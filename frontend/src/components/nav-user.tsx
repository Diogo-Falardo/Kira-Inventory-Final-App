// page
import { User, ChevronsUpDown, LogOut } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// auth -> context
import { useAuth } from "@/app/AuthContext";

// router -> tanstack
import { useNavigate } from "@tanstack/react-router";

export function NavUser({
  user,
}: {
  user: {
    email: string;
    username: string | null;
    avatar: string | null;
  };
}) {
  const { isMobile } = useSidebar();
  const navigate = useNavigate();
  const { logout } = useAuth();

  function handleLogout() {
    logout();
    navigate({ to: "/" });
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="
            cursor-pointer
            flex items-center gap-3
            rounded-lg
            border border-neutral-800/80
            bg-neutral-900/50
            text-left text-neutral-300
            hover:bg-neutral-900/70 hover:text-neutral-100
            data-[state=open]:bg-neutral-900/80
            data-[state=open]:text-neutral-100
            transition-all duration-150
            px-3 py-2
          "
            >
              {/* Avatar */}
              <Avatar className="h-8 w-8 rounded-md border border-neutral-800 bg-neutral-800 text-neutral-200">
                <AvatarImage
                  src={user.avatar ?? undefined}
                  alt={user.username ?? undefined}
                />
                <AvatarFallback className="rounded-md bg-neutral-800 text-[11px] font-medium text-neutral-200 border border-neutral-700">
                  {user.username?.[0]?.toUpperCase() ?? "?"}
                </AvatarFallback>
              </Avatar>

              {/* User Info */}
              <div className="grid flex-1 text-left leading-tight select-none">
                <span className="truncate font-medium text-[13px] text-neutral-100">
                  {user.username}
                </span>
                <span className="truncate text-[11px] text-neutral-500">
                  {user.email}
                </span>
              </div>

              {/* Icon */}
              <ChevronsUpDown className="ml-auto h-4 w-4 text-neutral-500 group-hover:text-neutral-300 transition-colors" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          {/* Dropdown Content */}
          <DropdownMenuContent
            className="
          min-w-56 rounded-xl 
          bg-neutral-900/95 
          border border-neutral-800 
          text-neutral-100 
          shadow-2xl 
          backdrop-blur-md
        "
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={6}
          >
            {/* Header */}
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-3 px-3 py-2">
                <Avatar className="h-8 w-8 rounded-md border border-neutral-800 bg-neutral-800 text-neutral-200">
                  <AvatarImage
                    src={user.avatar ?? undefined}
                    alt={user.username ?? undefined}
                  />
                  <AvatarFallback className="rounded-md bg-neutral-800 text-[11px] font-medium text-neutral-200 border border-neutral-700">
                    {user.username?.[0]?.toUpperCase() ?? "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 leading-tight">
                  <span className="truncate font-medium text-[13px] text-neutral-100">
                    {user.username}
                  </span>
                  <span className="truncate text-[11px] text-neutral-500">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="bg-neutral-800/70" />

            {/* Profile */}
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="
              cursor-pointer 
              flex items-center gap-2 
              text-neutral-300 
              hover:bg-neutral-800/70 
              hover:text-neutral-100 
              transition-colors
            "
                onClick={() => navigate({ to: "/userpanel/userprofile" })}
              >
                <User className="h-4 w-4 text-neutral-400" />
                <span>Profile</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="bg-neutral-800/70" />

            {/* Logout */}
            <DropdownMenuItem
              onClick={handleLogout}
              className="
            cursor-pointer 
            flex items-center gap-2
            text-neutral-300 
            hover:bg-red-900/30 
            hover:text-red-400 
            transition-colors
          "
            >
              <LogOut className="h-4 w-4 text-red-400" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

