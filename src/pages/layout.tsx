import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserNav } from "@/components/ui/usernav";
import { useIsUserLoggedStore } from "@/store/isUserLogged";
import { useUserLoggedStore } from "@/store/loggedUser";

function arrayBufferToBase64(buffer: ArrayBufferLike) {
  let binary = "";
  const bytes = [].slice.call(new Uint8Array(buffer));
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return window.btoa(binary);
}

export default function Layout() {
  const isUserLogged = useIsUserLoggedStore((state) => state.isLogged);
  const changeLoggedState = useIsUserLoggedStore(
    (state) => state.changeLoggedState
  );

  const loggedUser = useUserLoggedStore((state) => state.userLogged);
  const changeLoggedUser = useUserLoggedStore((state) => state.changeUser);
  const [userAvatar, setUserAvatar] = useState("");

  useEffect(() => {
    if (isUserLogged && loggedUser._id) {
      const token = localStorage.getItem("token");
      fetch(
        `https://tasg-backend-production.up.railway.app/users/` +
          loggedUser._id +
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
  }, [isUserLogged, loggedUser]);

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/users/me`, {
          method: "GET",
          mode: "cors",
          headers: {
            Authorization: "Bearer " + token,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            changeLoggedUser(data);
            if (!data?.error) {
              changeLoggedState(true);
            }
          });
      }
    } catch {
      changeLoggedUser({});
      changeLoggedState(false);
    }
  }, [isUserLogged, changeLoggedState, changeLoggedUser]);

  return (
    <>
      <header>
        <nav className="flex items-center justify-between relative p-4">
          <Button variant="ghost">Tasks</Button>
          <img src="/assets/logo-name.png" className="h-8" />
          <UserNav
            className=""
            userName={loggedUser.name}
            userEmail={loggedUser.email}
            avatar={userAvatar}
          />
        </nav>
      </header>
      <Outlet />
    </>
  );
}
