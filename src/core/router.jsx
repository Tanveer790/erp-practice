import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginView from "../views/auth/LoginView.jsx";
import MainLayout from "../views/layout/MainLayout.jsx";
import DashboardView from "../views/dashboard/DashboardView.jsx";
import { ProtectedRoute } from "../components/common/ProtectedRoute.jsx";
import CustomersListView from "../views/customers/CustomersListView.jsx";
import SalesInvoiceListPage from "../views/salesInvoices/SalesInvoiceListPage.jsx";
import SalesInvoiceFormPage from "../views/salesInvoices/SalesInvoiceFormPage.jsx";


export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginView />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardView />} />
          <Route path="customers" element={<CustomersListView />} />

          {/* ✅ sales invoices (relative paths because they are nested) */}
          <Route path="sales-invoices" element={<SalesInvoiceListPage />} />
          <Route
            path="sales-invoices/new"
            element={<SalesInvoiceFormPage mode="create" />}
          />
          <Route
            path="sales-invoices/:id"
            element={<SalesInvoiceFormPage mode="edit" />}
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
