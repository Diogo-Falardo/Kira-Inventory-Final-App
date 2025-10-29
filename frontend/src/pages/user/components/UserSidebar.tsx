import * as React from "react";
// page
import { Package, LayoutDashboard } from "lucide-react";
import { NavUser } from "@/components/nav-user";
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
} from "@/components/ui/sidebar";

// auth -> contentxt
import { useAuth } from "@/app/AuthContext";

// router
import { Link } from "@tanstack/react-router";

const navItems = [
  {
    name: "Dashboard",
    url: "/userpanel/userDashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Products",
    url: "/userpanel/userProduct",
    icon: Package,
  },
];

export function UserSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();
  if (!user) return null;

  const userInfo = {
    email: user.email,
    username: user.username ?? "User",
    avatar: user.avatar ?? "",
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <Link
          to="/"
          className="flex items-center px-3 py-2 hover:opacity-80 transition-opacity cursor-pointer"
        >
          <h1 className="text-xl font-extrabold tracking-tight">
            KIRA <span className="text-neutral-500">Inventory</span>
          </h1>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Free</SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton asChild>
                  <Link to={item.url}>
                    <item.icon />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userInfo} />
      </SidebarFooter>
    </Sidebar>
  );
}
