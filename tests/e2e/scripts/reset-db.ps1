param(
    [string]$Server = ".\SQLEXPRESS",
    [string]$Database = "CRM-LTE-E2E"
)

$errorActionPreference = "Stop"

$query = @"
IF DB_ID('$Database') IS NOT NULL
BEGIN
    ALTER DATABASE [$Database] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE [$Database];
END
"@

& sqlcmd -S $Server -E -Q $query
Write-Output "Dropped $Database on $Server (if it existed). It will be recreated and seeded on the next application start."
