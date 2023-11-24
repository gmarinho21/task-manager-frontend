"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useLocation, useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUserLoggedStore } from "@/store/loggedUser"

const formSchema = z.object({
  username: z.string().min(0, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().min(0, {
    message: "Password must be at least 8 characters.",
  }),
  password: z.string().min(0, {
    message: "Password must be at least 8 characters.",
  }),
})

export function UserLayout() {
    const location = useLocation()

    const loggedUser = useUserLoggedStore((state) => state.userLogged)
    const changeLoggedUser = useUserLoggedStore((state) => state.changeUser)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  })
 

  function onSubmit(values: z.infer<typeof formSchema>) {
    const token = localStorage.getItem("token")
    let updateBody = {}
    updateBody = {
      ...(loggedUser.name = values.username && {name: values.username}),
      ...(loggedUser.email = values.email && {email: values.email}),
      ...(values.password !== "" && {password: values.password})
    }
    fetch("https://34.31.22.223:3000/users/me", {
        method: "PATCH",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
        body: JSON.stringify( updateBody )
    })
  }

  const uploadImage = function(e) {
    e.preventDefault()
    const files = document.getElementById('picture').files;
    var formData = new FormData();

    for(var i = 0; i < files.length; i++)
    {
        formData.append('upload', files[i], files[i].name);
    }

    const token = localStorage.getItem("token")
    fetch("https://34.31.22.223:3000/users/me/avatar", {
      method: "POST",
      mode: "cors",
      headers: {
        "Authorization": "Bearer " + token,
      },
      body: formData
    }).then(res => res.json())
    .then(data => changeLoggedUser(data))
  }

  return (
    <div className="space-y-8 m-auto max-w-xs">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder={loggedUser?.name || "Your name"} {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
            />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder={loggedUser?.email || "example@example.com"} {...field} />
                </FormControl>
                <FormDescription>
                  Please Enter your e-mail
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
            />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormDescription>
                  Please Enter your Password
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
            />

          <Button type="submit">Update info</Button>
        </form>
      </Form>
      <div className="space-y-8">
        <form className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="picture">Picture</Label>
          <Input id="picture" type="file" />
          <Button type="submit" className="" onClick={uploadImage} >Upload picture</Button>
        </form>
      </div>
    </div>
  )
}
export default UserLayout