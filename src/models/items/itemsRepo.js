const KEY = "tanerp_items";

function read() {
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}

function write(rows) {
  localStorage.setItem(KEY, JSON.stringify(rows));
}

const itemsRepo = {
  list() {
    return read();
  },

  getById(id) {
    return read().find((x) => x.id === id) ?? null;
  },

  create(item) {
    const rows = read();
    rows.unshift(item);
    write(rows);
    return item;
  },

  update(id, patch) {
    const rows = read();
    const idx = rows.findIndex((x) => x.id === id);
    if (idx === -1) return null;

    rows[idx] = {
      ...rows[idx],
      ...patch,
      updatedAt: new Date().toISOString(),
    };

    write(rows);
    return rows[idx];
  },

  adjustStock(itemId, deltaQty) {
  const rows = read();
  const idx = rows.findIndex(x => String(x.id) === String(itemId));
  if (idx === -1) return null;

  const current = Number(rows[idx].stockQty || 0);
  const next = current + Number(deltaQty || 0);

  rows[idx] = {
    ...rows[idx],
    stockQty: next,
    updatedAt: new Date().toISOString(),
  };

  write(rows);
  return rows[idx];
},

  remove(id) {
    write(read().filter((x) => x.id !== id));
    return true;
  },
};



export default itemsRepo;
