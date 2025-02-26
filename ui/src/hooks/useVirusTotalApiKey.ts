import { useQuery } from '@tanstack/react-query'
import { checkVtApiKey } from '../services/api'

export const useVirusTotalApiKey = () => {
  const result = useQuery({
    queryFn: async () => {
      const result = await checkVtApiKey()
      return result
    },
    queryKey: ['checkVtApiKey'],
  })

  return {
    data: result.data,
    isApiKeyAvailable: result?.data?.apiKeyAvailable,
    isLoading: result.isLoading,
    isError: result.isError,
  }
}
