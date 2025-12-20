import { BrowserRouter, Routes, Route } from "react-router-dom"
import MainLayout from "./layouts/MainLayout"
import Home from "./pages/Home"
import About from "./pages/About"
import Contact from "./pages/Contact"
import Career from "./pages/Career"
import CompanyDetail from "./pages/CompanyDetail"

import HumanResources from "./pages/HumanResources"
import JobApplication from "./pages/JobApplication"
import JobDetail from "./pages/JobDetail"
import CompanyBrands from "./pages/CompanyBrands"
import NewsList from "./pages/NewsList"
import NewsDetail from "./pages/NewsDetail"
import CompanyCulture from "./pages/CompanyCulture"
import LegalPage from "./pages/LegalPage"

import AdminLogin from "./pages/admin/Login"
import AdminDashboard from "./pages/admin/Dashboard"
import ManagerDashboard from "./pages/admin/ManagerDashboard"
import SuperAdminDashboard from "./pages/admin/SuperAdminDashboard"

import AnalyticsTracker from "./components/AnalyticsTracker"

function App() {
  return (
    <BrowserRouter>
      <AnalyticsTracker />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="hakkimizda" element={<About />} />
          <Route path="iletisim" element={<Contact />} />
          <Route path="kariyer" element={<HumanResources />} />
          <Route path="kariyer/basvuru" element={<JobApplication />} />
          <Route path="kariyer/ilan/:id" element={<JobDetail />} />
          <Route path="kariyer/kultur" element={<CompanyCulture />} />
          <Route path="sirket/:id" element={<CompanyDetail />} />
          <Route path="sirket/:id/markalar" element={<CompanyBrands />} />
          <Route path="bizden-haberler" element={<NewsList />} />
          <Route path="news/:id" element={<NewsDetail />} />
          <Route path="kvkk" element={<LegalPage type="kvkk" title="Kişisel Verilerin Korunması" />} />
          <Route path="cerez-politikasi" element={<LegalPage type="cookiePolicy" title="Çerez Politikası" />} />
          <Route path="cerez-tercihleri" element={<LegalPage type="cookiePreferences" title="Çerez Tercihleri" />} />
        </Route>

        {/* Admin Routes - Layout dışı tam sayfa */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/manager" element={<ManagerDashboard />} />
        <Route path="/admin/super" element={<SuperAdminDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App