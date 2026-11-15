# ryho.io starter site

A single-page personal homepage with a privacy-reduced interactive travel atlas.

## Publish with GitHub Pages
1. Open your GitHub Pages repository.
2. Upload `index.html` into the repository root (alongside README.md).
3. Under Settings → Pages, ensure the source is **Deploy from a branch**, the correct branch is chosen, and the folder is **/(root)**.
4. In Settings → Pages, confirm the custom domain is `ryho.io`.
5. Wait for the GitHub Pages deployment to complete, then refresh https://ryho.io.

This is static HTML, so no build tools or frameworks are needed for the first version. You can migrate to Astro later.

## Privacy notes
- The original Timeline.json is **not** included.
- July 22, 2025 through October 2026 is used. July 22 is the inclusive start of the travel period (timestamps are stored with time-zone offsets).
- Position coordinates are rounded to a roughly 5km grid (0.05 degrees). Exact visits, labels, home and work classification are omitted.
- The map is approximate and not snapped to roads. Large gaps/flights are not joined.
- This output still reveals broad travel patterns and approximate visits. Review it before publishing, especially sensitive destinations.
- Leaflet and OpenStreetMap tiles are requested over the network when visitors load the page.

## What to do next
Add curated photos, hand-picked stops, a resume link, and individual articles.

## Regenerate the travel map

The page uses JavaScript and Leaflet. The editable converter is
`scripts/convert_timeline.go` (Go 1.16+, standard library only).
Existing map coordinates live in `data/travel-paths.js`; extracting them
has not changed the displayed route. The new converter is a replacement,
not the recovered original generator, so regenerated routes will differ.

From the project directory:

```sh
go run scripts/convert_timeline.go Timeline.json
```

Options: `--start 2025-07-22 --end 2026-10-31 --grid 0.05
--gap-hours 6 --jump-km 100`. Dates are inclusive, using each sample's
time-zone date. The script sorts route samples by time, includes activity
endpoints, rounds coordinates, removes consecutive duplicate points, groups
by month, and splits across large jumps or time gaps. It excludes visits
and identifying metadata. It does not snap routes to roads or infer flights.
Smaller grid values expose more precise locations. Review generated data
before publishing. The original export is stored locally as `data/Timeline.json` and excluded by `.gitignore`; never force-add it to Git.

Put flags before the input filename. To experiment without replacing the map data:

```sh
go run scripts/convert_timeline.go --output /tmp/travel-preview.js Timeline.json
```

Output paths are relative to the current directory. Reload the page after regeneration.

Route points include a matching `pathDates` date array. Click a route to see the nearest recorded point’s date, using the sample’s original time-zone date. Multiple visits can overlap; select a month to narrow the route.

## Omit dates from the map

The converter excludes **March 13–15, 2026**, inclusive, by default.
Edit `defaultOmissions` in `scripts/convert_timeline.go` to add permanent
ranges. Each entry uses `YYYY-MM-DD:YYYY-MM-DD`, or a single date.

Alternatively, repeat `--omit` before the input filename. Explicit flags
replace the default exclusions, so include every range you want:

```sh
go run scripts/convert_timeline.go --omit 2026-03-13:2026-03-15 --omit 2026-08-01:2026-08-03 Timeline.json
```

Dates use each sample's recorded time-zone date. Excluded periods break
the route, including when there are no samples inside the excluded range.
Regenerate the map data after changing exclusions.

Recording gaps and month boundaries are connected with dashed straight lines, stored in `routeBreaks`. They indicate unknown routes and may include flights. Clicking a dashed connection shows its endpoint dates. Explicit date exclusions are never connected.

Point and gap popups include recorded times and UTC offsets. The converter retains full timestamps in `pathDates` and `routeBreaks`. Consecutive identical rounded coordinates on the same date keep the first recorded time.

## Unrealistic-point filtering

Detailed GPS takes priority over activity endpoints within five minutes.
The converter then removes isolated spikes only when both adjacent legs
exceed `--max-speed-kmh` (default 1200) and skipping the point produces
a plausible leg. Jitter below 1 km is tolerated; sustained travel is retained.
This heuristic cannot identify every bad sample or infer transport mode.
The command reports skipped endpoints and removed spikes.

```sh
go run scripts/convert_timeline.go --max-speed-kmh 1200 data/Timeline.json
go test scripts/convert_timeline.go scripts/convert_timeline_test.go
```

## Rounding at stops only

