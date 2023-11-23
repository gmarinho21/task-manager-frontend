"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var button_1 = require("@/components/ui/button");
var usernav_1 = require("@/components/ui/usernav");
var isUserLogged_1 = require("@/store/isUserLogged");
var loggedUser_1 = require("@/store/loggedUser");
function arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = [].slice.call(new Uint8Array(buffer));
    bytes.forEach(function (b) { return binary += String.fromCharCode(b); });
    return window.btoa(binary);
}
function Layout() {
    var isUserLogged = (0, isUserLogged_1.useIsUserLoggedStore)(function (state) { return state.isLogged; });
    var changeLoggedState = (0, isUserLogged_1.useIsUserLoggedStore)(function (state) { return state.changeLoggedState; });
    var loggedUser = (0, loggedUser_1.useUserLoggedStore)(function (state) { return state.userLogged; });
    var changeLoggedUser = (0, loggedUser_1.useUserLoggedStore)(function (state) { return state.changeUser; });
    var _a = (0, react_1.useState)(""), userAvatar = _a[0], setUserAvatar = _a[1];
    (0, react_1.useEffect)(function () {
        if (isUserLogged && loggedUser._id) {
            var token = localStorage.getItem("token");
            fetch("http://34.31.22.223:3000/users/" + loggedUser._id + "/avatar", {
                method: "GET",
                mode: "cors",
                headers: {
                    "Authorization": "Bearer " + token,
                }
            }).then(function (res) { return res.arrayBuffer(); })
                .then(function (buffer) {
                var base64Flag = 'data:image/png;base64,';
                var imageStr = arrayBufferToBase64(buffer);
                var imageSrc = base64Flag + imageStr;
                setUserAvatar(imageSrc);
            });
        }
        else {
            setUserAvatar("");
        }
    }, [isUserLogged, loggedUser]);
    (0, react_1.useEffect)(function () {
        try {
            var token = localStorage.getItem("token");
            if (token) {
                fetch("http://34.31.22.223:3000/users/me", {
                    method: "GET",
                    mode: "cors",
                    headers: {
                        "Authorization": "Bearer " + token,
                    }
                }).then(function (res) { return res.json(); })
                    .then(function (data) {
                    changeLoggedUser(data);
                    if (!(data === null || data === void 0 ? void 0 : data.error)) {
                        changeLoggedState(true);
                    }
                });
            }
        }
        catch (_a) {
            changeLoggedUser({});
            changeLoggedState(false);
        }
    }, [isUserLogged]);
    return (<>
        <header>
            <nav className="flex items-center justify-between relative p-4">
            <button_1.Button variant="ghost">Tasks</button_1.Button>
            <img src="src/assets/logo-name.png" className="h-8"/>
            <usernav_1.UserNav className="" userName={loggedUser.name} userEmail={loggedUser.email} avatar={userAvatar}/>
            </nav>
        </header>
        <react_router_dom_1.Outlet />
        </>);
}
exports.default = Layout;
