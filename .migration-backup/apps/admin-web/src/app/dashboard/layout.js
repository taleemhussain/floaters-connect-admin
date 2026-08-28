'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DashboardLayout;
var react_1 = require("react");
var auth_provider_jsx_1 = require("../../providers/auth-provider.jsx");
var navigation_1 = require("next/navigation");
var link_1 = require("next/link");
var lucide_react_1 = require("lucide-react");
function DashboardLayout(_a) {
    var children = _a.children;
    var _b = (0, auth_provider_jsx_1.useAuth)(), user = _b.user, loading = _b.loading, logout = _b.logout;
    var pathname = (0, navigation_1.usePathname)();
    var router = (0, navigation_1.useRouter)();
    if (loading) {
        return (<div className="flex h-screen w-screen items-center justify-center bg-slate-950 text-slate-400">
        <div className="text-center">
          <lucide_react_1.Loader2 className="mx-auto h-8 w-8 animate-spin text-red-500 mb-2"/>
          <p className="text-sm font-medium">Securing connection...</p>
        </div>
      </div>);
    }
    // Double guard check: if not logged in, wait for redirection
    if (!user) {
        return null;
    }
    var menuItems = [
        { name: 'Overview', href: '/dashboard', icon: lucide_react_1.LayoutDashboard },
        { name: 'User Directory', href: '/dashboard/users', icon: lucide_react_1.Users },
        { name: 'Disputes Hub', href: '/dashboard/disputes', icon: lucide_react_1.AlertTriangle },
        { name: 'Match Settings (Tags)', href: '/dashboard/tags', icon: lucide_react_1.Tags },
    ];
    return (<div className="flex min-h-screen bg-slate-950 text-slate-100">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900 flex flex-col justify-between p-4 shrink-0">
        <div>
          {/* Logo Brand Header */}
          <div className="flex items-center space-x-2 px-2 py-3 mb-6">
            <lucide_react_1.ShieldAlert className="h-6 w-6 text-red-500"/>
            <span className="font-bold text-lg tracking-tight text-white">
              FC Admin Panel
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {menuItems.map(function (item) {
            var Icon = item.icon;
            var isActive = pathname === item.href;
            return (<link_1.default key={item.href} href={item.href} className={"flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ".concat(isActive
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/10'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200')}>
                  <Icon className="h-5 w-5 shrink-0"/>
                  <span>{item.name}</span>
                </link_1.default>);
        })}
          </nav>
        </div>

        {/* Profile / Logout Section */}
        <div className="border-t border-slate-800/80 pt-4 px-2">
          <div className="flex items-center justify-between mb-3">
            <div className="truncate pr-2">
              <p className="text-xs font-semibold text-slate-300 truncate">
                {user.displayName || 'Administrator'}
              </p>
              <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
          <button onClick={logout} className="flex w-full items-center space-x-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-red-400 transition">
            <lucide_react_1.LogOut className="h-5 w-5 shrink-0"/>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto max-h-screen">
        <header className="h-16 border-b border-slate-850 flex items-center justify-end px-8 bg-slate-900/40">
          <div className="text-xs text-slate-500 font-medium bg-slate-900 border border-slate-800 px-3 py-1 rounded-full">
            Active Connection: Secure SecureStore Session
          </div>
        </header>
        <div className="p-8 max-w-7xl w-full mx-auto flex-1">{children}</div>
      </main>
    </div>);
}
