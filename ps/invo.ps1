$uri = "http://localhost:3000/user/create"
$css = @{'background' = '#fff'; 'top' = 40; 'left' = 50}
$body = (@{'name' = 'mamo'; 'css' = $css} | ConvertTo-Json) 

# $res = Invoke-WebRequest `
#   -Uri            $uri `
#   -Method         POST `
#   -Body           $body `
#   -ContentType 'application/json'
$res = Invoke-WebRequest -Uri $uri -Method POST -Body $body -ContentType 'application/json'

Write-Host $res.Content
