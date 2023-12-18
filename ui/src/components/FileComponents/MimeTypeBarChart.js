import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { fetchWithTimeout } from "../../util";
import { APP_CONFIG } from "../../config";
import chroma from "chroma-js"; // A library for all kinds of color manipulations

const MimeTypeBarChart = ({ height }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchWithTimeout(
      `${APP_CONFIG.BACKEND_URL}/strelka/scans/mime-type-stats`,
      {
        method: "GET",
        mode: "cors",
        credentials: "include",
        timeout: APP_CONFIG.API_TIMEOUT,
      }
    )
      .then((response) => response.json())
      .then((rawData) => {
        // Transform data for charting
        const transformedData = Object.keys(rawData).map((month) => {
          return { month, ...rawData[month] };
        });
        setData(transformedData);
      });
  }, []);

  // Define Ant Design colors for the bars
  const baseColors = [
    "#f5222d",
    "#fa541c",
    "#fa8c16",
    "#fadb14",
    "#a0d911",
    "#52c41a",
    "#13c2c2",
    "#1890ff",
    "#2f54eb",
    "#722ed1",
    "#eb2f96",
    "#faad14",
    "#a0d911",
    "#52c41a",
    "#13c2c2",
  ];

  // Generate lighter versions for fills and use base colors for strokes (borders)
  const colors = baseColors.map(color => {
    return {
      fill: chroma(color).brighten(.1).hex(), // Slightly lighten the color for the fill
      stroke: chroma(color).darken(1.5).hex(), // Darken the color for the stroke
    };
  });

  return (
    <ResponsiveContainer width="100%" height={height || 300}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" tick={{ fontSize: 10 }} />
        <YAxis tick={{ fontSize: 10 }} />
        <Tooltip           wrapperStyle={{
            paddingLeft: "10px",
            lineHeight: "14px",
            textAlign: "left",
            fontSize: "10px",
            fontWeight: "800",
          }}/>
        <Legend
          verticalAlign="bottom"
          align="left"
          wrapperStyle={{
            paddingLeft: "10px",
            lineHeight: "14px",
            textAlign: "left",
            fontSize: "10px",
            fontWeight: "500",
          }}
        />{" "}
        {
          // Dynamically create a Bar for each MIME type
          Object.keys(data[0] || {})
            .filter((key) => key !== "month")
            .map((mime, idx) => {
              const color = colors[idx % colors.length]; // Cycle through colors

              return (
                <Bar
                  key={mime}
                  dataKey={mime}
                  fill={color.fill}
                  stroke={color.stroke}
                  strokeWidth={1.2}
                  barSize={400}
                />
              );
            })
        }
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MimeTypeBarChart;
