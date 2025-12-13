export function createInvoiceNo(prefix = 'SI') {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const rnd = String(Math.floor(Math.random() * 9000) + 1000);
  return `${prefix}-${y}${m}${d}-${rnd}`;
}

export function calcInvoiceTotals(lines) {
  const subTotal = lines.reduce((sum, l) => sum + (Number(l.qty) * Number(l.unitPrice)), 0);
  const vat = lines.reduce((sum, l) => sum + (Number(l.qty) * Number(l.unitPrice) * (Number(l.vatRate) / 100)), 0);
  const total = subTotal + vat;
  return { subTotal, vat, total };
}
