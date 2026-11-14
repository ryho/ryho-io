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
- July 23, 2025 through October 2026 is used. July 23 is the inclusive start of the travel period (timestamps are stored with time-zone offsets).
- Position coordinates are rounded to a roughly 5km grid (0.05 degrees). Exact visits, labels, home and work classification are omitted.
- The map is approximate and not snapped to roads. Large gaps/flights are not joined.
- This output still reveals broad travel patterns and approximate visits. Review it before publishing, especially sensitive destinations.
- Leaflet and OpenStreetMap tiles are requested over the network when visitors load the page.

## What to do next
Add curated photos, hand-picked stops, a resume link, and individual articles.
