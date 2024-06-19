import { useQuery } from "react-query";

const getUser = async () => {
  const token = localStorage.getItem("token");
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

export { useUserQuery };
