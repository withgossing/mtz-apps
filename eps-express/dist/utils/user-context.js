"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserContextService = void 0;
const async_hooks_1 = require("async_hooks");
class UserContextService {
    constructor() {
        this.als = new async_hooks_1.AsyncLocalStorage();
    }
    static getInstance() {
        if (!UserContextService.instance) {
            UserContextService.instance = new UserContextService();
        }
        return UserContextService.instance;
    }
    getUserId() {
        const context = this.als.getStore();
        return (context === null || context === void 0 ? void 0 : context.userId) || "system";
    }
    run(userId, callback) {
        return this.als.run({ userId }, callback);
    }
}
exports.UserContextService = UserContextService;
//# sourceMappingURL=user-context.js.map