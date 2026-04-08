import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { Header } from '@/components/Header/Header';
import { useAuthStore } from '@/stores/auth.store';
import HomePage from '@/pages/HomePage/HomePage';
import BrowsePage from '@/pages/BrowsePage/BrowsePage';
import SkillDetailPage from '@/pages/SkillDetailPage/SkillDetailPage';
import ProfilePage from '@/pages/ProfilePage/ProfilePage';
import SubmitPage from '@/pages/SubmitPage/SubmitPage';
import AuthPage from '@/pages/AuthPage/AuthPage';
import CommunityPage from '@/pages/CommunityPage/CommunityPage';
import CollectionDetailPage from '@/pages/CollectionDetailPage/CollectionDetailPage';
import AuthCallbackPage from '@/pages/AuthCallbackPage/AuthCallbackPage';
import ResearchDetailPage from '@/pages/ResearchDetailPage/ResearchDetailPage';
import SubmitResearchPage from '@/pages/SubmitResearchPage/SubmitResearchPage';
import DocsPage from '@/pages/DocsPage/DocsPage';
import GuidePage from '@/pages/GuidePage/GuidePage';
import ServicesPage from '@/pages/ServicesPage/ServicesPage';
import TermsPage from '@/pages/TermsPage/TermsPage';

function RootLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

function RequireAuth() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  return <Outlet />;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/browse" element={<BrowsePage />} />
        <Route path="/skill/:skillId" element={<SkillDetailPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/guide" element={<GuidePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/research/:researchId" element={<ResearchDetailPage />} />
        <Route path="/collection/:collectionId" element={<CollectionDetailPage />} />

        <Route element={<RequireAuth />}>
          <Route path="/profile/:userId" element={<ProfilePage />} />
          <Route path="/submit" element={<SubmitPage />} />
          <Route path="/submit-research" element={<SubmitResearchPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
