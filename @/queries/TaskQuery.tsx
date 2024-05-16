import { useQuery, useMutation } from "react-query";
import { queryClient } from "/src/App";

interface TasksEntryVariables {
  taskID: string;
  conditionToSet: boolean;
}

const getTasks = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/tasks`, {
    method: "GET",
    mode: "cors",
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  const data = await response.json();
  return data;
};

const useTaskQuery = () =>
  useQuery({
    queryKey: "tasks",
    queryFn: getTasks,
  });

const useDeleteTask = () =>
  useMutation(
    async (taskID: string) => {
      const token = localStorage.getItem("token");
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/tasks/` + taskID, {
        method: "DELETE",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    {
      onSuccess: async (data, parameters) => {
        await queryClient.cancelQueries("tasks");
        return queryClient.setQueryData("tasks", (old) => {
          return old.filter((card) => {
            return card._id !== parameters;
          });
        });
      },
    }
  );

const useUpdateTask = () =>
  useMutation(async ({ taskID, conditionToSet }: TasksEntryVariables) => {
    const token = localStorage.getItem("token");
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/tasks/` + taskID, {
      method: "PATCH",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ isCompleted: conditionToSet }),
    });
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
  });

const useAddTask = () =>
  useMutation(
    async ({ taskDescription, date, taskTitle, selectedProjectID }) => {
      const token = localStorage.getItem("token");
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/tasks/`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          title: taskTitle,
          description: taskDescription,
          promisedTime: date,
          project: selectedProjectID,
        }),
      });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    }
  );

export { useTaskQuery, useDeleteTask, useUpdateTask, useAddTask };
