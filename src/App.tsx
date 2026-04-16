import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import MainLayout from './components/layout/MainLayout'
import MobileLayout from './components/layout/MobileLayout'
import Splash from './screens/Splash'
import Onboarding from './screens/Onboarding'
import Login from './screens/Login'
import VerifyOtp from './screens/VerifyOtp'
import TrialOffer from './screens/TrialOffer'
import AssessmentIntro from './screens/AssessmentIntro'
import Questionnaire from './screens/Questionnaire'
import EnterName from './screens/EnterName'
import Paywall from './screens/Paywall'
import Home from './screens/Home'
import AskTutor from './screens/AskTutor'
import Lesson from './screens/Lesson'
import ProfileMenu from './screens/ProfileMenu'
import Settings from './screens/Settings'
import ProfileEdit from './screens/ProfileEdit'
import ContentPage from './screens/ContentPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
            {/* Public routes — constrained to phone width on desktop */}
            <Route element={<MobileLayout />}>
              <Route path="/" element={<Splash />} />
              <Route path="/onboarding/:step" element={<Onboarding />} />
              <Route path="/login" element={<Login />} />
              <Route path="/verify-otp" element={<VerifyOtp />} />
            </Route>

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              {/* Onboarding flows — constrained to phone width */}
              <Route element={<MobileLayout />}>
                <Route path="/trial-offer" element={<TrialOffer />} />
                <Route path="/assessment" element={<AssessmentIntro />} />
                <Route path="/questionnaire/:step" element={<Questionnaire />} />
                <Route path="/enter-name" element={<EnterName />} />
                <Route path="/paywall" element={<Paywall />} />
                <Route path="/profile/edit" element={<ProfileEdit />} />
              </Route>

              {/* Full-width responsive screens */}
              <Route path="/lesson/:id" element={<Lesson />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/content/:slug" element={<ContentPage />} />

              {/* Main app with sidebar/bottom nav */}
              <Route element={<MainLayout />}>
                <Route path="/home" element={<Home />} />
                <Route path="/ask-tutor" element={<AskTutor />} />
                <Route path="/profile" element={<ProfileMenu />} />
              </Route>
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
