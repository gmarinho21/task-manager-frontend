import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useEffect, useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { useIsUserLoggedStore } from "@/store/isUserLogged"
import { useUserLoggedStore } from "@/store/loggedUser"
import {
  useQuery,
  useMutation,
} from 'react-query'

import '../../index.css'
import { queryClient } from '../../App'

interface TasksEntryVariables {
  taskID: string,
  conditionToSet: boolean
}


function TaskLayout() {
  const { toast } = useToast()
  const isUserLogged = useIsUserLoggedStore((state: boolean) => state.isLogged)
  const loggedUser = useUserLoggedStore((state: boolean) => state.userLogged)
  const [clickedDeleteButton, setClickedDeleteButton] = useState("")
  
  useEffect(() => {
    if(isUserLogged) {
      getTasks()

    }
  
  }, [isUserLogged])

  
  
  const getTasks = async () => {
    const token = localStorage.getItem("token")
    const response = await fetch("http://tasg-backend-production.up.railway.app:3000/tasks", {
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
  
  const updateTask = useMutation(async ({taskID, conditionToSet}: TasksEntryVariables) => {
    const token = localStorage.getItem("token")
    await fetch("http://tasg-backend-production.up.railway.app:3000/tasks/" + taskID, {
    method: "PATCH",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token,
    },
    body: JSON.stringify({ isCompleted: conditionToSet })
  })
  queryClient.invalidateQueries({ queryKey: ['tasks'] })
  })

  const addTask = useMutation(async () => {
    const token = localStorage.getItem("token")
    const textDescription = document.getElementById("taskDescriptionInput").value
    if (!textDescription) {
      return  toast({
        title: "Error",
        description: "Can't add an empty task",
      })
    }
    await fetch("http://tasg-backend-production.up.railway.app:3000/tasks/", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token,
      },
      body: JSON.stringify({ description: textDescription })
    })
  document.getElementById("taskDescriptionInput").value = ""
  queryClient.invalidateQueries({ queryKey: ['tasks'] })
  })

  const deleteTask = useMutation(async (taskID: string) => {
    const token = localStorage.getItem("token")
    await fetch("http://tasg-backend-production.up.railway.app:3000/tasks/" + taskID, {
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
          console.log(parameters!== card._id)
          return card._id !== parameters})
      })
    }
     
  })

  const taskCards = taskQuery.isLoading ? "" : taskQuery.data.map((task) => {
    return (
      <Card key={task._id} className="relative">
        <CardHeader>
          {deleteTask.isLoading && clickedDeleteButton === task._id
          ? <Button className="absolute right-4" variant="deleting" size="icon" disabled>X</Button>
          : <Button className="absolute right-4" variant="destructive" size="icon" onClick={() => {
            setClickedDeleteButton(task._id)
            deleteTask.mutate(task._id)}}>X</Button>}
          <CardTitle>{loggedUser.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{task.description}</p>
        </CardContent>
        <CardFooter>
          {!task.isCompleted && <Button onClick={() => updateTask.mutate({taskID: task._id, conditionToSet: true})}>Complete</Button>}
          {task.isCompleted && <Button onClick={() => updateTask.mutate({taskID: task._id, conditionToSet: false})}>Uncomplete</Button>}
        </CardFooter>
      </Card>
        )})
      

  return (
    <>
    <Toaster />
    <div className="flex items-center justify-between relative p-4">
    </div>
    <div className="flex flex-col gap-4 items-center p-4">
      <Textarea className="w-96" placeholder="Write your task" id="taskDescriptionInput"/>
      <div className="flex gap-4">
        <Button variant="default" onClick={getTasks}>Reload Tasks</Button>
        <Button variant="default" onClick={addTask.mutate}>Add Task</Button>
      </div>
      <div className="grid grid-cols-3 gap-4 w-screen px-4">
        {taskCards}
      </div>
    </div>
    </>
  )
}

export default TaskLayout