import '../../index.css'
import { queryClient } from '../../App'
import { useEffect, useState } from "react"
import {
    useQuery,
    useMutation,
  } from 'react-query'
import { useIsUserLoggedStore } from "@/store/isUserLogged"
import { useUserLoggedStore } from "@/store/loggedUser"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { format, parseISO } from "date-fns"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"



function ProjectLayout() {
    const { toast } = useToast()
    const isUserLogged = useIsUserLoggedStore((state: boolean) => state.isLogged)
    const loggedUser = useUserLoggedStore((state: boolean) => state.userLogged)
    const [clickedDeleteButton, setClickedDeleteButton] = useState("")
    
    const getTasks = async () => {
      const token = localStorage.getItem("token")
      const response = await fetch("http://tasg-backend-production.up.railway.app/tasks", {
        method: "GET",
        mode: "cors",
        headers: {
          "Authorization": "Bearer " + token,
        }
      }
      )
      const data = await response.json()
      return data
    } 
  
    const taskQuery = useQuery('tasks', getTasks)

    const getProjects = async () => {
      const token = localStorage.getItem("token")
      const response = await fetch("http://tasg-backend-production.up.railway.app/projects", {
        method: "GET",
        mode: "cors",
        headers: {
          "Authorization": "Bearer " + token,
        }
      }
      )
      const data = await response.json()
      return data
    } 
    
    const projectQuery = useQuery('projects', getProjects)

    const addProject = useMutation(async () => {
      const token = localStorage.getItem("token")
      const textName = document.getElementById("projectNameInput").value
      const textDescription = document.getElementById("projectDescriptionInput").value
    if (!textDescription) {
      return  toast({
        name: "Error",
        description: "Can't add an empty task",
      })
    }
    await fetch("http://tasg-backend-production.up.railway.app/projects/", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token,
      },
      body: JSON.stringify({ 
        name: textName,
        description: textDescription,
      })
    })
    document.getElementById("projectNameInput").value = ""
    document.getElementById("projectDescriptionInput").value = ""
    queryClient.invalidateQueries({ queryKey: ['projects'] })
    })
    
    const deleteProject = useMutation(async (taskID: string) => {
      const token = localStorage.getItem("token")
      await fetch("http://tasg-backend-production.up.railway.app/projects/" + taskID, {
        method: "DELETE",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
        }
      })
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },{
      onSuccess: async(data, parameters) => {
        await queryClient.cancelQueries('tasks')
        return queryClient.setQueryData('tasks', old => {
          return old.filter(card => {
            return card._id !== parameters})
        })
      }
       
    })

    const projectCards = projectQuery.isLoading ? "" : projectQuery.data.map((project) => {
      return (
        <Card key={project._id} className="relative grow basis-96">
          <CardHeader >
            <CardTitle>{project.name}</CardTitle>
            {deleteProject.isLoading && clickedDeleteButton === project._id
            ? <Button className="absolute right-4" variant="deleting" size="icon" disabled>X</Button>
            : <Button className="absolute right-4" variant="destructive" size="icon" onClick={() => {
              setClickedDeleteButton(project._id)
              deleteProject.mutate(project._id)}}>X</Button>}
          </CardHeader>
          <CardContent>
            <p>{project.description}</p>
          </CardContent>
          <CardFooter className="justify-between gap-6">
          FOOTER
          </CardFooter>
        </Card>
          )})


    const taskRows = taskQuery.isLoading ? 
      <tr>
        <td>Loading...</td>
      </tr>
      : taskQuery.data.map((task) => {
      return (
        <TableRow key={task._id}>
          <TableCell className="font-medium">{loggedUser.name}</TableCell>
          <TableCell>{task.title}</TableCell>
          <TableCell>{task.promisedTime ? format(parseISO(task.promisedTime), "PPP") : "No date set"}</TableCell>
          <TableCell>{task.isCompleted ? "Finished" : "Unfinished"}</TableCell>
        </TableRow>
          )})

    return (
      <>
        <Toaster />
        <div className="flex flex-col gap-4 items-center p-4">
          <Input className="w-96" placeholder="Write your Project Name" id="projectNameInput"/>
          <Textarea className="w-96" placeholder="Write your Project Description" id="projectDescriptionInput"/>
          <div className="flex gap-4">
            <Button variant="default" onClick={addProject.mutate}>Add Project</Button>
          </div>
          <div className='grid grid-cols-2 gap-8'>
            <div  className="flex flex-col w-96 gap-4">
              {projectCards}
            </div>
            <div  className="flex flex-col w-96 gap-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Owner</TableHead>
                    <TableHead className="w-[100px]">Title</TableHead>
                    <TableHead className="w-[150px]">Due Date</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {taskRows}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </>
    )
}

export default ProjectLayout