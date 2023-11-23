"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUserLoggedStore = void 0;
var zustand_1 = require("zustand");
exports.useUserLoggedStore = (0, zustand_1.create)(function (set) { return ({
    userLogged: {},
    changeUser: function (newUser) { return set(function () { return ({ userLogged: newUser }); }); },
}); });
