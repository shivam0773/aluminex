import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Companies from "./pages/Companies";
import CompanyDetails from "./pages/CompanyDetails";
import Contacts from "./pages/Contacts";
import ContactDetails from "./pages/ContactDetails";
import Products from "./pages/Products";
import FollowUps from "./pages/FollowUps";
import FollowUpDetails from "./pages/FollowUpDetails";
import Communications from "./pages/Communications";
import CommunicationDetails from "./pages/CommunicationDetails";

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
      <Route path="/followups" element={<FollowUps />} />
      <Route path="/followups/:id" element={<FollowUpDetails />} />
      <Route path="/communications" element={<Communications />} />
      <Route path="/communications/:id" element={<CommunicationDetails />} />
      </Routes>
      );
      }

      export default App;