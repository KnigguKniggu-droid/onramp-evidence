// OnRamp classifier, browser edition.
// Classifies runs that the Python normalizer (py/onramp_normalize.py) already turned into versioned JSON.
// It does not parse raw test logs itself: Python is the authority, and CI checks that both agree.
(function (root) {
  'use strict';
  const SUPPORTED = ['onramp.run/1'];
  const FAIL = s => s === 'FAIL' || s === 'ERROR';
  const STATUSES = ['PASS', 'FAIL', 'ERROR', 'SKIP'];  // the normalizer's whole vocabulary; anything else is not trusted

  function check(run, label) {
    if (!run || SUPPORTED.indexOf(run.schema_version) < 0) return [label + ': unsupported schema_version ' + String(run && run.schema_version)];
    const out = (run.problems || []).map(p => label + ': ' + p);
    if (!run.outcomes || typeof run.outcomes !== 'object' || Array.isArray(run.outcomes)) return out.concat([label + ': outcomes missing']);
    const bad = Object.keys(run.outcomes).filter(id => STATUSES.indexOf(run.outcomes[id]) < 0).sort();
    if (bad.length) out.push(label + ': ' + bad.length + ' test(s) with an unknown status (first: ' + bad[0] + ')');
    return out;
  }

  function classify(baseline, current) {
    const problems = check(baseline, 'baseline').concat(check(current, 'current run'));
    const r = { schema_version: 'onramp.run/1', valid: problems.length === 0, problems, scope: null,
      inherited: [], fixed: [], regression: [], new_failure: [], new_test: [], unchanged_pass: [], not_run: [], skipped: [] };
    if (!r.valid) return r; // INCONCLUSIVE: no FIXED, no "0 regressions"
    const base = baseline.outcomes, cur = current.outcomes;
    for (const id of Object.keys(base).sort()) {
      const b = base[id], c = cur[id];
      if (c === undefined) { r.not_run.push(id); continue; }
      if (c === 'SKIP') { r.skipped.push(id); continue; }
      const bf = FAIL(b), cf = FAIL(c);
      r[bf && cf ? 'inherited' : bf ? 'fixed' : cf ? 'regression' : 'unchanged_pass'].push(id);
    }
    for (const id of Object.keys(cur).sort()) {
      if (id in base || cur[id] === 'SKIP') continue;
      r[FAIL(cur[id]) ? 'new_failure' : 'new_test'].push(id);
    }
    r.scope = r.not_run.length === 0 ? 'FULL' : 'TARGETED';
    return r;
  }

  const api = { classify, SUPPORTED };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.OnRampClassifier = api;
})(this);
