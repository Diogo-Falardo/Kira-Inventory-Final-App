<script lang="ts">
  import '../app.css';
  import favicon from '$lib/assets/favicon.svg';
  import { onMount } from 'svelte';
  // toast
  import { Toaster } from 'svelte-sonner';

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

{@render children()}

<Toaster position="top-right" richColors />
