"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
exports.default = RootLayout;
var google_1 = require("next/font/google");
require("./globals.css");
var auth_provider_jsx_1 = require("../providers/auth-provider.jsx");
var geistSans = (0, google_1.Geist)({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});
var geistMono = (0, google_1.Geist_Mono)({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});
exports.metadata = {
    title: "Floaters CONNECT — Admin Console",
    description: "Platform management console for Floaters CONNECT",
};
function RootLayout(_a) {
    var children = _a.children;
    return (<html lang="en" className={"".concat(geistSans.variable, " ").concat(geistMono.variable, " h-full antialiased")}>
      <body className="min-h-full bg-slate-900 text-slate-100 flex flex-col">
        <auth_provider_jsx_1.AuthProvider>
          {children}
        </auth_provider_jsx_1.AuthProvider>
      </body>
    </html>);
}
