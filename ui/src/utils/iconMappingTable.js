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
  FileWordOutlined,
  FileImageOutlined,
  FileGifOutlined,
  FileMarkdownOutlined,
  MailOutlined,
  FileUnknownOutlined,
  ExperimentOutlined,
  CodeOutlined,
} from "@ant-design/icons";

import { antdColors } from "../utils/colors"

export const flowIconMappingTable = {
  strelka: {
    "application/octet-stream": {
      icon: NumberOutlined,
      color: antdColors.brown,
    },
    "text/plain": {
      icon: FileTextOutlined,
      color: antdColors.blue,
    },
    "text/html": {
      icon: Html5Outlined,
      color: antdColors.purple,
    },
    "text/csv": {
      icon: TableOutlined,
      color: antdColors.lime,
    },
    "image/png": {
      icon: PictureOutlined,
      color: antdColors.blue,
    },
    "image/jpeg": {
      icon: PictureOutlined,
      color: antdColors.blue,
    },
    "application/pdf": {
      icon: FilePdfOutlined,
      color: antdColors.red,
    },
    "text/xml": {
      icon: FileTextOutlined,
      color: antdColors.orange,
    },
    "application/x-executable": {
      icon: PlaySquareOutlined,
      color: antdColors.red,
    },
    "application/zip": {
      icon: FileZipOutlined,
      color: antdColors.gold,
    },
    "application/vnd.ms-excel": {
      icon: FileExcelOutlined,
      color: antdColors.green,
    },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
      icon: FileExcelOutlined,
      color: antdColors.green,
    },
    "application/msword": {
      icon: FileWordOutlined,
      color: antdColors.geekblue,
    },
    "application/x-dosexec": {
      icon: PlaySquareOutlined,
      color: antdColors.red,
    },
    "application/x-dbt": {
      icon: DatabaseOutlined,
      color: antdColors.purple,
    },
    "application/encrypted": {
      icon: LockOutlined,
      color: antdColors.cyan,
    },
    "application/x-matlab-data": {
      icon: CalculatorOutlined,
      color: antdColors.yellow,
    },
    "application/x-pnf": {
      icon: FileOutlined,
      color: antdColors.gold,
    },
    "application/x-empty": {
      icon: FileUnknownOutlined,
      color: antdColors.gray,
    },
    "application/cdfv2": {
      icon: FileTextOutlined,
      color: antdColors.gray,
    },
    "application/gzip": {
      icon: FileZipOutlined,
      color: antdColors.gold,
    },
    "image/svg+xml": {
      icon: FileImageOutlined,
      color: antdColors.green,
    },
    "message/rfc822": {
      icon: MailOutlined,
      color: antdColors.blue,
    },
    "text/rtf": {
      icon: FileWordOutlined,
      color: antdColors.green,
    },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
      icon: FileWordOutlined,
      color: antdColors.green,
    },
    "application/x-wine-extension-ini": {
      icon: ExperimentOutlined,
      color: antdColors.magenta,
    },
    "application/x-setupscript": {
      icon: CodeOutlined,
      color: antdColors.cyan,
    },
    "text/css": {
      icon: CodeOutlined,
      color: antdColors.teal,
    },
    "application/json": {
      icon: FileOutlined,
      color: antdColors.indigo,
    },
    "application/xml": {
      icon: FileOutlined,
      color: antdColors.deepPurple,
    },
    "application/javascript": {
      icon: CodeOutlined,
      color: antdColors.deepOrange,
    },
    "text/markdown": {
      icon: FileMarkdownOutlined,
      color: antdColors.limeGreen,
    },
    "image/gif": {
      icon: FileGifOutlined,
      color: antdColors.amber,
    },
  },
};

// Default icon and color
const defaultIconConfig = {
  icon: FileTextOutlined,
  color: antdColors.darkGray,
};

// Function to get icon configuration
export const getIconConfig = (category, type) => {
  if (flowIconMappingTable[category] && flowIconMappingTable[category][type]) {
    return flowIconMappingTable[category][type];
  }
  return defaultIconConfig;
};
