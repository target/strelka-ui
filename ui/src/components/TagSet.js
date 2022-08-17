import React from "react";
import { Tag } from "antd";

const TagSet = ({ items }) => {
  const hintItems = items?.slice(0, 3).map((type) => (
    <Tag style={{ marginBottom: "4px" }} key={type}>
      <div className="tagItem">{type}</div>
    </Tag>
  ));

  return (
    <div>
      {hintItems}
      {items?.length > 3 ? (
        <span style={{ fontSize: "12px" }} title={items?.slice(3).join(", ")}>
          and {items?.length - 3} more
        </span>
      ) : null}
    </div>
  );
};

export default TagSet;
