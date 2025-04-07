import { useQuery } from '@tanstack/react-query'
import { fetchAuthApiKey } from '../services/api'

/**
 * Fetches the user's API key.
 *
 * @returns {AuthApiKeyResponse} The user's API key.
 */
export function useApiKey() {
  const { data, isLoading } = useQuery({
    queryFn: () => fetchAuthApiKey(),
    queryKey: ['apiKey'],
  })

  const apiKey = data?.api_key || ''

  return { apiKey, isLoading }
}
