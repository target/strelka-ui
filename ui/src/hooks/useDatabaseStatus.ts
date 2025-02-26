import { useQuery } from '@tanstack/react-query'
import { fetchDatabaseStatus } from '../services/api'

export const useDatabaseStatus = (): DatabaseStatusResponse => {
  const { data, isLoading, isError } = useQuery({
    queryFn: fetchDatabaseStatus,
    queryKey: ['fetchDatabaseStatus'],
    refetchInterval: 1000 * 60 * 5, // refresh every 5 minutes
  })

  return {
    data,
    isLoading,
    isError,
  }
}

interface DatabaseStatus {
  message: string
}

interface DatabaseStatusResponse {
  data: DatabaseStatus
  isLoading: boolean
  isError: boolean
}
