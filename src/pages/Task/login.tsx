import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useLocation, Navigate, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useUserQuery, useLogin } from "@/queries/UserQuery";
import { useEffect } from "react";

const formSchema = z.object({
  email: z.string().min(2, {
    message: "Password must be at least 8 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

export function LoginForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const loginUser = useLogin();
  const userQuery = useUserQuery();

  const from = location.state?.from || "/tasks";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    loginUser.mutate({ values });
  }

  useEffect(() => {
    if (userQuery.data) {
      navigate(from, { replace: true });
    }
  }, [userQuery]);

  if (localStorage.getItem("token")) {
    return (
      <Navigate
        to="/tasks"
        state={{
          from: location.pathname,
        }}
        replace
      />
    );
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 m-auto max-w-xs"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="example@example.com"
                  {...field}
                />
              </FormControl>
              <FormDescription>Please Enter your e-mail</FormDescription>
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
              <FormDescription>Please Enter your Password</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Log In</Button>
      </form>
    </Form>
  );
}
