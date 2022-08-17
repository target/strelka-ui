import React from "react";

import PageWrapper from "../components/PageWrapper";
import Dropzone from "../components/Dropzone";

const UploadPage = (props) => {
  return (
    <PageWrapper
      title="Submit Files"
      subtitle="Upload files for Strelka analysis."
    >
      <div className="site-layout-content">
        <Dropzone height="calc(100vh - 500px)" />
      </div>
    </PageWrapper>
  );
};

export default UploadPage;
