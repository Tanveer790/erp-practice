import repo from "../models/purchaseInvoices/purchaseInvoiceRepo";

const purchaseInvoiceService = {
  list: async () => repo.list(),
  getById: async (id) => repo.getById(id),
  create: async (inv) => repo.create(inv),
  update: async (inv) => repo.update(inv),
  nextInvoiceNo: async () => repo.nextInvoiceNo(),
};

export default purchaseInvoiceService;
