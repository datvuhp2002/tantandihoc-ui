import React, { useEffect, useState } from "react";
import LiveSearch from "./LiveSearch";
import { Hidden } from "@mui/material";
const DataTable = (props) => {
  const {
    name,
    columns,
    data,
    onChangeTransactionType,
    onSelectedRows,
    wallet = false,
  } = props;
  const [selectedRows, setSelectedRows] = useState([]);
  useEffect(() => {
    console.log("selected rows=> ", selectedRows);
    onSelectedRows(selectedRows);
  }, [selectedRows]);
  const renderHeader = () => {
    return columns?.map((col, index) => <th key={index}>{col.name}</th>);
  };
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
        {columns.map((col, ind) => (
          <td key={ind}>{col.element(item)}</td>
        ))}
      </tr>
    ));
  };
  const onClickCheckbox = (e) => {
    let checked = e.target.checked;
    let value = e.target.value;
    if (checked) {
      if (!selectedRows.includes(value)) {
        setSelectedRows([...selectedRows, value]);
      } else {
        let index = selectedRows.indexOf(value);
        const temp = [...selectedRows];
        temp.splice(index, 1);
        setSelectedRows(temp);
      }
    }
  };
  const onSelectAll = (e) => {
    let checked = e.target.checked;
    if (checked) {
      const temp = data.map((elements) => String(elements.id));
      setSelectedRows(temp);
    } else {
      setSelectedRows([]);
    }
  };
  const onChangeOption = (e) => {
    const target = e.target;
    onChangeTransactionType(target.value);
  };
  return (
    <div
      className="card mb-4 "
      style={{ maxHeight: "65rem", overflowY: "scroll" }}
    >
      <div className="card-header">
        <i className="fas fa-table me-1">{name}</i>
      </div>
      <div className="card-body">
        <div className="row mb-3">
          <div className=" d-flex justify-content-end">
            {!wallet && (
              <label className="d-inline-flex w-25">
                <select
                  name="example_length"
                  className="form-select form-select-sm ms-1 me-1  fs-5"
                  onChange={onChangeOption}
                >
                  <option value="" defaultChecked>
                    Tất cả
                  </option>
                  <option value="Chi">Chi</option>
                  <option value="Thu">Thu</option>
                </select>
              </label>
            )}
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
              {renderHeader()}
            </tr>
          </thead>
          <tbody>{renderData()}</tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
