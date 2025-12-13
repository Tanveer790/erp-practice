import { useEffect, useMemo, useState } from "react"
import { salesInvoiceService } from "../../services/salesInvoiceService.js"

const toNum = (v) => {
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

const calcGrandTotalFromLines = (lines = []) =>
  (lines || []).reduce((sum, l) => {
    const qty = toNum(l.qty)
    const price = toNum(l.price)
    const discPct = toNum(l.discountPct)
    const taxPct = toNum(l.taxPct)

    const base = qty * price
    const disc = base * (discPct / 100)
    const afterDisc = base - disc
    const tax = afterDisc * (taxPct / 100)

    return sum + (afterDisc + tax)
  }, 0)

const normalizeInvoices = (list = []) =>
  (list || []).map((inv) => {
    const grandTotal =
      inv?.grandTotal ??
      inv?.totals?.grandTotal ??
      calcGrandTotalFromLines(inv?.lines)

    return { ...inv, grandTotal }
  })

export function useSalesInvoiceListVM() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState("")
  const [status, setStatus] = useState("ALL")

  const load = async () => {
    setLoading(true)
    try {
      const data = await salesInvoiceService.list()
      setRows(normalizeInvoices(data))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const post = async (id) => {
    await salesInvoiceService.setStatus(id, "POSTED")
    await load()
  }

  const cancel = async (id) => {
    await salesInvoiceService.setStatus(id, "CANCELLED")
    await load()
  }

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase()
    return rows.filter((r) => {
      const matchQ =
        !query ||
        (r.invoiceNo || "").toLowerCase().includes(query) ||
        (r.customerName || "").toLowerCase().includes(query)

      const matchStatus = status === "ALL" ? true : r.status === status
      return matchQ && matchStatus
    })
  }, [rows, q, status])

  return {
    loading,
    q,
    setQ,
    status,
    setStatus,
    rows: filtered,
    reload: load,
    post,
    cancel,
  }
}
