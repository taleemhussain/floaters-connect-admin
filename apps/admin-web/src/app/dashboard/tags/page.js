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
exports.default = TagsPage;
var react_1 = require("react");
var auth_provider_jsx_1 = require("../../providers/auth-provider.jsx");
var lucide_react_1 = require("lucide-react");
function TagsPage() {
    var _this = this;
    var token = (0, auth_provider_jsx_1.useAuth)().token;
    var _a = (0, react_1.useState)([]), tags = _a[0], setTags = _a[1];
    var _b = (0, react_1.useState)(true), loading = _b[0], setLoading = _b[1];
    var _c = (0, react_1.useState)(null), editTag = _c[0], setEditTag = _c[1];
    var _d = (0, react_1.useState)(''), name = _d[0], setName = _d[1];
    var _e = (0, react_1.useState)(''), description = _e[0], setDescription = _e[1];
    var _f = (0, react_1.useState)(true), active = _f[0], setActive = _f[1];
    var _g = (0, react_1.useState)(null), error = _g[0], setError = _g[1];
    var fetchTags = function () { return __awaiter(_this, void 0, void 0, function () {
        var res, data, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!token)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, fetch('/api/v1/admin/tags', {
                            headers: { Authorization: "Bearer ".concat(token) }
                        })];
                case 2:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 3:
                    data = _a.sent();
                    if (Array.isArray(data)) {
                        setTags(data);
                    }
                    else {
                        setError('Invalid response from server.');
                    }
                    return [3 /*break*/, 6];
                case 4:
                    err_1 = _a.sent();
                    setError(err_1.message || 'Error fetching tags.');
                    return [3 /*break*/, 6];
                case 5:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    (0, react_1.useEffect)(function () {
        fetchTags();
    }, [token]);
    var handleEdit = function (tag) {
        setEditTag(tag);
        setName(tag.name);
        setDescription(tag.description);
        setActive(tag.active);
    };
    var handleCreateNew = function () {
        setEditTag(null);
        setName('');
        setDescription('');
        setActive(true);
    };
    var handleSubmit = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var payload, res, err, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!token || !name.trim() || !description.trim())
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    payload = {
                        name: name,
                        description: description,
                        active: active,
                    };
                    if (editTag === null || editTag === void 0 ? void 0 : editTag.id) {
                        payload.id = editTag.id;
                    }
                    return [4 /*yield*/, fetch('/api/v1/admin/tags', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: "Bearer ".concat(token),
                            },
                            body: JSON.stringify(payload)
                        })];
                case 2:
                    res = _a.sent();
                    if (!res.ok) return [3 /*break*/, 3];
                    handleCreateNew();
                    fetchTags();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, res.json()];
                case 4:
                    err = _a.sent();
                    alert(err.message || 'Failed to save tag.');
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    err_2 = _a.sent();
                    console.error(err_2);
                    alert('Error submitting tag configuration.');
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    return (<div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Smart Match Tags</h1>
        <p className="mt-2 text-sm text-slate-400">
          Configure skill tags available to Runners and required by Drivers during matchmaking.
        </p>
      </div>

      {error && (<div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400">
          {error}
        </div>)}

      {/* Grid splits tags list and edit form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* List of tags */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Registered Tags</h3>
            <button onClick={handleCreateNew} className="inline-flex items-center space-x-1.5 rounded-lg bg-red-600 hover:bg-red-500 px-3 py-1.5 text-xs font-semibold text-white shadow transition">
              <lucide_react_1.Plus className="h-4 w-4"/>
              <span>Create New Tag</span>
            </button>
          </div>

          {loading ? (<div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-500">
              Loading tag registry...
            </div>) : tags.length === 0 ? (<div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-500">
              No match tags registered.
            </div>) : (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tags.map(function (tag) { return (<div key={tag.id} onClick={function () { return handleEdit(tag); }} className={"bg-slate-900 border p-5 rounded-2xl shadow-sm cursor-pointer hover:border-slate-700 transition flex flex-col justify-between ".concat((editTag === null || editTag === void 0 ? void 0 : editTag.id) === tag.id ? 'border-red-500' : 'border-slate-800')}>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-base font-bold text-white truncate pr-2">
                        {tag.name}
                      </h4>
                      <span className={"inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ".concat(tag.active
                    ? 'bg-green-600/10 text-green-400 ring-1 ring-green-500/20'
                    : 'bg-slate-800 text-slate-500 ring-1 ring-slate-700')}>
                        {tag.active ? 'Active' : 'Retired'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {tag.description}
                    </p>
                  </div>

                  <span className="text-[10px] text-red-400/80 mt-4 block font-semibold hover:underline">
                    Edit Configuration &rarr;
                  </span>
                </div>); })}
            </div>)}
        </div>

        {/* Editor sidebar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl h-fit">
          <div className="flex items-center space-x-2 mb-6">
            <lucide_react_1.Tags className="h-5 w-5 text-red-500"/>
            <h3 className="text-lg font-semibold text-white">
              {editTag ? 'Modify Skill Tag' : 'Scaffold New Tag'}
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Tag Label (Unique name)
              </label>
              <input type="text" required value={name} onChange={function (e) { return setName(e.target.value); }} placeholder="e.g. White-glove Courier" className="w-full rounded-lg bg-slate-950 border border-slate-800 p-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500"/>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Description (Aims & Limits)
              </label>
              <textarea rows={4} required value={description} onChange={function (e) { return setDescription(e.target.value); }} placeholder="Specify what operations this tag warrants, and what rules apply during matchmaking..." className="w-full rounded-lg bg-slate-950 border border-slate-800 p-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500"/>
            </div>

            <div className="flex items-center justify-between bg-slate-950 border border-slate-800/80 p-3 rounded-lg">
              <div>
                <span className="text-xs font-semibold text-slate-300 block">Status Active</span>
                <span className="text-[10px] text-slate-500 block">Uncheck to retire from matchmaking</span>
              </div>
              <input type="checkbox" checked={active} onChange={function (e) { return setActive(e.target.checked); }} className="h-4 w-4 rounded border-slate-800 bg-slate-950 text-red-600 focus:ring-red-500 shrink-0"/>
            </div>

            <div className="flex space-x-2 pt-2">
              <button type="submit" className="flex-1 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-semibold py-2 transition">
                {editTag ? 'Save Changes' : 'Publish Tag'}
              </button>
              {editTag && (<button type="button" onClick={handleCreateNew} className="px-3 rounded-lg border border-slate-700 bg-slate-850 hover:bg-slate-800 text-slate-300 text-sm font-semibold py-2 transition">
                  Reset
                </button>)}
            </div>
          </form>
        </div>
      </div>
    </div>);
}
