const KEY = "tanerp_sales_invoices_v1"

const readAll = () => JSON.parse(localStorage.getItem(KEY) || "[]")
const writeAll = (data) => localStorage.setItem(KEY, JSON.stringify(data))

const genInvoiceNo = (count) => `SI-${String(100000 + count).slice(-6)}`

export const salesInvoiceService = {
  list: async () => {
    return readAll().sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))
  },

  getById: async (id) => {
    return readAll().find((x) => x.id === id) ?? null
  },

  create: async (invoice) => {
    const all = readAll()
    const newInv = {
      ...invoice,
      id: crypto?.randomUUID?.() ?? String(Date.now()),
      invoiceNo: invoice.invoiceNo || genInvoiceNo(all.length + 1),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    all.push(newInv)
    writeAll(all)
    return newInv
  },

  update: async (invoice) => {
    const all = readAll()
    const idx = all.findIndex((x) => x.id === invoice.id)
    if (idx === -1) throw new Error("Invoice not found")
    all[idx] = { ...all[idx], ...invoice, updatedAt: Date.now() }
    writeAll(all)
    return all[idx]
  },
}
