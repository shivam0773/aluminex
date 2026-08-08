import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Companies from "./pages/Companies";
import CompanyDetails from "./pages/CompanyDetails";
import Contacts from "./pages/Contacts";
import ContactDetails from "./pages/ContactDetails";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Quotations from "./pages/Quotations";
import QuotationDetails from "./pages/QuotationDetails";
import CreateQuotation from "./pages/CreateQuotation";
import EditQuotation from "./pages/EditQuotation";
import FollowUps from "./pages/FollowUps";
import FollowUpDetails from "./pages/FollowUpDetails";
import Communications from "./pages/Communications";
import CommunicationDetails from "./pages/CommunicationDetails";
import SalesOrders from "./pages/SalesOrders";
import SalesOrderDetails from "./pages/SalesOrderDetails";
import CreateSalesOrder from "./pages/CreateSalesOrder";
import EditSalesOrder from "./pages/EditSalesOrder";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />

      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/companies" element={<Companies />} />

      {/* Company Details */}
      <Route path="/companies/:id" element={<CompanyDetails />} />

      <Route path="/contacts" element={<Contacts />} />
      {/* Contact Details */}
      <Route path="/contacts/:id" element={<ContactDetails />} />

      <Route path="/products" element={<Products />} />
      <Route path="/products/:id" element={<ProductDetails />} />

      <Route path="/quotations" element={<Quotations />} />
      <Route path="/quotations/new" element={<CreateQuotation />} />
      <Route path="/quotations/:id" element={<QuotationDetails />} />
      <Route path="/quotations/:id/edit" element={<EditQuotation />} />

      <Route path="/sales-orders" element={<SalesOrders />} />
      <Route path="/sales-orders/new" element={<CreateSalesOrder />} />
      <Route path="/sales-orders/:id" element={<SalesOrderDetails />} />
      <Route path="/sales-orders/:id/edit" element={<EditSalesOrder />} />

      <Route path="/followups" element={<FollowUps />} />
      <Route path="/followups/:id" element={<FollowUpDetails />} />
      <Route path="/communications" element={<Communications />} />
      <Route path="/communications/:id" element={<CommunicationDetails />} />
    </Routes>
  );
}

      export default App;