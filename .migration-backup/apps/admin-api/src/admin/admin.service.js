"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
var common_1 = require("@nestjs/common");
var firebase_1 = require("@workspace/firebase");
var AdminService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AdminService = _classThis = /** @class */ (function () {
        function AdminService_1(firebaseConfigured, firestore) {
            this.firebaseConfigured = firebaseConfigured;
            this.firestore = firestore;
            this.logger = new common_1.Logger(AdminService.name);
            // In-memory mock database for fallback testing when Firebase is unconfigured
            this.mockUsers = [
                { uid: 'u1', email: 'driver1@floaters.com', displayName: 'Marcus Vance', role: 'driver', onboardingStatus: 'registered', isBanned: false, createdAt: new Date().toISOString() },
                { uid: 'u2', email: 'runner1@floaters.com', displayName: 'Elena Rostova', role: 'runner', onboardingStatus: 'registered', isBanned: false, createdAt: new Date().toISOString() },
                { uid: 'u3', email: 'driver2@floaters.com', displayName: 'Sarah Chen', role: 'driver', onboardingStatus: 'documents_uploaded', isBanned: false, createdAt: new Date().toISOString() },
                { uid: 'u4', email: 'runner2@floaters.com', displayName: 'John Doe', role: 'runner', onboardingStatus: 'registered', isBanned: true, createdAt: new Date().toISOString() }
            ];
            this.mockDisputes = [
                { id: 'disp1', gigId: 'gig101', reporterName: 'Marcus Vance', reporterRole: 'driver', accusedName: 'Elena Rostova', reason: 'Runner failed to deliver the final parcel to the doorstep.', status: 'open', createdAt: new Date().toISOString(), evidenceUrl: 'https://images.unsplash.com/photo-1595246140625-573b715d11dc' },
                { id: 'disp2', gigId: 'gig102', reporterName: 'Elena Rostova', reporterRole: 'runner', accusedName: 'Marcus Vance', reason: 'Driver cancelled the ride post-OTP confirmation without explaining.', status: 'resolved', resolution: 'Runner compensated $10 penalty charge', createdAt: new Date().toISOString(), evidenceUrl: '' }
            ];
            this.mockTags = [
                { id: 'tag1', name: 'Heavy Lifting', description: 'Assisting with large furniture, appliances or deliveries exceeding 20kg', active: true },
                { id: 'tag2', name: 'Grocery Sorting', description: 'Navigating aisles and selecting item replacements with extreme accuracy', active: true },
                { id: 'tag3', name: 'Express Sprint', description: 'On-foot runners optimized for immediate quick delivery tasks under 15 mins', active: true },
                { id: 'tag4', name: 'Fragile Handling', description: 'Handling delicate items (e.g. cakes, glassware, catering packages)', active: false }
            ];
        }
        AdminService_1.prototype.getUsers = function () {
            return __awaiter(this, void 0, void 0, function () {
                var snap, users_1, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.firebaseConfigured) {
                                this.logger.log('Firebase unconfigured - returning mock users');
                                return [2 /*return*/, this.mockUsers];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.firestore.collection(firebase_1.FirestoreCollections.users).get()];
                        case 2:
                            snap = _a.sent();
                            users_1 = [];
                            snap.forEach(function (doc) {
                                users_1.push(__assign({ uid: doc.id }, doc.data()));
                            });
                            return [2 /*return*/, users_1.length > 0 ? users_1 : this.mockUsers];
                        case 3:
                            error_1 = _a.sent();
                            this.logger.error("Error fetching Firestore users: ".concat(error_1.message));
                            return [2 /*return*/, this.mockUsers];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        AdminService_1.prototype.toggleUserBan = function (uid) {
            return __awaiter(this, void 0, void 0, function () {
                var user, ref, snap, data, nextBanState, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.firebaseConfigured) {
                                user = this.mockUsers.find(function (u) { return u.uid === uid; });
                                if (user) {
                                    user.isBanned = !user.isBanned;
                                    return [2 /*return*/, { success: true, user: user }];
                                }
                                return [2 /*return*/, { success: false, message: 'User not found' }];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, , 5]);
                            ref = this.firestore.collection(firebase_1.FirestoreCollections.users).doc(uid);
                            return [4 /*yield*/, ref.get()];
                        case 2:
                            snap = _a.sent();
                            if (!snap.exists) {
                                return [2 /*return*/, { success: false, message: 'User not found' }];
                            }
                            data = snap.data();
                            nextBanState = !(data === null || data === void 0 ? void 0 : data.isBanned);
                            return [4 /*yield*/, ref.update({ isBanned: nextBanState })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, { success: true, isBanned: nextBanState }];
                        case 4:
                            error_2 = _a.sent();
                            this.logger.error("Error toggling ban state for user ".concat(uid, ": ").concat(error_2.message));
                            return [2 /*return*/, { success: false, message: error_2.message }];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        AdminService_1.prototype.verifyUser = function (uid) {
            return __awaiter(this, void 0, void 0, function () {
                var user, ref, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.firebaseConfigured) {
                                user = this.mockUsers.find(function (u) { return u.uid === uid; });
                                if (user) {
                                    user.onboardingStatus = 'registered';
                                    return [2 /*return*/, { success: true, user: user }];
                                }
                                return [2 /*return*/, { success: false, message: 'User not found' }];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            ref = this.firestore.collection(firebase_1.FirestoreCollections.users).doc(uid);
                            return [4 /*yield*/, ref.update({ onboardingStatus: 'registered' })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, { success: true, onboardingStatus: 'registered' }];
                        case 3:
                            error_3 = _a.sent();
                            this.logger.error("Error verifying user ".concat(uid, ": ").concat(error_3.message));
                            return [2 /*return*/, { success: false, message: error_3.message }];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        AdminService_1.prototype.getDisputes = function () {
            return __awaiter(this, void 0, void 0, function () {
                var snap, disputes_1, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.firebaseConfigured) {
                                return [2 /*return*/, this.mockDisputes];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.firestore.collection('disputes').get()];
                        case 2:
                            snap = _a.sent();
                            disputes_1 = [];
                            snap.forEach(function (doc) {
                                disputes_1.push(__assign({ id: doc.id }, doc.data()));
                            });
                            return [2 /*return*/, disputes_1.length > 0 ? disputes_1 : this.mockDisputes];
                        case 3:
                            error_4 = _a.sent();
                            this.logger.error("Error fetching Firestore disputes: ".concat(error_4.message));
                            return [2 /*return*/, this.mockDisputes];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        AdminService_1.prototype.resolveDispute = function (id, resolution) {
            return __awaiter(this, void 0, void 0, function () {
                var dispute, ref, error_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.firebaseConfigured) {
                                dispute = this.mockDisputes.find(function (d) { return d.id === id; });
                                if (dispute) {
                                    dispute.status = 'resolved';
                                    dispute.resolution = resolution;
                                    return [2 /*return*/, { success: true, dispute: dispute }];
                                }
                                return [2 /*return*/, { success: false, message: 'Dispute not found' }];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            ref = this.firestore.collection('disputes').doc(id);
                            return [4 /*yield*/, ref.update({ status: 'resolved', resolution: resolution })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, { success: true, id: id, status: 'resolved', resolution: resolution }];
                        case 3:
                            error_5 = _a.sent();
                            this.logger.error("Error resolving dispute ".concat(id, ": ").concat(error_5.message));
                            return [2 /*return*/, { success: false, message: error_5.message }];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        AdminService_1.prototype.getTags = function () {
            return __awaiter(this, void 0, void 0, function () {
                var snap, tags_1, error_6;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.firebaseConfigured) {
                                return [2 /*return*/, this.mockTags];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.firestore.collection('skill_tags').get()];
                        case 2:
                            snap = _a.sent();
                            tags_1 = [];
                            snap.forEach(function (doc) {
                                tags_1.push(__assign({ id: doc.id }, doc.data()));
                            });
                            return [2 /*return*/, tags_1.length > 0 ? tags_1 : this.mockTags];
                        case 3:
                            error_6 = _a.sent();
                            this.logger.error("Error fetching Firestore tags: ".concat(error_6.message));
                            return [2 /*return*/, this.mockTags];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        AdminService_1.prototype.addOrUpdateTag = function (tagData) {
            return __awaiter(this, void 0, void 0, function () {
                var tag, newTag, id, ref, error_7;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.firebaseConfigured) {
                                if (tagData.id) {
                                    tag = this.mockTags.find(function (t) { return t.id === tagData.id; });
                                    if (tag) {
                                        tag.name = tagData.name;
                                        tag.description = tagData.description;
                                        tag.active = tagData.active;
                                        return [2 /*return*/, { success: true, tag: tag }];
                                    }
                                }
                                else {
                                    newTag = __assign({ id: "tag".concat(this.mockTags.length + 1) }, tagData);
                                    this.mockTags.push(newTag);
                                    return [2 /*return*/, { success: true, tag: newTag }];
                                }
                                return [2 /*return*/, { success: false, message: 'Tag not found' }];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            id = tagData.id || this.firestore.collection('skill_tags').doc().id;
                            ref = this.firestore.collection('skill_tags').doc(id);
                            return [4 /*yield*/, ref.set({ name: tagData.name, description: tagData.description, active: tagData.active }, { merge: true })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, { success: true, tag: __assign({ id: id }, tagData) }];
                        case 3:
                            error_7 = _a.sent();
                            this.logger.error("Error upserting skill tag: ".concat(error_7.message));
                            return [2 /*return*/, { success: false, message: error_7.message }];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        return AdminService_1;
    }());
    __setFunctionName(_classThis, "AdminService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AdminService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AdminService = _classThis;
}();
exports.AdminService = AdminService;
