<script lang="ts">
  import * as Sidebar from '$lib/components/ui/sidebar/index.js';
  import SiteHeader from '$lib/components/site-header.svelte';
  import UserSidebar from '$lib/components/user/UserSidebar.svelte';

  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { auth } from '$lib/auth/store';

  onMount(() => {
    const unsub = auth.subscribe(({ access }) => {
      if (!access) goto('/auth');
    });

    return () => unsub();
  });
</script>

<div class="dark">
  <Sidebar.Provider
    style="--sidebar-width: calc(var(--spacing) * 72); --header-height: calc(var(--spacing) * 12);"
  >
    <UserSidebar />

    <!-- Content -->
    <Sidebar.Inset class="bg-neutral-900 text-neutral-100">
      <SiteHeader />
      <div class="flex flex-1 flex-col px-3 md:px-6">
        <div class="@container/main flex flex-1 flex-col gap-2">
          <div class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <slot />
          </div>
        </div>
      </div>
    </Sidebar.Inset>
  </Sidebar.Provider>
</div>
