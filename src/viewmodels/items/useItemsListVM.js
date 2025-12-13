import { useEffect, useMemo, useState } from "react";
import itemsRepo from "../../models/items/itemsRepo";

export function useItemsListVM() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("ALL");

  const load = () => {
    setLoading(true);
    setRows(itemsRepo.list());
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const query = (q || "").trim().toLowerCase();

    return rows.filter((r) => {
      const code = String(r?.code || "").toLowerCase();
      const name = String(r?.name || "").toLowerCase();

      const matchQ = !query || code.includes(query) || name.includes(query);
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
