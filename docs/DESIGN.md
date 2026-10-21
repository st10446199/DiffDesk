# Design notes

The comparison engine is independent of the DOM. A recursive walk compares value types first, then traverses the union of child keys. Object.hasOwn avoids confusing inherited keys with data. Object property keys are sorted for stable output; array keys retain index order.

A change stores its type, JSON Pointer and applicable before/after values. Missing sides are omitted rather than represented as null. Neither input is modified.

Rendering uses textContent rather than innerHTML, so strings from an imported JSON file cannot create elements or scripts. Input changes immediately invalidate previous results. File size, comparison depth and displayed row count are bounded to keep accidental large inputs manageable.

The UI displays at most 1,000 matching rows. Export always serializes the full comparison, independent of filters. Very broad nested objects can still be expensive to compare on the main thread; a worker is a reasonable future extension.

Array identity matching, arbitrary precision JSON parsing and patch application are deliberately outside this version. This makes the comparison rules easy to explain and test.
