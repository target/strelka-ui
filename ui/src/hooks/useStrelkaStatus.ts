import { useQuery } from '@tanstack/react-query'
import { fetchStrelkaStatus } from '../services/api'
import type { StatusResponse } from '../services/api.types'

export const useStrelkaStatus = (): StrelkaStatusResponse => {
  const { data, isLoading, isError } = useQuery({
    queryFn: fetchStrelkaStatus,
    queryKey: ['fetchStrelkaStatus'],
    refetchInterval: 1000 * 60 * 5, // refresh every 5 minutes
  })

  return {
    data,
    isLoading,
    isError,
  }
}

interface StrelkaStatusResponse {
  data: StatusResponse
  isLoading: boolean
  isError: boolean
}
