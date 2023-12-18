import {
  FileTextOutlined,
  Html5Outlined,
  PictureOutlined,
  FilePdfOutlined,
  PlaySquareOutlined,
  FileZipOutlined,
  FileExcelOutlined,
  NumberOutlined,
  TableOutlined,
  DatabaseOutlined,
  CalculatorOutlined,
  LockOutlined,
  FileOutlined,

} from "@ant-design/icons";

export const flowIconMappingTable = {
  strelka: {
    "application/octet-stream": {
      icon: NumberOutlined,
      color: "#8D6E63",
    },
    "text/plain": {
      icon: FileTextOutlined,
      color: "#1677ff",
    },
    "text/html": {
      icon: Html5Outlined,
      color: "#9c27b0",
    },
    "text/csv": {
      icon: TableOutlined,
      color: "#5b8c00",
    },
    "image/png": {
      icon: PictureOutlined,
      color: "#4096ff",
    },
    "image/jpeg": {
      icon: PictureOutlined,
      color: "#4096ff",
    },
    "application/pdf": {
      icon: FilePdfOutlined,
      color: "#ff4d4f",
    },
    "text/xml": {
      icon: FileTextOutlined,
      color: "#ffa940",
    },
    "application/x-executable": {
      icon: PlaySquareOutlined,
      color: "#ff4d4f",
    },
    "application/zip": {
      icon: FileZipOutlined,
      color: "#f759ab",
    }
    ,
    "application/vnd.ms-excel": {
      icon: FileExcelOutlined,
      color: "#4CAF50",
    },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
      icon: FileExcelOutlined,
      color: "#4CAF50",
    },
    "application/x-dosexec": {
      icon: PlaySquareOutlined,
      color: "#ff4d4f",
    },
    "application/x-dbt": {
      icon: DatabaseOutlined,
      color: "#531dab",
    },
    "application/encrypted": {
      icon: LockOutlined,
      color: "#13c2c2",
    },
    "application/x-matlab-data": {
      icon: CalculatorOutlined,
      color: "#fadb14",
    },
    "application/x-pnf": {
      icon: FileOutlined,
      color: "#faad14",
    },
    "application/x-empty": {
      icon: FileOutlined,
      color: "#531dab",
    },
  }
}

// Default icon and color
const defaultIconConfig = {
  icon: FileTextOutlined,
  color: "#d9d9d9" 
};

// Function to get icon configuration
export const getIconConfig = (category, type) => {
  if (flowIconMappingTable[category] && flowIconMappingTable[category][type]) {
    return flowIconMappingTable[category][type];
  }
  return defaultIconConfig;
};