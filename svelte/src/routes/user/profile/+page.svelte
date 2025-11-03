<script lang="ts">
  import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
  } from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Separator } from '$lib/components/ui/separator';
  import { Label } from '$lib/components/ui/label';
  import { Avatar, AvatarImage, AvatarFallback } from '$lib/components/ui/avatar';
  import { Badge } from '$lib/components/ui/badge';
  import { Eye, EyeOff, UserRound, Mail, Shield } from '@lucide/svelte';
  //
  import { toast } from 'svelte-sonner';
  //
  import { useUser } from '$lib/api/hooks/useUser';
  const { userQuery, updateProfile, changeEmail, changePassword } = useUser();
  //
  import { validate_email, validate_password } from '$lib/utils/inputValidators';

  // forms
  let profile = $state({
    username: '',
    avatar_url: '',
    address: '',
    country: '',
    phone_number: '',
  });

  let emailForm = $state({ email: '' });
  let passForm = $state({ password: '', new_password: '' });

  // ui state
  let showPwd = $state(false);
  let showNewPwd = $state(false);
  let savingProfile = false;
  let savingEmail = false;
  let savingPass = false;

  let errors = $state<{
    username?: string;
    email?: string;
    password?: string;
    new_password?: string;
  }>({});

  $effect(() => {
    if (userQuery.data) {
      profile.username = userQuery.data.username ?? '';
      profile.avatar_url = userQuery.data.avatar ?? '';
      // address/country/phone: set from API if you return them
      emailForm.email = userQuery.data.email;
    }
  });

  // helpers
  const avatarUrl = () => profile.avatar_url || '';
  const usernameInitial = () => profile.username?.[0]?.toUpperCase() ?? 'U';

  async function onSaveProfile(e: SubmitEvent) {
    e.preventDefault();
    // tiny UX check; server still validates with Zod in the endpoint
    errors.username = profile.username ? undefined : 'Username is required';
    if (errors.username) return;

    try {
      await updateProfile.mutateAsync(profile);
      toast.success('Profile updated!');
    } catch (e: any) {
      toast.error(e?.message ?? 'Failed to update profile');
    }
  }

  async function onChangeEmail(e: SubmitEvent) {
    e.preventDefault();
    errors.email = validate_email(emailForm.email) ? undefined : 'Invalid email';
    if (errors.email) return;

    try {
      await changeEmail.mutateAsync({ email: emailForm.email });
      toast.success('Email updated!');
    } catch (e: any) {
      toast.error(e?.message ?? 'Failed to update email');
    }
  }

  async function onChangePassword(e: SubmitEvent) {
    e.preventDefault();
    errors.password = passForm.password ? undefined : 'Current password required';
    errors.new_password = validate_password(passForm.new_password)
      ? undefined
      : 'Password must include upper, lower & special chars';
    if (errors.password || errors.new_password) return;

    try {
      await changePassword.mutateAsync(passForm);
      passForm = { password: '', new_password: '' };
      toast.success('Password updated!');
    } catch (e: any) {
      toast.error(e?.message ?? 'Failed to update password');
    }
  }
</script>

