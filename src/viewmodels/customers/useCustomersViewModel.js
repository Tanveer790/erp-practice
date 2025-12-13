import { useEffect, useState, useCallback } from "react"
import { customerService } from "../../services/customerService.js"

export function useCustomersViewModel() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const load = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const data = await customerService.list() // ✅ FIX
      setCustomers(data)
    } catch (err) {
      console.error(err)
      setError("Failed to load customers")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const addCustomer = useCallback((payload) => {
    setCustomers((prev) => {
      const maxId = prev.reduce((max, c) => (c.id > max ? c.id : max), 0)
      const newCustomer = {
        id: maxId + 1,
        isActive: true,
        ...payload,
      }
      return [...prev, newCustomer]
    })
  }, [])

  const updateCustomer = useCallback((id, payload) => {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, ...payload } : c)))
  }, [])

  const deactivateCustomer = useCallback((id) => {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, isActive: false } : c)))
  }, [])

  return {
    customers,
    loading,
    error,
    reload: load,
    addCustomer,
    updateCustomer,
    deactivateCustomer,
  }
}
