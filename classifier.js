// OnRamp evidence classifier, browser edition.
// Mirrors the corrected rules in the kit's .bob/gen_report.py: classify only tests that actually ran,
// never call a test FIXED unless it executed and passed, and refuse to judge runs that are incomplete.
(function (root) {
  'use strict';

  // Django --verbosity=2 / unittest -v: "name (dotted.id) ... ok", optionally with a docstring line before " ... ".
  const RAN = /^Ran (\d+) tests? in [\d.]+s\s*$/m;
  const TERMINAL = /^(OK|FAILED)\b.*$/m;

  function normalize(text) {
    return String(text || '').replace(/^﻿/, '').replace(/\u0000/g, '');
  }

  function parseRun(text) {
    const t = normalize(text);
    const tests = new Map();
    // Split at each test header; the status may follow on a later line when the test printed warnings.
    const HEADER = /^(\w+) \(([\w.]+)\)/gm;
    const STATUS = /(?:\.\.\. |^)(ok|FAIL|ERROR|skipped[^\r\n]*|expected failure|unexpected success)\s*$/m;
    const end = t.search(/^(?:={20,}|-{20,})\s*$/m);
    const body = end >= 0 ? t.slice(0, end) : t;
    const heads = [];
    let h;
    while ((h = HEADER.exec(body)) !== null) {
      // a header continues on the same line with " ... " or a docstring line before it
      const rest = body.slice(h.index, h.index + 2000);
      if (/^[^\r\n]*\)(?: \.\.\.|\r?\n[^\r\n]* \.\.\.)/.test(rest)) heads.push(h);
    }
    for (let i = 0; i < heads.length; i++) {
      const seg = body.slice(heads[i].index + heads[i][0].length, i + 1 < heads.length ? heads[i + 1].index : body.length);
      const s = STATUS.exec(seg);
      if (!s) continue;
      const raw = s[1];
      const status = raw === 'ok' || raw === 'expected failure' ? 'PASS'
        : raw.startsWith('skipped') ? 'SKIP'
        : raw === 'unexpected success' ? 'FAIL' : raw; // FAIL | ERROR
      tests.set(heads[i][2], status);
    }
    const ran = RAN.exec(t);
    const term = TERMINAL.exec(t);
    const problems = [];
    if (!t.trim()) problems.push('empty output');
    if (!ran) problems.push('no "Ran N tests" line (crashed or aborted run?)');
    if (!term) problems.push('no terminal OK/FAILED line');
    if (ran && Number(ran[1]) !== tests.size) problems.push(`"Ran ${ran[1]}" but ${tests.size} per-test results parsed (use verbose output)`);
    if (term && ran) {
      const anyFail = [...tests.values()].some(s => s === 'FAIL' || s === 'ERROR');
      if ((term[1] === 'OK') === anyFail) problems.push('terminal status disagrees with per-test results');
    }
    return { tests, ran: ran ? Number(ran[1]) : null, valid: problems.length === 0, problems };
  }

  function classify(baselineText, currentText) {
    const base = parseRun(baselineText);
    const cur = parseRun(currentText);
    const out = { valid: base.valid && cur.valid, problems: [], scope: null,
      inherited: [], fixed: [], regression: [], newFailure: [], newTest: [], unchangedPass: [], notRun: [], skipped: [], removed: [] };
    base.problems.forEach(p => out.problems.push('baseline: ' + p));
    cur.problems.forEach(p => out.problems.push('current run: ' + p));
    if (!out.valid) return out; // INCONCLUSIVE: no FIXED, no "0 regressions"

    for (const [id, b] of base.tests) {
      const c = cur.tests.get(id);
      const bFail = b === 'FAIL' || b === 'ERROR';
      if (c === undefined) { out.notRun.push(id); continue; }
      if (c === 'SKIP') { out.skipped.push(id); continue; }
      const cFail = c === 'FAIL' || c === 'ERROR';
      if (bFail && cFail) out.inherited.push(id);
      else if (bFail && !cFail) out.fixed.push(id);
      else if (!bFail && cFail) out.regression.push(id);
      else out.unchangedPass.push(id);
    }
    for (const [id, c] of cur.tests) {
      if (base.tests.has(id)) continue;
      if (c === 'FAIL' || c === 'ERROR') out.newFailure.push(id);
      else if (c !== 'SKIP') out.newTest.push(id);
    }
    out.scope = out.notRun.length === 0 ? 'FULL' : 'TARGETED';
    return out;
  }

  const api = { parseRun, classify };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.OnRampClassifier = api;
})(this);
