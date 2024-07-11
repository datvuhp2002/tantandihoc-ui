import React, { useEffect, useState } from "react";
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

  const renderHeaders = () => {
    return columns.map((col, index) => <th key={index}>{col.name}</th>);
  };
  const renderData = () => {
    return data.map((item, index) => (
      <tr key={index}>
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

  const renderPagination = () => {
    const pagination = [];
    const nextPage = currentPage + 1 > numOfPage ? null : currentPage + 1;
    const prevPage = currentPage - 1 < 1 ? null : currentPage - 1;
    pagination.push(
      <li key="prev" className={prevPage ? "page-item" : "page-item disabled"}>
        <button className="page-link" onClick={() => onPageChange(prevPage)}>
          &laquo;
        </button>
      </li>
    );
    for (let i = 1; i <= numOfPage; i++) {
      pagination.push(
        <li
          key={i}
          className={currentPage === i ? "page-item active" : "page-item"}
        >
          <button className="page-link" onClick={() => onPageChange(i)}>
            {i}
          </button>
        </li>
      );
    }
    pagination.push(
      <li key="next" className={nextPage ? "page-item" : "page-item disabled"}>
        <button className="page-link" onClick={() => onPageChange(nextPage)}>
          &raquo;
        </button>
      </li>
    );
    return pagination;
  };

  const onChangeOption = (event) => {
    const target = event.target;
    onChangeItemsPerPage(target.value);
  };

  const onChangeStatus = (e) => {
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
          <div className="col-sm-12 col-md-6 d-flex algin-items-center">
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
            <div className="ms-3 w-50">
              <select
                name="isPublished"
                className="form-select form-select-sm ms-1 me-1"
                value={selectedStatus}
                onChange={onChangeStatus}
              >
                <option value="all">Tất cả</option>
                <option value="1">Đã hoàn thành</option>
                <option value="0">Chưa hoàn thành</option>
              </select>
            </div>
          </div>
          <div className="col-sm-12 col-md-6">
            <label className="d-inline-flex float-end align-items-center ">
              <LiveSearch onKeySearch={onKeySearch} />
            </label>
          </div>
        </div>
        <table
          className="table table-striped table-bordered"
          cellSpacing="0"
          width="100%"
        >
          <thead>
            <tr>{renderHeaders()}</tr>
          </thead>
          <tbody>{renderData()}</tbody>
          <tfoot>
            <tr>{renderHeaders()}</tr>
          </tfoot>
        </table>
        {numOfPage > 1 && (
          <div className="row">
            <div className="col-sm-12 col-md-7">
              <ul className="pagination justify-content-end">
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
