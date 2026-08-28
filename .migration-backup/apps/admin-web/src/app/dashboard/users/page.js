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
exports.default = UsersPage;
var react_1 = require("react");
var auth_provider_jsx_1 = require("../../providers/auth-provider.jsx");
var lucide_react_1 = require("lucide-react");
function UsersPage() {
    var _this = this;
    var token = (0, auth_provider_jsx_1.useAuth)().token;
    var _a = (0, react_1.useState)([]), users = _a[0], setUsers = _a[1];
    var _b = (0, react_1.useState)(true), loading = _b[0], setLoading = _b[1];
    var _c = (0, react_1.useState)(''), search = _c[0], setSearch = _c[1];
    var _d = (0, react_1.useState)('all'), roleFilter = _d[0], setRoleFilter = _d[1];
    var _e = (0, react_1.useState)(null), error = _e[0], setError = _e[1];
    var fetchUsers = function () { return __awaiter(_this, void 0, void 0, function () {
        var res, data, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!token)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, fetch('/api/v1/admin/users', {
                            headers: { Authorization: "Bearer ".concat(token) }
                        })];
                case 2:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 3:
                    data = _a.sent();
                    if (Array.isArray(data)) {
                        setUsers(data);
                    }
                    else {
                        setError('Invalid response from server.');
                    }
                    return [3 /*break*/, 6];
                case 4:
                    err_1 = _a.sent();
                    setError(err_1.message || 'Error fetching user directory.');
                    return [3 /*break*/, 6];
                case 5:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    (0, react_1.useEffect)(function () {
        fetchUsers();
    }, [token]);
    var handleToggleBan = function (uid) { return __awaiter(_this, void 0, void 0, function () {
        var res, err, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!token)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, fetch("/api/v1/admin/users/".concat(uid, "/toggle-ban"), {
                            method: 'POST',
                            headers: { Authorization: "Bearer ".concat(token) }
                        })];
                case 2:
                    res = _a.sent();
                    if (!res.ok) return [3 /*break*/, 3];
                    // Refresh list
                    fetchUsers();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, res.json()];
                case 4:
                    err = _a.sent();
                    alert(err.message || 'Failed to update ban state.');
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    err_2 = _a.sent();
                    console.error(err_2);
                    alert('Error updating user ban state.');
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var handleVerify = function (uid) { return __awaiter(_this, void 0, void 0, function () {
        var res, err, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!token)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, fetch("/api/v1/admin/users/".concat(uid, "/verify"), {
                            method: 'POST',
                            headers: { Authorization: "Bearer ".concat(token) }
                        })];
                case 2:
                    res = _a.sent();
                    if (!res.ok) return [3 /*break*/, 3];
                    fetchUsers();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, res.json()];
                case 4:
                    err = _a.sent();
                    alert(err.message || 'Failed to verify user.');
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    err_3 = _a.sent();
                    console.error(err_3);
                    alert('Error verifying user.');
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var filteredUsers = users.filter(function (u) {
        var _a, _b;
        var matchesSearch = (((_a = u.displayName) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(search.toLowerCase())) || false) ||
            (((_b = u.email) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes(search.toLowerCase())) || false) ||
            u.uid.includes(search);
        var matchesRole = roleFilter === 'all' ? true : u.role === roleFilter;
        return matchesSearch && matchesRole;
    });
    return (<div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">User Directory</h1>
          <p className="mt-2 text-sm text-slate-400">
            Review registration documents, roles, and status of all network operators.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div className="relative flex-1">
          <lucide_react_1.Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-500"/>
          <input type="text" placeholder="Search by name, email, or UID..." value={search} onChange={function (e) { return setSearch(e.target.value); }} className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:border-red-500 focus:outline-none"/>
        </div>

        <div className="flex items-center space-x-2">
          <lucide_react_1.Filter className="h-5 w-5 text-slate-500"/>
          <select value={roleFilter} onChange={function (e) { return setRoleFilter(e.target.value); }} className="bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-300 py-2 px-3 focus:outline-none focus:border-red-500">
            <option value="all">All Roles</option>
            <option value="driver">Drivers Only</option>
            <option value="runner">Runners Only</option>
          </select>
        </div>
      </div>

      {/* Error Banner */}
      {error && (<div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400">
          {error}
        </div>)}

      {/* User Table Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        {loading ? (<div className="p-8 text-center text-slate-500">Loading operators...</div>) : filteredUsers.length === 0 ? (<div className="p-8 text-center text-slate-500">No users match your criteria.</div>) : (<div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-850/40 text-slate-400 text-xs font-semibold uppercase">
                  <th className="px-6 py-4">Name / Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Onboarding Status</th>
                  <th className="px-6 py-4">KYC / Ban Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-sm text-slate-300">
                {filteredUsers.map(function (user) { return (<tr key={user.uid} className="hover:bg-slate-850/10">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{user.displayName || 'Unnamed User'}</div>
                      <div className="text-xs text-slate-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={"inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ".concat(user.role === 'driver'
                    ? 'bg-blue-600/10 text-blue-400 ring-1 ring-blue-500/20'
                    : 'bg-red-600/10 text-red-400 ring-1 ring-red-500/20')}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-400 font-mono text-xs">{user.onboardingStatus}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        {user.isBanned ? (<span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-950 text-red-400 ring-1 ring-red-500/30">
                            Banned
                          </span>) : (<span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-950 text-green-400 ring-1 ring-green-500/30">
                            Active
                          </span>)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {user.onboardingStatus !== 'registered' && (<button onClick={function () { return handleVerify(user.uid); }} className="inline-flex items-center justify-center p-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-green-600 hover:text-white text-slate-300 transition" title="Verify / Approve KYC">
                          <lucide_react_1.UserCheck className="h-4 w-4"/>
                        </button>)}
                      <button onClick={function () { return handleToggleBan(user.uid); }} className={"inline-flex items-center justify-center p-1.5 rounded-lg border ".concat(user.isBanned
                    ? 'bg-red-600 border-red-500 text-white hover:bg-red-500'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-red-950 hover:text-red-400', " transition")} title={user.isBanned ? 'Lift Ban' : 'Restrict Account'}>
                        {user.isBanned ? <lucide_react_1.ShieldAlert className="h-4 w-4"/> : <lucide_react_1.Ban className="h-4 w-4"/>}
                      </button>
                    </td>
                  </tr>); })}
              </tbody>
            </table>
          </div>)}
      </div>
    </div>);
}
