import { mapCustomerDtoToModel } from "../models/customers/customerModel.js"

const KEY = "tanerp_customers_v1"

const readAll = () => JSON.parse(localStorage.getItem(KEY) || "[]")
const writeAll = (data) => localStorage.setItem(KEY, JSON.stringify(data))

const seedIfEmpty = () => {
  const existing = readAll()
  if (existing.length) return

  const seed = [
    {
      id: 1,
      name: "ABC Trading Co.",
      phone: "0551234567",
      email: "info@abctrading.com",
      city: "Jeddah",
      isActive: true,
    },
    {
      id: 2,
      name: "Matrix Meras",
      phone: "0126123456",
      email: "support@matrixmeras.com",
      city: "Jeddah",
      isActive: true,
    },
  ]
  writeAll(seed)
}

seedIfEmpty()

export async function fetchCustomersApi() {
  return readAll().map(mapCustomerDtoToModel)
}

export async function createCustomerApi(payload) {
  const all = readAll()
  const maxId = all.reduce((m, c) => (Number(c.id) > m ? Number(c.id) : m), 0)
  const saved = { id: maxId + 1, isActive: true, ...payload }
  all.push(saved)
  writeAll(all)
  return mapCustomerDtoToModel(saved)
}

export async function updateCustomerApi(id, patch) {
  const all = readAll()
  const idx = all.findIndex((c) => String(c.id) === String(id))
  if (idx === -1) throw new Error("Customer not found")
  all[idx] = { ...all[idx], ...patch }
  writeAll(all)
  return mapCustomerDtoToModel(all[idx])
}

export async function deactivateCustomerApi(id) {
  return updateCustomerApi(id, { isActive: false })
}

export const customerService = {
  list: fetchCustomersApi,
  create: createCustomerApi,
  update: updateCustomerApi,
  deactivate: deactivateCustomerApi,
}
