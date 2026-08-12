import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";

import RoleProtectedRoute from "./RoleProtectedRoute";
import ProtectedRoute from "./ProtectedRoute";
import AppLayout from "../components/layout/AppLayout";

import Customers from "../pages/customers/Customers";
import CustomerForm from "../pages/customers/CustomerForm";
import CustomerDetails from "../pages/customers/CustomerDetails";

import Products from "../pages/products/Products";
import ProductForm from "../pages/products/ProductForm";
import ProductDetails from "../pages/products/ProductDetails";

import Challans from "../pages/challans/Challans";
import CreateChallan from "../pages/challans/CreateChallan";
import ChallanDetails from "../pages/challans/ChallanDetails";
import EditProduct from "../pages/products/EditProduct";

import Inventory from "../pages/inventory/Inventory";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/customers" element={<Customers />} />

          <Route path="/customers/new" element={<CustomerForm />} />

          <Route path="/customers/:id/edit" element={<CustomerForm />} />
          <Route path="/customers/:id" element={<CustomerDetails />} />

          <Route path="/products" element={<Products />} />
          <Route
            path="/products/new"
            element={
              <RoleProtectedRoute allowedRoles={["ADMIN", "WAREHOUSE"]}>
                <ProductForm />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/products/:id"
            element={
              <RoleProtectedRoute
                allowedRoles={["ADMIN", "SALES", "WAREHOUSE"]}
              >
                <ProductDetails />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/products/:id/edit"
            element={
              <RoleProtectedRoute allowedRoles={["ADMIN", "WAREHOUSE"]}>
                <EditProduct />
              </RoleProtectedRoute>
            }
          />

          <Route
            path="/challans"
            element={
              <ProtectedRoute>
                <Challans />
              </ProtectedRoute>
            }
          />

          <Route
            path="/challans/new"
            element={
              <ProtectedRoute>
                <CreateChallan />
              </ProtectedRoute>
            }
          />
          <Route
            path="/challans/:id"
            element={
              <ProtectedRoute>
                <ChallanDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/inventory"
            element={
              <RoleProtectedRoute allowedRoles={["ADMIN", "WAREHOUSE"]}>
                <Inventory />
              </RoleProtectedRoute>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
