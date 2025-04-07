import ReactJson from '@microlink/react-json-view'
import { Flex, Input } from 'antd'
import { useState } from 'react'
import { useDarkModeSetting } from '../../../hooks/useDarkModeSetting'
import { useLocalStorage } from '../../../hooks/useLocalStorage'
import JsonThemeSelect from './JsonThemeSelect'

import type { OverviewCardProps } from '../types'

import { useQuery } from '@tanstack/react-query'

const JsonViewCard = (props: OverviewCardProps) => {
  const { data: json } = props

  const { isDarkMode } = useDarkModeSetting()

  const { data: jsonTheme, mutate } = useLocalStorage(
    'jsonTheme',
    isDarkMode ? 'summerfruit' : 'summerfruit:inverted',
  )

  const [filterQuery, setFilterQuery] = useState('')

  const { data } = useQuery({
    queryKey: ['filteredJsonData', json, filterQuery],
    queryFn: () => filterValues(json, filterQuery),
    staleTime: 1000 * 60 * 1,
  })

  const filteredJsonData = data

  return (
    <Flex
      vertical
      style={{
        position: 'relative',
        padding: 0,
      }}
    >
      <Input
        placeholder="Filter by keyword..."
        value={filterQuery}
        onChange={(e) => setFilterQuery(e.target.value)}
        style={{
          padding: '10px',
          margin: '0 0 20px 0',
        }}
      />

      <div
        style={{
          position: 'absolute',
          right: '10px',
          top: '80px',
          zIndex: 100,
        }}
      >
        <JsonThemeSelect jsonTheme={jsonTheme} setJsonTheme={mutate} />
      </div>

      <ReactJson
        style={{
          wordBreak: 'break-all',
          margin: ' 0 -16px -16px -16px',
          padding: '15px',
        }}
        theme={jsonTheme}
        src={filteredJsonData || {}}
        collapsed={3}
        shouldCollapse={(field) => {
          if (field.name === 'scan') {
            return false
          }
          if (typeof field.src !== 'object' || Array.isArray(field.src)) {
            return false
          }
          return field.namespace.length > 2
        }}
      />
    </Flex>
  )
}

export default JsonViewCard

const filterValues = (json, query) => {
  if (!query) return json

  let result = Array.isArray(json) ? [] : {}

  if (typeof json === 'object') {
    for (const key of Object.keys(json)) {
      const value = json[key]
      // Recursively find matches in nested objects/arrays
      if (typeof value === 'object') {
        const filteredChild = filterValues(value, query)
        if (filteredChild && Object.keys(filteredChild).length !== 0) {
          // If there is a match in children, include this key in the result
          result[key] = filteredChild
        }
      } else if (
        typeof value === 'string' &&
        value.toLowerCase().includes(query.toLowerCase())
      ) {
        // Direct matches with the string representation of the value are included
        result[key] = value
      }
    }
  } else if (
    typeof json === 'string' &&
    json.toLowerCase().includes(query.toLowerCase())
  ) {
    // If this is a string and it matches, return it directly.
    return json
  }

  // If we're working with an array after filtering, filter out any empty objects or arrays.
  if (Array.isArray(result)) {
    result = result.filter((item) =>
      typeof item === 'object' ? Object.keys(item).length > 0 : true,
    )
  }

  // Return an empty object/array if no matches found,
  // or an object/array only containing matching keys/values.
  return result
}
