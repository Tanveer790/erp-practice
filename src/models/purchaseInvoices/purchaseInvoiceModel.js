export const PurchaseInvoiceStatus = {
  DRAFT: "DRAFT",
  POSTED: "POSTED",
  VOID: "VOID",
};

export const newPurchaseLine = () => ({
  id: crypto?.randomUUID?.() ?? String(Date.now()),
  itemId: "",
  description: "",
  qty: 1,
  cost: 0, // purchase cost (not selling price)
  discountPct: 0,
  taxPct: 15,
});

export const newPurchaseInvoice = () => ({
  id: crypto?.randomUUID?.() ?? String(Date.now()),
  invoiceNo: "",
  date: new Date().toISOString().slice(0, 10),
  supplierName: "",
  notes: "",
  status: PurchaseInvoiceStatus.DRAFT,
  lines: [newPurchaseLine()],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});
