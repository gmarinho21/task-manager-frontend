"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryClient = void 0;
var login_1 = require("./pages/Task/login");
var task_1 = require("./pages/Task/task");
var user_1 = require("./pages/Task/user");
var landing_1 = require("./pages/Task/landing");
var AuthRequired_1 = require("@/components/helper/AuthRequired");
var react_router_dom_1 = require("react-router-dom");
var layout_1 = require("./pages/layout");
var react_query_1 = require("react-query");
var devtools_1 = require("react-query/devtools");
exports.queryClient = new react_query_1.QueryClient();
function App() {
    return (<>
    <react_query_1.QueryClientProvider client={exports.queryClient}>
    <devtools_1.ReactQueryDevtools initialIsOpen={false}/>
      <react_router_dom_1.BrowserRouter>
        <react_router_dom_1.Routes>
          <react_router_dom_1.Route path="/" element={<layout_1.default />}>
            <react_router_dom_1.Route index element={<landing_1.default />}/>  
            <react_router_dom_1.Route path="/login" element={<login_1.LoginForm />}/>  
            <react_router_dom_1.Route element={<AuthRequired_1.default />}>
              <react_router_dom_1.Route path="/user" element={<user_1.default />}/>
              <react_router_dom_1.Route path="/tasks" element={<task_1.default />}/>
            </react_router_dom_1.Route>
          </react_router_dom_1.Route>
        </react_router_dom_1.Routes>
      </react_router_dom_1.BrowserRouter>
    </react_query_1.QueryClientProvider>
    </>);
}
exports.default = App;
