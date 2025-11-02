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

  // temporary mock data (UI only)
  const userInfo = {
    email: 'demo@example.com',
    username: 'DemoUser',
    avatar: '/placeholder.svg',
  };

  const navItems = [
    { name: 'Dashboard', url: '/userpanel/userDashboard', icon: LayoutDashboard },
    { name: 'Products', url: '/userpanel/userProduct', icon: Package },
  ];
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
          <SidebarMenuItem>
            <SidebarMenuButton class="cursor-pointer text-neutral-500">
              <a href={item.url} class="flex items-center gap-2">
                <svelte:component this={item.icon} />
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        {/each}
      </SidebarMenu>
    </SidebarGroup>
  </SidebarContent>

  <SidebarFooter>
    <NavUser user={userInfo} />
  </SidebarFooter>
</Sidebar>
