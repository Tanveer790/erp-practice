import { useEffect, useMemo, useState } from "react";
import { salesInvoiceService } from "../../services/salesInvoiceService.js";

export function useSalesInvoiceListVM() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("ALL");

  const load = async () => {
    setLoading(true);
    try {
      const data = await salesInvoiceService.list();
      setRows(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return rows.filter((r) => {
      const matchQ =
        !query ||
        (r.invoiceNo || "").toLowerCase().includes(query) ||
        (r.customerName || "").toLowerCase().includes(query);

      const matchStatus = status === "ALL" ? true : r.status === status;
      return matchQ && matchStatus;
    });
  }, [rows, q, status]);

  return { loading, q, setQ, status, setStatus, rows: filtered, reload: load };
}
