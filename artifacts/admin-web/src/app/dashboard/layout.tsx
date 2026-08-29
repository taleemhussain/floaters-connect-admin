'use client';

import React from 'react';
import { useAuth } from '@/providers/auth-provider';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  LogOut,
  ShieldCheck,
  Loader2,
  ChevronRight,
  ChevronsUpDown,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/theme-toggle';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background text-muted-foreground">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground mb-2" />
          <p className="text-[10px] font-semibold tracking-wider uppercase">Securing connection...</p>
        </div>
      </div>
    );
  }

  // Double guard check
  if (!user) {
    return null;
  }

  const menuItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'User Directory', href: '/dashboard/users', icon: Users },
  ];

  const getBreadcrumb = () => {
    if (pathname === '/dashboard') return 'Overview';
    if (pathname === '/dashboard/users') return 'User Directory';
    return 'Dashboard';
  };

  const getInitials = (name?: string) => {
    if (!name) return 'AD';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen bg-background text-foreground font-sans antialiased selection:bg-zinc-800 selection:text-zinc-100 overflow-hidden">
        {/* Sidebar Component */}
        <Sidebar collapsible="icon" className="border-r border-border bg-sidebar">
          {/* Logo Header */}
          <SidebarHeader className="border-b border-border/50 py-3">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" asChild className="hover:bg-transparent">
                  <div className="flex items-center space-x-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold shadow-md shadow-primary/5">
                      <ShieldCheck className="h-5 w-5 stroke-[2]" />
                    </div>
                    <div className="flex flex-col gap-0.5 line-clamp-1 leading-none group-data-[collapsible=icon]:hidden">
                      <span className="font-semibold text-xs tracking-tight text-foreground">
                        FC Admin
                      </span>
                      <span className="text-[9px] text-muted-foreground font-medium">Operations Console</span>
                    </div>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>

          {/* Navigation Links */}
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">Platform Management</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton asChild tooltip={item.name} isActive={isActive}>
                          <Link href={item.href} className="flex items-center">
                            <Icon className="h-4 w-4" />
                            <span>{item.name}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          {/* Sidebar Footer with Account Dropdown */}
          <SidebarFooter className="border-t border-border/50 py-3">
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                      size="lg"
                      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    >
                      <Avatar className="h-7 w-7 rounded-lg">
                        <AvatarFallback className="rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-300 text-xs font-semibold uppercase">
                          {getInitials(user.displayName || user.email || undefined)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-xs leading-tight group-data-[collapsible=icon]:hidden">
                        <span className="truncate font-semibold text-foreground">
                          {user.displayName || 'Administrator'}
                        </span>
                        <span className="truncate text-[10px] text-muted-foreground">{user.email}</span>
                      </div>
                      <ChevronsUpDown className="ml-auto size-4 text-muted-foreground group-data-[collapsible=icon]:hidden" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 bg-popover border border-border text-popover-foreground"
                    side="right"
                    align="end"
                    sideOffset={4}
                  >
                    <DropdownMenuLabel className="p-0 font-normal">
                      <div className="flex items-center gap-2 px-1.5 py-1.5 text-left text-xs">
                        <Avatar className="h-7 w-7 rounded-lg">
                          <AvatarFallback className="rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-300 text-xs font-semibold uppercase">
                            {getInitials(user.displayName || user.email || undefined)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-xs leading-tight">
                          <span className="truncate font-semibold text-foreground">
                            {user.displayName || 'Administrator'}
                          </span>
                          <span className="truncate text-[10px] text-muted-foreground">{user.email}</span>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-border/60" />
                    <DropdownMenuItem
                      onClick={logout}
                      className="cursor-pointer text-xs focus:bg-accent focus:text-destructive text-muted-foreground gap-2.5 py-2"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        {/* Sidebar Inset Wrapper */}
        <SidebarInset className="flex flex-col flex-1 overflow-hidden bg-background">
          <header className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-card/40 backdrop-blur-md px-6 sticky top-0 z-40">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground hover:bg-accent" />
              <Separator orientation="vertical" className="h-4 bg-border" />
              <div className="flex items-center space-x-2 text-[11px] font-medium text-muted-foreground select-none">
                <span>Console</span>
                <ChevronRight className="h-3 w-3 text-zinc-400 dark:text-zinc-600" />
                <span className="text-foreground font-semibold">{getBreadcrumb()}</span>
              </div>
            </div>
            <div className="flex items-center">
              <ThemeToggle />
            </div>
          </header>

          {/* Main content body */}
          <div className="flex-1 overflow-y-auto p-6 w-full bg-background text-foreground">
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
