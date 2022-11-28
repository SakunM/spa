5..8 | ForEach-Object {

  $url = "https://api.zipaddress.net/?zipcode=904000$_"

  Write-Host "start test URL:${url}"
  $res = Invoke-WebRequest $url

  $obj = ConvertFrom-Json $res.Content

  if ( $obj.code -eq '200' ) {
    Write-Host '正常値' -ForegroundColor Cyan
    Write-Host ('address:' + $obj.data.fullAddress) -ForegroundColor Cyan

  } elseif ( $obj.code -eq '404' ) {
    Write-Host ('fail :' + $obj.code ) -ForegroundColor Red
    Write-Host 'not address' -ForegroundColor Red

  } else {
    Write-Host ('fail :' + $obj.code ) -ForegroundColor DarkRed
  }

  Start-Sleep -Seconds 2
}
