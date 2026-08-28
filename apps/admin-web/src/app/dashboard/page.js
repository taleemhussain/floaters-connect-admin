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
exports.default = DashboardOverview;
var react_1 = require("react");
var auth_provider_jsx_1 = require("../providers/auth-provider.jsx");
var lucide_react_1 = require("lucide-react");
function DashboardOverview() {
    var _this = this;
    var token = (0, auth_provider_jsx_1.useAuth)().token;
    var _a = (0, react_1.useState)({ total: 0, drivers: 0, runners: 0 }), usersCount = _a[0], setUsersCount = _a[1];
    var _b = (0, react_1.useState)({ total: 0, open: 0, resolved: 0 }), disputesCount = _b[0], setDisputesCount = _b[1];
    var _c = (0, react_1.useState)(true), loading = _c[0], setLoading = _c[1];
    (0, react_1.useEffect)(function () {
        if (!token)
            return;
        var fetchData = function () { return __awaiter(_this, void 0, void 0, function () {
            var headers, usersRes, users, disputesRes, disputes, drivers, runners, open_1, resolved, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, 6, 7]);
                        headers = { Authorization: "Bearer ".concat(token) };
                        return [4 /*yield*/, fetch('/api/v1/admin/users', { headers: headers })];
                    case 1:
                        usersRes = _a.sent();
                        return [4 /*yield*/, usersRes.json()];
                    case 2:
                        users = _a.sent();
                        return [4 /*yield*/, fetch('/api/v1/admin/disputes', { headers: headers })];
                    case 3:
                        disputesRes = _a.sent();
                        return [4 /*yield*/, disputesRes.json()];
                    case 4:
                        disputes = _a.sent();
                        if (Array.isArray(users)) {
                            drivers = users.filter(function (u) { return u.role === 'driver'; }).length;
                            runners = users.filter(function (u) { return u.role === 'runner'; }).length;
                            setUsersCount({ total: users.length, drivers: drivers, runners: runners });
                        }
                        if (Array.isArray(disputes)) {
                            open_1 = disputes.filter(function (d) { return d.status === 'open'; }).length;
                            resolved = disputes.filter(function (d) { return d.status === 'resolved'; }).length;
                            setDisputesCount({ total: disputes.length, open: open_1, resolved: resolved });
                        }
                        return [3 /*break*/, 7];
                    case 5:
                        err_1 = _a.sent();
                        console.error('Error fetching dashboard stats:', err_1);
                        return [3 /*break*/, 7];
                    case 6:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        }); };
        fetchData();
    }, [token]);
    var cards = [
        { title: 'Total Registered Users', value: loading ? '...' : usersCount.total, desc: "".concat(usersCount.drivers, " Drivers \u00B7 ").concat(usersCount.runners, " Runners"), icon: lucide_react_1.Users, color: 'text-blue-500' },
        { title: 'Active Marketplace Gigs', value: '18', desc: '14 matching · 4 executing', icon: lucide_react_1.Briefcase, color: 'text-green-500' },
        { title: 'Escalated Disputes', value: loading ? '...' : disputesCount.total, desc: "".concat(disputesCount.open, " open \u00B7 ").concat(disputesCount.resolved, " resolved"), icon: lucide_react_1.AlertOctagon, color: 'text-red-500' },
        { title: 'Smart Match Success Rate', value: '98.4%', desc: 'Avg meet time 4.5 mins', icon: lucide_react_1.Percent, color: 'text-purple-500' },
    ];
    return (<div className="space-y-8">
      {/* Header section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">System Overview</h1>
        <p className="mt-2 text-sm text-slate-400">
          Real-time metrics and operational pulse of Floaters CONNECT.
        </p>
      </div>

      {/* Grid Cards stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(function (card, idx) {
            var Icon = card.icon;
            return (<div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md hover:border-slate-700 transition">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-400">{card.title}</span>
                <Icon className={"h-5 w-5 ".concat(card.color)}/>
              </div>
              <div className="mt-2">
                <span className="text-3xl font-bold text-white">{card.value}</span>
                <p className="mt-1 text-xs text-slate-500">{card.desc}</p>
              </div>
            </div>);
        })}
      </div>

      {/* Audit logs & quick actions split */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Activity feed list */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Platform Activity Logs</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 text-sm">
              <lucide_react_1.CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0"/>
              <div>
                <p className="text-slate-300">Smart Match Secured: Driver **Marcus V.** matches Runner **Elena R.**</p>
                <span className="text-[10px] text-slate-500">2 minutes ago</span>
              </div>
            </div>

            <div className="flex items-start space-x-3 text-sm">
              <lucide_react_1.Clock className="h-5 w-5 text-yellow-500 mt-0.5 shrink-0"/>
              <div>
                <p className="text-slate-300">OTP Code Generated for Meet point physical confirmation (Secure PIN #5289)</p>
                <span className="text-[10px] text-slate-500">10 minutes ago</span>
              </div>
            </div>

            <div className="flex items-start space-x-3 text-sm">
              <lucide_react_1.AlertOctagon className="h-5 w-5 text-red-500 mt-0.5 shrink-0"/>
              <div>
                <p className="text-slate-300">Dispute Escalated: **Sarah C.** submitted photo evidence for Gig #108</p>
                <span className="text-[10px] text-slate-500">24 minutes ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* Shortcuts list */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Shortcuts</h3>
            <div className="space-y-2">
              <a href="/dashboard/users" className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 text-sm font-medium transition">
                <span>Verify ID/Documents</span>
                <lucide_react_1.ExternalLink className="h-4 w-4 text-slate-400"/>
              </a>

              <a href="/dashboard/disputes" className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 text-sm font-medium transition">
                <span>Resolve Open Cases</span>
                <lucide_react_1.ExternalLink className="h-4 w-4 text-slate-400"/>
              </a>

              <a href="/dashboard/tags" className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 text-sm font-medium transition">
                <span>Manage Skill Tags</span>
                <lucide_react_1.ExternalLink className="h-4 w-4 text-slate-400"/>
              </a>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-center text-[10px] text-slate-500">
            FC Admin Console v1.0.0 (Local Sandbox Mode)
          </div>
        </div>
      </div>
    </div>);
}
