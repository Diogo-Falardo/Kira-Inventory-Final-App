import { useState } from "react";
// page
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Lock, BarChart3, Boxes, Eye, EyeOff } from "lucide-react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

// input -> lib {validators}
import { validate_email, validate_password } from "@/lib/Input";

// api -> related
import { useLogin, useRegister } from "@/app/hooks/useAuth";
import { getApiErrorMessage } from "@/app/api";

// alert
import { toast } from "react-toastify";

// router -> tanstack
import { useNavigate } from "@tanstack/react-router";

// auth
import { useAuth } from "@/app/AuthContext";

type LoginValues = {
  email: string;
  password: string;
};

type RegisterValues = {
  email: string;
  plan_code: "free";
  password: string;
  repeatPassword: string;
};

export default function AuthPage() {
  const [tab, setTab] = useState<"login" | "register">("login");

  // passowrd visibility
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterRepeatPassword, setShowRegisterRepeatPassword] =
    useState(false);

  // react-hook-form instances for each tab
  const loginForm = useForm<LoginValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterValues>({
    defaultValues: {
      email: "",
      password: "",
      repeatPassword: "",
    },
  });

  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const navigate = useNavigate();
  const { login } = useAuth();
  function handleLoginSubmit(values: LoginValues) {
    loginMutation.mutate(values, {
      onSuccess: (data) => {
        login({
          access_token: data.access_token,
          refresh_token: data.refresh_token,
        });

        toast.success("Welcome");
        navigate({ to: "/userpanel" });
      },
      onError: (err) => {
        toast.error(getApiErrorMessage(err));
      },
    });
  }

  function handleRegisterSubmit(values: RegisterValues) {
    registerMutation.mutate(values, {
      onSuccess: () => {
        setTab("login");
        toast.success("Account created you can login now!");
      },
      onError: (err) => {
        toast.error(getApiErrorMessage(err));
      },
    });
  }

  return (
    <main className="min-h-screen w-full bg-linear-to-br from-neutral-950 via-neutral-900 to-neutral-800 text-neutral-100 flex items-center justify-center p-6">
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-4xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 border border-neutral-800/80 bg-neutral-900/60 backdrop-blur-xl rounded-xl shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)] overflow-hidden">
          {/* Left / Brand side */}
          <div className="relative hidden md:flex flex-col justify-between border-b md:border-b-0 md:border-r border-neutral-800/80 bg-neutral-900 p-8">
            {/* subtle radial glow */}
            <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_0%,rgba(0,0,0,0)_70%)] blur-[80px]" />

            <div className="relative space-y-4">
              <div className="inline-flex items-center gap-2 rounded-lg border border-neutral-700/60 bg-neutral-800/40 px-2 py-1 text-[11px] font-medium text-neutral-300">
                <Lock className="h-3.5 w-3.5 text-neutral-400" />
                <span>Secure access</span>
              </div>

              <h2 className="text-xl font-semibold text-neutral-100 leading-tight">
                Kira Inventory
              </h2>

              <p className="text-sm text-neutral-400 leading-relaxed">
                Track stock levels, margins and sales performance in one clean
                dashboard. Built for small sellers on Instagram, Vinted, etc.
              </p>
            </div>

            {/* Features */}
            <div className="relative grid grid-cols-2 gap-6 text-left text-xs text-neutral-400 pt-10">
              {/* Feature 1 */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 p-2 items-center justify-center rounded-md border border-neutral-800 bg-neutral-900/70 text-neutral-300 flex-none">
                    <Boxes className="h-4 w-4" />
                  </div>

                  <p className="text-neutral-200 font-medium text-[13px] leading-none">
                    Inventory control
                  </p>
                </div>

                <p className="text-[11px] leading-relaxed text-neutral-400">
                  Stay on top of what&apos;s in stock and what needs restocking.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 p-2 items-center justify-center rounded-md border border-neutral-800 bg-neutral-900/70 text-neutral-300 flex-none">
                    <BarChart3 className="h-4 w-4" />
                  </div>

                  <p className="text-neutral-200 font-medium text-[13px] leading-none">
                    Profit tracking
                  </p>
                </div>

                <p className="text-[11px] leading-relaxed text-neutral-400">
                  Understand what you&apos;re actually earning.
                </p>
              </div>
            </div>

            <div className="relative text-[10px] text-neutral-600 text-center pt-8">
              © {new Date().getFullYear()} Kira Inventory
            </div>
          </div>

          {/* Right / Auth form side */}
          <div className="p-6 md:p-8">
            <Card className="bg-transparent border-0 shadow-none text-neutral-100">
              <CardHeader className="text-center space-y-2 p-0 mb-6">
                <CardTitle className="text-xl font-semibold text-neutral-100">
                  {tab === "login" ? "Welcome back" : "Create your account"}
                </CardTitle>

                <CardDescription className="text-neutral-400 text-sm">
                  {tab === "login"
                    ? "Sign in to manage your inventory and profits."
                    : "Start organising your shop in minutes."}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-0">
                <Tabs value={tab} onValueChange={(val) => setTab(val as any)}>
                  {/* segmented control */}
                  <TabsList className="mb-6 flex w-full bg-neutral-800/40 border border-neutral-700/60 backdrop-blur-sm rounded-lg p-1">
                    <TabsTrigger
                      value="login"
                      className="cursor-pointer flex-1 data-[state=active]:bg-neutral-700 data-[state=active]:text-white data-[state=active]:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.8)] rounded-md text-neutral-300 text-sm font-medium"
                    >
                      Login
                    </TabsTrigger>
                    <TabsTrigger
                      value="register"
                      className="cursor-pointer flex-1 data-[state=active]:bg-neutral-700 data-[state=active]:text-white data-[state=active]:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.8)] rounded-md text-neutral-300 text-sm font-medium"
                    >
                      Register
                    </TabsTrigger>
                  </TabsList>

                  {/* LOGIN FORM */}
                  <TabsContent value="login" className="space-y-5">
                    <Form {...loginForm}>
                      <form
                        className="space-y-5"
                        onSubmit={loginForm.handleSubmit(handleLoginSubmit)}
                      >
                        <FormField
                          control={loginForm.control}
                          name="email"
                          rules={{
                            required: "Email is required.",
                            validate: (value) =>
                              validate_email(value) || "Invalid Email.",
                          }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[13px] text-neutral-300">
                                Email
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="you@example.com"
                                  className="bg-neutral-800/60 border border-neutral-700 text-neutral-100 placeholder:text-neutral-500"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-[12px] text-red-400" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={loginForm.control}
                          name="password"
                          rules={{
                            required: "Password is required.",
                            validate: (value) =>
                              validate_password(value) ||
                              "Password must have 6+ characters, 1 uppercase, 1 lowercase and 1 symbol.",
                          }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[13px] text-neutral-300">
                                Password
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    type={
                                      showLoginPassword ? "text" : "password"
                                    }
                                    placeholder="••••••••"
                                    className="bg-neutral-800/60 border border-neutral-700 text-neutral-100 placeholder:text-neutral-500 pr-10"
                                    {...field}
                                  />

                                  <button
                                    type="button"
                                    onClick={() =>
                                      setShowLoginPassword((v) => !v)
                                    }
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200 transition-colors"
                                    aria-label={
                                      showLoginPassword
                                        ? "Hide password"
                                        : "Show password"
                                    }
                                  >
                                    {showLoginPassword ? (
                                      <EyeOff className="h-4 w-4" />
                                    ) : (
                                      <Eye className="h-4 w-4" />
                                    )}
                                  </button>
                                </div>
                              </FormControl>
                              <FormMessage className="text-[12px] text-red-400" />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          disabled={loginMutation.isPending}
                          className="w-full cursor-pointer bg-neutral-200 text-neutral-900 hover:bg-white font-medium shadow-[0_20px_60px_-10px_rgba(255,255,255,0.3)]"
                        >
                          {loginMutation.isPending
                            ? "Logging in..."
                            : "Sign in"}
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>

                  {/* REGISTER FORM */}
                  <TabsContent value="register" className="space-y-5">
                    <Form {...registerForm}>
                      <form
                        className="space-y-5"
                        onSubmit={registerForm.handleSubmit(
                          handleRegisterSubmit
                        )}
                      >
                        <FormField
                          control={registerForm.control}
                          name="email"
                          rules={{
                            required: "Email is required.",
                            validate: (value) =>
                              validate_email(value) || "Invalid Email.",
                          }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[13px] text-neutral-300">
                                Email
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="you@example.com"
                                  className="bg-neutral-800/60 border border-neutral-700 text-neutral-100 placeholder:text-neutral-500"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-[12px] text-red-400" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={registerForm.control}
                          name="password"
                          rules={{
                            required: "Password is required.",
                            validate: (value) =>
                              validate_password(value) ||
                              "Password must have 6+ characters, 1 uppercase, 1 lowercase and 1 symbol.",
                          }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[13px] text-neutral-300">
                                Password
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    type={
                                      showRegisterPassword ? "text" : "password"
                                    }
                                    placeholder="••••••••"
                                    className="bg-neutral-800/60 border border-neutral-700 text-neutral-100 placeholder:text-neutral-500 pr-10"
                                    {...field}
                                  />

                                  <button
                                    type="button"
                                    onClick={() =>
                                      setShowRegisterPassword((v) => !v)
                                    }
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200 transition-colors"
                                    aria-label={
                                      showRegisterPassword
                                        ? "Hide password"
                                        : "Show password"
                                    }
                                  >
                                    {showRegisterPassword ? (
                                      <EyeOff className="h-4 w-4" />
                                    ) : (
                                      <Eye className="h-4 w-4" />
                                    )}
                                  </button>
                                </div>
                              </FormControl>
                              <FormMessage className="text-[12px] text-red-400" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={registerForm.control}
                          name="repeatPassword"
                          rules={{
                            required: "New password is required.",
                            validate: (value) =>
                              validate_password(value) ||
                              "Password must have 6+ characters, 1 uppercase, 1 lowercase and 1 symbol.",
                          }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[13px] text-neutral-300">
                                Repeat Password
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    type={
                                      showRegisterRepeatPassword
                                        ? "text"
                                        : "password"
                                    }
                                    placeholder="••••••••"
                                    className="bg-neutral-800/60 border border-neutral-700 text-neutral-100 placeholder:text-neutral-500 pr-10"
                                    {...field}
                                  />

                                  <button
                                    type="button"
                                    onClick={() =>
                                      setShowRegisterRepeatPassword((v) => !v)
                                    }
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200 transition-colors"
                                    aria-label={
                                      showRegisterRepeatPassword
                                        ? "Hide password"
                                        : "Show password"
                                    }
                                  >
                                    {showRegisterRepeatPassword ? (
                                      <EyeOff className="h-4 w-4" />
                                    ) : (
                                      <Eye className="h-4 w-4" />
                                    )}
                                  </button>
                                </div>
                              </FormControl>
                              <FormMessage className="text-[12px] text-red-400" />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          disabled={registerMutation.isPending}
                          className="w-full cursor-pointer bg-neutral-200 text-neutral-900 hover:bg-white font-medium shadow-[0_20px_60px_-10px_rgba(255,255,255,0.3)]"
                        >
                          {registerMutation.isPending
                            ? "Creating..."
                            : "Create account"}
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.section>
    </main>
  );
}
