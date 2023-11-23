"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useIsUserLoggedStore = void 0;
var zustand_1 = require("zustand");
exports.useIsUserLoggedStore = (0, zustand_1.create)(function (set) { return ({
    isLogged: false,
    changeLoggedState: function (newState) { return set(function () { return ({ isLogged: newState }); }); },
}); });
