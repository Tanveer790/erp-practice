const KEY = "tanerp_suppliers";

function read() {
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}
function write(rows) {
  localStorage.setItem(KEY, JSON.stringify(rows));
}

const repo = {
  list() {
    return read();
  },
  getById(id) {
    return read().find((x) => String(x.id) === String(id)) ?? null;
  },
  create(row) {
    const rows = read();
    rows.unshift(row);
    write(rows);
    return row;
  },
  update(id, patch) {
    const rows = read();
    const idx = rows.findIndex((x) => String(x.id) === String(id));
    if (idx === -1) return null;
    rows[idx] = { ...rows[idx], ...patch, updatedAt: new Date().toISOString() };
    write(rows);
    return rows[idx];
  },
  remove(id) {
    write(read().filter((x) => String(x.id) !== String(id)));
    return true;
  },
  nextCode(prefix = "SUP-", pad = 4) {
    const rows = read();
    let max = 0;
    for (const r of rows) {
      const code = String(r?.code || "");
      if (!code.startsWith(prefix)) continue;
      const num = parseInt(code.slice(prefix.length), 10);
      if (!Number.isNaN(num)) max = Math.max(max, num);
    }
    return `${prefix}${String(max + 1).padStart(pad, "0")}`;
  },
};

export default repo;
