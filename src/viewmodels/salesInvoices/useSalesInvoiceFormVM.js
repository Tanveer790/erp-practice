import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { salesInvoiceService } from "../../services/salesInvoiceService.js"
import { customerService } from "../../services/customerService.js"

const newLine = () => ({
  id: crypto?.randomUUID?.() ?? String(Date.now()),
  description: "",
  qty: 1,
  price: 0,
  discountPct: 0,
  taxPct: 0,
})

const toNum = (v) => {
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

export function useSalesInvoiceFormVM({ mode, id }) {
  const nav = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [customers, setCustomers] = useState([])

  const [invoice, setInvoice] = useState({
    id: null,
    invoiceNo: "",
    date: new Date().toISOString().slice(0, 10),
    customerId: "",
    customerName: "",
    notes: "",
    status: "DRAFT",
    lines: [newLine()],
  })

  const totals = useMemo(() => {
    let subTotal = 0
    let discountTotal = 0
    let taxTotal = 0

    for (const l of invoice.lines || []) {
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
  }, [invoice.lines])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const cust = await customerService.list()
        setCustomers(cust)

        if (mode === "edit" && id) {
          const inv = await salesInvoiceService.getById(id)
          if (inv) setInvoice(inv)
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [mode, id])

  const setField = (name, value) => setInvoice((p) => ({ ...p, [name]: value }))

  const setCustomer = (customerId) => {
    const c = customers.find((x) => String(x.id) === String(customerId))
    setInvoice((p) => ({
      ...p,
      customerId,
      customerName: c?.name || c?.customerName || "",
    }))
  }

  const addLine = () => setInvoice((p) => ({ ...p, lines: [...p.lines, newLine()] }))

  const removeLine = (lineId) => {
    setInvoice((p) => {
      const next = (p.lines || []).filter((l) => l.id !== lineId)
      return { ...p, lines: next.length ? next : [newLine()] }
    })
  }

  const updateLine = (lineId, patch) => {
    setInvoice((p) => ({
      ...p,
      lines: (p.lines || []).map((l) => (l.id === lineId ? { ...l, ...patch } : l)),
    }))
  }

  const saveDraft = async () => {
    if (!invoice.customerId) {
      alert("Please select a customer")
      return
    }

    setSaving(true)
    try {
      const payload = { ...invoice, totals, grandTotal: totals.grandTotal, status: "DRAFT" }
      if (payload.id) await salesInvoiceService.update(payload)
      else await salesInvoiceService.create(payload)

      nav("/sales-invoices")
    } finally {
      setSaving(false)
    }
  }

  return {
    loading,
    saving,
    customers,
    invoice,
    totals,
    setField,
    setCustomer,
    addLine,
    removeLine,
    updateLine,
    saveDraft,
    goBack: () => nav("/sales-invoices"),
  }
}
