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
exports.default = DisputesPage;
var react_1 = require("react");
var auth_provider_jsx_1 = require("../../providers/auth-provider.jsx");
var lucide_react_1 = require("lucide-react");
function DisputesPage() {
    var _this = this;
    var token = (0, auth_provider_jsx_1.useAuth)().token;
    var _a = (0, react_1.useState)([]), disputes = _a[0], setDisputes = _a[1];
    var _b = (0, react_1.useState)(true), loading = _b[0], setLoading = _b[1];
    var _c = (0, react_1.useState)(null), selectedDispute = _c[0], setSelectedDispute = _c[1];
    var _d = (0, react_1.useState)(''), resolutionText = _d[0], setResolutionText = _d[1];
    var _e = (0, react_1.useState)(null), error = _e[0], setError = _e[1];
    var fetchDisputes = function () { return __awaiter(_this, void 0, void 0, function () {
        var res, data, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!token)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, fetch('/api/v1/admin/disputes', {
                            headers: { Authorization: "Bearer ".concat(token) }
                        })];
                case 2:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 3:
                    data = _a.sent();
                    if (Array.isArray(data)) {
                        setDisputes(data);
                    }
                    else {
                        setError('Invalid response from server.');
                    }
                    return [3 /*break*/, 6];
                case 4:
                    err_1 = _a.sent();
                    setError(err_1.message || 'Error fetching disputes.');
                    return [3 /*break*/, 6];
                case 5:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    (0, react_1.useEffect)(function () {
        fetchDisputes();
    }, [token]);
    var handleResolve = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var res, err, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!token || !selectedDispute || !resolutionText.trim())
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, fetch("/api/v1/admin/disputes/".concat(selectedDispute.id, "/resolve"), {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: "Bearer ".concat(token),
                            },
                            body: JSON.stringify({ resolution: resolutionText })
                        })];
                case 2:
                    res = _a.sent();
                    if (!res.ok) return [3 /*break*/, 3];
                    setSelectedDispute(null);
                    setResolutionText('');
                    fetchDisputes();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, res.json()];
                case 4:
                    err = _a.sent();
                    alert(err.message || 'Failed to resolve dispute.');
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    err_2 = _a.sent();
                    console.error(err_2);
                    alert('Error submitting resolution.');
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    return (<div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Disputes Hub</h1>
        <p className="mt-2 text-sm text-slate-400">
          Review, arbitrate, and issue payouts/penalties for active matchmaking conflicts.
        </p>
      </div>

      {error && (<div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400">
          {error}
        </div>)}

      {/* Main layout split (left list, right resolver) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {loading ? (<div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-500">
              Loading active disputes...
            </div>) : disputes.length === 0 ? (<div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-500">
              No disputes reported on the platform.
            </div>) : (disputes.map(function (dispute) { return (<div key={dispute.id} onClick={function () { return dispute.status === 'open' && setSelectedDispute(dispute); }} className={"bg-slate-900 border p-6 rounded-2xl shadow-md transition flex flex-col justify-between cursor-pointer ".concat((selectedDispute === null || selectedDispute === void 0 ? void 0 : selectedDispute.id) === dispute.id
                ? 'border-red-500'
                : dispute.status === 'resolved'
                    ? 'border-slate-800/80 opacity-75'
                    : 'border-slate-800 hover:border-slate-700')}>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Dispute #{dispute.id} · Gig Reference: {dispute.gigId}
                    </span>
                    <h4 className="text-base font-semibold text-white mt-1">
                      Reporter: {dispute.reporterName} ({dispute.reporterRole}) vs {dispute.accusedName}
                    </h4>
                  </div>
                  <span className={"inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ".concat(dispute.status === 'resolved'
                ? 'bg-green-600/10 text-green-400 ring-1 ring-green-500/20'
                : 'bg-yellow-600/10 text-yellow-400 ring-1 ring-yellow-500/20 animate-pulse')}>
                    {dispute.status}
                  </span>
                </div>

                <p className="text-sm text-slate-300 my-3 leading-relaxed">
                  &ldquo;{dispute.reason}&rdquo;
                </p>

                {dispute.evidenceUrl && (<div className="mb-4">
                    <span className="text-xs text-slate-500 block mb-1">Attached Evidence:</span>
                    <a href={dispute.evidenceUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-red-400 hover:underline inline-flex items-center">
                      View Evidence Image &rarr;
                    </a>
                  </div>)}

                {dispute.status === 'resolved' && dispute.resolution && (<div className="rounded-xl bg-slate-950 p-3 border border-slate-800 text-xs text-slate-400 mt-2">
                    <span className="font-semibold text-slate-300 block mb-1">Resolution Outcome:</span>
                    {dispute.resolution}
                  </div>)}
              </div>); }))}
        </div>

        {/* Dispute Resolution sidebar */}
        <div>
          {selectedDispute ? (<div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 sticky top-8 shadow-xl">
              <div className="flex items-center space-x-2">
                <lucide_react_1.Scale className="h-5 w-5 text-red-500"/>
                <h3 className="text-lg font-semibold text-white">Issue Arbitration</h3>
              </div>

              <div>
                <span className="text-xs text-slate-500 font-medium">Resolving dispute for:</span>
                <p className="text-sm font-semibold text-white mt-0.5">
                  {selectedDispute.reporterName} ({selectedDispute.reporterRole})
                </p>
              </div>

              <form onSubmit={handleResolve} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Arbitrator Resolution Notes
                  </label>
                  <textarea rows={4} required value={resolutionText} onChange={function (e) { return setResolutionText(e.target.value); }} placeholder="Enter details of chargeback, warnings, penalty, or payout adjustments issued..." className="w-full rounded-lg bg-slate-950 border border-slate-800 p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500"/>
                </div>

                <div className="flex space-x-2">
                  <button type="submit" className="flex-1 rounded-lg bg-green-600 hover:bg-green-500 text-white text-sm font-semibold py-2 transition">
                    Confirm Resolution
                  </button>
                  <button type="button" onClick={function () { return setSelectedDispute(null); }} className="px-3 rounded-lg border border-slate-700 bg-slate-850 hover:bg-slate-800 text-slate-300 text-sm font-semibold py-2 transition">
                    Cancel
                  </button>
                </div>
              </form>
            </div>) : (<div className="bg-slate-900 border border-slate-800 border-dashed rounded-2xl p-8 text-center text-slate-500 sticky top-8">
              <lucide_react_1.HelpCircle className="mx-auto h-8 w-8 text-slate-600 mb-2"/>
              <h4 className="font-semibold text-slate-400 text-sm">Select an Open Dispute</h4>
              <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">
                Click on any dispute marked as &lsquo;open&rsquo; to launch the arbitration editor and resolve the conflict.
              </p>
            </div>)}
        </div>
      </div>
    </div>);
}
