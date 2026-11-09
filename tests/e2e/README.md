# Free CRM end-to-end suite

Playwright suite covering the API surface and the Vue/Syncfusion admin UI of the CRM.

## Coverage

- `tests/api/auth.spec.ts` - login, validate, refresh, logout and anonymous rejection.
- `tests/api/crud.spec.ts` - create/list/update/delete for every CRUD module plus nested
  sales-order and purchase-order items.
- `tests/api/read-only.spec.ts` - company, roles, users, profile, dashboards and reports.
- `tests/ui/auth.spec.ts` - UI login, invalid login, anonymous redirect and logout.
- `tests/ui/navigation.spec.ts` - every page renders without script errors, the public landing
  page, and sidebar navigation.
- `tests/ui/crud/*.spec.ts` - full add/edit/delete cycle for every CRUD module, including the
  nested order item grids and the soft-deleted Users flow.
- `tests/ui/read-only.spec.ts` - dashboard cards/charts, sales and purchase reports, Excel
  export, roles and number sequences.
- `tests/ui/update-only.spec.ts` - My Company and My Profile edit/restore cycles.

The suite is serial (`workers: 1`) and intentionally uses a disposable database.

## Setup

```powershell
cd tests/e2e
npm ci
npx playwright install chromium
```

If `npm` is blocked by the PowerShell execution policy, use `npm.cmd` and `npx.cmd`.

## Running against Docker Compose

The base stack is `docker-compose.yml`; the E2E override at `tests/e2e/docker-compose.e2e.yml` keeps
a separate Compose project (`freecrm-e2e`), volume set, container names, database
(`CRM-LTE-E2E`) and host port (`5055`).

```powershell
docker compose -p freecrm-e2e -f docker-compose.yml -f tests/e2e/docker-compose.e2e.yml down -v
docker compose -p freecrm-e2e -f docker-compose.yml -f tests/e2e/docker-compose.e2e.yml up -d --build
cd tests/e2e
npx.cmd playwright test
```

The volume reset (`down -v`) gives a fresh, re-seeded database. The application seeds itself on
startup.

For the Swagger smoke check, start the same stack with `E2E_ENVIRONMENT=Development`:

```powershell
$env:E2E_ENVIRONMENT = "Development"
docker compose -p freecrm-e2e -f docker-compose.yml -f tests/e2e/docker-compose.e2e.yml up -d
# GET http://localhost:5055/swagger/v1/swagger.json must return 200 with the Bearer scheme
$env:E2E_ENVIRONMENT = "Docker"
```

## Running locally without Docker

Requirements: a reachable SQL Server instance, the .NET SDK and Node.js.

```powershell
# in one terminal - recreate the disposable database
cd tests/e2e
.\scripts\reset-db.ps1 -Server ".\SQLEXPRESS"

# in a second terminal - publish and run the application on http://localhost:5055
.\scripts\start-local.ps1 -ConnectionString "Server=.\SQLEXPRESS;Database=CRM-LTE-E2E;Integrated Security=True;TrustServerCertificate=True;"

# in a third terminal - run the suite
cd tests/e2e
npx.cmd playwright test
```

Use the instance that is reliable on the host. The default SQL Server instance can have a slow TCP
listener; the scripts default to shared memory/named-instance connections over `localhost`.

## Environment variables

| Variable | Default | Purpose |
| --- | --- | --- |
| `CRM_BASE_URL` | `http://localhost:5055` | Application under test |
| `CRM_ADMIN_EMAIL` | `admin@root.com` | Seeded administrator |
| `CRM_ADMIN_PASSWORD` | `123456` | Seeded administrator password |

## Authentication details

The app issues the JWT as an HttpOnly `accessToken` cookie and also stores it in `localStorage`.
`tests/setup/auth.setup.ts` logs in through the browser, then persists both the cookie (rewritten as
`Secure=false` for `http://localhost`) and the localStorage keys into `.auth/admin.json`. API tests
use the `Authorization: Bearer` header from a direct login.

The API returns HTTP 498 for an expired JWT (`SecurityTokenExpiredException`). The client code
refreshes via `/api/Security/RefreshToken`; the suite treats 498 as an expired session, never as an
authorization failure.

## Notes

- `.auth/`, `test-results/`, `playwright-report/`, `.app/` and `node_modules/` are ignored.
- The application uses `MapStaticAssets()`; the E2E stack runs the published application (the same
  shape as the Docker image), so `wwwroot` and `FrontEnd/Pages/**/*.cshtml.js` assets behave exactly
  as they do in production.
- External CDN scripts (`html2canvas`, `jspdf`) are requested by the layout. Offline failures are
  tolerated; real application `pageerror` events fail the navigation test.
- The report Excel export is exercised through the Syncfusion grid instance (`excelExport()`)
  because the page's toolbar handler compares against a non-existent `MainGrid_excelexport` id.
  Export itself still produces `Export.xlsx`.
