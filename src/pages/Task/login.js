"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginForm = void 0;
var zod_1 = require("@hookform/resolvers/zod");
var react_hook_form_1 = require("react-hook-form");
var z = require("zod");
var react_router_dom_1 = require("react-router-dom");
var button_1 = require("@/components/ui/button");
var form_1 = require("@/components/ui/form");
var input_1 = require("@/components/ui/input");
var isUserLogged_1 = require("@/store/isUserLogged");
var formSchema = z.object({
    email: z.string().min(2, {
        message: "Password must be at least 8 characters.",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }),
});
function LoginForm() {
    var _a;
    var location = (0, react_router_dom_1.useLocation)();
    var navigate = (0, react_router_dom_1.useNavigate)();
    var changeLoggedState = (0, isUserLogged_1.useIsUserLoggedStore)(function (state) { return state.changeLoggedState; });
    var from = ((_a = location.state) === null || _a === void 0 ? void 0 : _a.from) || "/tasks";
    var form = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });
    function onSubmit(values) {
        fetch("http://34.31.22.223:3000/users/login", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: values.email, password: values.password })
        }).then(function (res) { return res.json(); })
            .then(function (data) {
            localStorage.setItem("token", data.token);
            changeLoggedState(true);
            navigate(from, { replace: true });
        });
    }
    if (localStorage.getItem("token")) {
        return (<react_router_dom_1.Navigate to="/tasks" state={{
                message: "You must log in first",
                from: location.pathname
            }} replace/>);
    }
    return (<form_1.Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 m-auto max-w-xs">

        <form_1.FormField control={form.control} name="email" render={function (_a) {
            var field = _a.field;
            return (<form_1.FormItem>
              <form_1.FormLabel>E-mail</form_1.FormLabel>
              <form_1.FormControl>
                <input_1.Input type="email" placeholder="example@example.com" {...field}/>
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

        <button_1.Button type="submit">Log In</button_1.Button>
      </form>
    </form_1.Form>);
}
exports.LoginForm = LoginForm;
