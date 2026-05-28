import Layout from "@/components/Layout";
import LoadingSpinner from "@/components/LoadingSpinner";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  Outlet,
  RouterProvider,
  createBrowserHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import React, { Suspense } from "react";
import "@/i18n";
import MyFavouritesPage from "@/pages/MyFavouritesPage";
const MyLikesPage = React.lazy(() => import("@/pages/MyLikesPage"));
const MyReferralsPage = React.lazy(() => import("@/pages/MyReferralsPage"));
const ReferralLandingPage = React.lazy(
  () => import("@/pages/ReferralLandingPage"),
);

// Lazy-loaded pages
const FeedPage = React.lazy(() => import("@/pages/FeedPage"));
const AdDetailPage = React.lazy(() => import("@/pages/AdDetailPage"));
const ProfilePage = React.lazy(() => import("@/pages/ProfilePage"));
const CreateAdPage = React.lazy(() => import("@/pages/CreateAdPage"));
const MyAdsPage = React.lazy(() => import("@/pages/MyAdsPage"));
const PaymentSuccessPage = React.lazy(
  () => import("@/pages/PaymentSuccessPage"),
);
const PaymentCancelPage = React.lazy(() => import("@/pages/PaymentCancelPage"));
const MyJoinRequestsPage = React.lazy(
  () => import("@/pages/MyJoinRequestsPage"),
);
const PublicProfilePage = React.lazy(() => import("@/pages/PublicProfilePage"));

const PageFallback = (
  <div className="flex items-center justify-center min-h-[50vh]">
    <LoadingSpinner size="lg" />
  </div>
);

// Root route — wraps all children in Layout
const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Suspense fallback={PageFallback}>
        {/* Outlet rendered by child routes */}
        <RouterOutlet />
      </Suspense>
    </Layout>
  ),
});

// We need a small helper to render the correct outlet
function RouterOutlet() {
  return <Outlet />;
}

// Individual routes
const feedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => (
    <Suspense fallback={PageFallback}>
      <FeedPage />
    </Suspense>
  ),
});

const adDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ad/$id",
  component: () => (
    <Suspense fallback={PageFallback}>
      <AdDetailPage />
    </Suspense>
  ),
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: () => (
    <ProtectedRoute>
      <Suspense fallback={PageFallback}>
        <ProfilePage />
      </Suspense>
    </ProtectedRoute>
  ),
});

const createAdRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/create-ad",
  component: () => (
    <ProtectedRoute>
      <Suspense fallback={PageFallback}>
        <CreateAdPage />
      </Suspense>
    </ProtectedRoute>
  ),
});

const myAdsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/my-ads",
  component: () => (
    <ProtectedRoute>
      <Suspense fallback={PageFallback}>
        <MyAdsPage />
      </Suspense>
    </ProtectedRoute>
  ),
});

const paymentSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/payment-success",
  component: () => (
    <Suspense fallback={PageFallback}>
      <PaymentSuccessPage />
    </Suspense>
  ),
});

const paymentCancelRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/payment-cancel",
  component: () => (
    <Suspense fallback={PageFallback}>
      <PaymentCancelPage />
    </Suspense>
  ),
});

const myJoinRequestsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/my-join-requests",
  component: () => (
    <ProtectedRoute>
      <Suspense fallback={PageFallback}>
        <MyJoinRequestsPage />
      </Suspense>
    </ProtectedRoute>
  ),
});

const myFavouritesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/my-favourites",
  component: () => (
    <ProtectedRoute>
      <Suspense fallback={PageFallback}>
        <MyFavouritesPage />
      </Suspense>
    </ProtectedRoute>
  ),
});

const publicProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/user/$principal",
  component: () => (
    <Suspense fallback={PageFallback}>
      <PublicProfilePage />
    </Suspense>
  ),
});

// Build route tree
const myLikesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/my-likes",
  component: () => (
    <ProtectedRoute>
      <Suspense fallback={PageFallback}>
        <MyLikesPage />
      </Suspense>
    </ProtectedRoute>
  ),
});

const myReferralsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/my-referrals",
  component: () => (
    <ProtectedRoute>
      <Suspense fallback={PageFallback}>
        <MyReferralsPage />
      </Suspense>
    </ProtectedRoute>
  ),
});

const referralLandingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/referral/$code",
  component: () => (
    <Suspense fallback={PageFallback}>
      <ReferralLandingPage />
    </Suspense>
  ),
});

const routeTree = rootRoute.addChildren([
  feedRoute,
  adDetailRoute,
  profileRoute,
  createAdRoute,
  myAdsRoute,
  myJoinRequestsRoute,
  myFavouritesRoute,
  myLikesRoute,
  publicProfileRoute,
  paymentSuccessRoute,
  paymentCancelRoute,
  myReferralsRoute,
  referralLandingRoute,
]);

const history = createBrowserHistory();

const router = createRouter({
  routeTree,
  history,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