<div class="mx-auto w-full max-w-[1200px] space-y-6 px-3 pb-10 text-neutral-100 md:px-6">
  <!-- Page header -->
  <div class="flex items-start justify-between gap-4">
    <div class="space-y-1">
      <h2 class="flex items-center gap-2 text-lg font-semibold text-neutral-100">
        <UserRound class="h-5 w-5 text-neutral-400" />
        Profile
      </h2>
      <p class="text-[13px] leading-relaxed text-neutral-500">
        Update your personal info and secure your account.
      </p>
    </div>
    <Badge variant="outline" class="rounded-md border-neutral-700 text-[10px] text-neutral-400">
      USER PANEL
    </Badge>
  </div>

  <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
    <!-- Profile details -->
    <Card
      class="border border-neutral-800/80 bg-neutral-900/50 shadow-[0_30px_120px_-20px_rgba(0,0,0,0.9)] backdrop-blur-sm lg:col-span-2"
    >
      <CardHeader>
        <CardTitle class="text-sm font-semibold text-neutral-200">Profile details</CardTitle>
        <CardDescription class="text-[12px] text-neutral-500">
          Your public information used across the app.
        </CardDescription>
      </CardHeader>

      <CardContent class="space-y-6">
        <!-- Avatar preview -->
        <div class="flex items-center gap-4">
          <Avatar class="h-14 w-14 rounded-xl border border-neutral-800 bg-neutral-800">
            <AvatarImage src={avatarUrl()} alt={profile.username} />
            <AvatarFallback class="rounded-xl text-[12px] text-neutral-300">
              {usernameInitial()}
            </AvatarFallback>
          </Avatar>
          <div class="text-xs text-neutral-500">Recommended 160×160. Paste an image URL below.</div>
        </div>

        <!-- Form fields -->
        <form
          class="grid grid-cols-1 gap-4 md:grid-cols-2"
          onsubmit={(e) => {
            e.preventDefault();
            onSaveProfile(e);
          }}
        >
          <div>
            <Label class="text-[12px] text-neutral-300">Username</Label>
            <Input
              bind:value={profile.username}
              placeholder="Your username"
              class="mt-1 border-neutral-700 bg-neutral-800/60 text-neutral-100 placeholder:text-neutral-500"
            />
            {#if errors.username}
              <p class="mt-1 text-[12px] text-red-400">{errors.username}</p>
            {/if}
          </div>

          <div>
            <Label class="text-[12px] text-neutral-300">Avatar URL</Label>
            <Input
              bind:value={profile.avatar_url}
              placeholder="https://example.com/me.jpg"
              class="mt-1 border-neutral-700 bg-neutral-800/60 text-neutral-100 placeholder:text-neutral-500"
            />
          </div>

          <div class="md:col-span-2">
            <Label class="text-[12px] text-neutral-300">Address</Label>
            <Input
              bind:value={profile.address}
              placeholder="Street, number, city"
              class="mt-1 border-neutral-700 bg-neutral-800/60 text-neutral-100 placeholder:text-neutral-500"
            />
          </div>

          <div>
            <Label class="text-[12px] text-neutral-300">Country</Label>
            <Input
              bind:value={profile.country}
              placeholder="Portugal"
              class="mt-1 border-neutral-700 bg-neutral-800/60 text-neutral-100 placeholder:text-neutral-500"
            />
          </div>

          <div>
            <Label class="text-[12px] text-neutral-300">Phone</Label>
            <Input
              bind:value={profile.phone_number}
              placeholder="+351 9xx xxx xxx"
              class="mt-1 border-neutral-700 bg-neutral-800/60 text-neutral-100 placeholder:text-neutral-500"
            />
          </div>

          <div class="pt-2 md:col-span-2">
            <Button
              type="submit"
              disabled={savingProfile}
              class="cursor-pointer bg-neutral-200 font-medium text-neutral-900 shadow-[0_20px_60px_-10px_rgba(255,255,255,0.3)] hover:bg-white"
            >
              {savingProfile ? 'Saving...' : 'Save changes'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>

    <!-- Account actions -->
    <div class="space-y-6">
      <!-- Change email -->
      <Card
        class="border border-neutral-800/80 bg-neutral-900/50 shadow-[0_30px_120px_-20px_rgba(0,0,0,0.9)] backdrop-blur-sm"
      >
        <CardHeader class="pb-2">
          <CardTitle class="flex items-center gap-2 text-sm font-semibold text-neutral-200">
            <Mail class="h-4 w-4 text-neutral-400" />
            Change email
          </CardTitle>
          <CardDescription class="text-[12px] text-neutral-500">
            We’ll send a verification link to the new email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            class="space-y-3"
            onsubmit={(e) => {
              e.preventDefault();
              onChangeEmail(e);
            }}
          >
            <div>
              <Label class="text-[12px] text-neutral-300">New email</Label>
              <Input
                type="email"
                bind:value={emailForm.email}
                placeholder="you@newmail.com"
                class="mt-1 border-neutral-700 bg-neutral-800/60 text-neutral-100 placeholder:text-neutral-500"
              />
              {#if errors.email}
                <p class="mt-1 text-[12px] text-red-400">{errors.email}</p>
              {/if}
            </div>

            <Button
              type="submit"
              disabled={savingEmail}
              class="w-full cursor-pointer bg-neutral-200 font-medium text-neutral-900 hover:bg-white"
            >
              {savingEmail ? 'Updating...' : 'Update email'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <!-- Change password -->
      <Card
        class="border border-neutral-800/80 bg-neutral-900/50 shadow-[0_30px_120px_-20px_rgba(0,0,0,0.9)] backdrop-blur-sm"
      >
        <CardHeader class="pb-2">
          <CardTitle class="flex items-center gap-2 text-sm font-semibold text-neutral-200">
            <Shield class="h-4 w-4 text-neutral-400" />
            Change password
          </CardTitle>
          <CardDescription class="text-[12px] text-neutral-500">
            Keep your account secure with a strong password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            class="space-y-3"
            onsubmit={(e) => {
              e.preventDefault();
              onChangePassword(e);
            }}
          >
            <div>
              <Label class="text-[12px] text-neutral-300">Current password</Label>
              <div class="relative mt-1">
                <Input
                  type={showPwd ? 'text' : 'password'}
                  bind:value={passForm.password}
                  placeholder="••••••••"
                  class="border-neutral-700 bg-neutral-800/60 pr-9 text-neutral-100 placeholder:text-neutral-500"
                />
                <button
                  type="button"
                  class="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer text-neutral-400 hover:text-neutral-200"
                  onclick={() => (showPwd = !showPwd)}
                  aria-label={showPwd ? 'Hide password' : 'Show password'}
                >
                  {#if showPwd}
                    <EyeOff class="h-4 w-4" />
                  {:else}
                    <Eye class="h-4 w-4" />
                  {/if}
                </button>
              </div>
              {#if errors.password}
                <p class="mt-1 text-[12px] text-red-400">{errors.password}</p>
              {/if}
            </div>

            <div>
              <Label class="text-[12px] text-neutral-300">New password</Label>
              <div class="relative mt-1">
                <Input
                  type={showNewPwd ? 'text' : 'password'}
                  bind:value={passForm.new_password}
                  placeholder="••••••••"
                  class="border-neutral-700 bg-neutral-800/60 pr-9 text-neutral-100 placeholder:text-neutral-500"
                />
                <button
                  type="button"
                  class="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer text-neutral-400 hover:text-neutral-200"
                  onclick={() => (showNewPwd = !showNewPwd)}
                  aria-label={showNewPwd ? 'Hide password' : 'Show password'}
                >
                  {#if showNewPwd}
                    <EyeOff class="h-4 w-4" />
                  {:else}
                    <Eye class="h-4 w-4" />
                  {/if}
                </button>
              </div>
              {#if errors.new_password}
                <p class="mt-1 text-[12px] text-red-400">{errors.new_password}</p>
              {/if}
            </div>

            <Button
              disabled={savingPass}
              type="submit"
              class="w-full cursor-pointer bg-neutral-200 font-medium text-neutral-900 hover:bg-white"
            >
              {savingPass ? 'Updating...' : 'Update password'}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p class="text-[11px] text-neutral-500">
            Tip: use at least 1 uppercase, 1 number and 1 symbol.
          </p>
        </CardFooter>
      </Card>
    </div>
  </div>

  <Separator class="bg-neutral-800" />
  <p class="text-[10px] text-neutral-600">
    © {new Date().getFullYear()} Kira Inventory — Profile settings.
  </p>
</div>
