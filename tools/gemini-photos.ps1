<#
  Генерує фото товарів через Gemini API і кладе їх у images/products/.
  Промпти бере з PROMPTS-GEMINI.md, ключ — з gemini-key.txt (НЕ здавайте цей файл разом із сайтом!).

  Приклади:
    .\tools\gemini-photos.ps1 -Only sp-w-1          # один товар (тест)
    .\tools\gemini-photos.ps1                       # усі, що ще не згенеровані
    .\tools\gemini-photos.ps1 -Force                # перегенерувати все
    .\tools\gemini-photos.ps1 -Model gemini-2.5-flash-image
#>
param(
  [string[]]$Only,
  [switch]$Force,
  [switch]$FirstOnly,
  [string]$Model = 'gemini-2.5-flash-image'
)
$ErrorActionPreference = 'Stop'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
Add-Type -AssemblyName System.Drawing

$root = Split-Path $PSScriptRoot -Parent
$keyFile = Join-Path $root 'gemini-key.txt'
if (-not (Test-Path $keyFile)) { throw "Немає файлу gemini-key.txt" }
$key = (Get-Content $keyFile -Raw).Trim()
if (-not $key) { throw "gemini-key.txt порожній" }

$outDir = Join-Path $root 'images\products'
New-Item -ItemType Directory -Force $outDir | Out-Null

# --- Промпти з таблиць у PROMPTS-GEMINI.md: | код | `промпт` |
$md = Get-Content (Join-Path $root 'PROMPTS-GEMINI.md') -Raw -Encoding UTF8
$items = [regex]::Matches($md, '(?m)^\|\s*([a-z]{2}-[wmk]-\d)\s*\|\s*`([^`]+)`') |
  ForEach-Object { [pscustomobject]@{ Id = $_.Groups[1].Value; Prompt = $_.Groups[2].Value } }
if ($Only) { $items = $items | Where-Object { $Only -contains $_.Id } }
Write-Host "Товарів до обробки: $(@($items).Count)"

$second = 'Now show exactly the same garment as a flat lay, top-down view, neatly arranged on the same seamless pastel background, no model, same lighting, vertical 3:4, absolutely no text or letters.'

function Invoke-Gemini($parts) {
  $body = @{
    contents = @(@{ role = 'user'; parts = $parts })
    generationConfig = @{ responseModalities = @('IMAGE'); imageConfig = @{ aspectRatio = '3:4' } }
  } | ConvertTo-Json -Depth 10
  $uri = "https://generativelanguage.googleapis.com/v1beta/models/${Model}:generateContent"
  for ($try = 1; $try -le 4; $try++) {
    try {
      $r = Invoke-RestMethod -Method Post -Uri $uri -Headers @{ 'x-goog-api-key' = $key } `
        -ContentType 'application/json; charset=utf-8' -Body ([Text.Encoding]::UTF8.GetBytes($body))
      $img = $r.candidates[0].content.parts | Where-Object { $_.inlineData } | Select-Object -First 1
      if (-not $img) { throw "Gemini не повернув зображення (можливо, спрацював фільтр)." }
      return $img.inlineData.data
    } catch {
      $msg = $_.ErrorDetails.Message; if (-not $msg) { $msg = $_.Exception.Message }
      if ($msg -match 'RESOURCE_EXHAUSTED|429' -and $try -lt 4) { Write-Host "  ліміт, чекаю 30 с…"; Start-Sleep 30; continue }
      throw $msg
    }
  }
}

function Save-Jpeg($b64, $path) {
  $bytes = [Convert]::FromBase64String($b64)
  $ms = New-Object IO.MemoryStream(,$bytes)
  $src = [Drawing.Image]::FromStream($ms)
  $w = 900; $h = [int]($src.Height * $w / $src.Width)
  $bmp = New-Object Drawing.Bitmap $w, $h
  $g = [Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = 'HighQualityBicubic'; $g.DrawImage($src, 0, 0, $w, $h); $g.Dispose()
  $enc = [Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
  $p = New-Object Drawing.Imaging.EncoderParameters 1
  $p.Param[0] = New-Object Drawing.Imaging.EncoderParameter ([Drawing.Imaging.Encoder]::Quality), 82L
  $bmp.Save($path, $enc, $p); $bmp.Dispose(); $src.Dispose()
}

$ok = 0; $fail = @()
foreach ($it in $items) {
  $f1 = Join-Path $outDir "$($it.Id)-1.jpg"
  $f2 = Join-Path $outDir "$($it.Id)-2.jpg"
  try {
    if ($Force -or -not (Test-Path $f1)) {
      Write-Host "$($it.Id): фото 1…"
      $b1 = Invoke-Gemini @(@{ text = $it.Prompt + ' Absolutely no text, letters or logos on the image.' })
      Save-Jpeg $b1 $f1
    } else { $b1 = [Convert]::ToBase64String([IO.File]::ReadAllBytes($f1)) }
    if (-not $FirstOnly -and ($Force -or -not (Test-Path $f2))) {
      Write-Host "$($it.Id): фото 2 (flat lay)…"
      $b2 = Invoke-Gemini @(@{ inlineData = @{ mimeType = 'image/jpeg'; data = $b1 } }, @{ text = $second })
      Save-Jpeg $b2 $f2
    }
    $ok++
  } catch {
    Write-Host "  ПОМИЛКА $($it.Id): $_" -ForegroundColor Red
    $fail += $it.Id
    if ("$_" -match 'API_KEY_INVALID|PERMISSION_DENIED|limit: 0|billing') { Write-Host 'Зупиняюсь: проблема з ключем або тарифом.'; break }
  }
}
Write-Host "Готово: $ok. Помилки: $($fail -join ', ')"
