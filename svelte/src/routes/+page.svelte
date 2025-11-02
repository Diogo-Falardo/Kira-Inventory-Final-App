<script lang="ts">
  import { LogIn, Package, BarChart3, TrendingUp } from '@lucide/svelte';
  import { goto } from '$app/navigation';
  import { auth } from '$lib/auth/store';
  // shadcn-svelte
  import { Button } from '$lib/components/ui/button';
  import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
  } from '$lib/components/ui/card';
  import { Separator } from '$lib/components/ui/separator';

  // Navigate based on auth state
  function handleClick() {
    if (auth.isAuthenticated()) goto('/user');
    else goto('/auth');
  }
</script>

<main
  class="flex min-h-screen w-full flex-col items-center justify-between
         bg-linear-to-br from-neutral-950 via-neutral-900 to-neutral-800
         text-neutral-100"
>
  <!-- Hero -->
  <section class="relative mx-auto w-full max-w-5xl px-6 pt-32 pb-24 text-center">
    <h1
      class="mb-4 bg-linear-to-r from-neutral-100 to-neutral-300 bg-clip-text
             text-4xl font-bold text-transparent sm:text-5xl"
    >
      Simplify your small business
    </h1>
    <p class="mx-auto mb-10 max-w-xl text-base leading-relaxed text-neutral-400 sm:text-lg">
      Kira Inventory helps small Instagram, Vinted and more shops manage their stock, track sales,
      and understand profits — all in one clean dashboard.
    </p>

    <Button
      type="button"
      aria-label="Access Dashboard"
      title="Access Dashboard"
      onclick={handleClick}
      class="cursor-pointer gap-2 border border-neutral-700 bg-neutral-800
             text-neutral-100
             shadow-[0_10px_30px_-5px_rgba(255,255,255,0.05)] hover:bg-neutral-700"
      variant="outline"
    >
      <LogIn />
      <span class="text-base">Access Dashboard</span>
    </Button>
  </section>

  <!-- Features -->
  <section class="mx-auto grid w-full max-w-5xl cursor-default gap-6 px-6 pb-24 sm:grid-cols-3">
    <Card
      class="border-neutral-800/80 bg-neutral-900/60 text-neutral-100 backdrop-blur-md hover:shadow-lg hover:shadow-black/30"
    >
      <CardHeader class="items-center space-y-3 text-center">
        <Package class="h-8 w-8 opacity-80" />
        <CardTitle class="text-lg">Smart Stock Tracking</CardTitle>
        <CardDescription class="text-neutral-400">
          Stay on top of your inventory — know what’s in, what’s out, and what needs restocking.
        </CardDescription>
      </CardHeader>
      <CardContent />
    </Card>

    <Card
      class="border-neutral-800/80 bg-neutral-900/60 text-neutral-100 backdrop-blur-md hover:shadow-lg hover:shadow-black/30"
    >
      <CardHeader class="items-center space-y-3 text-center">
        <BarChart3 class="h-8 w-8 opacity-80" />
        <CardTitle class="text-lg">Profit Insights</CardTitle>
        <CardDescription class="text-neutral-400">
          Understand your earnings and profit margins with simple analytics and clean visuals.
        </CardDescription>
      </CardHeader>
      <CardContent />
    </Card>

    <Card
      class="border-neutral-800/80 bg-neutral-900/60 text-neutral-100 backdrop-blur-md hover:shadow-lg hover:shadow-black/30"
    >
      <CardHeader class="items-center space-y-3 text-center">
        <TrendingUp class="h-8 w-8 opacity-80" />
        <CardTitle class="text-lg">Growth Overview</CardTitle>
        <CardDescription class="text-neutral-400">
          Visualize your sales performance over time to make smarter decisions for your shop.
        </CardDescription>
      </CardHeader>
      <CardContent />
    </Card>
  </section>

  <Separator class="my-0 w-full bg-neutral-800/70" />

  <!-- Footer -->
  <footer class="py-6 text-center text-xs text-neutral-500">
    <p>
      © 2025 <span class="font-medium text-neutral-300">Kira Inventory</span> — Manage your shop effortlessly.
    </p>
  </footer>
</main>
