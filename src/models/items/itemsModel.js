const ItemStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
};

function createEmptyItem() {
  return {
    id: crypto?.randomUUID?.() ?? Date.now().toString(),
    code: "",
    name: "",
    uom: "PCS",
    price: 0,
    taxRate: 15,
    status: ItemStatus.ACTIVE,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export { ItemStatus, createEmptyItem };
export default { ItemStatus, createEmptyItem };
