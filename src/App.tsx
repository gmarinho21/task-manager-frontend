import { LoginForm } from "./pages/Task/login";
import TaskLayout from "./pages/Task/task"
import UserLayout from "./pages/User/user"
import ProjectLayout from "./pages/Project/project"
import Landing from "./pages/landing"
import AuthRequired from "@/components/helper/AuthRequired"
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Layout from "./pages/layout";
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

export const queryClient = new QueryClient()

function App() {

  return (
    <>
    <QueryClientProvider client={queryClient}>
    <ReactQueryDevtools initialIsOpen={false} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout/>}>
            <Route index element={<Landing />}/>  
            <Route path="/login" element={<LoginForm />}/>  
            <Route element={<AuthRequired />} >
              <Route path="/user" element={<UserLayout />}/>
              <Route path="/tasks" element={<TaskLayout />}/>
              <Route path="/projects" element={<ProjectLayout />}/>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
    </>
  )
}

export default App
