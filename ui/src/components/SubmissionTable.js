import React, { useState, useEffect, useContext, useRef } from "react";

import { CopyToClipboard } from "react-copy-to-clipboard";
import { Table, Space, Dropdown, Menu, message } from "antd";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

import { APP_CONFIG } from "../config";
import AuthCtx from "../contexts/auth";
import { fetchWithTimeout } from "../util";
import useResize from "../providers/Resize";
import TagSet from "./TagSet";

const SubmissionTable = ({ filesUploaded, page_size }) => {
  const { handle401 } = useContext(AuthCtx);
  const [data, setData] = useState([]);

  const [minimalView, setMinimalView] = useState(false);
  const [componentWidth, setComponentWidth] = useState(1000);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: page_size ? page_size : 10,
  });

  const refElem = useRef();
  const { width } = useResize();

  useEffect(() => {
    setMinimalView(refElem?.current?.clientWidth < 1000);
    setComponentWidth(refElem?.current?.clientWidth || 1000);
  }, [width]);

  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

  let query = useQuery();
  const filterJustMine = query.get("just_mine");

  const [isLoading, setIsLoading] = useState(true);

  const fetchTableData = (params = {}) => {
    setIsLoading(true);

    let search_url = `${APP_CONFIG.BACKEND_URL}/strelka/scans?page=${params.pagination.current}&per_page=${params.pagination.pageSize}`;
    if (filterJustMine) {
      search_url = `${search_url}&just_mine=${filterJustMine}`;
    }

    fetchWithTimeout(search_url, {
      method: "GET",
      mode: "cors",
      credentials: "include",
      timeout: APP_CONFIG.API_TIMEOUT,
    })
      .then((res) => {
        if (res.status === 401) {
          handle401();
        }
        return res.json();
      })
      .then((res) => {
        setData(res.items);
        setPagination({
          current: res.page,
          pageSize: res.per_page,
          total: res.total,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchTableData({
      pagination,
    });
  }, [filesUploaded, filterJustMine]);

  const handleTableChange = (pagination, filters, sorter) => {
    fetchTableData({
      sortField: sorter.field,
      sortOrder: sorter.order,
      pagination,
      ...filters,
    });
  };

  const copyHashMenu = (record) => {
    return (
      <Menu>
        {record.hashes.map((kv) => (
          <Menu.Item data-hash={kv[1]}>
            <CopyToClipboard
              text={kv[1]}
              onCopy={() => message.success("Hash copied to clipboard!")}
            >
              <span>{kv[0]}</span>
            </CopyToClipboard>
          </Menu.Item>
        ))}
      </Menu>
    );
  };

  const copyHashes = (record) => {
    return (
      <Dropdown overlay={copyHashMenu(record)}>
        <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
          Hashes
          {/* <DownOutlined /> */}
        </a>
      </Dropdown>
    );
  };

  const columns = [
    {
      title: "Filename",
      dataIndex: "file_id",
      key: "file_id",
      width: minimalView ? componentWidth / 4 : 200,
      render: (file_id, full) => (
        <Link to={`/submissions/${file_id}`}>{full.file_name}</Link>
      ),
    },
    {
      title: "Description",
      dataIndex: "submitted_description",
      key: "submitted_description",
      width: 200,
      render: (_, full) => <p style={{"overflow-wrap": "anywhere"}}>{full.submitted_description}</p>,
    },
    {
      title: "Submitted by",
      dataIndex: "user.user_cn",
      key: "user.user_cn",
      width: minimalView ? componentWidth / 4 : 120,
      render: (_, full) => <p>{full.user?.user_cn}</p>,
    },
    {
      title: "Date of Submission",
      dataIndex: "submitted_at",
      key: "submitted_at",
      width: minimalView ? componentWidth / 4 : 200,
      render: (submitted_at, full) => {
        return submitted_at ? (
          <p>{new Date(submitted_at).toUTCString()}</p>
        ) : (
          <p></p>
        );
      },
    },
    {
      title: "MIME Types",
      dataIndex: "mime_types",
      key: "mime_types",
      width: 200,
      render: (mime_types) => <TagSet items={mime_types} />,
    },
    {
      title: "YARA Hits",
      dataIndex: "yara_hits",
      key: "yara_hits",
      width: 200,
      render: (_, record) => (
        <TagSet items={record?.strelka_response?.scan.yara?.matches} />
      ),
    },
    {
      title: "Scanners Run",
      key: "scanners_run",
      dataIndex: "scanners_run",
      width: 200,
      render: (scanners_run) => <TagSet items={scanners_run} />,
    },
    {
      title: "Action",
      key: "action",
      dataIndex: "file_id",
      key: "file_id",
      width: minimalView ? componentWidth / 4 : 200,
      render: (file_id, record) => (
        <Space size="middle">
          {copyHashes(record)}
        </Space>
      ),
    },
  ];

  let tableProps = [...columns];
  if (minimalView) {
    tableProps = [tableProps[0], tableProps[1], tableProps[2], tableProps[6]];
  }

  return (
    <div ref={refElem}>
      <Table
        size={minimalView ? "small" : "middle"}
        loading={isLoading}
        columns={tableProps}
        pagination={pagination}
        dataSource={data}
        onChange={handleTableChange}
        scroll={{ x: 600 }}
      />
    </div>
  );
};

export default SubmissionTable;
