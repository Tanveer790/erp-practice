const KEY = "tanerp_sales_invoices_v1"

const readAll = () => JSON.parse(localStorage.getItem(KEY) || "[]")
const writeAll = (data) => localStorage.setItem(KEY, JSON.stringify(data))

const genInvoiceNo = (count) => `SI-${String(100000 + count).slice(-6)}`

const toNum = (v) => {
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

const calcTotalsFromLines = (lines = []) => {
  let subTotal = 0
  let discountTotal = 0
  let taxTotal = 0

  for (const l of lines || []) {
    const qty = toNum(l.qty)
    const price = toNum(l.price)
    const discPct = toNum(l.discountPct)
    const taxPct = toNum(l.taxPct)

    const base = qty * price
    const disc = base * (discPct / 100)
    const afterDisc = base - disc
    const tax = afterDisc * (taxPct / 100)

    subTotal += base
    discountTotal += disc
    taxTotal += tax
  }

  return {
    subTotal,
    discountTotal,
    taxTotal,
    grandTotal: subTotal - discountTotal + taxTotal,
  }
}

export async function fetchSalesInvoicesApi() {
  return readAll().sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))
}

export async function getSalesInvoiceByIdApi(id) {
  return readAll().find((x) => String(x.id) === String(id)) ?? null
}

export async function createSalesInvoiceApi(invoice) {
  const all = readAll()
  const totals = calcTotalsFromLines(invoice?.lines || [])

  const saved = {
    ...invoice,
    totals,
    grandTotal: totals.grandTotal,
    id: crypto?.randomUUID?.() ?? String(Date.now()),
    invoiceNo: invoice.invoiceNo || genInvoiceNo(all.length + 1),
    status: invoice.status || "DRAFT",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }

  all.push(saved)
  writeAll(all)
  return saved
}

export async function updateSalesInvoiceApi(invoice) {
  const all = readAll()
  const idx = all.findIndex((x) => String(x.id) === String(invoice.id))
  if (idx === -1) throw new Error("Invoice not found")

  const totals = calcTotalsFromLines(invoice?.lines || [])

  all[idx] = {
    ...all[idx],
    ...invoice,
    totals,
    grandTotal: totals.grandTotal,
    updatedAt: Date.now(),
  }

  writeAll(all)
  return all[idx]
}

export async function setSalesInvoiceStatusApi(id, status) {
  const all = readAll()
  const idx = all.findIndex((x) => String(x.id) === String(id))
  if (idx === -1) throw new Error("Invoice not found")

  all[idx] = { ...all[idx], status, updatedAt: Date.now() }
  writeAll(all)
  return all[idx]
}

export const salesInvoiceService = {
  list: fetchSalesInvoicesApi,
  getById: getSalesInvoiceByIdApi,
  create: createSalesInvoiceApi,
  update: updateSalesInvoiceApi,
  setStatus: setSalesInvoiceStatusApi,
}
