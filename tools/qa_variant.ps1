# Design-variant test bench (Claude Code). Renders one page at several widths in headless Edge and records
# overflow, rendered contrast (qa_contrast.js) and anti-slop metrics (qa_slop.js), plus a screenshot per width.
# Usage: qa_variant.ps1 -SiteDir <dir> -Page index.html -Label A
param([Parameter(Mandatory)][string]$SiteDir, [Parameter(Mandatory)][string]$Page, [Parameter(Mandatory)][string]$Label,
      [string]$OutDir = "$PSScriptRoot\..\docs\qa\variants", [int[]]$Widths = @(375, 1024, 1440), [int]$Scheme = 0)
$ErrorActionPreference = 'Continue'  # Edge writes harmless sync errors to stderr
$edge = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
New-Item -ItemType Directory -Force $OutDir | Out-Null; $OutDir = (Resolve-Path $OutDir).Path
Copy-Item "$PSScriptRoot\qa_contrast.js" (Join-Path $SiteDir '_qa_contrast.js')
Copy-Item "$PSScriptRoot\qa_slop.js" (Join-Path $SiteDir '_qa_slop.js')
$results = @()
foreach ($w in $Widths) {
  $harness = Join-Path $SiteDir "_qa_variant.html"
  @"
<!doctype html><html><head><meta charset="utf-8"><style>body{margin:0}iframe{border:0;display:block}</style><script src="_qa_contrast.js"></script><script src="_qa_slop.js"></script></head><body>
<iframe id="f" src="$Page" style="width:${w}px;height:900px"></iframe><pre id="out" style="display:none"></pre>
<script>
const f=document.getElementById('f');
f.addEventListener('load',async()=>{const d=f.contentDocument;await new Promise(r=>setTimeout(r,1800));
 const vw=d.documentElement.clientWidth,sw=d.documentElement.scrollWidth;
 const c=onrampContrastAudit(d), s=onrampSlopAudit(d);
 const v=d.getElementById('verdict');
 document.getElementById('out').textContent=JSON.stringify({variant:'$Label',page:'$Page',width:$w,scheme:$Scheme,overflow:sw>vw,contrastFails:c.failures.length,contrastMin:c.min&&c.min.ratio,verdict:v?v.textContent.slice(0,50):null,slop:s});});
</script></body></html>
"@ | Set-Content -Encoding utf8 $harness
  $url = 'file:///' + ($harness -replace '\\', '/')
  $common = @('--headless=new', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files', "--blink-settings=preferredColorScheme=$Scheme", '--virtual-time-budget=9000', "--window-size=$([Math]::Max($w,500)),900")
  $dom = & $edge @common --dump-dom $url 2>$null | Out-String
  $m = [regex]::Match($dom, '<pre id="out"[^>]*>([^<]*)</pre>')
  $results += [System.Net.WebUtility]::HtmlDecode($m.Groups[1].Value)
  $png = Join-Path $OutDir "$Label-$w.png"
  $pageUrl = 'file:///' + ((Join-Path $SiteDir $Page) -replace '\\', '/')
  & $edge @common "--window-size=$([Math]::Max($w,500)),2600" --screenshot="$png" $pageUrl 2>$null
  for ($i = 0; $i -lt 40 -and -not (Test-Path $png); $i++) { Start-Sleep -Milliseconds 250 }
  Remove-Item $harness
}
Remove-Item (Join-Path $SiteDir '_qa_contrast.js'), (Join-Path $SiteDir '_qa_slop.js')
$results | Set-Content -Encoding utf8 (Join-Path $OutDir "$Label-metrics.jsonl")
$results
