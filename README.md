# DiffDesk

A local JSON comparison workspace for inspecting API responses and configuration changes.

Paste two JSON documents, compare their structures, filter the changes and export the result. Everything runs in the browser, with no upload, account, build step or external dependency.


## Try it

1. Extract the folder.
2. Open `index.html` in a modern browser such as Edge, Chrome or Firefox.
3. Select **Load example**. The sample produces five changes.
4. Try the change-type filter and path search.
5. Select **Export changes** to save all changes as JSON.

Alternatively paste your own JSON or select a local file for each side. Ctrl+Enter or Command+Enter runs the comparison. Swap sides reverses the inputs; compare again to refresh the results.

## Features

* Nested object and array comparisons with added, removed and changed states.
* Distinction between missing fields, null, strings, numbers and booleans.
* JSON Pointer paths including escaped field names (Bryan, Zyp and Nottingham, 2013).
* Change-type filtering and case-insensitive path search.
* JSON file import, sample data, keyboard shortcut and complete JSON export.
* Responsive layout, labelled inputs, visible focus and status announcements.
* Invalidation of stale results whenever an input changes.
* 1 MiB per input and a 1,000-row display cap. Export includes every detected change.

## Comparison rules

Object property order does not matter. Arrays are compared by index: reordering or inserting items may produce several changes. Added or removed subtrees are recorded once at their parent path. A type change is one change at that path. The empty path represents the root; `/` represents a property whose name is empty.

The comparison output is a change list, **not** an RFC 6902 JSON Patch document. It does not attempt semantic matching of array items by ID.

JavaScript uses IEEE 754 numbers. Integers outside the safe integer range can lose precision during JSON parsing; encode large identifiers as strings. Duplicate JSON object keys are resolved by JSON.parse, so the last occurrence wins. Use unique keys. Maximum recursive comparison depth is 150.

## Tests

Node.js 18.17 or later is needed only for tests:

```text
node --test tests/diff.test.cjs
```

No npm install is required. `npm test` runs the same checks. See `docs/VERIFICATION.md` for recorded results.

## Source map

* `index.html`: accessible page structure.
* `src/style.css`: responsive interface styles.
* `src/diff.js`: comparison engine, independently usable in Node or the browser.
* `src/app.js`: input validation, file import, rendering and export.
* `tests/diff.test.cjs`: regression tests for structural comparison.

## Privacy

There are no fetch calls, analytics scripts, fonts from external servers or persistent storage. Imported data remains in the page until it is closed or cleared. Export creates a local file containing changed values, so review it before sharing.

## References

Bryan, P., Zyp, K. and Nottingham, M. (2013) *JavaScript Object Notation (JSON) Pointer. RFC 6901*. Available at: https://www.rfc-editor.org/rfc/rfc6901 (Accessed: 21 October 2026).

## Licence

MIT. See LICENSE.
