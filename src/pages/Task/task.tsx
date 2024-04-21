import { Button } from "@/components/ui/button"
import { ProjectSelector } from "@/components/ui/combobox"
import {
  Card,
  CardContent,
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


import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format, parseISO } from "date-fns"

import '../../index.css'

import {
  useTaskQuery,
  useDeleteTask,
  useUpdateTask,
  useAddTask,
} from '@/queries/taskQuery'

import {
  useQuery,
  useMutation,
} from 'react-query'
import { queryClient } from '../../App'

interface TasksEntryVariables {
  taskID: string,
  conditionToSet: boolean
}

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
]


function TaskLayout() {
  const { toast } = useToast()
  const isUserLogged = useIsUserLoggedStore((state: boolean) => state.isLogged)
  const loggedUser = useUserLoggedStore((state: boolean) => state.userLogged)
  const [clickedDeleteButton, setClickedDeleteButton] = useState("")
  const [date, setDate] = useState<Date>()
  const taskQuery = useTaskQuery()
  const deleteTask = useDeleteTask()
  const updateTask = useUpdateTask()
  const addTask = useAddTask()
  
  useEffect(() => {
    if(isUserLogged) {
      invaldiateTaskQuery()
    }
  
  }, [isUserLogged])

  
  const invaldiateTaskQuery = async () => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] })
  }

  const addNewTask = async () => {
    const taskDescription = document.getElementById("taskDescriptionInput").value
    const taskTitle = document.getElementById("taskTitleInput").value
    if (!taskDescription || !taskTitle) {
      return  toast({
        title: "Error",
        description: "Please inform a title and a description",
      })
    }
    document.getElementById("taskDescriptionInput").value = ""
    document.getElementById("taskTitleInput").value = ""
    addTask.mutate({taskDescription, date, taskTitle})
  }

  

  const taskCards = taskQuery.isLoading ? "" : taskQuery.data.map((task) => {
    return (
      <Card key={task._id} className="relative grow basis-96">
        <CardHeader >
          <CardTitle>{loggedUser.name}</CardTitle>
          <CardTitle>{task.title}</CardTitle>
          {deleteTask.isLoading && clickedDeleteButton === task._id
          ? <Button className="absolute right-4" variant="deleting" size="icon" disabled>X</Button>
          : <Button className="absolute right-4" variant="destructive" size="icon" onClick={() => {
            setClickedDeleteButton(task._id)
            deleteTask.mutate(task._id)}}>X</Button>}
        </CardHeader>
        <CardContent>
          <p>{task.description}</p>
        </CardContent>
        <CardFooter className="justify-between gap-6">
          {!task.isCompleted && <Button onClick={() => updateTask.mutate({taskID: task._id, conditionToSet: true})}>Complete</Button>}
          {task.isCompleted && <Button onClick={() => updateTask.mutate({taskID: task._id, conditionToSet: false})}>Uncomplete</Button>}
          <p><b>Due Date:</b> {task.promisedTime ? format(parseISO(task.promisedTime), "PPP") : "No date set"}</p>
        </CardFooter>
      </Card>
        )})
      

  return (
    <>
    <Toaster />
    <div className="flex items-center justify-between relative p-4">
    </div>
    <div className="flex flex-col gap-4 items-center p-4">
      <Input className="w-96" placeholder="Write your task title" id="taskTitleInput"/>
      <Textarea className="w-96" placeholder="Write your task description" id="taskDescriptionInput"/>
      <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-96 justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date when it's due</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
    <ProjectSelector frameworks={frameworks}/>
      <div className="flex gap-4">
        <Button variant="default" onClick={invaldiateTaskQuery}>Reload Tasks</Button>
        <Button variant="default" onClick={addNewTask}>Add Task</Button>
      </div>
      <div className="flex flex-wrap gap-4 w-screenpx-4">
        {taskCards}
      </div>
    </div>
    </>
  )
}

export default TaskLayout