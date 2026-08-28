'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Home;
var auth_provider_jsx_1 = require("../providers/auth-provider.jsx");
var lucide_react_1 = require("lucide-react");
function Home() {
    var loading = (0, auth_provider_jsx_1.useAuth)().loading;
    return (<div className="flex h-screen w-screen items-center justify-center bg-slate-950 text-slate-400">
      <div className="text-center">
        <lucide_react_1.Loader2 className="mx-auto h-8 w-8 animate-spin text-red-500 mb-2"/>
        <p className="text-sm font-medium">Securing session...</p>
      </div>
    </div>);
}
