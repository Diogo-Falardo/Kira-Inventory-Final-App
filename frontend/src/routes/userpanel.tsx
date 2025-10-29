import { createFileRoute, Navigate } from "@tanstack/react-router";
import UserPanel from "@/pages/user/UserPanel";

// router
import type { RouterContext } from "@/main";

export const Route = createFileRoute("/userpanel")({
  component: UserPanelGate,
});

function UserPanelGate() {
  // router context
  const { auth } = Route.useRouteContext() as RouterContext;

  if (auth.isBootstrapping) {
    return <></>;
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  return <UserPanel />;
}
