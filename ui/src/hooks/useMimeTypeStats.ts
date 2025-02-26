import { useQuery } from '@tanstack/react-query'

import { fetchMimeTypeStats } from '../services/api'

interface MimeTypeStatsRow {
  month: string
  [key: string]: string | number
}

export function useMimeTypeStats() {
  return useQuery({
    queryKey: ['mimeTypeStats'],
    queryFn: async () => {
      const rawData = await fetchMimeTypeStats()

      const transformedData = Object.keys(rawData).map((month) => ({
        month,
        ...rawData[month],
      }))

      return transformedData as MimeTypeStatsRow[]
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
