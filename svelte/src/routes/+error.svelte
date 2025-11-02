<script lang="ts">
  import { goto } from '$app/navigation';
  import { AlertCircle, ArrowLeft, PackageSearch } from '@lucide/svelte';
</script>

<main
  class="relative flex min-h-screen w-full items-center justify-center
         bg-linear-to-br from-neutral-950 via-neutral-900 to-neutral-800
         p-6 text-neutral-100"
>
  <!-- background accent glow -->
  <div class="pointer-events-none fixed inset-0 overflow-hidden">
    <div
      class="absolute top-1/3 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full
             bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_0%,rgba(0,0,0,0)_70%)]
             blur-[60px]"
    ></div>
  </div>

  <section class="relative w-full max-w-lg">
    <article
      class="relative overflow-hidden rounded-2xl
             border border-neutral-800/80
             bg-neutral-900/70 text-neutral-100
             shadow-2xl shadow-black/60 backdrop-blur-xl"
    >
      <!-- subtle radial highlight -->
      <div
        class="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[420px] -translate-x-1/2
               rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_0%,rgba(0,0,0,0)_70%)]"
      ></div>

      <!-- HEADER -->
      <header class="relative flex flex-col items-center px-8 pt-8 pb-4 text-center">
        <!-- Icon bubble -->
        <div class="mb-4 flex items-center justify-center">
          <div class="relative">
            <div class="absolute inset-0 rounded-2xl bg-white/10 blur-xl"></div>
            <div
              class="relative flex h-16 w-16 items-center justify-center rounded-2xl
                     border border-neutral-700/60
                     bg-linear-to-br from-neutral-800/80 via-neutral-800/40 to-transparent
                     text-neutral-200 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.8)]"
            >
              <AlertCircle class="h-7 w-7" />
            </div>
          </div>
        </div>

        <!-- Brand badge -->
        <span
          class="mb-2 inline-block rounded-md border border-neutral-700/80
                 bg-neutral-800/60 px-2 py-0.5 text-[10px] font-medium tracking-wider text-neutral-400 uppercase"
        >
          Kira Inventory
        </span>

        <!-- Title + subtitle -->
        <h2 class="text-2xl leading-tight font-semibold text-neutral-100">Page not found</h2>
        <p class="mt-1 text-sm text-neutral-400">We couldn’t locate that section</p>

        <p class="mt-3 max-w-sm text-sm leading-relaxed text-neutral-400">
          The page you tried to access either doesn’t exist, isn’t available yet, or you don’t have
          permission to view it.
        </p>
      </header>

      <!-- CONTENT -->
      <div class="space-y-4 px-6 pb-6 text-sm text-neutral-300">
        <!-- attempted route info -->
        <div class="rounded-xl border border-neutral-800/80 bg-neutral-900/60 p-4">
          <div class="flex items-start gap-3">
            <div
              class="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-lg
                     border border-neutral-800 bg-neutral-950/60 text-neutral-300"
            >
              <PackageSearch class="h-4 w-4" />
            </div>

            <div class="flex-1 space-y-1">
              <p class="leading-none font-medium text-neutral-200">Trying to access:</p>
              <code
                class="block rounded-md border border-neutral-800/80
                       bg-neutral-950/50 px-2 py-1 font-mono text-[11px] text-neutral-400"
                >/path/not-found</code
              >
              <p class="text-xs leading-relaxed text-neutral-500">
                This route is not part of Kira Inventory yet.
              </p>
            </div>
          </div>
        </div>

        <!-- Divider -->
        <div class="my-2 h-px w-full bg-neutral-800/80"></div>

        <!-- tips -->
        <div class="text-xs leading-relaxed text-neutral-500">
          <p class="mb-1 font-medium text-neutral-400">What you can do:</p>
          <ul class="list-disc space-y-1 pl-4">
            <li>Go back to where you were and continue managing stock.</li>
            <li>Contact your admin if you believe you should have access.</li>
          </ul>
        </div>
      </div>

      <!-- FOOTER ACTIONS -->
      <footer
        class="relative flex flex-col gap-3 px-6 pb-6 sm:flex-row sm:items-center sm:justify-between"
      >
        <!-- back button -->
        <button
          on:click={() => history.back()}
          type="button"
          class="flex items-center justify-center gap-2 rounded-md border border-neutral-700
                 bg-neutral-800 px-4 py-2 text-sm font-medium text-neutral-100
                 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.8)]
                 transition-colors hover:bg-neutral-700"
        >
          <ArrowLeft class="h-4 w-4" />
          <span>Go Back</span>
        </button>

        <!-- dashboard button -->
        <button
          on:click={() => goto('/user')}
          type="button"
          class="flex items-center justify-center gap-2 rounded-md border border-neutral-700
                 bg-neutral-900/60 px-4 py-2 text-sm font-medium text-neutral-200
                 transition-colors hover:bg-neutral-800 hover:text-white"
        >
          Open Dashboard
        </button>
      </footer>
    </article>

    <!-- footer hint -->
    <div class="mt-6 text-center font-mono text-[10px] tracking-wide text-neutral-600 uppercase">
      Error code: 404 / Not Registered Route
    </div>
  </section>
</main>
