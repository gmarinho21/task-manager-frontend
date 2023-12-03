import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { NavLink, Navigate, useLocation, useNavigate } from "react-router-dom"

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


const formSchema = z.object({
  username: z.string().min(0, {
    message: "Username must be at least 2 characters.",
  }),    
  email: z.string().min(2, {
    message: "Password must be at least 8 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
})

export default function Landing() {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  })
 

  function onSubmit(values: z.infer<typeof formSchema>) {
    fetch("http://https://tasg-backend-production.up.railway.app:3000/users", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: values.username, email: values.email, password: values.password })
    })
    .then((res) => res.json())
    .then((data) => {
        localStorage.setItem("token", data.token)
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
                <>
                    <div className="space-y-8 m-auto max-w-xs py-9"> 
                        <h2 className="text-xl text-center font-bold">Please Register</h2>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                    <Input placeholder={"Your name"} {...field} />
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
                                    <Input type="email" placeholder={"example@example.com"} {...field} />
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
                            <div className="flex flex-column justify-center items-center gap-3">

                            <Button type="submit">Register</Button>
                            <p>or</p>
                            <span ><NavLink to="/login" className="underline underline-offset-2 hover:cursor-pointer">login</NavLink></span>
                            </div>
                            </form>
                        </Form>
                    </div>
                </>
    )
}