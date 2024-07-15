import React, { useEffect, useState } from "react";
import LiveSearch from "../LiveSearch";
import Image from "~/components/Image";

const DataTable = (props) => {
  const {
    name,
    data,
    columns,
    currentPage,
    numOfPage,
    onPageChange,
    onChangeItemsPerPage,
    onKeySearch,
    onSelectedRows,
  } = props;
  const [selectedRows, setSelectedRows] = useState([]);

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
            checked={selectedRows.includes(String(item.id)) ? true : false}
            className="form-check-input"
            value={item.id}
            onChange={onClickCheckbox}
          />
        </td>
        {columns.map((col, ind) => {
          return col.name !== "Thumbnail" ? (
            <td key={ind}>{col.element(item)}</td>
          ) : (
            <td key={ind}>
              <Image tableImg src={col.element(item)} />
            </td>
          );
        })}
      </tr>
    ));
  };

  const onClickCheckbox = (event) => {
    let checked = event.target.checked;
    let value = event.target.value;
    if (checked) {
      if (!selectedRows.includes(value)) {
        setSelectedRows([...selectedRows, value]);
      }
    } else {
      let index = selectedRows.indexOf(value);
      const temp = [...selectedRows];
      temp.splice(index, 1);
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
    const target = event.target;
    onChangeItemsPerPage(target.value);
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
            <label className="d-inline-flex">
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
            </label>
          </div>

          <div className="col-sm-12 col-md-6">
            <label className="d-inline-flex float-end align-items-center ">
              <LiveSearch onKeySearch={onKeySearch} />
            </label>
          </div>
        </div>
        <div className="table-responsive">
          <table
            className="table table-striped table-bordered"
            cellSpacing="0"
            width="100%"
          >
            <thead>
              <tr>
                <td>
                  <input
                    checked={
                      selectedRows.length === data.length && data.length > 0
                        ? true
                        : false
                    }
                    type="checkbox"
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

export default DataTable;
