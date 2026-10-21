(function (scope) {
  "use strict";
  function kind(value) {
    return value === null ? "null" : Array.isArray(value) ? "array" : typeof value;
  }
  function escapeToken(token) { return String(token).replace(/~/g, "~0").replace(/\//g, "~1"); }
  function compare(before, after) {
    const changes = [];
    function walk(a, b, path, depth) {
      if (depth > 150) throw new Error("JSON nesting exceeds the supported depth of 150.");
      if (Object.is(a, b)) return;
      const ak = kind(a), bk = kind(b);
      if (ak !== bk || (ak !== "object" && ak !== "array")) {
        changes.push({ type: "changed", path, before: a, after: b });
        return;
      }
      const keys = [...new Set([...Object.keys(a), ...Object.keys(b)])];
      if (ak === "object") keys.sort();
      for (const key of keys) {
        const next = path + "/" + escapeToken(key);
        if (!Object.hasOwn(a, key)) changes.push({ type: "added", path: next, after: b[key] });
        else if (!Object.hasOwn(b, key)) changes.push({ type: "removed", path: next, before: a[key] });
        else walk(a[key], b[key], next, depth + 1);
      }
    }
    walk(before, after, "", 0);
    return changes;
  }
  const api = { compare, kind };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else scope.DiffDesk = api;
})(globalThis);
