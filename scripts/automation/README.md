# Daily Perks Automation System

Automated system to health-check student perk links and discover new perks from known sources.

## Scripts

### Link Health Checker

Checks every perk's claim link and updates `isActive` status in the CSV.

```bash
npm run perks:check
```

- Sends HTTP HEAD requests (falls back to GET on 405)
- Marks links as `True` (2xx/3xx) or `False` (4xx/5xx/timeout)
- Flags suspicious redirects (specific path redirected to `/`)
- Generates a JSON report in `scripts/automation/reports/`

### New Perks Discovery

Scrapes known student discount sources for perks not already in the database.

```bash
npm run perks:discover
```

- Fetches HTML from GitHub Education, UNiDAYS, Student Beans, Figma, JetBrains
- Extracts links and deduplicates against existing CSV titles
- Writes new perks to `scripts/automation/staging/` for manual review
- Does NOT modify the main CSV

### Run Both

```bash
npm run perks:update
```

## GitHub Actions

The workflow runs daily at 00:30 UTC (06:00 IST) and can also be triggered manually from the Actions tab.

- Checks all perk links and updates the CSV
- Discovers new perks and creates a GitHub Issue if any are found
- Commits CSV changes automatically

## File Locations

| Type | Path |
|------|------|
| Main CSV | `public/assets/Name-Category-Description-...ClaimLink.csv` |
| Health reports | `scripts/automation/reports/perk-health-YYYY-MM-DD.json` |
| Discovery reports | `scripts/automation/reports/discovery-YYYY-MM-DD.json` |
| Staged new perks | `scripts/automation/staging/new-perks-YYYY-MM-DD.csv` |

Reports and staging files are git-ignored.

## Reviewing Staged Perks

1. Open the staging CSV (or check the GitHub Issue)
2. Fill in `category`, `description`, `VerificationMethod`, and `validity`
3. Change `isActive` from `Pending` to `True`
4. Copy approved rows into the main CSV
5. Close the related GitHub Issue
