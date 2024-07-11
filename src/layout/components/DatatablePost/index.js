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
              <Autocomplete
                options={categories}
                getOptionLabel={(option) => option.name}
                value={selectedCategory}
                onChange={(event, value) => {
                  setSelectedCategory(value);
                  updateQueryCategoryParams(value);
                }}
                renderInput={(params) => (
                  <TextField {...params} variant="outlined" label="Thể loại" />
                )}
              />
            </div>
            <div className="ms-3 w-50">
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

export default DatatablePost;
