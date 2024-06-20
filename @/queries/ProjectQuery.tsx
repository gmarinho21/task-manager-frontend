import { useQuery, useMutation } from "react-query";
import { queryClient } from "/src/App";

interface ProjectEntryVariables {
  projectID: string;
  nameToSet: string;
  descriptionToSet: string;
}

const getProjects = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/projects`, {
    method: "GET",
    mode: "cors",
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  const data = await response.json();
  return data;
};

const useProjectQuery = () => useQuery("projects", getProjects);

const useDeleteProject = () =>
  useMutation(
    async (taskID: string) => {
      const token = localStorage.getItem("token");
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/projects/` + taskID, {
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
      onSuccess: async () => {
        queryClient.invalidateQueries({ queryKey: ["projects"] });
      },
    }
  );

interface AddProjectParams {
  textName: string;
  textDescription: string;
}

const useAddProject = () =>
  useMutation(async ({ textName, textDescription }: AddProjectParams) => {
    const token = localStorage.getItem("token");
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/projects/`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        name: textName,
        description: textDescription,
      }),
    });
    queryClient.invalidateQueries({ queryKey: ["projects"] });
  });

const useUpdateProject = () =>
  useMutation(
    async ({
      projectID,
      nameToSet,
      descriptionToSet,
    }: ProjectEntryVariables) => {
      const token = localStorage.getItem("token");
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/projects/` + projectID, {
        method: "PATCH",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          name: nameToSet,
          description: descriptionToSet,
        }),
      });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    }
  );

export { useProjectQuery, useDeleteProject, useUpdateProject, useAddProject };
