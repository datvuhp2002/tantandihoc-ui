import React, { useState, useEffect } from "react";
import LiveSearch from "../LiveSearch";
import Image from "~/components/Image";
import { useNavigate, useLocation } from "react-router-dom";

const DatatableTransaction = (props) => {
  const {
    name,
    selectedStatus,
    data,
    columns,
    currentPage,
    numOfPage,
    onPageChange,
    onChangeItemsPerPage,
    onKeySearch,
  } = props;

  const [selectedRows, setSelectedRows] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Effect to handle selectedRows change
    console.log("Selected Rows:", selectedRows);
  }, [selectedRows]);

  const renderHeaders = () => {
    return columns.map((col, index) => <th key={index}>{col.name}</th>);
  };

  const renderData = () => {
    return data.map((item, index) => (
      <tr key={index}>
        <td>
          <input
            type="checkbox"
            checked={selectedRows.includes(item.id)}
            onChange={(e) => handleCheckboxChange(e, item.id)}
          />
        </td>
        {columns.map((col, ind) => (
          <td key={ind}>
            {col.name !== "Thumbnail" ? (
              col.element(item)
            ) : (
              <Image tableImg src={col.element(item)} />
            )}
          </td>
        ))}
      </tr>
    ));
  };

  const handleCheckboxChange = (e, itemId) => {
    const checked = e.target.checked;
    if (checked) {
      setSelectedRows([...selectedRows, itemId]);
    } else {
      setSelectedRows(selectedRows.filter((id) => id !== itemId));
    }
  };

  const renderPagination = () => {
    const pagination = [];
    const prevPage = currentPage > 1 ? currentPage - 1 : null;
    const nextPage = currentPage < numOfPage ? currentPage + 1 : null;
    const maxVisiblePages = 5; // Số lượng trang tối đa hiển thị

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(numOfPage, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    pagination.push(
      <li
        key="prev"
        className={`page-item ${prevPage ? "" : "disabled"}`}
        style={{ display: "inline-block", margin: "0 5px" }}
      >
        <button
          className="page-link"
          onClick={() => onPageChange(prevPage)}
          disabled={!prevPage}
        >
          &laquo; Prev
        </button>
      </li>
    );

    if (startPage > 1) {
      pagination.push(
        <li key="ellipsis-prev" className="page-item disabled">
          <span className="page-link">...</span>
        </li>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      pagination.push(
        <li
          key={i}
          className={`page-item ${currentPage === i ? "active" : ""}`}
          style={{ display: "inline-block", margin: "0 5px" }}
        >
          <button className="page-link" onClick={() => onPageChange(i)}>
            {i}
          </button>
        </li>
      );
    }

    if (endPage < numOfPage) {
      pagination.push(
        <li key="ellipsis-next" className="page-item disabled">
          <span className="page-link">...</span>
        </li>
      );
    }

    pagination.push(
      <li
        key="next"
        className={`page-item ${nextPage ? "" : "disabled"}`}
        style={{ display: "inline-block", margin: "0 5px" }}
      >
        <button
          className="page-link"
          onClick={() => onPageChange(nextPage)}
          disabled={!nextPage}
        >
          Next &raquo;
        </button>
      </li>
    );

    return (
      <div className="pagination-wrapper">
        <ul className="pagination">{pagination}</ul>
      </div>
    );
  };

  const handleChangeItemsPerPage = (e) => {
    onChangeItemsPerPage(e.target.value);
  };

  const handleChangeStatus = (e) => {
    const target = e.target.value;
    const params = new URLSearchParams(location.search);
    if (target === "all") {
      params.delete("status");
    } else {
      params.set("status", target);
    }
    navigate({ search: params.toString() });
  };

  return (
    <div className="card mb-4">
      <div className="card-header">
        <i className="fas fa-table me-1"></i>
        {name}
      </div>
      <div className="card-body">
        <div className="row mb-3">
          <div className="col-sm-12 col-md-6 d-flex align-items-center">
            <div className="me-3">
              <select
                name="itemsPerPage"
                className="form-select form-select-sm"
                onChange={handleChangeItemsPerPage}
              >
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
                <option value="25">25</option>
                <option value="30">30</option>
              </select>
            </div>
            <div>
              <select
                name="status"
                className="form-select form-select-sm"
                value={selectedStatus}
                onChange={handleChangeStatus}
              >
                <option value="all">Tất cả</option>
                <option value="1">Đã hoàn thành</option>
                <option value="0">Chưa hoàn thành</option>
              </select>
            </div>
          </div>
          <div className="col-sm-12 col-md-6">
            <LiveSearch onKeySearch={onKeySearch} />
          </div>
        </div>
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={
                      selectedRows.length === data.length && data.length > 0
                    }
                    onChange={(e) =>
                      e.target.checked
                        ? setSelectedRows(data.map((item) => item.id))
                        : setSelectedRows([])
                    }
                  />
                </th>
                {renderHeaders()}
              </tr>
            </thead>
            <tbody>{renderData()}</tbody>
            <tfoot>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={
                      selectedRows.length === data.length && data.length > 0
                    }
                    onChange={(e) =>
                      e.target.checked
                        ? setSelectedRows(data.map((item) => item.id))
                        : setSelectedRows([])
                    }
                  />
                </th>
                {renderHeaders()}
              </tr>
            </tfoot>
          </table>
        </div>
        {numOfPage > 1 && (
          <div className="row">
            <div className="col-sm-12 col-md-7">
              <ul className="pagination justify-content-end mt-2">
                {renderPagination()}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatatableTransaction;
