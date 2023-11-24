import { useEffect, useState } from "react"
import { Link, NavLink, Outlet } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/ui/usernav"
import { useIsUserLoggedStore } from "@/store/isUserLogged"
import { useUserLoggedStore } from "@/store/loggedUser"


function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = [].slice.call(new Uint8Array(buffer));
  bytes.forEach((b) => binary += String.fromCharCode(b));
  return window.btoa(binary);
}

export default function Layout() {
    const isUserLogged = useIsUserLoggedStore((state) => state.isLogged)
    const changeLoggedState = useIsUserLoggedStore((state) => state.changeLoggedState)

    const loggedUser = useUserLoggedStore((state) => state.userLogged)
    const changeLoggedUser = useUserLoggedStore((state) => state.changeUser)
    const [userAvatar, setUserAvatar] = useState("")


    useEffect(() => {
      if(isUserLogged && loggedUser._id) {
        const token = localStorage.getItem("token")
        fetch("http://34.31.22.223:3000/users/" + loggedUser._id + "/avatar", {
        method: "GET",
        mode: "cors",
        headers: {
          "Authorization": "Bearer " + token,
        }
      }).then((res) => res.arrayBuffer())
      .then((buffer) => {
        const base64Flag = 'data:image/png;base64,';
        const imageStr = arrayBufferToBase64(buffer);
        const imageSrc = base64Flag + imageStr;
        setUserAvatar(imageSrc)
      })
      } else {
        setUserAvatar("")
      }
    }, [isUserLogged, loggedUser])

    useEffect(() => {
      try {
        const token = localStorage.getItem("token")
        if(token) {


        fetch("http://34.31.22.223:3000/users/me", {
          method: "GET",
          mode: "cors",
          headers: {
            "Authorization": "Bearer " + token,
          }
        }).then(res => res.json())
        .then(data => {
          changeLoggedUser(data)
          if(!data?.error){
          changeLoggedState(true)
        }

        })
      }
      } catch {
        changeLoggedUser({})
        changeLoggedState(false)
      }

        
      }, [isUserLogged])

    return (
        <>
        <header>
            <nav className="flex items-center justify-between relative p-4">
            <Button variant="ghost">Tasks</Button>
            <img src="public/assets/logo-name.png" className="h-8"/>
            <UserNav className="" userName={loggedUser.name} userEmail={loggedUser.email} avatar={userAvatar}  />
            </nav>
        </header>
        <Outlet />
        </>
    )
}