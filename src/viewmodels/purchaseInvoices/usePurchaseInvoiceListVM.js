import { useEffect, useMemo, useState } from "react";
import purchaseInvoiceService from "../../services/purchaseInvoiceService";

export function usePurchaseInvoiceListVM() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("ALL");

  const load = async () => {
    setLoading(true);
    try {
      const data = await purchaseInvoiceService.list();
      setRows(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const query = (q || "").trim().toLowerCase();
    return rows.filter((r) => {
      const no = String(r?.invoiceNo || "").toLowerCase();
      const sup = String(r?.supplierName || "").toLowerCase();

      const matchQ = !query || no.includes(query) || sup.includes(query);
      const matchStatus = status === "ALL" ? true : r?.status === status;

      return matchQ && matchStatus;
    });
  }, [rows, q, status]);

  return {
    rows: filtered,
    loading,
    q,
    setQ,
    status,
    setStatus,
    reload: load,
  };
}
