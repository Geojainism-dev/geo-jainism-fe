import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import SEO from "@/components/common/SEO";
import "@/styles/app.css";
import "@/styles/navbar.css";
import "@/styles/footer.css";
import "./firebase";
import { loadLanding, loadTamilJain, loadAbout } from "@/lib/routePreloader";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/features/auth/AuthContext";
import ProtectedRoute from "@/features/auth/ProtectedRoute";
import AdminLogin from "@/pages/Admin/Login";
import AdminRegister from "@/pages/Admin/Register";
import AdminLoginCallback from "@/pages/Admin/LoginCallback";
import AdminPending from "@/pages/Admin/Pending";
import AdminDashboard from "@/pages/Admin/Dashboard";
import AdminProfile from "@/pages/Admin/Profile";
import AdminCalendar from "@/pages/Admin/Calendar";
import AdminLayout from "@/components/layout/AdminLayout";
import AdminScreeningsList from "@/pages/Admin/Screenings/List";
import AdminScreeningNew from "@/pages/Admin/Screenings/New";
import AdminScreeningEdit from "@/pages/Admin/Screenings/Edit";
import AdminScreeningRegistrationsList from "@/pages/Admin/ScreeningRegistrations/List";
import AdminScreeningRegistrationDetail from "@/pages/Admin/ScreeningRegistrations/Detail";
import AdminUsersPending from "@/pages/Admin/Users/Pending";
import AdminUsersList from "@/pages/Admin/Users/List";
import AdminBlogList from "@/pages/Admin/Blog/List";
import AdminBlogNew from "@/pages/Admin/Blog/New";
import AdminBlogEdit from "@/pages/Admin/Blog/Edit";
import AdminBlogCategories from "@/pages/Admin/Blog/Categories";
import AdminBlogTags from "@/pages/Admin/Blog/Tags";
import ScreeningsListPage from "@/pages/Screenings/List";
import ScreeningDetailPage from "@/pages/Screenings/Detail";
import RegisterPage from "@/pages/Register";
import RegisterSuccessPage from "@/pages/Register/Success";
import BlogListPage from "@/pages/Blog/List";
import BlogDetailPage from "@/pages/Blog/Detail";

const LandingPage = lazy(loadLanding);
const TamilJainPage = lazy(loadTamilJain);
const AboutPage = lazy(loadAbout);

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    // Basic scroll reset, ensure it doesn't conflict too much with Lenis if we can help it.
    // Ideally lenis.scrollTo(0) but we don't have the instance here unless we use a context.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

const PageLoader = () => (
  <div className="premium-loader-container" aria-hidden="true">
    <div className="premium-loader-bar" />
    <img src="/logo.png" className="premium-loader-logo" alt="Loading" />
    <p className="premium-loader-text">GEO JAINISM</p>
  </div>
);

function RouteSeo() {
  const { pathname } = useLocation();
  return <SEO pathname={pathname} />;
}

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <RouteSeo />
            <ScrollToTop />
            <Toaster />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/tamil-jain" element={<TamilJainPage />} />
                <Route path="/about" element={<AboutPage />} />

                <Route path="/events" element={<ScreeningsListPage />} />
                <Route path="/events/:id" element={<ScreeningDetailPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/register/success/:code" element={<RegisterSuccessPage />} />
                <Route path="/blog" element={<BlogListPage />} />
                <Route path="/blog/:slug" element={<BlogDetailPage />} />

                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/register" element={<AdminRegister />} />
                <Route path="/admin/login/callback" element={<AdminLoginCallback />} />
                <Route path="/admin/pending" element={<AdminPending />} />

                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="profile" element={<AdminProfile />} />
                  <Route path="calendar" element={<AdminCalendar />} />
                  <Route path="events" element={<AdminScreeningsList />} />
                  <Route path="events/new" element={<AdminScreeningNew />} />
                  <Route path="events/:id/edit" element={<AdminScreeningEdit />} />
                  <Route path="registrations" element={<AdminScreeningRegistrationsList />} />
                  <Route path="registrations/:id" element={<AdminScreeningRegistrationDetail />} />
                  <Route path="blog" element={<AdminBlogList />} />
                  <Route path="blog/new" element={<AdminBlogNew />} />
                  <Route path="blog/:id/edit" element={<AdminBlogEdit />} />
                  <Route path="blog/categories" element={<AdminBlogCategories />} />
                  <Route path="blog/tags" element={<AdminBlogTags />} />
                  <Route
                    path="users"
                    element={
                      <ProtectedRoute requiredRole="SUPER_ADMIN">
                        <AdminUsersList />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="users/pending"
                    element={
                      <ProtectedRoute requiredRole="SUPER_ADMIN">
                        <AdminUsersPending />
                      </ProtectedRoute>
                    }
                  />
                </Route>
              </Routes>
            </Suspense>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;

