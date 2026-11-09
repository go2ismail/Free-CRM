param(
    [string]$ConnectionString = "Server=.\SQLEXPRESS;Database=CRM-LTE-E2E;Integrated Security=True;TrustServerCertificate=True;",
    [int]$Port = 5055,
    [string]$Configuration = "Release"
)

$errorActionPreference = "Stop"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..\..")
$publishDir = Join-Path $PSScriptRoot "..\.app"

& dotnet publish (Join-Path $repoRoot "Presentation\ASPNET\ASPNET.csproj") -c $Configuration -o $publishDir --nologo
if ($LASTEXITCODE -ne 0) {
    throw "dotnet publish failed"
}

$env:ASPNETCORE_ENVIRONMENT = "Docker"
$env:ConnectionStrings__DefaultConnection = $ConnectionString
$env:Jwt__ExpireInMinute = "240"
$env:Kestrel__Endpoints__Http__Url = "http://localhost:$Port"
$env:Logging__LogLevel__Default = "Warning"
$env:Logging__LogLevel__Microsoft = "Warning"

Push-Location $publishDir
try {
    & dotnet ASPNET.dll
} finally {
    Pop-Location
}
