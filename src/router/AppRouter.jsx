import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from '../components/auth/ProtectedRoute'
import DashboardLayout from '../components/layout/DashboardLayout'

// Landing/Login stay eager — they're the first thing most visitors see,
// so there's no benefit to lazy-loading them.
import Landing from '../pages/public/Landing'
import Login from '../pages/public/Login'
import Register from '../pages/public/Register'

// Everything else is lazy-loaded: each page (and anything heavy it imports,
// like the PDF/Word generators) only downloads when the user actually
// navigates there, instead of all being bundled into the initial load.
const PublicInvoice = lazy(() => import('../pages/public/PublicInvoice'))
const NotFound = lazy(() => import('../pages/NotFound'))

const DashboardOverview = lazy(() => import('../pages/dashboard/DashboardOverview'))
const Invoices = lazy(() => import('../pages/dashboard/Invoices'))
const CreateInvoice = lazy(() => import('../pages/dashboard/CreateInvoice'))
const InvoiceDetail = lazy(() => import('../pages/dashboard/InvoiceDetail'))
const Clients = lazy(() => import('../pages/dashboard/Clients'))
const Contracts = lazy(() => import('../pages/dashboard/Contracts'))
const CreateContract = lazy(() => import('../pages/dashboard/CreateContract'))
const ContractDetail = lazy(() => import('../pages/dashboard/ContractDetail'))
const Settings = lazy(() => import('../pages/dashboard/Settings'))
const Profile = lazy(() => import('../pages/dashboard/Profile'))

function PageFallback() {
  return (
    <div className="flex items-center justify-center min-h-[40vh] text-sm text-gray-400">
      Loading...
    </div>
  )
}

export default function AppRouter() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/invoice/:publicId" element={<PublicInvoice />} />

        {/* Dashboard (protected) */}
        <Route
          path="/app"
          element={(
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          )}
        >
          <Route index element={<DashboardOverview />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="invoices/new" element={<CreateInvoice />} />
          <Route path="invoices/:id" element={<InvoiceDetail />} />
          <Route path="clients" element={<Clients />} />
          <Route path="contracts" element={<Contracts />} />
          <Route path="contracts/new" element={<CreateContract />} />
          <Route path="contracts/:id" element={<ContractDetail />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
