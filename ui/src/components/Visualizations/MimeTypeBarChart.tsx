import { Flex, Spin } from 'antd'
import chroma from 'chroma-js'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useMimeTypeStats } from '../../hooks/useMimeTypeStats'
import { getIconConfig } from '../../utils/iconMappingTable'

interface MimeTypeBarChartProps {
  height: number
}

/**
 * Component that renders a bar chart for MIME type statistics.
 * @param {number} height - Height of the chart container.
 */
const MimeTypeBarChart = ({ height }: MimeTypeBarChartProps) => {
  const { data, isLoading } = useMimeTypeStats()

  if (isLoading) {
    return (
      <Flex justify="center" align="center" style={{ minHeight: '500px' }}>
        <Spin size="large" />
      </Flex>
    )
  }

  // Define the style for the Tooltip and Legend once to avoid inline object creation
  const chartTextStyle = {
    paddingLeft: '10px',
    lineHeight: '14px',
    fontSize: '10px',
    fontWeight: '800',
  }

  // get list if keys of all items in the array, deduplicated and sorted by total descending

  const allBarKeysWithTotals = data.reduce(
    (acc, item) => {
      for (const key of Object.keys(item)) {
        if (key !== 'month') {
          acc[key] = (acc[key] || 0) + (item[key] as number)
        }
      }
      return acc
    },
    {} as Record<string, number>,
  )
  const allBarKeys = Object.keys(allBarKeysWithTotals).sort(
    (a, b) => allBarKeysWithTotals[b] - allBarKeysWithTotals[a],
  )

  // find the top key totals and sum the rest into 'other'
  const topKeys = allBarKeys.slice(0, 20)
  const otherKeys = allBarKeys.slice(20)

  let otherTotal = 0
  const dataWithOther = data.map((item) => {
    const otherValue = otherKeys.reduce(
      (acc, key) => acc + ((item[key] as number) || 0),
      0,
    )
    otherTotal += otherValue
    return { ...item, other: otherValue }
  })

  const barKeys = topKeys

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={dataWithOther}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" tick={{ fontSize: 10 }} />
        <YAxis tick={{ fontSize: 10 }} />
        <Tooltip wrapperStyle={chartTextStyle} />
        <Legend
          layout="vertical"
          align="right"
          verticalAlign="top"
          wrapperStyle={chartTextStyle}
          formatter={(v) =>
            `${(allBarKeysWithTotals[v] || otherTotal).toLocaleString()} ${v.slice(0, 30)}${v.length > 30 ? '...' : ''}`
          }
        />
        {barKeys.map((mime: string) => {
          const { color: bgColor = 'defaultBackgroundColor' } =
            getIconConfig('strelka', mime.toLowerCase()) || {}

          return (
            <Bar
              key={mime}
              dataKey={mime}
              stackId="a"
              fill={chroma(bgColor).brighten(0.1).hex()}
              stroke={chroma(bgColor).darken(1.5).hex()}
            />
          )
        })}
      </BarChart>
    </ResponsiveContainer>
  )
}

export default MimeTypeBarChart
