import React from "react";
import { Typography } from "antd";

import ConditionalWrapper from "./ConditionalWrapper";

const { Text } = Typography;

const DataDisplayObj = ({ name, value }) => {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value === "function") {
    return null;
  }

  if (
    typeof value === "boolean" ||
    typeof value === "number" ||
    typeof value === "string" ||
    typeof value === "bigint"
  ) {
    return (
      <div>
        <ConditionalWrapper
          condition={name}
          wrapper={(children) => (
            <span>
              <Text code>{name}</Text> {children}
            </span>
          )}
        >
          <Text>{value}</Text>
        </ConditionalWrapper>
      </div>
    );
  }

  if (Array.isArray(value)) {
    return (
      <div>
        <ConditionalWrapper
          condition={name}
          wrapper={(children) => (
            <span>
              <Text code>{name}</Text> {children}
            </span>
          )}
        >
          <div style={{ marginLeft: "10px", paddingLeft: "12px" }}>
            {value.map((value) => (
              <DataDisplayObj value={value} />
            ))}
          </div>
        </ConditionalWrapper>
      </div>
    );
  }

  if (typeof value === "object") {
    return (
      <div>
        <ConditionalWrapper
          condition={name}
          wrapper={(children) => (
            <span>
              {" "}
              <Text code>{name}</Text> {children}
            </span>
          )}
        >
          <div style={{ marginLeft: "10px" }}>
            {Object.entries(value).map((entries) => {
              return <DataDisplayObj name={entries[0]} value={entries[1]} />;
            })}
          </div>
        </ConditionalWrapper>
      </div>
    );
  }

  return null;
};

export { DataDisplayObj };
