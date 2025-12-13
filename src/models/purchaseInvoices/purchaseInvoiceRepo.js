const KEY = "tanerp_purchase_invoices";

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
  create(inv) {
    const rows = read();
    rows.unshift(inv);
    write(rows);
    return inv;
  },
  update(inv) {
    const rows = read();
    const idx = rows.findIndex((x) => String(x.id) === String(inv.id));
    if (idx === -1) return null;
    rows[idx] = { ...rows[idx], ...inv, updatedAt: new Date().toISOString() };
    write(rows);
    return rows[idx];
  },
  nextInvoiceNo(prefix = "PINV-", pad = 6) {
    const rows = read();
    let max = 0;
    for (const r of rows) {
      const no = String(r?.invoiceNo || "");
      if (!no.startsWith(prefix)) continue;
      const num = parseInt(no.slice(prefix.length), 10);
      if (!Number.isNaN(num)) max = Math.max(max, num);
    }
    return `${prefix}${String(max + 1).padStart(pad, "0")}`;
  },
};

export default repo;
