"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PointReasonCode = exports.PointType = exports.UserType = void 0;
var UserType;
(function (UserType) {
    UserType["ADMIN"] = "ADMIN";
    UserType["MANAGER"] = "MANAGER";
    UserType["USER"] = "USER";
})(UserType || (exports.UserType = UserType = {}));
var PointType;
(function (PointType) {
    PointType["RECEIVED"] = "RECEIVED";
    PointType["AVAILABLE"] = "AVAILABLE";
})(PointType || (exports.PointType = PointType = {}));
var PointReasonCode;
(function (PointReasonCode) {
    PointReasonCode["GOOD_WORK"] = "GOOD_WORK";
    PointReasonCode["COOPERATION"] = "COOPERATION";
    PointReasonCode["INNOVATION"] = "INNOVATION";
    PointReasonCode["HELP_OTHERS"] = "HELP_OTHERS";
    PointReasonCode["ACHIEVEMENT"] = "ACHIEVEMENT";
    PointReasonCode["OTHER"] = "OTHER";
})(PointReasonCode || (exports.PointReasonCode = PointReasonCode = {}));
//# sourceMappingURL=meta.type.js.map