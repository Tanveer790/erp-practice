import suppliersRepo from "../models/suppliers/suppliersRepo";

const supplierService = {
  list: async () => suppliersRepo.list(),
  getById: async (id) => suppliersRepo.getById(id),
  create: async (row) => suppliersRepo.create(row),
  update: async (id, patch) => suppliersRepo.update(id, patch),
  nextCode: async () => suppliersRepo.nextCode(),
};

export default supplierService;
