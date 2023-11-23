"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var button_1 = require("@/components/ui/button");
var card_1 = require("@/components/ui/card");
var react_1 = require("react");
var textarea_1 = require("@/components/ui/textarea");
var use_toast_1 = require("@/components/ui/use-toast");
var toaster_1 = require("@/components/ui/toaster");
var isUserLogged_1 = require("@/store/isUserLogged");
var loggedUser_1 = require("@/store/loggedUser");
var react_query_1 = require("react-query");
require("../../index.css");
var App_1 = require("../../App");
function TaskLayout() {
    var _this = this;
    var toast = (0, use_toast_1.useToast)().toast;
    var isUserLogged = (0, isUserLogged_1.useIsUserLoggedStore)(function (state) { return state.isLogged; });
    var loggedUser = (0, loggedUser_1.useUserLoggedStore)(function (state) { return state.userLogged; });
    var _a = (0, react_1.useState)(""), clickedDeleteButton = _a[0], setClickedDeleteButton = _a[1];
    (0, react_1.useEffect)(function () {
        if (isUserLogged) {
            getTasks();
        }
    }, [isUserLogged]);
    var getTasks = function () { return __awaiter(_this, void 0, void 0, function () {
        var token, response, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    token = localStorage.getItem("token");
                    return [4 /*yield*/, fetch("http://34.31.22.223:3000/tasks", {
                            method: "GET",
                            mode: "cors",
                            headers: {
                                "Authorization": "Bearer " + token,
                            }
                        })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    return [2 /*return*/, data];
            }
        });
    }); };
    var taskQuery = (0, react_query_1.useQuery)('tasks', getTasks);
    var updateTask = (0, react_query_1.useMutation)(function (_a) {
        var taskID = _a.taskID, conditionToSet = _a.conditionToSet;
        return __awaiter(_this, void 0, void 0, function () {
            var token;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        token = localStorage.getItem("token");
                        return [4 /*yield*/, fetch("http://34.31.22.223:3000/tasks/" + taskID, {
                                method: "PATCH",
                                mode: "cors",
                                headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": "Bearer " + token,
                                },
                                body: JSON.stringify({ isCompleted: conditionToSet })
                            })];
                    case 1:
                        _b.sent();
                        App_1.queryClient.invalidateQueries({ queryKey: ['tasks'] });
                        return [2 /*return*/];
                }
            });
        });
    });
    var addTask = (0, react_query_1.useMutation)(function () { return __awaiter(_this, void 0, void 0, function () {
        var token, textDescription;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    token = localStorage.getItem("token");
                    textDescription = document.getElementById("taskDescriptionInput").value;
                    if (!textDescription) {
                        return [2 /*return*/, toast({
                                title: "Error",
                                description: "Can't add an empty task",
                            })];
                    }
                    return [4 /*yield*/, fetch("http://34.31.22.223:3000/tasks/", {
                            method: "POST",
                            mode: "cors",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": "Bearer " + token,
                            },
                            body: JSON.stringify({ description: textDescription })
                        })];
                case 1:
                    _a.sent();
                    document.getElementById("taskDescriptionInput").value = "";
                    App_1.queryClient.invalidateQueries({ queryKey: ['tasks'] });
                    return [2 /*return*/];
            }
        });
    }); });
    var deleteTask = (0, react_query_1.useMutation)(function (taskID) { return __awaiter(_this, void 0, void 0, function () {
        var token;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    token = localStorage.getItem("token");
                    return [4 /*yield*/, fetch("http://34.31.22.223:3000/tasks/" + taskID, {
                            method: "DELETE",
                            mode: "cors",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": "Bearer " + token,
                            }
                        })];
                case 1:
                    _a.sent();
                    App_1.queryClient.invalidateQueries({ queryKey: ['tasks'] });
                    return [2 /*return*/];
            }
        });
    }); }, {
        onSuccess: function (data, parameters) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, App_1.queryClient.cancelQueries('tasks')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, App_1.queryClient.setQueryData('tasks', function (old) {
                                return old.filter(function (card) {
                                    console.log(parameters !== card._id);
                                    return card._id !== parameters;
                                });
                            })];
                }
            });
        }); }
    });
    var taskCards = taskQuery.isLoading ? "" : taskQuery.data.map(function (task) {
        return (<card_1.Card key={task._id} className="relative">
        <card_1.CardHeader>
          {deleteTask.isLoading && clickedDeleteButton === task._id
                ? <button_1.Button className="absolute right-4" variant="deleting" size="icon" disabled>X</button_1.Button>
                : <button_1.Button className="absolute right-4" variant="destructive" size="icon" onClick={function () {
                        setClickedDeleteButton(task._id);
                        deleteTask.mutate(task._id);
                    }}>X</button_1.Button>}
          <card_1.CardTitle>{loggedUser.name}</card_1.CardTitle>
        </card_1.CardHeader>
        <card_1.CardContent>
          <p>{task.description}</p>
        </card_1.CardContent>
        <card_1.CardFooter>
          {!task.isCompleted && <button_1.Button onClick={function () { return updateTask.mutate({ taskID: task._id, conditionToSet: true }); }}>Complete</button_1.Button>}
          {task.isCompleted && <button_1.Button onClick={function () { return updateTask.mutate({ taskID: task._id, conditionToSet: false }); }}>Uncomplete</button_1.Button>}
        </card_1.CardFooter>
      </card_1.Card>);
    });
    return (<>
    <toaster_1.Toaster />
    <div className="flex items-center justify-between relative p-4">
    </div>
    <div className="flex flex-col gap-4 items-center p-4">
      <textarea_1.Textarea className="w-96" placeholder="Write your task" id="taskDescriptionInput"/>
      <div className="flex gap-4">
        <button_1.Button variant="default" onClick={getTasks}>Reload Tasks</button_1.Button>
        <button_1.Button variant="default" onClick={addTask.mutate}>Add Task</button_1.Button>
      </div>
      <div className="grid grid-cols-3 gap-4 w-screen px-4">
        {taskCards}
      </div>
    </div>
    </>);
}
exports.default = TaskLayout;
