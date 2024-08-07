import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useIsUserLoggedStore } from "@/store/isUserLogged";
import { useUserLoggedStore } from "@/store/loggedUser";

import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format, parseISO } from "date-fns";

import "../../index.css";

import {
  useTaskQuery,
  useDeleteTask,
  useUpdateTask,
  useAddTask,
} from "@/queries/TaskQuery";

import { useProjectQuery } from "@/queries/ProjectQuery";

import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { queryClient } from "../../App";

interface Task {
  _id: string;
  isCompleted: boolean;
  owner: string;
  promisedTime: string;
  title: string;
  description: string;
  project: string;
}

function TaskLayout() {
  const { toast } = useToast();
  const isUserLogged = useIsUserLoggedStore((state) => state.isLogged);
  const loggedUser = useUserLoggedStore((state) => state.userLogged);
  const [clickedDeleteButton, setClickedDeleteButton] = useState("");
  const [projectTitleList, setProjectTitleList] = useState<
    { label: string; value: string }[]
  >([]);
  const [promisedDate, setPromisedDate] = useState<Date>();
  const [taskStartDate, setTaskStartDate] = useState<Date>();
  const [taskEndDate, setTaskEndDate] = useState<Date>();
  const taskQuery = useTaskQuery();
  const projectQuery = useProjectQuery();
  const deleteTask = useDeleteTask();
  const updateTask = useUpdateTask();
  const addTask = useAddTask();
  const [open, setOpen] = useState<boolean>(false);
  const [selectedProjectID, setSelectedProjectID] = useState("");

  useEffect(() => {
    if (isUserLogged) {
      invalidateTaskQuery();
    }
  }, [isUserLogged]);

  useEffect(() => {
    if (!projectQuery.data) {
      setProjectTitleList([{ label: "empty", value: "empty" }]);
    } else {
      const projectTitleListToBeSet = projectQuery.data?.map(
        (project: {
          _id: string;
          name: string;
          description: string;
          owner: string;
        }) => {
          return { value: project._id, label: project.name };
        }
      );
      setProjectTitleList(projectTitleListToBeSet);
    }
  }, [projectQuery.data]);

  const invalidateTaskQuery = async () => {
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
  };

  const addNewTask = async () => {
    const taskDescription = (
      document.getElementById("taskDescriptionInput") as HTMLInputElement
    ).value;
    const taskTitle = (
      document.getElementById("taskTitleInput") as HTMLInputElement
    ).value;
    if (!taskDescription || !taskTitle) {
      return toast({
        title: "Error",
        description: "Please inform a title and a description",
      });
    }
    (
      document.getElementById("taskDescriptionInput") as HTMLInputElement
    ).value = "";
    (document.getElementById("taskTitleInput") as HTMLInputElement).value = "";
    addTask.mutate({
      taskDescription,
      promisedDate,
      taskStartDate,
      taskEndDate,
      taskTitle,
      selectedProjectID,
    });
  };

  const taskCards = taskQuery.isLoading
    ? ""
    : taskQuery.data.map((task: Task) => {
        return (
          <Card key={task._id} className="relative grow basis-96">
            <CardHeader>
              <CardTitle>{loggedUser.name}</CardTitle>
              <CardTitle>{task.title}</CardTitle>
              {deleteTask.isLoading && clickedDeleteButton === task._id ? (
                <Button
                  className="absolute right-4"
                  variant="deleting"
                  size="icon"
                  disabled
                >
                  X
                </Button>
              ) : (
                <Button
                  className="absolute right-4"
                  variant="destructive"
                  size="icon"
                  onClick={() => {
                    setClickedDeleteButton(task._id);
                    deleteTask.mutate(task._id);
                  }}
                >
                  X
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <p>{task.description}</p>
            </CardContent>
            <CardFooter className="justify-between gap-6">
              {!task.isCompleted && (
                <Button
                  onClick={() =>
                    updateTask.mutate({
                      taskID: task._id,
                      conditionToSet: true,
                    })
                  }
                >
                  Complete
                </Button>
              )}
              {task.isCompleted && (
                <Button
                  onClick={() =>
                    updateTask.mutate({
                      taskID: task._id,
                      conditionToSet: false,
                    })
                  }
                >
                  Pending
                </Button>
              )}
              <p>
                <b>Due Date:</b>{" "}
                {task.promisedTime
                  ? format(parseISO(task.promisedTime), "PPP")
                  : "No date set"}
              </p>
            </CardFooter>
          </Card>
        );
      });

  return (
    <>
      <Toaster />
      <div className="flex items-center justify-between relative p-4"></div>
      <div className="flex flex-col gap-4 items-center p-4">
        <Input
          className="w-96"
          placeholder="Write your task title"
          id="taskTitleInput"
        />
        <Textarea
          className="w-96"
          placeholder="Write your task description"
          id="taskDescriptionInput"
        />

        {/* promisedDate */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-96 justify-start text-left font-normal",
                !promisedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {promisedDate ? (
                format(promisedDate, "PPP")
              ) : (
                <span>Pick a date when it's due</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={promisedDate}
              onSelect={setPromisedDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* taskStartDate */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-96 justify-start text-left font-normal",
                !taskStartDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {taskStartDate ? (
                format(taskStartDate, "PPP")
              ) : (
                <span>Pick a date to start the task</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={taskStartDate}
              onSelect={setTaskStartDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* taskEndDate */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-96 justify-start text-left font-normal",
                !taskEndDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {taskEndDate ? (
                format(taskEndDate, "PPP")
              ) : (
                <span>Pick a date to end the task</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={taskEndDate}
              onSelect={setTaskEndDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between"
            >
              {selectedProjectID
                ? projectTitleList.find(
                    (projectTitleList) =>
                      projectTitleList.value === selectedProjectID
                  )?.label
                : "Select project..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Type to search..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {projectTitleList.map((projectTitleList) => (
                    <CommandItem
                      key={projectTitleList.value}
                      value={projectTitleList.value}
                      onSelect={(currentValue) => {
                        setSelectedProjectID(
                          currentValue === selectedProjectID ? "" : currentValue
                        );
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedProjectID === projectTitleList.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {projectTitleList.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <div className="flex gap-4">
          <Button variant="default" onClick={invalidateTaskQuery}>
            Reload Tasks
          </Button>
          <Button variant="default" onClick={addNewTask}>
            Add Task
          </Button>
        </div>
        <div className="flex flex-wrap gap-4 w-screenpx-4">{taskCards}</div>
      </div>
    </>
  );
}

export default TaskLayout;
