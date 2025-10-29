import { createFileRoute, Navigate } from "@tanstack/react-router";
import AuthPage from "@/pages/AuthPage";

// router
import type { RouterContext } from "@/main";

export const Route = createFileRoute("/auth")({
  component: AuthGate,
});

function AuthGate() {
  const { auth } = Route.useRouteContext() as RouterContext;

  if (auth.isBootstrapping) {
    return <></>;
  }

  if (auth.isAuthenticated) {
    return <Navigate to="/userpanel" />;
  }

  return <AuthPage />;
}
