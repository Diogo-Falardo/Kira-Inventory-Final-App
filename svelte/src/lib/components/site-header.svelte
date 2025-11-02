<!-- src/lib/components/site-header.svelte -->
<script lang="ts">
  import { Separator } from '$lib/components/ui/separator';
  import { SidebarTrigger } from '$lib/components/ui/sidebar';
</script>

<header
  class="
    mx-3 mt-3 flex h-(--header-height) shrink-0 items-center gap-2
    rounded-xl border border-neutral-800/70 bg-neutral-900/40 px-4
    backdrop-blur-sm transition-[width,height] ease-linear
    group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)
  "
>
  <div class="flex w-full items-center justify-between gap-1 lg:gap-2">
    <div class="flex items-center gap-2">
      <SidebarTrigger
        class="-ml-1 cursor-pointer text-neutral-400 transition-colors hover:text-neutral-100"
      />
      <Separator orientation="vertical" class="mx-2 h-4 bg-neutral-700/60" />

      <h1 class="text-sm font-medium tracking-wide text-neutral-300">
        Manage your stock with
        <span class="font-semibold text-neutral-100"> Kira</span>
      </h1>
    </div>
  </div>
</header>
