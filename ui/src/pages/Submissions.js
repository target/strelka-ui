import React from "react";

import PageWrapper from "../components/PageWrapper";
import SubmissionTable from "../components/SubmissionTable";

const SubmissionsPage = (props) => {
  return (
    <PageWrapper
      title="File Submissions"
      subtitle="All files submitted and scanned by Strelka though this UI can be found here."
    >
      <div className="site-layout-content">
        <SubmissionTable />
      </div>
    </PageWrapper>
  );
};

export default SubmissionsPage;
