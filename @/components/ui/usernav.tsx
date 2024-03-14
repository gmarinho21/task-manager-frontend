import * as React from "react"
import { NavLink, Outlet } from "react-router-dom"
import { useLocation, useNavigate } from "react-router-dom"
import { useIsUserLoggedStore } from "@/store/isUserLogged"
import { useUserLoggedStore } from "@/store/loggedUser"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"
  import { Button } from "@/components/ui/button"
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  
  export function UserNav({...props}) {
    const navigate = useNavigate()
    const changeLoggedState = useIsUserLoggedStore((state) => state.changeLoggedState)
    const changeLoggedUser = useUserLoggedStore((state) => state.changeUser)

    
    const logout = async () => {
      const token = localStorage.getItem("token")
      await fetch("http://tasg-backend-production.up.railway.app/users/logoutAll", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
        }
      })
      localStorage.removeItem("token")
      changeLoggedState(false)
      changeLoggedUser({})
      navigate("/login", { replace: true })
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={props.avatar} alt="@gabriel.jaka" />
              <AvatarFallback>{props.userName ? props.userName.slice(0,1) : "x"}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{props.userName}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {props.userEmail}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
        <DropdownMenuGroup>
        <NavLink to="tasks">
          <DropdownMenuItem>
             Tasks
          </DropdownMenuItem>
        </NavLink>
        <NavLink to="user">
          <DropdownMenuItem>
             Profile
          </DropdownMenuItem>
        </NavLink>
        </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout}>
            Log out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }