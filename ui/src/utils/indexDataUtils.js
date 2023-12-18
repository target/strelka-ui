// Constants for index colors
const COLORS = {
    STRELKA: "#9c27b0",
    DEFAULT: "#ff0072"
  };
  
  /**
   * Returns the color theme based on the given index.
   * 
   * @param index - The index for which the color is to be fetched.
   * 
   * @returns A color string.
   */
  export const indexColorThemes = (index) => {
    switch (index) {
      case "strelka":
        return COLORS.STRELKA;
      default:
        return COLORS.DEFAULT;
    }
  };
  
  /**
   * Transforms raw data into a structured nodeData object based on the index.
   * 
   * @param index - The type/index of the data.
   * @param data - The raw data to be transformed.
   * 
   * @returns A structured nodeData object.
   */
  export const indexDataType = (index, data) => {
    let nodeData = {
      nodeDatatype: "strelka",
      nodeVirustotal: "Not Found",
      nodeInsights: 0,
      nodeIocs: 0,
      nodeDisposition: "",
      nodeMain: "",
      nodeSub: "",
      nodeLabel: "",
      nodeMetric: "",
      nodeParentId: "",
      nodeRelationshipId: "",
    };
    switch (index) {
      case "strelka":
        Object.assign(nodeData, {
          nodeDepth: data["file"]["depth"],
          nodeMain: data["file"]["flavors"]["mime"][0],
          nodeSub: `${data["file"]["size"]} Bytes`,
          nodeLabel: data["file"]["name"],
          nodeMetric: data["scan"]?.["yara"]?.["matches"]?.length || 0,
          nodeMetricLabel: "Yara Matches",
          nodeParentId: data["file"]["tree"]["parent"],
          nodeRelationshipId: data["file"]["tree"]["node"],
          nodeVirustotal: data["enrichment"]?.["virustotal"] !== undefined ? data["enrichment"]["virustotal"] : "Not Found",
          nodeInsights: data?.insights?.length,
          nodeIocs: data?.iocs?.length
        }
        );
        break;
  
      default:
        break;
    }

    return nodeData;
  };
  
    /**
   * Transforms raw data into a structured nodeData object based on the index.
   * 
   * @param index - The type/index of the data.
   * @param data - The raw data to be transformed.
   * 
   * @returns A structured nodeData object.
   */
    export const indexNodeType = (index) => {    
      switch (index) {   
        case "strelka":
          return "event";    
        default:
          return "event";
      }
    };