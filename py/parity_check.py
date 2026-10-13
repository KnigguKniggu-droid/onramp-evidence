"""CI gate: the browser classifier (classifier.js) must match the Python classifier exactly on every golden case."""
import json
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
import onramp_normalize as on  # noqa: E402

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
CASES = ["full_run_after_fix", "targeted_run", "synthetic_new_failure", "synthetic_crashed_run"]
SCHEMA_CASES = {"unsupported_schema": {"schema_version": "onramp.run/99", "problems": [], "outcomes": {}},
                "null_outcome": {"schema_version": "onramp.run/1", "problems": [], "outcomes": None},
                "unknown_status": None}

base = json.loads((DATA / "baseline_run.json").read_text(encoding="utf-8"))
# a full run where one baseline failure has a null outcome and another an unknown status: must not become FIXED
_full = json.loads((DATA / "full_run_after_fix.json").read_text(encoding="utf-8"))
_ids = sorted(k for k, v in base["outcomes"].items() if v in ("FAIL", "ERROR"))
SCHEMA_CASES["unknown_status"] = {**_full, "outcomes": {**_full["outcomes"], _ids[0]: None, _ids[1]: "CRASH"}}
failures = 0
for name in CASES + list(SCHEMA_CASES):
    cur = SCHEMA_CASES.get(name) or json.loads((DATA / f"{name}.json").read_text(encoding="utf-8"))
    # Re-normalize from the raw log too, so the committed JSON cannot drift from the parser.
    if name in CASES:
        fresh = on.normalize(on.read_text(ROOT / "fixtures" / f"{name}.txt"), source=f"{name}.txt")
        if fresh != cur:
            print(f"DRIFT {name}: data/{name}.json differs from a fresh normalization")
            failures += 1
    py = on.classify(base, cur)
    js = json.loads(subprocess.run(
        ["node", "-e", "const c=require('./classifier.js');const fs=require('fs');"
         "const b=JSON.parse(fs.readFileSync(process.argv[1],'utf8'));const x=JSON.parse(fs.readFileSync(0,'utf8'));"
         "process.stdout.write(JSON.stringify(c.classify(b,x)))", str(DATA / "baseline_run.json")],
        cwd=ROOT, input=json.dumps(cur), capture_output=True, text=True, check=True).stdout)
    if py != js:
        diff = {k: (py.get(k), js.get(k)) for k in set(py) | set(js) if py.get(k) != js.get(k)}
        print(f"MISMATCH {name}: {str(diff)[:400]}")
        failures += 1
    else:
        counts = {k: len(v) for k, v in py.items() if isinstance(v, list) and k != "problems"}
        print(f"ok {name}: valid={py['valid']} scope={py['scope']} {counts}")
sys.exit(1 if failures else 0)
