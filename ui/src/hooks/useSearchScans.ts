import { useQuery } from '@tanstack/react-query'
import { searchScans } from '../services/api'

export function useSearchScans(opts) {
  const query = useQuery({
    queryKey: ['searchScans', opts],
    queryFn: () => searchScans(opts),
    staleTime: 1000 * 60 * 5,
  })

  return {
    ...query,
    reload: query.refetch,
  }
}
