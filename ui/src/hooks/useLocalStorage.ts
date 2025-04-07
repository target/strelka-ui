import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

export const useLocalStorage = (key, initialValue) => {
  useEffect(() => {
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, JSON.stringify(initialValue))
    }
  }, [key, initialValue])

  const { data, isLoading } = useQuery({
    queryFn: () => getLocalStorageItem(key),
    queryKey: ['localStorage', key],
  })

  const queryClient = useQueryClient()

  const { mutate } = useMutation({
    // biome-ignore lint/suspicious/noExplicitAny: any is used to allow any type of value to be stored in local storage
    mutationFn: (newVal: any) => setLocalStorageItem(key, newVal),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['localStorage', key],
      })
    },
  })

  return { data, isLoading, mutate }
}

function getLocalStorageItem(key: string) {
  const val = JSON.parse(localStorage.getItem(key))
  return val
}

// biome-ignore lint/suspicious/noExplicitAny: any is used to allow any type of value to be stored in local storage
function setLocalStorageItem(key: string, value: any) {
  const stringifiedValue = JSON.stringify(value)
  localStorage.setItem(key, stringifiedValue)
  return Promise.resolve()
}
