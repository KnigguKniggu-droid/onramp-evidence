# R6 extra checks (the team): rendered contrast in both colour schemes, and a direct 200% zoom render
# (a 640px CSS viewport at device scale factor 2 is what a 1280px window at 200% browser zoom lays out).
param([Parameter(Mandatory)][string]$SiteDir, [string]$OutDir = "$PSScriptRoot\..\docs\qa\screenshots", [string]$Label = 'extra')
$ErrorActionPreference = 'Continue'  # Edge writes harmless sync errors to stderr
$edge = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
New-Item -ItemType Directory -Force $OutDir | Out-Null; $OutDir = (Resolve-Path $OutDir).Path
Copy-Item "$PSScriptRoot\qa_contrast.js" (Join-Path $SiteDir '_qa_contrast.js')
$cases = @(
  @{ name = 'contrast-dark';  w = 1280; dsf = 1; scheme = 0 },
  @{ name = 'contrast-light'; w = 1280; dsf = 1; scheme = 1 },
  @{ name = 'zoom200-dark';   w = 640;  dsf = 2; scheme = 0 },
  @{ name = 'zoom200-light';  w = 640;  dsf = 2; scheme = 1 }
)
$results = @()
foreach ($c in $cases) {
  $harness = Join-Path $SiteDir "_qa_extra.html"
  @"
<!doctype html><html><head><meta charset="utf-8"><style>body{margin:0}iframe{border:0;display:block}</style><script src="_qa_contrast.js"></script></head><body>
<iframe id="f" src="index.html" style="width:$($c.w)px;height:3000px"></iframe><pre id="out" style="display:none"></pre>
<script>
const f=document.getElementById('f');
f.addEventListener('load',async()=>{const d=f.contentDocument;await new Promise(r=>setTimeout(r,1500));
 d.querySelectorAll('details').forEach(x=>x.open=true);
 const vw=d.documentElement.clientWidth,sw=d.documentElement.scrollWidth;
 const a=onrampContrastAudit(d);
 document.getElementById('out').textContent=JSON.stringify({case:'$($c.name)',width:vw,dpr:window.devicePixelRatio,overflow:sw>vw,scrollWidth:sw,verdict:d.getElementById('verdict').textContent.slice(0,60),contrast:{checked:a.checked,skipped:a.skipped,min:a.min,failures:a.failures.slice(0,10),failCount:a.failures.length}});});
</script></body></html>
"@ | Set-Content -Encoding utf8 $harness
  $url = 'file:///' + ($harness -replace '\\', '/')
  $common = @('--headless=new', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files', "--blink-settings=preferredColorScheme=$($c.scheme)", "--force-device-scale-factor=$($c.dsf)", '--virtual-time-budget=10000', "--window-size=$($c.w),1400")
  $dom = & $edge @common --dump-dom $url 2>$null | Out-String
  $m = [regex]::Match($dom, '<pre id="out"[^>]*>([^<]*)</pre>')
  $results += [System.Net.WebUtility]::HtmlDecode($m.Groups[1].Value)
  if ($c.name -like 'zoom200*') {
    $png = Join-Path $OutDir "$Label-$($c.name).png"
    & $edge @common --screenshot="$png" ('file:///' + ((Join-Path $SiteDir 'index.html') -replace '\\', '/')) 2>$null
    for ($i = 0; $i -lt 40 -and -not (Test-Path $png); $i++) { Start-Sleep -Milliseconds 250 }
  }
  Remove-Item $harness
}
Remove-Item (Join-Path $SiteDir '_qa_contrast.js')
$results | Set-Content -Encoding utf8 (Join-Path $OutDir "$Label-metrics.jsonl")
$results
