// page
import { motion } from "framer-motion";
import { TrendingUp, Package, BarChart3, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// router -> tanstack
import { useNavigate } from "@tanstack/react-router";

// auth
import { useAuth } from "@/app/AuthContext";

export default function LandingPage() {
  const navigate = useNavigate();

  const { isAuthenticated, isBootstrapping } = useAuth();

  const handleClick = () => {
    if (isBootstrapping) {
      return;
    }

    if (isAuthenticated) {
      navigate({ to: "/userpanel" });
    } else {
      navigate({ to: "/auth" });
    }
  };

  return (
    <main className="min-h-screen w-full bg-linear-to-br from-neutral-950 via-neutral-900 to-neutral-800 text-neutral-100 flex flex-col items-center justify-between">
      {/* Hero Section */}
      <section className="relative w-full max-w-5xl mx-auto text-center px-6 pt-32 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-linear-to-r from-neutral-100 to-neutral-300 bg-clip-text text-transparent">
            Simplify your small business
          </h1>
          <p className="text-neutral-400 max-w-xl mx-auto text-base sm:text-lg leading-relaxed mb-10">
            Kira Inventory helps small Instagram, Vinted and more shops manage
            their stock, track sales, and understand profits — all in one clean
            dashboard.
          </p>

          <Button
            size="lg"
            className="cursor-pointer bg-neutral-800 hover:bg-neutral-700 text-neutral-100 border border-neutral-700 shadow-[0_10px_30px_-5px_rgba(255,255,255,0.05)]"
            onClick={handleClick}
          >
            <LogIn className="mr-2 h-5 w-5" />
            Access Dashboard
          </Button>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-5xl mx-auto px-6 grid sm:grid-cols-3 gap-6 pb-24">
        {[
          {
            icon: Package,
            title: "Smart Stock Tracking",
            desc: "Stay on top of your inventory — know what’s in, what’s out, and what needs restocking.",
          },
          {
            icon: BarChart3,
            title: "Profit Insights",
            desc: "Understand your earnings and profit margins with simple analytics and clean visuals.",
          },
          {
            icon: TrendingUp,
            title: "Growth Overview",
            desc: "Visualize your sales performance over time to make smarter decisions for your shop.",
          },
        ].map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.15, duration: 0.4 }}
          >
            <Card className="bg-neutral-900/60 border border-neutral-800/80 backdrop-blur-md text-neutral-100 shadow-md hover:shadow-lg hover:shadow-black/30 transition-all">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
                <f.icon className="h-8 w-8 text-neutral-300" />
                <h3 className="text-lg font-semibold">{f.title}</h3>
                <p className="text-sm text-neutral-400">{f.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </section>

      <Separator className="bg-neutral-800/70 w-full" />

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-neutral-500">
        <p>
          © {new Date().getFullYear()}{" "}
          <span className="text-neutral-300 font-medium">Kira Inventory</span> —
          Manage your shop effortlessly.
        </p>
      </footer>
    </main>
  );
}
