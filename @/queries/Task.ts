import {
    useQuery,
    useMutation,
  } from 'react-query'

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
  
  const updateTask = useMutation(async ({taskID, conditionToSet}: TasksEntryVariables) => {
    const token = localStorage.getItem("token")
    await fetch("http://tasg-backend-production.up.railway.app/tasks/" + taskID, {
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
    await fetch("http://tasg-backend-production.up.railway.app/tasks/", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token,
      },
      body: JSON.stringify({ 
        description: textDescription,
        promisedTime: date
      })
    })
  document.getElementById("taskDescriptionInput").value = ""
  queryClient.invalidateQueries({ queryKey: ['tasks'] })
  })

  const deleteTask = useMutation(async (taskID: string) => {
    const token = localStorage.getItem("token")
    await fetch("http://tasg-backend-production.up.railway.app/tasks/" + taskID, {
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