Moving samples retain original GPS coordinates. Only consecutive clusters
within `--stop-radius-km 1` lasting strictly over `--stop-hours 1` are rounded
to the configured grid. Gaps exceeding `--gap-hours` end a cluster. This is
a heuristic based on recorded samples, not proof of continuous presence.
Dashed connection endpoints follow the same rounding rule. Generated map
data now exposes more precise coordinates along moving routes.

## National park markers

`data/visited-parks.js` contains inferred U.S. national park visits, matching
generated route points against official NPS administrative boundary polygons.
Source: https://services1.arcgis.com/fBc8EJBxQRMcHlei/arcgis/rest/services/NPS_Land_Resources_Division_Boundary_and_Tract_Data_Service/FeatureServer/2
Retrieved November 14, 2026. Boundary simplification: 0.001 degrees.
This includes designated national parks only, not monuments, recreation areas,
Canadian parks, or other countries. Rounded stop coordinates and sparse
recordings can cause missed or incorrect matches. Markers are located at a
matching route sample, not necessarily a visitor center. Fewer than three
matching points are labeled possible visits; all others are still inferences,
not confirmed visits. Recorded dates are listed individually.
The file is editable; review it before publishing. It does not automatically
regenerate when running the Timeline converter.

## Park artwork, photos, and Canada

Each park has an editable illustrated SVG in `assets/icons/parks/`, using
a representative landscape motif and park initials (not official park logos).
Yosemite uses Half Dome. Popup photos load from official NPS / Parks Canada
page metadata; a source link appears below each photo. Photos require network
access and can change at the source.

Canadian route matches use Natural Resources Canada's legislative boundaries:
https://proxyinternet.nrcan-rncan.gc.ca/arcgis/rest/services/CLSS-SATC/CLSS_Administrative_Boundaries/MapServer/1
Retrieved November 14, 2026; simplified to 0.001 degrees. Matches detected:
Banff, Yoho, Jasper. These are inferred visits, not user-confirmed.
Canadian provincial parks are outside this boundary dataset.

Visit date display merges consecutive days and gaps of one missing day into
a single range, for both parks and highlights. Longer gaps remain separate
visits. Glacier dates were explicitly corrected by the traveler.

## Transport colors and month highlighting

Blue shows ground route samples; orange shows explicitly classified flying
activities from Timeline. Flight lines are approximate airport connections,
not actual flight tracks. Gray dashes indicate unknown routes. The month
selector highlights the selected month and keeps other routes as faint
context. Park/highlight lists still filter to that month. Flights are assigned
to their departure month. No speed-based flight guesses are made.

## Location groups and local time

Pins have category borders and white outer edges. `category` in each data
entry selects parks (green), nature (blue), cities (violet), landmarks (gold),
or people (berry). Radio buttons select all locations or one category, filtering map pins and the unified chronological
location list; month filtering applies as well.
Route point popups use bundled MIT-licensed tz-lookup 6.1.25 to resolve an
IANA timezone from coordinates, then Intl formats the timestamp with local
daylight-saving rules. Geographic timezone lookup is approximate near borders.
`data/transport-overrides.js` records the traveler-confirmed Kona–Seattle
flight absent from flying activities; displayed times are GPS gap endpoints.
Flight-associated gaps are suppressed by time or nearby matching airport pairs.

Flight popups group connecting legs into a full itinerary when the next flight
departs within 24 hours and its origin is within 100 km of the prior arrival.
Cities are matched against the local airport catalog within 75 km; unmatched
records are labeled unidentified. Each leg keeps its own local endpoint times.
Repeated itineraries share a dashed line; transpacific longitudes are unwrapped.

## Holiday trip comparison

The map checkbox hides Thanksgiving (November 25–December 2, 2025) and
Christmas (December 22–29, 2025), inclusive. Edit `holidayHomeRanges` in
`index.html` to adjust the ranges. This display-only filter hides recorded
route samples, overlapping gaps/flights, and location dates during those
periods; it leaves the underlying files unchanged. Default: show everything.

The home-trip comparison also includes March 12–17, 2026, covering the
Mississippi trip and its outbound/return flights.

The comparison toggle also hides the wedding trip October 9–15, 2025,
including the Las Vegas–Atlanta outbound and return flights.

The converter includes July 22, 2025, to retain the initial drive from Blue Springs toward Louisville. The trip start flag is July 22, 2025.

## Pages

`index.html` is the personal homepage. `travel.html` is the window-filling
travel atlas, linked from the homepage navigation and travel section. Its
page does not scroll; controls and locations scroll within the sidebar
(top panel on small screens). Map behavior lives in `assets/travel-map.js`.
