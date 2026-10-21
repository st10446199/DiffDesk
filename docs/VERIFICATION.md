# Verification

Checked on 21 October 2026 using Node.js.

All 12 comparison-engine tests passed. They cover object ordering, missing versus null, type changes, escaped paths, array indices, root values, prototype-named keys, immutability, recursion limits, removed subtrees and empty property names.

Browser startup was blocked by this environment, so rendered layout, browser file import/download and keyboard interaction have not been executed in a real browser here. The interface source was reviewed; that is not equivalent to browser testing.

## Local acceptance checks

1. Open index.html and select Load example. Expect five changes: one added, one removed and three changed.
2. Filter to Added. Expect only /timeout. Search /features to isolate its field change.
3. Edit either input. Old results should disappear until Compare JSON is selected again.
4. Enter invalid JSON and compare. Expect an error naming the affected side.
5. Export changes and inspect the downloaded JSON. Filters should not remove changes from the export.
6. Compare identical documents and confirm zero changes.
7. Import a JSON file with Open JSON. Verify its content appears on the chosen side.
8. Compare a string containing HTML markup. It should display as text.
9. Use the page with a narrow window and keyboard navigation.
10. Press Ctrl+Enter or Command+Enter to compare.
