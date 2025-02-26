import { useQuery } from '@tanstack/react-query'

import { fetchScanStats } from '../services/api'

export function useScanStats() {
  return useQuery({
    queryKey: ['scanStats'],
    queryFn: fetchScanStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
