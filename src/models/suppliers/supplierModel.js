export const SupplierStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
};

export const newSupplier = () => ({
  id: crypto?.randomUUID?.() ?? String(Date.now()),
  code: "",
  name: "",
  phone: "",
  email: "",
  vatNo: "",
  address: "",
  status: SupplierStatus.ACTIVE,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});
