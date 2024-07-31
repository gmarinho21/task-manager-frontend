import "../../index.css";
import { queryClient } from "../../App";
import { useEffect, useState } from "react";
import { useIsUserLoggedStore } from "@/store/isUserLogged";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { format, parseISO } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTaskQuery } from "@/queries/TaskQuery";
import { useUserQuery } from "@/queries/UserQuery";

import {
  useProjectQuery,
  useDeleteProject,
  useUpdateProject,
  useAddProject,
} from "@/queries/ProjectQuery";

import { LayoutList, Pencil, Check } from "lucide-react";

interface Task {
  _id: string;
  isCompleted: boolean;
  owner: string;
  promisedTime: string;
  title: string;
  description: string;
  project: string;
}

interface Project {
  _id: string;
  name: string;
  description: string;
  owner: string;
}

interface ProjectEntryVariables {
  projectID: string;
  nameToSet: string;
  descriptionToSet: boolean;
}

function ProjectLayout() {
  const { toast } = useToast();
  const isUserLogged = useIsUserLoggedStore((state) => state.isLogged);
  const [clickedDeleteButton, setClickedDeleteButton] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedProjectToEdit, setSelectedProjectToEdit] = useState("");
  const [editingName, setEditingName] = useState("");
  const [editingDescription, setEditingDescription] = useState("");

  const userQuery = useUserQuery();

  const projectQuery = useProjectQuery();
  const deleteProject = useDeleteProject();
  const addProject = useAddProject();
  const updateProject = useUpdateProject();

  const taskQuery = useTaskQuery();

  useEffect(() => {
    if (isUserLogged) {
      invaldiateProjectQuery();
    }
  }, [isUserLogged]);

  function selectProjetToEdit(
    projectID: string,
    projectName: string,
    projectDescription: string
  ) {
    if (selectedProject === projectID) {
      setSelectedProjectToEdit("");
    } else {
      setSelectedProjectToEdit(projectID);
      setEditingName(projectName);
      setEditingDescription(projectDescription);
    }
  }

  function handleDescriptionChange(e) {
    e.preventDefault();
    setEditingDescription(e.target.value);
  }

  function handleNameChange(e) {
    e.preventDefault();
    setEditingName(e.target.value);
  }

  const invaldiateProjectQuery = async () => {
    queryClient.invalidateQueries({ queryKey: ["projects"] });
  };

  const addNewProject = async () => {
    const textName = (
      document.getElementById("projectNameInput") as HTMLInputElement
    ).value;
    const textDescription = (
      document.getElementById("projectDescriptionInput") as HTMLInputElement
    ).value;
    if (!textDescription) {
      return toast({
        title: "Error",
        description: "Please inform a title and a description",
      });
    }
    (document.getElementById("projectNameInput") as HTMLInputElement).value =
      "";
    (
      document.getElementById("projectDescriptionInput") as HTMLInputElement
    ).value = "";
    addProject.mutate({ textName, textDescription });
  };

  const projectCards = projectQuery.isLoading
    ? ""
    : projectQuery.data.map((project: Project) => {
        return (
          <Card key={project._id} className="grow">
            <CardHeader className="relative">
              <CardTitle className="w-3/4">
                {selectedProjectToEdit === project._id ? (
                  <Input
                    className="flex-grow "
                    value={editingName}
                    onChange={handleNameChange}
                  />
                ) : (
                  project.name
                )}
              </CardTitle>

              {selectedProjectToEdit === project._id ? (
                <>
                  <Button
                    className="absolute right-16"
                    size="icon"
                    variant="confirm"
                    onClick={() => {
                      updateProject.mutate(
                        {
                          projectID: project._id,
                          nameToSet: editingName,
                          descriptionToSet: editingDescription,
                        },
                        {
                          onSuccess: () => {
                            setSelectedProjectToEdit("");
                          },
                        }
                      );
                    }}
                  >
                    <Check />
                  </Button>
                  {deleteProject.isLoading &&
                  clickedDeleteButton === project._id ? (
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
                        setClickedDeleteButton(project._id);
                        deleteProject.mutate(project._id);
                      }}
                    >
                      X
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <Button
                    className="absolute right-16"
                    size="icon"
                    onClick={() => {
                      selectedProject === project._id
                        ? setSelectedProject("")
                        : setSelectedProject(project._id);
                    }}
                  >
                    <LayoutList />
                  </Button>
                  <Button
                    className="absolute right-4"
                    size="icon"
                    onClick={() => {
                      selectProjetToEdit(
                        project._id,
                        project.name,
                        project.description
                      );
                    }}
                  >
                    <Pencil />
                  </Button>
                </>
              )}
            </CardHeader>
            <CardContent className="pt-4">
              <p>
                {selectedProjectToEdit === project._id ? (
                  <Textarea
                    className="flex-grow "
                    value={editingDescription}
                    onChange={handleDescriptionChange}
                  />
                ) : (
                  project.description
                )}
              </p>
            </CardContent>
            <CardFooter className="justify-between gap-6">FOOTER</CardFooter>
          </Card>
        );
      });

  const taskRows = taskQuery.isLoading ? (
    <tr>
      <td>Loading...</td>
    </tr>
  ) : (
    taskQuery.data
      .filter((task: Task) =>
        selectedProject === "" ? true : task.project === selectedProject
      )
      .map((task: Task) => {
        return (
          <TableRow key={task._id}>
            <TableCell className="font-medium">{userQuery.data.name}</TableCell>
            <TableCell>{task.title}</TableCell>
            <TableCell>
              {task.promisedTime
                ? format(parseISO(task.promisedTime), "PPP")
                : "No date set"}
            </TableCell>
            <TableCell>
              {task.isCompleted ? (
                <Badge variant="outline">Completed</Badge>
              ) : (
                <Badge variant="outline">Completed</Badge>
              )}
            </TableCell>
          </TableRow>
        );
      })
  );

  return (
    <>
      <Toaster />
      <div className="flex flex-col gap-4 items-center p-4">
        <Input
          className="w-96"
          placeholder="Write your Project Name"
          id="projectNameInput"
        />
        <Textarea
          className="w-96"
          placeholder="Write your Project Description"
          id="projectDescriptionInput"
        />
        <div className="flex gap-4">
          <Button variant="default" onClick={addNewProject}>
            Add Project
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col min-w-96 gap-4">{projectCards}</div>
          <div>
            <Card className="overflow-hidden" x-chunk="dashboard-06-chunk-2">
              <CardHeader className="flex flex-row items-start bg-muted/50">
                <div className="grid gap-0.5">
                  <CardTitle>Project Details</CardTitle>
                  <CardDescription>
                    View details of the selected project.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-6 text-sm">
                <div className="grid gap-3">
                  <div className="font-semibold">Project Information</div>
                  <dl className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Project Name</dt>
                      <dd>Website Redesign</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Description</dt>
                      <dd>Updating the company website</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Status</dt>
                      <dd>
                        <Badge variant="secondary">In Progress</Badge>
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Start Date</dt>
                      <dd>2023-04-01</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">End Date</dt>
                      <dd>2023-06-30</dd>
                    </div>
                  </dl>
                </div>
                <Separator className="my-4" />
                <div className="grid gap-3">
                  <div className="font-semibold">Tasks</div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Owner</TableHead>
                        <TableHead className="w-[100px]">Title</TableHead>
                        <TableHead className="w-[150px]">Due Date</TableHead>
                        <TableHead className="w-[100px]">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>{taskRows}</TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProjectLayout;
