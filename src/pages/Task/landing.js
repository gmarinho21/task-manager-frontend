"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var zod_1 = require("@hookform/resolvers/zod");
var react_hook_form_1 = require("react-hook-form");
var z = require("zod");
var react_router_dom_1 = require("react-router-dom");
var button_1 = require("@/components/ui/button");
var form_1 = require("@/components/ui/form");
var input_1 = require("@/components/ui/input");
var formSchema = z.object({
    username: z.string().min(0, {
        message: "Username must be at least 2 characters.",
    }),
    email: z.string().min(2, {
        message: "Password must be at least 8 characters.",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }),
});
function Landing() {
    var form = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(formSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    });
    function onSubmit(values) {
        fetch("http://34.31.22.223:3000/users", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: values.username, email: values.email, password: values.password })
        })
            .then(function (res) { return res.json(); })
            .then(function (data) {
            localStorage.setItem("token", data.token);
        });
    }
    if (localStorage.getItem("token")) {
        return (<react_router_dom_1.Navigate to="/tasks" state={{
                message: "You must log in first",
                from: location.pathname
            }} replace/>);
    }
    return (<>
                    <div className="space-y-8 m-auto max-w-xs py-9"> 
                        <h2 className="text-xl text-center font-bold">Please Register</h2>
                        <form_1.Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <form_1.FormField control={form.control} name="username" render={function (_a) {
            var field = _a.field;
            return (<form_1.FormItem>
                                    <form_1.FormLabel>Username</form_1.FormLabel>
                                    <form_1.FormControl>
                                    <input_1.Input placeholder={"Your name"} {...field}/>
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
                                    <input_1.Input type="email" placeholder={"example@example.com"} {...field}/>
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
                            <div className="flex flex-column justify-center items-center gap-3">

                            <button_1.Button type="submit">Register</button_1.Button>
                            <p>or</p>
                            <span><react_router_dom_1.NavLink to="/login" className="underline underline-offset-2 hover:cursor-pointer">login</react_router_dom_1.NavLink></span>
                            </div>
                            </form>
                        </form_1.Form>
                    </div>
                </>);
}
exports.default = Landing;
