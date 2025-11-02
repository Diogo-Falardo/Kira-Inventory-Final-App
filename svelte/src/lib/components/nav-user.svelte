<script lang="ts">
  import { User as UserIcon, ChevronsUpDown, LogOut } from '@lucide/svelte';
  import * as Avatar from '$lib/components/ui/avatar/index.js';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import * as Sidebar from '$lib/components/ui/sidebar/index.js';
  import { createEventDispatcher } from 'svelte';

  import { auth } from '$lib/auth/store';

  let {
    user,
  }: {
    user: { email: string; username?: string | null; name?: string | null; avatar?: string | null };
  } = $props();
  const sidebar = Sidebar.useSidebar(); // para decidir o side no mobile
  const dispatch = createEventDispatcher();

  const displayName = (user?.username ?? user?.name ?? 'User') as string;
  const initial = displayName?.[0]?.toUpperCase() ?? '?';
  const onLogout = () => auth.clear();
</script>

<Sidebar.Menu>
  <Sidebar.MenuItem>
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        {#snippet child({ props })}
          <Sidebar.MenuButton
            {...props}
            size="lg"
            class="
              flex items-center gap-3 rounded-lg border border-neutral-800/80
              bg-neutral-900/50 px-3 py-2 text-left text-neutral-300
              transition-all duration-150
              hover:bg-neutral-900/70 hover:text-neutral-100
              data-[state=open]:bg-neutral-900/80 data-[state=open]:text-neutral-100
            "
          >
            <!-- Avatar -->
            <Avatar.Root
              class="size-8 rounded-md border border-neutral-800 bg-neutral-800 text-neutral-200"
            >
              <Avatar.Image src={user?.avatar ?? undefined} alt={displayName} />
              <Avatar.Fallback
                class="rounded-md border border-neutral-700 bg-neutral-800 text-[11px] font-medium text-neutral-200"
              >
                {initial}
              </Avatar.Fallback>
            </Avatar.Root>

            <!-- User info -->
            <div class="grid flex-1 text-left leading-tight select-none">
              <span class="truncate text-[13px] font-medium text-neutral-100">{displayName}</span>
              <span class="truncate text-[11px] text-neutral-500">{user?.email}</span>
            </div>

            <ChevronsUpDown
              class="ml-auto size-4 text-neutral-500 transition-colors group-hover:text-neutral-300"
            />
          </Sidebar.MenuButton>
        {/snippet}
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        class="w-(--bits-dropdown-menu-anchor-width) min-w-56 rounded-xl border border-neutral-800 bg-neutral-900/95 text-neutral-100 shadow-2xl backdrop-blur-md"
        side={sidebar.isMobile ? 'bottom' : 'right'}
        align="end"
        sideOffset={6}
      >
        <DropdownMenu.Label class="p-0 font-normal">
          <div class="flex items-center gap-3 px-3 py-2">
            <Avatar.Root
              class="size-8 rounded-md border border-neutral-800 bg-neutral-800 text-neutral-200"
            >
              <Avatar.Image src={user?.avatar ?? undefined} alt={displayName} />
              <Avatar.Fallback
                class="rounded-md border border-neutral-700 bg-neutral-800 text-[11px] font-medium text-neutral-200"
              >
                {initial}
              </Avatar.Fallback>
            </Avatar.Root>
            <div class="grid flex-1 leading-tight">
              <span class="truncate text-[13px] font-medium text-neutral-100">{displayName}</span>
              <span class="truncate text-[11px] text-neutral-500">{user?.email}</span>
            </div>
          </div>
        </DropdownMenu.Label>

        <DropdownMenu.Separator class="bg-neutral-800/70" />

        <DropdownMenu.Group>
          <DropdownMenu.Item class="cursor-pointer">
            <a href="/userpanel/userprofile" class="flex w-full items-center gap-2">
              <UserIcon class="h-4 w-4 text-neutral-400" />
              <span>Profile</span>
            </a>
          </DropdownMenu.Item>
        </DropdownMenu.Group>

        <DropdownMenu.Separator class="bg-neutral-800/70" />

        <DropdownMenu.Item
          onclick={onLogout}
          class="cursor-pointer hover:bg-red-900/30 hover:text-red-400"
        >
          <LogOut class="h-4 w-4 text-red-400" />
          <span>Log out</span>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </Sidebar.MenuItem>
</Sidebar.Menu>
