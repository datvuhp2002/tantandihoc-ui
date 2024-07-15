import React, { useEffect, useState } from "react";
import LiveSearch from "../LiveSearch";
import Image from "~/components/Image";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useNavigate, useLocation } from "react-router-dom";

const DatatablePost = (props) => {
  const {
    name,
    categories,
    data,
    selectedCategory,
    setSelectedCategory,
    selectedPublished,
    setSelectedPublished,
    columns,
    currentPage,
    numOfPage,
    onPageChange,
    onChangeItemsPerPage,
    onKeySearch,
    onSelectedRows,
  } = props;
  const [selectedRows, setSelectedRows] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const renderHeaders = () => {
    return columns.map((col, index) => <th key={index}>{col.name}</th>);
  };

  useEffect(() => {
    onSelectedRows(selectedRows);
  }, [selectedRows]);

  const renderData = () => {
    return data.map((item, index) => (
      <tr key={index}>
        <td>
          <input
            type="checkbox"
            checked={selectedRows.includes(String(item.id))}
            className="form-check-input"
            onChange={onClickCheckbox}
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

  const onClickCheckbox = (event) => {
    const checked = event.target.checked;
    const value = event.target.value;

    if (checked) {
      if (!selectedRows.includes(value)) {
        setSelectedRows([...selectedRows, value]);
      }
    } else {
      const temp = selectedRows.filter((row) => row !== value);
      setSelectedRows(temp);
    }
  };

  const onSelectAll = (event) => {
    if (event.target.checked) {
      const temp = data.map((element) => String(element.id));
      setSelectedRows(temp);
    } else {
      setSelectedRows([]);
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
  const onChangeOption = (event) => {
    onChangeItemsPerPage(event.target.value);
  };

  const onChangeIsPublished = (e) => {
    const target = e.target.value;
    const params = new URLSearchParams(location.search);

    if (target === "all") {
      params.delete("isPublished");
    } else {
      params.set("isPublished", target);
    }

    navigate({ search: params.toString() });
  };

  const updateQueryCategoryParams = (category) => {
    const params = new URLSearchParams(location.search);

    if (category) {
      params.set("category", category.id);
    } else {
      params.delete("category");
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
          <div className="col-sm-12 col-md-6">
            <div className="d-flex align-items-center">
              <div>
                <select
                  name="example_length"
                  className="form-select form-select-sm ms-1 me-1"
                  onChange={onChangeOption}
                >
                  <option value="10">10</option>
                  <option value="15">15</option>
                  <option value="20">20</option>
                  <option value="25">25</option>
                  <option value="30">30</option>
                </select>
              </div>
              <div className="ms-3 flex-grow-1">
                <Autocomplete
                  options={categories}
                  getOptionLabel={(option) => option.name}
                  value={selectedCategory}
                  onChange={(event, value) => {
                    setSelectedCategory(value);
                    updateQueryCategoryParams(value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Thể loại"
                    />
                  )}
                />
              </div>
              <div className="ms-3">
                <select
                  name="isPublished"
                  className="form-select form-select-sm ms-1 me-1"
                  value={selectedPublished}
                  onChange={onChangeIsPublished}
                >
                  <option value="all">Tất cả</option>
                  <option value="true">Đã được duyệt</option>
                  <option value="false">Chưa được duyệt</option>
                </select>
              </div>
            </div>
          </div>
          <div className="col-sm-12 col-md-6">
            <label className="d-inline-flex float-end align-items-center">
              <LiveSearch onKeySearch={onKeySearch} />
            </label>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table table-striped table-bordered" width="100%">
            <thead>
              <tr>
                <td>
                  <input
                    type="checkbox"
                    checked={
                      selectedRows.length === data.length && data.length > 0
                    }
                    className="form-check-input"
                    onChange={onSelectAll}
                  />
                </td>
                {renderHeaders()}
              </tr>
            </thead>
            <tbody>{renderData()}</tbody>
            <tfoot>
              <tr>
                <td></td>
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

export default DatatablePost;
