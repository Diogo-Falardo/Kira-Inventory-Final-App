// page
import { motion } from "framer-motion";
import { AlertCircle, ArrowLeft, PackageSearch } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// router
import { useRouterState, useNavigate } from "@tanstack/react-router";

export default function ErrorPage() {
  // TanStack Router state + navigation
  const { location } = useRouterState({
    select: (s) => ({ location: s.location }),
  });

  const navigate = useNavigate();

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center bg-linear-to-br from-neutral-950 via-neutral-900 to-neutral-800 p-6 text-neutral-100">
      {/* background accent glow (subtle, neutral instead of violet/cyan) */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,rgba(0,0,0,0)_70%)] blur-[60px]" />
      </div>

      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative w-full max-w-lg"
      >
        <Card className="relative overflow-hidden border border-neutral-800/80 bg-neutral-900/70 text-neutral-100 shadow-2xl shadow-black/60 backdrop-blur-xl">
          {/* soft radial highlight behind content */}
          <div className="pointer-events-none absolute -top-40 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_0%,rgba(0,0,0,0)_70%)]" />

          <CardHeader className="relative flex flex-col items-center pb-4 text-center">
            {/* Icon bubble */}
            <div className="mb-4 flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-white/10 blur-xl" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-neutral-700/60 bg-linear-to-br from-neutral-800/80 via-neutral-800/40 to-transparent text-neutral-200 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.8)]">
                  <AlertCircle className="h-7 w-7" />
                </div>
              </div>
            </div>

            {/* brand badge */}
            <Badge
              variant="outline"
              className="mb-2 border-neutral-700/80 bg-neutral-800/60 text-[10px] font-medium uppercase tracking-wider text-neutral-400"
            >
              Kira Inventory
            </Badge>

            {/* Title + subtitle */}
            <CardTitle className="flex flex-col items-center gap-1 text-2xl font-semibold leading-tight text-neutral-100">
              <span>Page not found</span>
              <span className="text-sm font-normal text-neutral-400">
                We couldn&apos;t locate that section
              </span>
            </CardTitle>

            <CardDescription className="max-w-sm text-sm leading-relaxed text-neutral-400">
              The page you tried to access either doesn&apos;t exist, isn&apos;t
              available yet, or you don&apos;t have permission to view it.
            </CardDescription>
          </CardHeader>

          <CardContent className="relative space-y-4 text-sm text-neutral-300">
            {/* attempted route info */}
            <div className="rounded-xl border border-neutral-800/80 bg-neutral-900/60 p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-lg border border-neutral-800 bg-neutral-950/60 text-neutral-300">
                  <PackageSearch className="h-4 w-4" />
                </div>

                <div className="flex-1 space-y-1">
                  <p className="leading-none font-medium text-neutral-200">
                    Trying to access:
                  </p>

                  <code className="block rounded-md border border-neutral-800/80 bg-neutral-950/50 px-2 py-1 font-mono text-[11px] text-neutral-400">
                    {location.pathname}
                  </code>

                  <p className="text-xs leading-relaxed text-neutral-500">
                    This route is not part of Kira Inventory yet.
                  </p>
                </div>
              </div>
            </div>

            <Separator className="bg-neutral-800/80" />

            {/* help / tips */}
            <div className="text-xs leading-relaxed text-neutral-500">
              <p className="mb-1 font-medium text-neutral-400">
                What you can do:
              </p>
              <ul className="list-disc space-y-1 pl-4">
                <li>Go back to where you were and continue managing stock.</li>
                <li>
                  Contact your admin if you believe you should have access.
                </li>
              </ul>
            </div>
          </CardContent>

          <CardFooter className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* back button */}
            <Button
              className="w-full bg-neutral-800 text-neutral-100 border border-neutral-700 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.8)] hover:bg-neutral-700 sm:w-auto cursor-pointer"
              onClick={() =>
                navigate({
                  // go "up" one level, keep same params/search
                  to: "..",
                  params: (p: any) => p,
                  search: (s: any) => s,
                })
              }
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>

            {/* dashboard button */}
            <Button
              variant="outline"
              className="w-full border-neutral-700 bg-neutral-900/60 text-neutral-200 hover:bg-neutral-800 hover:text-white sm:w-auto cursor-pointer"
              // onClick={() =>
              //   navigate({
              //     to: "/dashboard",
              //   })
              // }
            >
              Open Dashboard
            </Button>
          </CardFooter>
        </Card>

        {/* tiny footer hint */}
        <div className="mt-6 text-center text-[10px] font-mono uppercase tracking-wide text-neutral-600">
          Error code: 404 / Not Registered Route
        </div>
      </motion.section>
    </main>
  );
}
