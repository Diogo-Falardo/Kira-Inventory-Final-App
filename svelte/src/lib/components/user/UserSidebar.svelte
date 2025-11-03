<script lang="ts">
  import { Package, LayoutDashboard } from '@lucide/svelte';
  import NavUser from '$lib/components/nav-user.svelte';
  import {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
  } from '$lib/components/ui/sidebar';
  //
  import { useUser } from '$lib/api/hooks/useUser';
  import { string } from 'zod';
  import { goto } from '$app/navigation';

  const navItems = [
    { name: 'Dashboard', url: '/user/dashboard', icon: LayoutDashboard },
    { name: 'Products', url: '/user/products', icon: Package },
  ];

  const { userQuery } = useUser();
  let userInfo = $state<{ email: string; username: string; avatar: string } | null>(null);

  $effect(() => {
    if (userQuery.data) {
      userInfo = {
        email: userQuery.data.email,
        username: userQuery.data.username ?? 'User',
        avatar: userQuery.data.avatar ?? '',
      };
    }
  });
</script>

<Sidebar collapsible="offcanvas" variant="inset">
  <SidebarHeader>
    <a
      href="/"
      class="flex cursor-pointer items-center px-3 py-2 transition-opacity hover:opacity-80"
    >
      <h1 class="text-2xl font-extrabold tracking-tight">
        KIRA <span class="text-neutral-600">Inventory</span>
      </h1>
    </a>
  </SidebarHeader>

  <SidebarContent>
    <SidebarGroup>
      <SidebarGroupLabel>Free</SidebarGroupLabel>
      <SidebarMenu>
        {#each navItems as item (item.name)}
          {@const Icon = item.icon}
          <SidebarMenuItem>
            <SidebarMenuButton class="cursor-pointer text-neutral-500">
              <button onclick={() => goto(item.url)} class="flex items-center gap-2">
                <Icon class="h-4 w-4" />
                <span>{item.name}</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        {/each}
      </SidebarMenu>
    </SidebarGroup>
  </SidebarContent>

  <SidebarFooter>
    {#if userQuery.isLoading}
      <div class="px-3 py-2 text-xs text-neutral-500">Loading user…</div>
    {:else if userQuery.isError}
      <div class="px-3 py-2 text-xs text-red-400">{userQuery.error.message}</div>
    {:else if userInfo}
      <NavUser user={userInfo} />
    {/if}
  </SidebarFooter>
</Sidebar>
