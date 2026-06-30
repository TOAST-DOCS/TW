# -*- coding: utf-8 -*-
"""배포 후 검수 대시보드 빌드 (TW repo 레이아웃).
소스(이 폴더 review/src/): dashboard_template.html, owners.md,
  inventory_<MONTH>.tsv, autoscan_<MONTH>.tsv, reviews/*.md
출력: ../<MONTH>/index.html   (예: review/2026-06/index.html)

협업 워크플로우:
  1) 담당 라이터가 reviews/<repo>__<문서키>.md 의 '변경해야 할 항목' 검토
     → 반영([x] 체크)·수정·삭제, review_state: auto→reviewing→done, 필요시 grade_* 조정
  2) owners.md 담당자 갱신(필요 시)
  3) PR 머지 시 GitHub Action이 본 스크립트를 실행해 대시보드 자동 재생성
     (수동 재빌드: python review/src/build_dashboard.py)
"""
import io, os, re, json, glob

MONTH = '2026-06'  # 신규 월 추가 시 이 값 + inventory_/autoscan_/reviews + review/<MONTH>/ 준비

HERE = os.path.dirname(os.path.abspath(__file__))
def p(*a): return os.path.join(HERE, *a)

def md_inline(t):
    """`code` -> <code>code</code> (그 외는 평문 유지)"""
    return re.sub(r'`([^`]+)`', r'<code>\1</code>', t)

# ---------- owners.md ----------
def parse_owners():
    owners = {}
    txt = io.open(p('owners.md'), encoding='utf-8').read()
    for line in txt.splitlines():
        line = line.strip()
        if not line.startswith('|'):
            continue
        cells = [c.strip() for c in line.strip('|').split('|')]
        if len(cells) < 4:
            continue
        repo = cells[0]
        if repo in ('리포지토리', '서비스', '') or set(repo) <= set('-: '):
            continue
        service, author, reviewer = cells[1], cells[2], cells[3]
        owners[repo] = {'service': service, 'author': author, 'reviewer': reviewer}
    return owners

# ---------- inventory ----------
def parse_inventory():
    inv = {}
    for line in io.open(p('inventory_%s.tsv' % MONTH), encoding='utf-8'):
        parts = line.rstrip('\n').split('\t')
        if len(parts) < 3:
            continue
        svc, st, path = parts[0], parts[1], parts[2]
        if st == 'D' and path.startswith('ko/old/'):
            inv.setdefault(svc, {'docs': []})
            inv[svc]['oldDeleted'] = inv[svc].get('oldDeleted', 0) + 1
            continue
        inv.setdefault(svc, {'docs': []})['docs'].append({'path': path, 'status': st})
    return inv

# ---------- autoscan(자동 패턴 스캔) ----------
def parse_autoscan():
    g = {}
    for line in io.open(p('autoscan_%s.tsv' % MONTH), encoding='utf-8'):
        parts = line.rstrip('\n').split('\t')
        if len(parts) < 7:
            continue
        svc, path, st, ga, gb, addc, fullc = parts[:7]
        entry = {'a': ga, 'b': gb}
        if gb == 'R':
            red = 0
            if '/' in fullc:
                try: red = int(fullc.split('/')[1])
                except ValueError: red = 0
            entry['findings'] = [{
                'src': 'exist', 'sev': 'R',
                'text': '외부 <code>http://</code>·죽은 링크 %d건 — 유효성(링크깨짐) 점검 필요 <i>(자동 휴리스틱)</i>' % red
            }]
        g.setdefault(svc, {})[path] = entry
    return g

# ---------- reviews/*.md (상세 검수 원본) ----------
def parse_reviews():
    reviews = {}
    for fp in sorted(glob.glob(p('reviews', '*.md'))):
        txt = io.open(fp, encoding='utf-8').read()
        m = re.match(r'^---\s*\n(.*?)\n---\s*\n(.*)$', txt, re.S)
        if not m:
            continue
        fm = {}
        for ln in m.group(1).splitlines():
            if ':' in ln:
                k, v = ln.split(':', 1)
                fm[k.strip()] = v.strip()
        body = m.group(2)
        svc, path = fm.get('service'), fm.get('path')
        if not svc or not path:
            continue
        # '## 변경해야 할 항목' 섹션 파싱: - [구분] | 위치 | AS-IS | TO-BE
        items = []
        sec = re.search(r'##\s*변경해야 할 항목\s*\n(.*?)(?:\n##\s|\Z)', body, re.S)
        if sec:
            for ln in sec.group(1).splitlines():
                cm = re.match(r'\s*-\s*\[(기존|변경분|참고)\]\s*(.*)', ln)
                if not cm:
                    continue
                src = {'기존': 'exist', '변경분': 'chg', '참고': 'ref'}[cm.group(1)]
                parts = [x.strip() for x in cm.group(2).split('|')]
                while parts and parts[0] == '':   # 구분 뒤 선행 파이프 제거
                    parts.pop(0)
                loc  = parts[0] if len(parts) > 0 else ''
                asis = parts[1] if len(parts) > 1 else ''
                tobe = ' | '.join(parts[2:]).strip() if len(parts) > 2 else ''
                items.append({'src': src, 'loc': md_inline(loc),
                              'asis': md_inline(asis), 'tobe': md_inline(tobe)})
        reviews[(svc, path)] = {
            'a': fm.get('grade_change', 'G'),
            'b': fm.get('grade_full', 'G'),
            'state': fm.get('review_state', 'auto'),
            'items': items,
        }
    return reviews

def build():
    owners = parse_owners()
    inv = parse_inventory()
    grades = parse_autoscan()
    reviews = parse_reviews()

    # 리뷰 결과를 grades 에 병합(등급 override + review 객체 부여)
    for (svc, path), rv in reviews.items():
        entry = grades.setdefault(svc, {}).setdefault(path, {})
        entry['a'] = rv['a']
        entry['b'] = rv['b']
        entry.pop('findings', None)
        entry['review'] = {'state': rv['state'], 'items': rv['items']}

    tpl = io.open(p('dashboard_template.html'), encoding='utf-8').read()
    out = (tpl
           .replace('__INV__', json.dumps(inv, ensure_ascii=False))
           .replace('__GRADES__', json.dumps(grades, ensure_ascii=False))
           .replace('__OWNERS__', json.dumps(owners, ensure_ascii=False)))

    out_dir = p('..', MONTH)
    if not os.path.isdir(out_dir):
        os.makedirs(out_dir)
    out_path = os.path.join(out_dir, 'index.html')
    io.open(out_path, 'w', encoding='utf-8').write(out)

    n_rev = len(reviews)
    n_done = sum(1 for r in reviews.values() if r['state'] == 'done')
    print('build OK ->', os.path.relpath(out_path, p('..', '..')))
    print('  서비스:', len(inv), '| owners:', len(owners), '| 상세검수 MD:', n_rev, '(검토 완료', n_done, ')')
    print('  남은 placeholder:', [x for x in ('__INV__', '__GRADES__', '__OWNERS__') if x in out] or '없음')

if __name__ == '__main__':
    build()
