import { useQuery } from '@tanstack/react-query'

import { searchScans } from '../services/api'

export function useSearchScans(opts) {
  return useQuery({
    queryKey: ['searchScans', opts],
    queryFn: () => searchScans(opts),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
