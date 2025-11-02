<script lang="ts">
  import { Lock, BarChart3, Boxes, Eye, EyeOff } from '@lucide/svelte';
  //
  import { auth } from '$lib/auth/store';
  import { goto } from '$app/navigation';
  //
  import { apiFetch } from '$lib/api/api';
  import { toast } from 'svelte-sonner';
  //
  import { validate_email, validate_password } from '$lib/utils/inputValidators';

  // form state
  let tab: 'login' | 'register' = 'login';
  let email = '';
  let password = '';
  let regEmail = '';
  let regPassword = '';
  let regRepeat = '';

  let loading = false;

  // password visibility
  let showLoginPassword = false;
  let showRegisterPassword = false;
  let showRegisterRepeatPassword = false;

  // field ids
  const ids = {
    loginEmail: 'login-email',
    loginPassword: 'login-password',
    regEmail: 'reg-email',
    regPassword: 'reg-password',
    regRepeat: 'reg-repeat-password',
  };

  // reactive errors
  // login
  $: emailError = email && !validate_email(email) ? 'Please enter a valid email.' : null;
  $: passwordError =
    password && !validate_password(password)
      ? 'Password must include upper, lower and a symbol.'
      : null;
  // register
  $: regEmailError = regEmail && !validate_email(regEmail) ? 'Please enter a valid email.' : null;
  $: regPasswordError =
    regPassword && !validate_password(regPassword)
      ? 'Password must include upper, lower and a symbol.'
      : null;
  $: regRepeatError = regRepeat && regRepeat !== regPassword ? 'Passwords do not match.' : null;

  async function handleSubmit(intent: 'login' | 'register') {
    // basic validation gate
    if (intent === 'login') {
      // missing fields?
      if (!email || !password) {
        toast.error('All fields are required');
        return;
      }
      // format errors?
      if (emailError || passwordError) {
        toast.error('Fix the highlighted fields.');
        return;
      }
    } else {
      if (!regEmail || !regPassword || !regRepeat) {
        toast.error('All fields are required');
        return;
      }
      if (regEmailError || regPasswordError || regRepeatError) {
        toast.error('Fix the highlighted fields.');
        return;
      }
    }

    loading = true;

    try {
      const endpoint = intent === 'login' ? `/auth/login` : `/auth/register`;
      const body =
        intent === 'register'
          ? { email: regEmail, password: regPassword, plan_code: 'free' }
          : { email, password };

      if (intent === 'login') {
        // login
        const data = await apiFetch<{ access_token: string; refresh_token: string }>(endpoint, {
          method: 'POST',
          body: JSON.stringify(body),
        });

        auth.setTokens(data.access_token, data.refresh_token);
        toast.success('Welcome back!');
        goto('/user');
        return;
      } else {
        // register
        await apiFetch<{ email: string }>(endpoint, {
          method: 'POST',
          body: JSON.stringify(body),
        });

        // auto login
        const loginData = await apiFetch<{ access_token: string; refresh_token: string }>(
          '/auth/login',
          {
            method: 'POST',
            body: JSON.stringify({ email: regEmail, password: regPassword }),
          }
        );

        auth.setTokens(loginData.access_token, loginData.refresh_token);

        toast.success('Account created');
        goto('/user');
        return;
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Network error';
      toast.error(msg);
    } finally {
      loading = false;
    }
  }
</script>

<main
  class="flex min-h-screen w-full items-center justify-center bg-linear-to-br from-neutral-950 via-neutral-900 to-neutral-800 p-6 text-neutral-100"
>
  <section class="w-full max-w-4xl">
    <div
      class="grid grid-cols-1 overflow-hidden rounded-xl border border-neutral-800/80 bg-neutral-900/60 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl md:grid-cols-2"
    >
      <!-- Left side -->
      <div
        class="relative flex flex-col justify-between border-b border-neutral-800/80 bg-neutral-900 p-8 md:border-r md:border-b-0"
      >
        <div
          class="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_0%,rgba(0,0,0,0)_70%)] blur-[80px]"
        ></div>

        <div class="relative space-y-4">
          <div
            class="inline-flex items-center gap-2 rounded-lg border border-neutral-700/60 bg-neutral-800/40 px-2 py-1 text-[11px] font-medium text-neutral-300"
          >
            <Lock class="h-3.5 w-3.5 text-neutral-400" />
            <span>Secure access</span>
          </div>
          <h2 class="text-xl font-semibold">Kira Inventory</h2>
          <p class="text-sm leading-relaxed text-neutral-400">
            Track stock levels, margins and sales performance in one clean dashboard. Built for
            small sellers on Instagram, Vinted, etc.
          </p>
        </div>

        <div class="relative grid grid-cols-2 gap-6 pt-10 text-left text-xs text-neutral-400">
          <div class="space-y-2">
            <div class="flex items-center gap-3">
              <div
                class="flex h-8 w-8 flex-none items-center justify-center rounded-md border border-neutral-800 bg-neutral-900/70 p-2 text-neutral-300"
              >
                <Boxes class="h-4 w-4" />
              </div>
              <p class="text-[13px] leading-none font-medium text-neutral-200">Inventory control</p>
            </div>
            <p class="text-[11px] leading-relaxed">
              Stay on top of what’s in stock and what needs restocking.
            </p>
          </div>

          <div class="space-y-2">
            <div class="flex items-center gap-3">
              <div
                class="flex h-8 w-8 flex-none items-center justify-center rounded-md border border-neutral-800 bg-neutral-900/70 p-2 text-neutral-300"
              >
                <BarChart3 class="h-4 w-4" />
              </div>
              <p class="text-[13px] leading-none font-medium text-neutral-200">Profit tracking</p>
            </div>
            <p class="text-[11px] leading-relaxed">Understand what you’re actually earning.</p>
          </div>
        </div>

        <div class="relative pt-8 text-center text-[10px] text-neutral-600">
          © {new Date().getFullYear()} Kira Inventory
        </div>
      </div>

      <!-- Right side / Forms -->
      <div class="p-6 md:p-8">
        <!-- Header -->
        <div class="mb-6 space-y-2 text-center">
          <h3 class="text-xl font-semibold">
            {tab === 'login' ? 'Welcome back' : 'Create your account'}
          </h3>
          <p class="text-sm text-neutral-400">
            {tab === 'login'
              ? 'Sign in to manage your inventory and profits.'
              : 'Start organising your shop in minutes.'}
          </p>
        </div>

        <!-- Tabs -->
        <div
          class="mb-6 flex w-full rounded-lg border border-neutral-700/60 bg-neutral-800/40 p-1 backdrop-blur-sm"
        >
          <button
            type="button"
            class="flex-1 cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium text-neutral-300
                   transition-colors data-[active=true]:bg-neutral-700
                   data-[active=true]:text-white data-[active=true]:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.8)]"
            data-active={tab === 'login'}
            aria-pressed={tab === 'login'}
            on:click={() => (tab = 'login')}
          >
            Login
          </button>
          <button
            type="button"
            class="flex-1 cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium text-neutral-300
                   transition-colors data-[active=true]:bg-neutral-700
                   data-[active=true]:text-white data-[active=true]:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.8)]"
            data-active={tab === 'register'}
            aria-pressed={tab === 'register'}
            on:click={() => (tab = 'register')}
          >
            Register
          </button>
        </div>

        {#if tab === 'login'}
          <!-- LOGIN -->
          <form class="space-y-5" on:submit|preventDefault={() => handleSubmit('login')}>
            <!-- Email -->
            <div>
              <label for={ids.loginEmail} class="mb-1 block text-[13px] text-neutral-300"
                >Email</label
              >
              <input
                id={ids.loginEmail}
                bind:value={email}
                type="email"
                placeholder="you@example.com"
                class="h-10 w-full rounded-lg border bg-neutral-800/60 px-3 text-neutral-100 placeholder:text-neutral-500
                       focus:border-neutral-500 focus:ring-2 focus:ring-neutral-600 focus:outline-none"
                class:border-red-500={!!emailError}
                class:border-neutral-700={!emailError}
              />
              {#if emailError}<p class="mt-1 text-xs text-red-400">{emailError}</p>{/if}
            </div>

            <!-- Password -->
            <div>
              <label for={ids.loginPassword} class="mb-1 block text-[13px] text-neutral-300"
                >Password</label
              >
              <div class="relative">
                <input
                  id={ids.loginPassword}
                  bind:value={password}
                  type={showLoginPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  class="h-10 w-full rounded-lg border bg-neutral-800/60 px-3 pr-10 text-neutral-100 placeholder:text-neutral-500
                         focus:border-neutral-500 focus:ring-2 focus:ring-neutral-600 focus:outline-none"
                  class:border-red-500={!!passwordError}
                  class:border-neutral-700={!passwordError}
                />
                <button
                  type="button"
                  class="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer text-neutral-400 transition-colors hover:text-neutral-200"
                  on:click={() => (showLoginPassword = !showLoginPassword)}
                  aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                >
                  {#if showLoginPassword}<EyeOff class="h-4 w-4" />{:else}<Eye
                      class="h-4 w-4"
                    />{/if}
                </button>
              </div>
              {#if passwordError}<p class="mt-1 text-xs text-red-400">{passwordError}</p>{/if}
            </div>

            <button
              type="submit"
              class="w-full cursor-pointer rounded-lg bg-neutral-200 px-4 py-2 text-sm font-medium
                     text-neutral-900 shadow-[0_20px_60px_-10px_rgba(255,255,255,0.3)]
                     hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
              disabled={loading}
            >
              {#if loading}Signing in…{:else}Sign in{/if}
            </button>
          </form>
        {:else}
          <!-- REGISTER -->
          <form class="space-y-5" on:submit|preventDefault={() => handleSubmit('register')}>
            <!-- Email -->
            <div>
              <label for={ids.regEmail} class="mb-1 block text-[13px] text-neutral-300">Email</label
              >
              <input
                id={ids.regEmail}
                bind:value={regEmail}
                type="email"
                placeholder="you@example.com"
                class="h-10 w-full rounded-lg border bg-neutral-800/60 px-3 text-neutral-100 placeholder:text-neutral-500
                       focus:border-neutral-500 focus:ring-2 focus:ring-neutral-600 focus:outline-none"
                class:border-red-500={!!regEmailError}
                class:border-neutral-700={!regEmailError}
              />
              {#if regEmailError}<p class="mt-1 text-xs text-red-400">{regEmailError}</p>{/if}
            </div>

            <!-- Password -->
            <div>
              <label for={ids.regPassword} class="mb-1 block text-[13px] text-neutral-300"
                >Password</label
              >
              <div class="relative">
                <input
                  id={ids.regPassword}
                  bind:value={regPassword}
                  type={showRegisterPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  class="h-10 w-full rounded-lg border bg-neutral-800/60 px-3 pr-10 text-neutral-100 placeholder:text-neutral-500
                         focus:border-neutral-500 focus:ring-2 focus:ring-neutral-600 focus:outline-none"
                  class:border-red-500={!!regPasswordError}
                  class:border-neutral-700={!regPasswordError}
                />
                <button
                  type="button"
                  class="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer text-neutral-400 transition-colors hover:text-neutral-200"
                  on:click={() => (showRegisterPassword = !showRegisterPassword)}
                  aria-label={showRegisterPassword ? 'Hide password' : 'Show password'}
                >
                  {#if showRegisterPassword}<EyeOff class="h-4 w-4" />{:else}<Eye
                      class="h-4 w-4"
                    />{/if}
                </button>
              </div>
              {#if regPasswordError}<p class="mt-1 text-xs text-red-400">{regPasswordError}</p>{/if}
            </div>

            <!-- Repeat Password -->
            <div>
              <label for={ids.regRepeat} class="mb-1 block text-[13px] text-neutral-300"
                >Repeat Password</label
              >
              <div class="relative">
                <input
                  id={ids.regRepeat}
                  bind:value={regRepeat}
                  type={showRegisterRepeatPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  class="focus:outline-noner h-10 w-full rounded-lg border bg-neutral-800/60 px-3 pr-10 text-neutral-100
                         placeholder:text-neutral-500 focus:border-neutral-500 focus:ring-2 focus:ring-neutral-600"
                  class:border-red-500={!!regRepeatError}
                  class:border-neutral-700={!regRepeatError}
                />
                <button
                  type="button"
                  class="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer text-neutral-400 transition-colors hover:text-neutral-200"
                  on:click={() => (showRegisterRepeatPassword = !showRegisterRepeatPassword)}
                  aria-label={showRegisterRepeatPassword ? 'Hide password' : 'Show password'}
                >
                  {#if showRegisterRepeatPassword}<EyeOff class="h-4 w-4" />{:else}<Eye
                      class="h-4 w-4"
                    />{/if}
                </button>
              </div>
              {#if regRepeatError}<p class="mt-1 text-xs text-red-400">{regRepeatError}</p>{/if}
            </div>

            <button
              type="submit"
              class="w-full cursor-pointer rounded-lg bg-neutral-200 px-4 py-2 text-sm font-medium
                     text-neutral-900 shadow-[0_20px_60px_-10px_rgba(255,255,255,0.3)]
                     hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
              disabled={loading}
            >
              {#if loading}Creating account…{:else}Create account{/if}
            </button>
          </form>
        {/if}
      </div>
    </div>
  </section>
</main>
