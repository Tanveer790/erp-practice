import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import supplierService from "../../services/supplierService";
import { newSupplier, SupplierStatus } from "../../models/suppliers/supplierModel";

export function useSupplierFormVM({ mode }) {
  const nav = useNavigate();
  const { id } = useParams();
  const isEdit = mode === "edit";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(newSupplier());

  const title = useMemo(() => (isEdit ? "Edit Supplier" : "New Supplier"), [isEdit]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        if (isEdit && id) {
          const row = await supplierService.getById(id);
          if (!row) setError("Supplier not found");
          else setForm(row);
        } else {
          const code = await supplierService.nextCode();
          setForm((p) => ({ ...p, code }));
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isEdit, id]);

  const setField = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const validate = async () => {
    const code = String(form.code || "").trim();
    const name = String(form.name || "").trim();
    if (!code) return "Supplier code is required";
    if (!name) return "Supplier name is required";

    const list = await supplierService.list();
    const exists = list.some(
      (x) => x.id !== form.id && String(x.code || "").toLowerCase() === code.toLowerCase()
    );
    if (exists) return "Supplier code already exists";
    return "";
  };

  const save = async () => {
    const msg = await validate();
    if (msg) {
      setError(msg);
      return;
    }
    setError("");
    setSaving(true);
    try {
      const payload = {
        ...form,
        code: String(form.code || "").trim(),
        name: String(form.name || "").trim(),
        status: form.status || SupplierStatus.ACTIVE,
        updatedAt: new Date().toISOString(),
      };

      if (isEdit) await supplierService.update(form.id, payload);
      else await supplierService.create(payload);

      nav("/suppliers");
    } finally {
      setSaving(false);
    }
  };

  return { loading, saving, error, form, title, setField, save, goBack: () => nav("/suppliers") };
}
