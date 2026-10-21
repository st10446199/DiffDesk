"use strict";
const el = id => document.getElementById(id);
const limit = 1024 * 1024;
let changes = [], valid = false;
function message(text, error = false) { el("status").textContent = text; el("status").className = error ? "error" : ""; }
function invalidate() {
  valid = false; changes = []; el("results").hidden = true;
  message("Inputs changed. Compare again to update the results.");
}
function parse(id) {
  const text = el(id).value;
  if (new TextEncoder().encode(text).length > limit) throw new Error(`${id === "before" ? "Original" : "Updated"} input exceeds 1 MiB.`);
  try { return JSON.parse(text); } catch (error) { throw new Error(`${id === "before" ? "Original" : "Updated"} JSON: ${error.message}`); }
}
function compare() {
  invalidate();
  try {
    changes = DiffDesk.compare(parse("before"), parse("after")); valid = true;
    el("results").hidden = false;
    const count = type => changes.filter(c => c.type === type).length;
    el("summary").textContent = `${changes.length} changes · ${count("added")} added · ${count("removed")} removed · ${count("changed")} changed`;
    message(changes.length ? "Comparison complete. Paths use JSON Pointer notation." : "These JSON documents are structurally identical.");
    render();
  } catch (error) { message(error.message, true); }
}
function render() {
  const rows = el("rows"); rows.replaceChildren();
  const query = el("search").value.toLowerCase(), filter = el("filter").value;
  const selected = changes.filter(c => (filter === "all" || c.type === filter) && c.path.toLowerCase().includes(query));
  // Bound DOM size for large documents. The export still includes every change.
  for (const change of selected.slice(0, 1000)) {
    const tr = document.createElement("tr"), path = document.createElement("td"), code = document.createElement("code"), badge = document.createElement("span");
    code.textContent = change.path || '(root: "")'; badge.textContent = change.type; badge.className = `badge ${change.type}`;
    path.append(code, badge); tr.append(path);
    for (const key of ["before", "after"]) {
      const td = document.createElement("td"), pre = document.createElement("pre");
      pre.textContent = Object.hasOwn(change, key) ? JSON.stringify(change[key], null, 2) : "Not present";
      if (!Object.hasOwn(change, key)) pre.className = "missing";
      td.append(pre); tr.append(td);
    }
    rows.append(tr);
  }
  el("empty").hidden = selected.length !== 0;
  if (selected.length > 1000) message(`Showing 1,000 of ${selected.length} matching changes. Export contains all ${changes.length} changes.`);
}
el("compare").addEventListener("click", compare);
for (const id of ["before", "after"]) {
  el(id).addEventListener("input", invalidate);
  el(id + "File").addEventListener("change", async event => {
    const file = event.target.files[0]; if (!file) return;
    try {
      if (file.size > limit) throw new Error("Choose a JSON file smaller than 1 MiB.");
      el(id).value = await file.text(); invalidate();
    } catch (error) { message(error.message, true); }
    event.target.value = "";
  });
}
el("sample").addEventListener("click", () => {
  el("before").value = JSON.stringify({ service: "checkout", version: 1, features: { express: false, currency: "ZAR" }, regions: ["Pretoria", "Cape Town"], legacy: null }, null, 2);
  el("after").value = JSON.stringify({ service: "checkout", version: 2, features: { express: true, currency: "ZAR" }, regions: ["Pretoria", "Durban"], timeout: 30 }, null, 2);
  el("filter").value = "all"; el("search").value = ""; compare();
});
el("swap").addEventListener("click", () => { [el("before").value, el("after").value] = [el("after").value, el("before").value]; invalidate(); });
el("clear").addEventListener("click", () => { el("before").value = ""; el("after").value = ""; invalidate(); el("before").focus(); });
el("filter").addEventListener("change", render); el("search").addEventListener("input", render);
el("export").addEventListener("click", () => {
  if (!valid) return;
  const url = URL.createObjectURL(new Blob([JSON.stringify({ format: "diffdesk.changes.v1", arrayMode: "index", changes }, null, 2)], { type: "application/json" }));
  const a = document.createElement("a"); a.href = url; a.download = "diffdesk_changes.json"; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
});
document.addEventListener("keydown", event => { if ((event.ctrlKey || event.metaKey) && event.key === "Enter") { event.preventDefault(); compare(); } });
