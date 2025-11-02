import { useEffect, useState } from "react";
// page
import { useForm } from "react-hook-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, UserRound, Mail, Shield } from "lucide-react";

// auth -> auth context
import { useAuth } from "@/app/AuthContext";

// hooks
import {
  useUpdateUserProfile,
  useChangeEmail,
  useChangePassword,
} from "@/app/hooks/useUser";

// alert
import { toast } from "react-toastify";

// api
import { getApiErrorMessage } from "@/app/api";

// types
type ProfileValues = {
  username: string;
  avatar_url: string;
  address: string;
  country: string;
  phone_number: string;
};

type ChangeEmailValues = {
  email: string;
};

type ChangePasswordValues = {
  password: string;
  new_password: string;
};

export default function UserProfilePage() {
  // user -> auth
  const { refreshUser, user, isBootstrapping } = useAuth();

  // react-hook-form instances
  const profileForm = useForm<ProfileValues>({
    defaultValues: {
      username: "",
      avatar_url: "",
      address: "",
      country: "",
      phone_number: "",
    },
  });
  const emailForm = useForm<ChangeEmailValues>({
    defaultValues: { email: "" },
  });
  const passForm = useForm<ChangePasswordValues>({
    defaultValues: { password: "", new_password: "" },
  });

  // password visibility
  const [showPwd, setShowPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);

  // hooks -> mutations
  const { mutateAsync: updateProfile, isPending: savingProfile } =
    useUpdateUserProfile();
  const { mutateAsync: changeEmail, isPending: savingEmail } = useChangeEmail();
  const { mutateAsync: changePass, isPending: savingPass } =
    useChangePassword();

  // auth filll forms when user available
  useEffect(() => {
    if (!isBootstrapping && user) {
      profileForm.reset({
        username: user.username ?? "",
        avatar_url: user.avatar ?? "",
        address: "",
        country: "",
        phone_number: "",
      });
      emailForm.reset({ email: user.email });
    }
  }, [isBootstrapping, user, profileForm, emailForm]);

  // Handlers
  async function onSaveProfile(values: ProfileValues) {
    try {
      await updateProfile({
        username: values.username || undefined,
        avatar_url: values.avatar_url || undefined,
        address: values.address || undefined,
        country: values.country || undefined,
        phone_number: values.phone_number || undefined,
      });
      await refreshUser();
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  }

  async function onChangeEmail(values: ChangeEmailValues) {
    try {
      await changeEmail({ email: values.email });
      await refreshUser();
      toast.success("Email updated!");
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  }

  async function onChangePassword(values: ChangePasswordValues) {
    try {
      await changePass(values);
      passForm.reset({ password: "", new_password: "" });
      toast.success("Password updated!");
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  }

  const avatarUrl = profileForm.watch("avatar_url");
  const username = profileForm.watch("username");

  return (
    <div className="w-full max-w-[1200px] mx-auto px-3 md:px-6 pb-10 text-neutral-100 space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-neutral-100 flex items-center gap-2">
            <UserRound className="h-5 w-5 text-neutral-400" />
            Profile
          </h2>
          <p className="text-[13px] text-neutral-500 leading-relaxed">
            Update your personal info and secure your account.
          </p>
        </div>
        <Badge
          variant="outline"
          className="text-[10px] rounded-md border-neutral-700 text-neutral-400"
        >
          USER PANEL
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile details */}
        <Card className="lg:col-span-2 bg-neutral-900/50 border border-neutral-800/80 backdrop-blur-sm shadow-[0_30px_120px_-20px_rgba(0,0,0,0.9)]">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-neutral-200">
              Profile details
            </CardTitle>
            <CardDescription className="text-[12px] text-neutral-500">
              Your public information used across the app.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar preview */}
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14 rounded-xl border border-neutral-800 bg-neutral-800">
                <AvatarImage src={avatarUrl || undefined} alt={username} />
                <AvatarFallback className="rounded-xl text-[12px] text-neutral-300">
                  {username?.[0]?.toUpperCase() ?? "U"}
                </AvatarFallback>
              </Avatar>
              <div className="text-xs text-neutral-500">
                Recommended 160×160. Paste an image URL below.
              </div>
            </div>

            <Form {...profileForm}>
              <form
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                onSubmit={profileForm.handleSubmit(onSaveProfile)}
              >
                <FormField
                  control={profileForm.control}
                  name="username"
                  rules={{ required: "Username is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[12px] text-neutral-300">
                        Username
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your username"
                          className="bg-neutral-800/60 border-neutral-700 text-neutral-100 placeholder:text-neutral-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[12px] text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={profileForm.control}
                  name="avatar_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[12px] text-neutral-300">
                        Avatar URL
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/me.jpg"
                          className="bg-neutral-800/60 border-neutral-700 text-neutral-100 placeholder:text-neutral-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[12px] text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={profileForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-[12px] text-neutral-300">
                        Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Street, number, city"
                          className="bg-neutral-800/60 border-neutral-700 text-neutral-100 placeholder:text-neutral-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[12px] text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={profileForm.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[12px] text-neutral-300">
                        Country
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Portugal"
                          className="bg-neutral-800/60 border-neutral-700 text-neutral-100 placeholder:text-neutral-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[12px] text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={profileForm.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[12px] text-neutral-300">
                        Phone
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="+351 9xx xxx xxx"
                          className="bg-neutral-800/60 border-neutral-700 text-neutral-100 placeholder:text-neutral-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[12px] text-red-400" />
                    </FormItem>
                  )}
                />

                <div className="md:col-span-2 pt-2">
                  <Button
                    disabled={savingProfile}
                    className="bg-neutral-200 text-neutral-900 hover:bg-white font-medium shadow-[0_20px_60px_-10px_rgba(255,255,255,0.3)]"
                  >
                    {savingProfile ? "Saving..." : "Save changes"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Account actions */}
        <div className="space-y-6">
          {/* Change email */}
          <Card className="bg-neutral-900/50 border border-neutral-800/80 backdrop-blur-sm shadow-[0_30px_120px_-20px_rgba(0,0,0,0.9)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-neutral-200 flex items-center gap-2">
                <Mail className="h-4 w-4 text-neutral-400" />
                Change email
              </CardTitle>
              <CardDescription className="text-[12px] text-neutral-500">
                We’ll send a verification link to the new email.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...emailForm}>
                <form
                  className="space-y-3"
                  onSubmit={emailForm.handleSubmit(onChangeEmail)}
                >
                  <FormField
                    control={emailForm.control}
                    name="email"
                    rules={{
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email",
                      },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[12px] text-neutral-300">
                          New email
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="you@newmail.com"
                            className="bg-neutral-800/60 border-neutral-700 text-neutral-100 placeholder:text-neutral-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-[12px] text-red-400" />
                      </FormItem>
                    )}
                  />

                  <Button
                    disabled={savingEmail}
                    className="w-full bg-neutral-200 text-neutral-900 hover:bg-white font-medium"
                  >
                    {savingEmail ? "Updating..." : "Update email"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Change password */}
          <Card className="bg-neutral-900/50 border border-neutral-800/80 backdrop-blur-sm shadow-[0_30px_120px_-20px_rgba(0,0,0,0.9)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-neutral-200 flex items-center gap-2">
                <Shield className="h-4 w-4 text-neutral-400" />
                Change password
              </CardTitle>
              <CardDescription className="text-[12px] text-neutral-500">
                Keep your account secure with a strong password.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...passForm}>
                <form
                  className="space-y-3"
                  onSubmit={passForm.handleSubmit(onChangePassword)}
                >
                  <FormField
                    control={passForm.control}
                    name="password"
                    rules={{ required: "Current password is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[12px] text-neutral-300">
                          Current password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPwd ? "text" : "password"}
                              placeholder="••••••••"
                              className="pr-9 bg-neutral-800/60 border-neutral-700 text-neutral-100 placeholder:text-neutral-500"
                              {...field}
                            />
                            <button
                              type="button"
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200"
                              onClick={() => setShowPwd((s) => !s)}
                              aria-label={
                                showPwd ? "Hide password" : "Show password"
                              }
                            >
                              {showPwd ? (
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
                    control={passForm.control}
                    name="new_password"
                    rules={{
                      required: "New password is required",
                      minLength: { value: 6, message: "Min 6 characters" },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[12px] text-neutral-300">
                          New password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showNewPwd ? "text" : "password"}
                              placeholder="••••••••"
                              className="pr-9 bg-neutral-800/60 border-neutral-700 text-neutral-100 placeholder:text-neutral-500"
                              {...field}
                            />
                            <button
                              type="button"
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200"
                              onClick={() => setShowNewPwd((s) => !s)}
                              aria-label={
                                showNewPwd ? "Hide password" : "Show password"
                              }
                            >
                              {showNewPwd ? (
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
                    disabled={savingPass}
                    className="w-full bg-neutral-200 text-neutral-900 hover:bg-white font-medium"
                  >
                    {savingPass ? "Updating..." : "Update password"}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter>
              <p className="text-[11px] text-neutral-500">
                Tip: use at least 1 uppercase, 1 number and 1 symbol.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>

      <Separator className="bg-neutral-800" />
      <p className="text-[10px] text-neutral-600">
        © {new Date().getFullYear()} Kira Inventory — Profile settings.
      </p>
    </div>
  );
}
