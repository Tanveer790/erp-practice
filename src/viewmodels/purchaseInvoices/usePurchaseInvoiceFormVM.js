import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import itemsRepo from "../../models/items/itemsRepo";
import purchaseInvoiceService from "../../services/purchaseInvoiceService";
import { newPurchaseInvoice, newPurchaseLine } from "../../models/purchaseInvoices/purchaseInvoiceModel";
import supplierService from "../../services/supplierService";

const toNum = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

export function usePurchaseInvoiceFormVM({ mode, id }) {
  const nav = useNavigate();
  const isEdit = mode === "edit";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [items, setItems] = useState([]);

  const [invoice, setInvoice] = useState(newPurchaseInvoice());

  const totals = useMemo(() => {
    let subTotal = 0;
    let discountTotal = 0;
    let taxTotal = 0;

    for (const l of invoice.lines || []) {
      const qty = toNum(l.qty);
      const cost = toNum(l.cost);
      const discPct = toNum(l.discountPct);
      const taxPct = toNum(l.taxPct);

      const base = qty * cost;
      const disc = base * (discPct / 100);
      const afterDisc = base - disc;
      const tax = afterDisc * (taxPct / 100);

      subTotal += base;
      discountTotal += disc;
      taxTotal += tax;
    }

    return {
      subTotal,
      discountTotal,
      taxTotal,
      grandTotal: subTotal - discountTotal + taxTotal,
    };
  }, [invoice.lines]);

  const [suppliers, setSuppliers] = useState([]);


  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        setSuppliers((await supplierService.list()).filter(s => s.status === "ACTIVE"));
        setItems(itemsRepo.list().filter((i) => i.status === "ACTIVE"));

        if (isEdit && id) {
          const inv = await purchaseInvoiceService.getById(id);
          if (inv) {
            setInvoice({
              ...inv,
              lines: inv.lines?.length ? inv.lines : [newPurchaseLine()],
            });
          }
        } else {
          // create mode: generate invoice no
          const nextNo = await purchaseInvoiceService.nextInvoiceNo();
          setInvoice((p) => ({ ...p, invoiceNo: nextNo }));
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isEdit, id]);

  const setField = (name, value) => setInvoice((p) => ({ ...p, [name]: value }));

  const addLine = () => setInvoice((p) => ({ ...p, lines: [...p.lines, newPurchaseLine()] }));

  const removeLine = (lineId) => {
    setInvoice((p) => {
      const next = (p.lines || []).filter((l) => l.id !== lineId);
      return { ...p, lines: next.length ? next : [newPurchaseLine()] };
    });
  };

  const updateLine = (lineId, patch) => {
    setInvoice((p) => ({
      ...p,
      lines: (p.lines || []).map((l) => (l.id === lineId ? { ...l, ...patch } : l)),
    }));
  };

  // item select: auto fill desc + cost + tax
  const setLineItem = (lineId, itemId) => {
    if (!itemId) {
      updateLine(lineId, { itemId: "", description: "" });
      return;
    }
    const item = itemsRepo.getById(itemId);
    if (!item) return;

    updateLine(lineId, {
      itemId: item.id,
      description: `${item.code} - ${item.name}`,
      cost: toNum(item.price),          // (for now using item.price as cost)
      taxPct: toNum(item.taxRate),
    });
  };

  const saveDraft = async () => {
    if (!String(invoice.supplierName || "").trim()) {
      alert("Please enter supplier name");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...invoice,
        totals,
        grandTotal: totals.grandTotal,
        status: "DRAFT",
      };

      if (payload.id && isEdit) await purchaseInvoiceService.update(payload);
      else await purchaseInvoiceService.create(payload);

      nav("/purchase-invoices");
    } finally {
      setSaving(false);
    }
  };

  const postInvoice = async () => {
  if (!String(invoice.supplierId || "").trim() && !String(invoice.supplierName || "").trim()) {
    alert("Please select supplier");
    return;
  }

  // prevent double posting
  if (invoice.status === "POSTED") {
    alert("Already posted");
    return;
  }

  setSaving(true);
  try {
    // 1) Increase stock for each line
    for (const l of invoice.lines || []) {
      const qty = Number(l.qty || 0);
      if (!l.itemId || qty <= 0) continue;
      itemsRepo.adjustStock(l.itemId, qty); // ✅ +qty
    }

    // 2) Save invoice as POSTED
    const payload = {
      ...invoice,
      totals,
      grandTotal: totals.grandTotal,
      status: "POSTED",
      postedAt: new Date().toISOString(),
    };

    if (payload.id && isEdit) await purchaseInvoiceService.update(payload);
    else await purchaseInvoiceService.create(payload);

    nav("/purchase-invoices");
  } finally {
    setSaving(false);
  }
};


  return {
    loading,
    saving,
    suppliers,
    items,
    invoice,
    totals,
    setField,
    postInvoice,
    addLine,
    removeLine,
    updateLine,
    setLineItem,
    saveDraft,
    goBack: () => nav("/purchase-invoices"),
  };
}
