'use client';
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LoginPage;
var react_1 = require("react");
var auth_provider_jsx_1 = require("../../providers/auth-provider.jsx");
var lucide_react_1 = require("lucide-react");
function LoginPage() {
    var _this = this;
    var _a = (0, auth_provider_jsx_1.useAuth)(), login = _a.login, loading = _a.loading;
    var _b = (0, react_1.useState)('admin@floaters.com'), email = _b[0], setEmail = _b[1];
    var _c = (0, react_1.useState)('password'), password = _c[0], setPassword = _c[1];
    var _d = (0, react_1.useState)(null), error = _d[0], setError = _d[1];
    var handleSubmit = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, login(email, password)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    setError(err_1.message || 'Login failed. Please check credentials.');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return (<div className="flex min-h-screen flex-col justify-center bg-slate-950 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-red-600/10 text-red-500 mb-4 ring-1 ring-red-500/20">
          <lucide_react_1.ShieldCheck className="h-7 w-7"/>
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-white">
          Floaters CONNECT
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Admin Operations & Match Console
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900 border border-slate-800 px-4 py-8 shadow-2xl rounded-2xl sm:px-10">
          {error && (<div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
              {error}
            </div>)}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                Email address
              </label>
              <input id="email" name="email" type="email" required value={email} onChange={function (e) { return setEmail(e.target.value); }} className="mt-1 block w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-white placeholder-slate-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 sm:text-sm"/>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                Password
              </label>
              <input id="password" name="password" type="password" required value={password} onChange={function (e) { return setPassword(e.target.value); }} className="mt-1 block w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-white placeholder-slate-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 sm:text-sm"/>
            </div>

            <div>
              <button type="submit" disabled={loading} className="flex w-full justify-center rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:opacity-50 transition">
                {loading ? 'Authenticating...' : 'Access Console'}
              </button>
            </div>
          </form>

          <div className="mt-6 border-t border-slate-800/80 pt-4">
            <div className="flex items-start space-x-2 rounded-lg bg-slate-950 p-3 border border-slate-800/55 text-xs text-slate-400">
              <lucide_react_1.Info className="h-4 w-4 text-slate-500 shrink-0 mt-0.5"/>
              <div>
                <p className="font-semibold text-slate-300 mb-1">Local Development Mode</p>
                <p>Use preset credentials for mock bypass access:</p>
                <p className="font-mono text-red-400 mt-1">admin@floaters.com / password</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
}
