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
import { getIconConfig } from "../../utils/iconMappingTable";
import chroma from "chroma-js";

/**
 * Component that renders a bar chart for MIME type statistics.
 * @param {number} height - Height of the chart container.
 */
const MimeTypeBarChart = ({ height }) => {
  const [data, setData] = useState([]);

  /**
   * Fetches MIME type statistics from the server and formats it for display.
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchWithTimeout(
          `${APP_CONFIG.BACKEND_URL}/strelka/scans/mime-type-stats`,
          {
            method: "GET",
            mode: "cors",
            credentials: "include",
            timeout: APP_CONFIG.API_TIMEOUT,
          }
        );

        const rawData = await response.json();
        const transformedData = Object.keys(rawData).map((month) => ({
          month,
          ...rawData[month],
        }));

        setData(transformedData);
      } catch (error) {
        console.error("Failed to fetch MIME type data:", error);
      }
    };

    fetchData();
  }, []);

  // Define the style for the Tooltip and Legend once to avoid inline object creation
  const chartTextStyle = {
    paddingLeft: "10px",
    lineHeight: "14px",
    textAlign: "left",
    fontSize: "10px",
    fontWeight: "800",
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" tick={{ fontSize: 10 }} />
        <YAxis tick={{ fontSize: 10 }} />
        <Tooltip wrapperStyle={chartTextStyle} />
        <Legend
          verticalAlign="bottom"
          align="left"
          wrapperStyle={chartTextStyle}
        />
        {data[0] &&
          Object.keys(data[0])
            .filter((key) => key !== "month")
            .map((mime) => {
              const { color: bgColor = "defaultBackgroundColor" } =
                getIconConfig("strelka", mime.toLowerCase()) || {};

              return (
                <Bar
                  key={mime}
                  dataKey={mime}
                  fill={chroma(bgColor).brighten(0.1).hex()}
                  stroke={chroma(bgColor).darken(1.5).hex()}
                  strokeWidth={1.2}
                  barSize={400}
                />
              );
            })}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MimeTypeBarChart;
