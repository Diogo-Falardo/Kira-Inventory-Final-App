import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function SiteHeader() {
  return (
    <header className="mx-3 mt-3 flex h-(--header-height) shrink-0 items-center gap-2 rounded-xl border border-neutral-800/70 bg-neutral-900/40 px-4 backdrop-blur-sm transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center justify-between gap-1 lg:gap-2">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1 cursor-pointer text-neutral-400 hover:text-neutral-100 transition-colors" />
          <Separator
            orientation="vertical"
            className="mx-2 h-4 bg-neutral-700/60"
          />
          <h1 className="text-sm font-medium tracking-wide text-neutral-300">
            Manage your stock with{" "}
            <span className="font-semibold text-neutral-100">Kira</span>
          </h1>
        </div>
      </div>
    </header>
  );
}
