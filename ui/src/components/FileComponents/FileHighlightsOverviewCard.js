import React from "react";
import { Row, Typography, Alert } from "antd";

const { Text } = Typography;

const FileHighlightsOverviewCard = ({ data }) => {
  // Initialize arrays to store unique insights and IOCs
  const uniqueInsights = new Set();
  const uniqueIOCs = new Set();

  // Iterate through strelka_response to collect unique IOCs and Insights
  data.strelka_response.forEach((response) => {
    if (response.insights) {
      response.insights.forEach((insight) => {
        uniqueInsights.add(insight);
      });
    }
    if (response.iocs) {
      response.iocs.forEach((ioc) => {
        uniqueIOCs.add(ioc.ioc);
      });
    }
  });

  const renderAlerts = (items, type) => (
    <div>
      {items.map((item, index) => (
        <Alert
          key={index}
          message={item}
          type={type}
          style={{ marginBottom: 8, fontSize: "12px" }}
        />
      ))}
    </div>
  );

  return (
    <Row>
      <div style={{ width: "100%" }}>
        {uniqueInsights.size > 0 ? (
          <>
            <Text
              strong
              style={{ display: "block", marginBottom: 8, fontSize: "12px" }}
            >
              Insights:
            </Text>
            {renderAlerts(Array.from(uniqueInsights), "warning")}
          </>
        ) : (
          <div>
            <Text
              strong
              style={{ display: "block", marginBottom: 8, fontSize: "12px" }}
            >
              Insights:
            </Text>
            <Text style={{ fontSize: "12px" }}>No Highlights</Text>
          </div>
        )}
        {uniqueIOCs.size > 0 ? (
          <>
            <Text
              strong
              style={{ display: "block", marginBottom: 8, marginTop: 8,  fontSize: "12px" }}
            >
              IOCs:
            </Text>
            {renderAlerts(Array.from(uniqueIOCs), "error")}
          </>
        ) : (
          <div>
            <Text
              strong
              style={{ display: "block", marginBottom: 8, marginTop: 8, fontSize: "12px" }}
            >
              IOCs:
            </Text>
            <Text style={{ fontSize: "12px" }}>No IOCs</Text>
          </div>
        )}
      </div>
    </Row>
  );
};

export default FileHighlightsOverviewCard;
