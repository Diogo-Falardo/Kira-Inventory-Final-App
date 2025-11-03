<script lang="ts">
  import '../app.css';
  import favicon from '$lib/assets/favicon.svg';
  // query client
  import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
  const queryClient = new QueryClient();
  // toast
  import { Toaster } from 'svelte-sonner';

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<QueryClientProvider client={queryClient}>
  {@render children()}
  <Toaster position="top-right" richColors />
</QueryClientProvider>
