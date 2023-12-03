"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useLocation, Navigate, useNavigate } from "react-router-dom"

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
import { useIsUserLoggedStore } from "@/store/isUserLogged"




const formSchema = z.object({
  email: z.string().min(2, {
    message: "Password must be at least 8 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
})

export function LoginForm() {
    const location = useLocation()
    const navigate = useNavigate()

    const changeLoggedState = useIsUserLoggedStore((state) => state.changeLoggedState)

    const from = location.state?.from || "/tasks";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })
 

  function onSubmit(values: z.infer<typeof formSchema>) {
    fetch("http://tasg-backend-production.up.railway.app/users/login", {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: values.email, password: values.password })
    }).then((res) => res.json())
    .then((data) => {
        localStorage.setItem("token", data.token)
        changeLoggedState(true)
        navigate(from, { replace: true })
    })


  }

  if (localStorage.getItem("token")) {
    return (
        <Navigate 
            to="/tasks" 
            state={{
                message: "You must log in first",
                from: location.pathname
            }} 
            replace
        />)
}


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 m-auto max-w-xs">

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input type="email" placeholder="example@example.com" {...field} />
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

        <Button type="submit">Log In</Button>
      </form>
    </Form>
  )
}
