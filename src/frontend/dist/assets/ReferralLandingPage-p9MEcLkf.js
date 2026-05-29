import { i as useParams, b as useNavigate, a as useAuth, c as useBackend, r as reactExports, j as jsxRuntimeExports, L as LoadingSpinner } from "./index-DIVa5zae.js";
const PENDING_REFERRAL_KEY = "pendingReferralCode";
function ReferralLandingPage() {
  const params = useParams({ from: "/referral/$code" });
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, login } = useAuth();
  const backend = useBackend();
  const processedRef = reactExports.useRef(false);
  reactExports.useEffect(() => {
    const code = params.code;
    if (code) {
      localStorage.setItem(PENDING_REFERRAL_KEY, code);
    }
    if (!isLoading && !isAuthenticated) {
      login();
    }
  }, [params.code, isLoading, isAuthenticated, login]);
  reactExports.useEffect(() => {
    if (!isAuthenticated || isLoading || processedRef.current) return;
    processedRef.current = true;
    const code = localStorage.getItem(PENDING_REFERRAL_KEY);
    if (code) {
      backend.setReferredBy(code).catch(() => {
      });
      localStorage.removeItem(PENDING_REFERRAL_KEY);
    }
    navigate({ to: "/" });
  }, [isAuthenticated, isLoading, backend.setReferredBy, navigate]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center min-h-screen", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "lg" }) });
}
export {
  ReferralLandingPage as default
};
