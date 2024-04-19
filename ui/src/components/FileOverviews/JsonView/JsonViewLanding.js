import React, { useState } from "react";

import { Collapse, Typography, Input } from "antd";
import ReactJson from "react-json-view";

const { Text } = Typography;

const JsonViewLanding = ({ jsonData }) => {
  const [filterQuery, setFilterQuery] = useState("");

  const filterValues = (json, query) => {
    if (!query) return json;
    
    let result = Array.isArray(json) ? [] : {};
    
    if (typeof json === "object") {
      for (const key of Object.keys(json)) {
        const value = json[key];
        // Recursively find matches in nested objects/arrays
        if (typeof value === 'object') {
          const filteredChild = filterValues(value, query);
          if (filteredChild && Object.keys(filteredChild).length !== 0) {
            // If there is a match in children, include this key in the result
            result[key] = filteredChild;
          }
        } else if (typeof value === 'string' && value.toLowerCase().includes(query.toLowerCase())) {
          // Direct matches with the string representation of the value are included
          result[key] = value;
        }
      }
    } else if (typeof json === 'string' && json.toLowerCase().includes(query.toLowerCase())) {
      // If this is a string and it matches, return it directly.
      return json;
    }
  
    // If we're working with an array after filtering, filter out any empty objects or arrays.
    if (Array.isArray(result)) {
      result = result.filter(item => typeof item === 'object' ? Object.keys(item).length > 0 : true);
    }
  
    // Return an empty object/array if no matches found,
    // or an object/array only containing matching keys/values.
    return result;
  };

  const filteredJsonData = filterValues(jsonData, filterQuery);

  return (
    <Collapse style={{ width: "100%" }}>
      <Collapse.Panel
        header={
          <div>
            <Text strong>JSON View</Text>
            <div style={{ fontSize: "smaller", color: "#888" }}>
              Raw Strelka data, including scanners not yet available in Card
              view.
            </div>
          </div>
        }
        key="1"
      >
        <Input
          placeholder="Filter by keyword..."
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            margin: "0 0 20px 0",
          }}
        />
        <ReactJson
          src={filteredJsonData}
          collapsed={3}
          shouldCollapse={(field) => {
            if (field.name === "scan") {
              return false;
            }
            if (typeof field.src !== "object" || Array.isArray(field.src)) {
              return false;
            }
            return field.level > 2;
          }}
        />
      </Collapse.Panel>
    </Collapse>
  );
};

export default JsonViewLanding;
