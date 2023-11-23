"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
function AuthRequired() {
    var isLoggedIn = localStorage.getItem("token");
    var location = (0, react_router_dom_1.useLocation)();
    if (!isLoggedIn) {
        return (<react_router_dom_1.Navigate to="/login" state={{
                message: "You must log in first",
                from: location.pathname
            }} replace/>);
    }
    return <react_router_dom_1.Outlet />;
}
exports.default = AuthRequired;
