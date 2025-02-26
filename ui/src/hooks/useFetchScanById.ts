import { useQuery } from '@tanstack/react-query'
import { fetchScanById } from '../services/api'

/**
 * Fetches a scan by its ID.
 *
 * @param {string} scanId - The ID of the scan to fetch.
 *
 * @returns {UseQueryResult<Scan, Error>} The scan result.
 */
export function useFetchScanById(scanId: string) {
  return useQuery({
    queryFn: () => fetchScanById(scanId),
    queryKey: ['fetchScanById', scanId],
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
