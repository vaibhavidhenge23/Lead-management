# Lead Management Portal

A small CRM-style portal built with React (Vite). Leads are kept only in
React state — nothing is written to a backend, SQL, or browser storage, so
the table resets on refresh, exactly as the task asked.

## Running it

```bash
npm install
npm run dev
```

Open the printed localhost URL. To create a production build: `npm run build`.

## Project structure

```
src/
  data/options.js            -> static dropdown lists (Lead Source, Priority, Status)
  components/LeadForm.jsx    -> add-lead form + validation + country/state/city logic
  components/FilterBar.jsx   -> search box + filter dropdowns
  components/LeadTable.jsx   -> renders the leads table, View/Delete buttons
  components/ViewModal.jsx   -> modal shown when "View" is clicked
  App.jsx                    -> owns the leads array + filters, wires everything together
  App.css                    -> all styling
```

## How the pieces fit together

**Where the data lives.** `App.jsx` is the single source of truth. It holds
`leads` (the array of saved leads) and `filters` (current search/filter
values) in `useState`. `LeadForm` doesn't store anything itself long-term —
it only manages its own draft fields, and on a valid submit it calls
`onAddLead(lead)`, a prop passed down from `App`. That's the only way new
data gets into the table. Same idea for delete: `LeadTable` calls
`onDelete(id)`, and `App` is the one that actually removes that lead
from state.

**Country → State → City.** This uses the `country-state-city` npm
package, which ships a static dataset (no API calls, works offline).
`Country.getAllCountries()` loads once at module level. `State.getStatesOfCountry(countryIso)`
and `City.getCitiesOfState(countryIso, stateIso)` are recalculated on every
render based on whatever is currently selected — they're not stored in
state themselves, just derived from it. When the country dropdown changes,
the form resets `stateIso` and `city` in the same state update; when state
changes, it resets `city`. That's what makes the dropdowns "dependent" —
the State select is `disabled` until a country is picked, and City is
disabled until a state is picked.

**Validation.** `validate(form)` in `LeadForm.jsx` is a plain function that
takes the current form values and returns an `errors` object — one key per
invalid field. It runs on submit; if the object isn't empty, the form
bails out and shows the messages instead of calling `onAddLead`. Mobile
number is checked with `/^\d{10}$/`, email (only if entered) with a basic
`name@domain` regex, budget must be a positive number, and every dropdown
/ required text field just checks for a non-empty value.

**Search and filters.** `App.jsx` computes `filteredLeads` with
`useMemo`, re-running only when `leads` or `filters` change. It's a plain
`.filter()` — search matches lead name or mobile (case-insensitive,
partial match), and each filter does an exact match against the
corresponding field. The filter dropdown *options* themselves
(`FilterBar.jsx`) are built from whatever values already exist in `leads`,
so you'll never see a filter for a country that has no leads yet.

**View / Delete.** Clicking "View" sets `viewingLead` in `App` state,
which is passed to `ViewModal` — it renders `null` when nothing is
selected, so the modal markup is always "there" but invisible until
needed. "Delete" calls back up to `App`, which filters that lead's `id`
out of the array.

## If asked to extend it

A few natural follow-ups an interviewer might ask for, and where they'd go:
- **Edit lead**: add an `onEdit` prop similar to `onDelete`, and reuse
  `LeadForm` pre-filled with the existing values (right now it only
  handles adding new leads).
- **Pagination**: would slot into `LeadTable`, slicing `filteredLeads`
  by page instead of rendering every row.
- **Export to CSV**: a small function building a CSV string from
  `filteredLeads` and triggering a download — no extra library needed.
