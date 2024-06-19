import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserNav } from "@/components/ui/usernav";
import { useUserQuery } from "@/queries/UserQuery";

function arrayBufferToBase64(buffer: ArrayBufferLike) {
  let binary = "";
  const bytes = [].slice.call(new Uint8Array(buffer));
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return window.btoa(binary);
}

export default function Layout() {
  const userQuery = useUserQuery();
  const [userAvatar, setUserAvatar] = useState("");

  useEffect(() => {
    if (userQuery.data && userQuery.data._id) {
      const token = localStorage.getItem("token");
      fetch(
        `${import.meta.env.VITE_BACKEND_URL}/users/` +
          userQuery.data._id +
          "/avatar",
        {
          method: "GET",
          mode: "cors",
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
        .then((res) => res.arrayBuffer())
        .then((buffer) => {
          const base64Flag = "data:image/png;base64,";
          const imageStr = arrayBufferToBase64(buffer);
          const imageSrc = base64Flag + imageStr;
          setUserAvatar(imageSrc);
        });
    } else {
      setUserAvatar("");
    }
  }, [userQuery.data]);

  return (
    <>
      <header>
        <nav className="flex items-center justify-between relative p-4">
          <Button variant="ghost">Tasks</Button>
          <img src="/assets/logo-name.png" className="h-8" />
          <UserNav
            className=""
            userName={userQuery.data?.name}
            userEmail={userQuery.data?.email}
            avatar={userAvatar}
          />
        </nav>
      </header>
      <Outlet />
    </>
  );
}
