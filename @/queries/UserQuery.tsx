import { useQuery, useMutation } from "react-query";
import { queryClient } from "/src/App";

const getUser = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return;
  }
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/me`, {
    method: "GET",
    mode: "cors",
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  const data = await response.json();
  return data;
};

const useUserQuery = () =>
  useQuery({
    queryKey: "user",
    queryFn: getUser,
  });

const useLogout = () =>
  useMutation(
    async () => {
      const token = localStorage.getItem("token");
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/logoutAll`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
    },
    {
      onSuccess: () => {
        localStorage.removeItem("token");
        queryClient.invalidateQueries({ queryKey: ["user"] });
      },
    }
  );

const useLogin = () =>
  useMutation(async ({ values }) => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/users/login`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: values.email,
        password: values.password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        localStorage.setItem("token", data.token);
        queryClient.invalidateQueries({ queryKey: ["user"] });
      });
  });

const useRegisterUser = () =>
  useMutation(async ({ values }) => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/users`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: values.username,
        email: values.email,
        password: values.password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        localStorage.setItem("token", data.token);
        queryClient.invalidateQueries({ queryKey: ["user"] });
      });
  });

export { useUserQuery, useLogout, useLogin, useRegisterUser };
