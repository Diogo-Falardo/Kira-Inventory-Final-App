import { StrictMode, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

// router -> tanstack
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "@/routeTree.gen";

// query -> tanstack
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// aleart -> react toastify
import { ToastContainer } from "react-toastify";

// authProvider -> AuthContext.tsx
import { AuthProvider, useAuth } from "./app/AuthContext";

// client query
const queryClient = new QueryClient();

export type RouterContext = {
  auth: {
    isAuthenticated: boolean;
    isBootstrapping: boolean;
  };
};

const router = createRouter({
  routeTree,
  context: {
    auth: {
      isAuthenticated: false,
      isBootstrapping: true,
    },
  } satisfies RouterContext,
});
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// blocks app until we know the state of auth
function AppAuth({ children }: { children: ReactNode }) {
  const { isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return <></>;
  }

  return <>{children}</>;
}

function AppRouter() {
  const { isAuthenticated, isBootstrapping } = useAuth();

  return (
    <AppAuth>
      <RouterProvider
        router={router}
        context={{
          auth: {
            isAuthenticated,
            isBootstrapping,
          },
        }}
      ></RouterProvider>
    </AppAuth>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <AppRouter />
        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
          draggable
        />
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>
);
