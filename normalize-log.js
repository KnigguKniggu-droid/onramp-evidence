// OnRamp log normalizer, browser edition.
// Copied verbatim from the paste-your-log demo in index.html (between NORMALIZE-START and NORMALIZE-END).
// It is a JavaScript port of normalize() in py/onramp_normalize.py. Python stays the authority.
(function (root) {
  'use strict';
  /*NORMALIZE-START*/
  // JavaScript port of normalize() in py/onramp_normalize.py (same regexes, same fail-closed problems; no sha256).
  function normalizeLog(text, source) {
    text = text.replace(/^﻿/, '').replace(/\x00/g, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const sep = /^(?:={20,}|-{20,})\s*$/m.exec(text);
    const body = sep ? text.slice(0, sep.index) : text;
    const HEADER = /(?:^|(?<=\.\.\.))(\w+) \(([\w.]+)\)/gm;
    const CONT = /[^\r\n]*\)(?: \.\.\.|\r?\n[^\r\n]* \.\.\.)/y;
    const heads = [];
    let h;
    while ((h = HEADER.exec(body)) !== null) {
      CONT.lastIndex = h.index;
      if (CONT.test(body)) heads.push(h);
    }
    const outcomes = {};
    heads.forEach((hd, i) => {
      const seg = body.slice(hd.index + hd[0].length, i + 1 < heads.length ? heads[i + 1].index : body.length);
      const s = /(?:\.\.\. |^)(ok|FAIL|ERROR|skipped[^\r\n]*|expected failure|unexpected success)\s*$/m.exec(seg);
      if (!s) return;
      const raw = s[1];
      outcomes[hd[2]] = (raw === 'ok' || raw === 'expected failure') ? 'PASS' : raw.indexOf('skipped') === 0 ? 'SKIP'
        : raw === 'unexpected success' ? 'FAIL' : raw;
    });
    const ran = /^Ran (\d+) tests? in [\d.]+s\s*$/m.exec(text);
    const term = /^(OK|FAILED)\b.*$/m.exec(text);
    const n = Object.keys(outcomes).length, problems = [];
    if (!text.trim()) problems.push('empty output');
    if (!ran) problems.push('no "Ran N tests" line (crashed or aborted run?)');
    if (!term) problems.push('no terminal OK/FAILED line');
    if (ran && Number(ran[1]) !== n) problems.push('"Ran ' + ran[1] + '" but ' + n + ' per-test results parsed (use verbose output)');
    if (ran && term) {
      const anyFail = Object.keys(outcomes).some(k => outcomes[k] === 'FAIL' || outcomes[k] === 'ERROR');
      if ((term[1] === 'OK') === anyFail) problems.push('terminal status disagrees with per-test results');
    }
    const sorted = {};
    Object.keys(outcomes).sort().forEach(k => { sorted[k] = outcomes[k]; });
    return { schema_version: 'onramp.run/1', source: source || '', valid: problems.length === 0, problems,
      tests_run: ran ? Number(ran[1]) : null, outcomes: sorted };
  }
  /*NORMALIZE-END*/
  const api = { normalizeLog };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.OnRampNormalize = api;
})(this);
