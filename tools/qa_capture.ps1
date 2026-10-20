# R6 browser evidence collector (the team). Renders a site copy inside true-width iframes in headless Edge,
# screenshots each width, and measures document overflow, focusable targets and the classifier result.
# Headless Edge cannot shrink its own viewport below ~492px, so phone widths use same-origin iframes
# (file:// with --allow-file-access-from-files). Not a WCAG certification; a repeatable evidence capture.
param([Parameter(Mandatory)][string]$SiteDir, [Parameter(Mandatory)][string]$Label, [string]$OutDir = "$PSScriptRoot\..\docs\qa\screenshots", [string]$BaseUrl = "", [switch]$ReducedMotion)
$ErrorActionPreference = 'Continue'  # Edge writes harmless sync errors to stderr
$edge = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
New-Item -ItemType Directory -Force $OutDir | Out-Null; $OutDir = (Resolve-Path $OutDir).Path
$results = @()
foreach ($w in 320, 375, 768, 1024, 1440) {
  $harness = Join-Path $SiteDir "_qa_$w.html"
  @"
<!doctype html><html><head><meta charset="utf-8"><style>body{margin:0;background:#888}iframe{border:0;display:block}</style></head><body>
<iframe id="f" src="index.html" style="width:${w}px;height:2400px"></iframe>
<pre id="out" style="display:none"></pre>
<script>
const f=document.getElementById('f');
f.addEventListener('load',async()=>{const d=f.contentDocument,win=f.contentWindow;
 await new Promise(r=>setTimeout(r,800));
 const vw=d.documentElement.clientWidth, sw=d.documentElement.scrollWidth;
 const offenders=[...d.querySelectorAll('body *')].filter(e=>{const b=e.getBoundingClientRect();return b.width>0&&b.right>vw+1&&!e.closest('.scroll,.diff,nav .in,.list')}).slice(0,8).map(e=>e.tagName.toLowerCase()+(e.className?'.'+String(e.className).split(' ')[0]:'')+'@'+Math.round(e.getBoundingClientRect().right));
 const small=[...d.querySelectorAll('a,button,select,summary')].filter(e=>{const b=e.getBoundingClientRect();return b.width>0&&(b.height<24||b.width<24)}).length;
 let verdict='n/a';const verdicts=[];try{const rb=d.getElementById('runBtn');if(rb){rb.click();await new Promise(r=>setTimeout(r,1500))}verdict=d.getElementById('verdict').textContent.slice(0,90);for(const r of d.querySelectorAll('input[name=cur]')){r.click();await new Promise(z=>setTimeout(z,700));verdicts.push(r.value+': '+d.getElementById('verdict').textContent.slice(0,70))}if(verdicts.length){d.querySelector('input[name=cur]').click();await new Promise(z=>setTimeout(z,700))}}catch(e){verdict='error: '+e.message}
 document.getElementById('out').textContent=JSON.stringify({width:$w,clientWidth:vw,scrollWidth:sw,overflow:sw>vw,offenders,smallTargets:small,verdict,verdicts});
 document.body.dataset.done='1';});
</script></body></html>
"@ | Set-Content -Encoding utf8 $harness
  $url = 'file:///' + ($harness -replace '\\', '/')
  if ($BaseUrl) { $url = $BaseUrl.TrimEnd('/') + '/' + (Split-Path $harness -Leaf) }  # http mode, so ES modules (fx.js) load
  $winW = [Math]::Max($w, 500)
  $dom = & $edge --headless=new --disable-gpu --hide-scrollbars --allow-file-access-from-files $(if ($ReducedMotion) { '--force-prefers-reduced-motion' }) --virtual-time-budget=8000 --window-size="$winW,2400" --dump-dom $url 2>$null | Out-String
  $m = [regex]::Match($dom, '<pre id="out"[^>]*>([^<]*)</pre>')
  $json = [System.Net.WebUtility]::HtmlDecode($m.Groups[1].Value)
  $results += $json
  $png = Join-Path $OutDir "$Label-$w.png"
  & $edge --headless=new --disable-gpu --hide-scrollbars --allow-file-access-from-files $(if ($ReducedMotion) { '--force-prefers-reduced-motion' }) --virtual-time-budget=8000 --window-size="$winW,2400" --screenshot="$png" $url 2>$null
  for ($i = 0; $i -lt 40 -and -not (Test-Path $png); $i++) { Start-Sleep -Milliseconds 250 }
  if ($w -lt 500 -and (Test-Path $png)) {  # crop the harness screenshot to the iframe's true width
    Add-Type -AssemblyName System.Drawing
    $src = [System.Drawing.Image]::FromFile($png); $bmp = New-Object System.Drawing.Bitmap $w, $src.Height
    $g = [System.Drawing.Graphics]::FromImage($bmp); $g.DrawImage($src, (New-Object System.Drawing.Rectangle 0, 0, $w, $src.Height), (New-Object System.Drawing.Rectangle 0, 0, $w, $src.Height), [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose(); $src.Dispose(); $bmp.Save("$png.tmp.png"); $bmp.Dispose(); Move-Item -Force "$png.tmp.png" $png
  }
  Remove-Item $harness
}
$results | Set-Content -Encoding utf8 (Join-Path $OutDir "$Label-metrics.jsonl")
$results

