"use client";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserLayout = void 0;
var zod_1 = require("@hookform/resolvers/zod");
var react_hook_form_1 = require("react-hook-form");
var z = require("zod");
var react_router_dom_1 = require("react-router-dom");
var button_1 = require("@/components/ui/button");
var form_1 = require("@/components/ui/form");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var loggedUser_1 = require("@/store/loggedUser");
var formSchema = z.object({
    username: z.string().min(0, {
        message: "Username must be at least 2 characters.",
    }),
    email: z.string().min(0, {
        message: "Password must be at least 8 characters.",
    }),
    password: z.string().min(0, {
        message: "Password must be at least 8 characters.",
    }),
});
function UserLayout() {
    var location = (0, react_router_dom_1.useLocation)();
    var loggedUser = (0, loggedUser_1.useUserLoggedStore)(function (state) { return state.userLogged; });
    var changeLoggedUser = (0, loggedUser_1.useUserLoggedStore)(function (state) { return state.changeUser; });
    var form = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(formSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    });
    function onSubmit(values) {
        var token = localStorage.getItem("token");
        var updateBody = {};
        updateBody = __assign(__assign(__assign({}, (loggedUser.name = values.username && { name: values.username })), (loggedUser.email = values.email && { email: values.email })), (values.password !== "" && { password: values.password }));
        fetch("http://34.31.22.223:3000/users/me", {
            method: "PATCH",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
            body: JSON.stringify(updateBody)
        });
    }
    var uploadImage = function (e) {
        e.preventDefault();
        var files = document.getElementById('picture').files;
        var formData = new FormData();
        for (var i = 0; i < files.length; i++) {
            formData.append('upload', files[i], files[i].name);
        }
        var token = localStorage.getItem("token");
        fetch("http://34.31.22.223:3000/users/me/avatar", {
            method: "POST",
            mode: "cors",
            headers: {
                "Authorization": "Bearer " + token,
            },
            body: formData
        }).then(function (res) { return res.json(); })
            .then(function (data) { return changeLoggedUser(data); });
    };
    return (<div className="space-y-8 m-auto max-w-xs">
      <form_1.Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <form_1.FormField control={form.control} name="username" render={function (_a) {
            var field = _a.field;
            return (<form_1.FormItem>
                <form_1.FormLabel>Username</form_1.FormLabel>
                <form_1.FormControl>
                  <input_1.Input placeholder={(loggedUser === null || loggedUser === void 0 ? void 0 : loggedUser.name) || "Your name"} {...field}/>
                </form_1.FormControl>
                <form_1.FormDescription>
                  This is your public display name.
                </form_1.FormDescription>
                <form_1.FormMessage />
              </form_1.FormItem>);
        }}/>

          <form_1.FormField control={form.control} name="email" render={function (_a) {
            var field = _a.field;
            return (<form_1.FormItem>
                <form_1.FormLabel>Email</form_1.FormLabel>
                <form_1.FormControl>
                  <input_1.Input type="email" placeholder={(loggedUser === null || loggedUser === void 0 ? void 0 : loggedUser.email) || "example@example.com"} {...field}/>
                </form_1.FormControl>
                <form_1.FormDescription>
                  Please Enter your e-mail
                </form_1.FormDescription>
                <form_1.FormMessage />
              </form_1.FormItem>);
        }}/>

          <form_1.FormField control={form.control} name="password" render={function (_a) {
            var field = _a.field;
            return (<form_1.FormItem>
                <form_1.FormLabel>Password</form_1.FormLabel>
                <form_1.FormControl>
                  <input_1.Input type="password" placeholder="********" {...field}/>
                </form_1.FormControl>
                <form_1.FormDescription>
                  Please Enter your Password
                </form_1.FormDescription>
                <form_1.FormMessage />
              </form_1.FormItem>);
        }}/>

          <button_1.Button type="submit">Update info</button_1.Button>
        </form>
      </form_1.Form>
      <div className="space-y-8">
        <form className="grid w-full max-w-sm items-center gap-1.5">
          <label_1.Label htmlFor="picture">Picture</label_1.Label>
          <input_1.Input id="picture" type="file"/>
          <button_1.Button type="submit" className="" onClick={uploadImage}>Upload picture</button_1.Button>
        </form>
      </div>
    </div>);
}
exports.UserLayout = UserLayout;
exports.default = UserLayout;
