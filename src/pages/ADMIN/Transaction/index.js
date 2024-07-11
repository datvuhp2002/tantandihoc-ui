import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as actions from "../../../redux/actions";
import { Button, Modal } from "react-bootstrap";
import DataTable from "~/layout/components/Datatable";
import ButtonCustom from "~/components/Button";
import requestApi from "~/utils/api";
import { Link, useLocation } from "react-router-dom";
import moment from "moment";
import formatPrice from "~/utils/formatPrice";
import DatatableTransaction from "~/layout/components/DatatableTransaction";

const Transaction = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [transaction, setTransaction] = useState([]);
  const [numOfPage, setNumOfPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchString, setSearchString] = useState("");
  const [refresh, setRefresh] = useState(Date.now());
  const [selectedStatus, setSelectedStatus] = useState();
  const columns = [
    {
      name: "ID",
      element: (row) => row.id,
    },
    {
      name: "Tên",
      element: (row) => row.name,
    },
    {
      name: "Số tiền",
      element: (row) => formatPrice(row.amount),
    },
    {
      name: "Trạng thái",
      element: (row) =>
        row.status === 0 ? "Chưa thanh toán" : "Đã thanh toán",
    },
    {
      name: "Ngày tạo",
      element: (row) => moment(row.createdAt).format("DD/MM/YYYY"),
    },
    {
      name: "Ngày cập nhật",
      element: (row) => moment(row.updatedAt).format("DD/MM/YYYY"),
    },
  ];

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const status = searchParams.get("status");
    if (status) {
      setSelectedStatus(status);
      if (status === "0") {
        setSelectedStatus(0);
      }
      if (status === "1") {
        setSelectedStatus(1);
      }
    } else {
      setSelectedStatus("all");
    }
    dispatch(actions.controlLoading(true));
    let query = `?items_per_page=${itemsPerPage}&page=${currentPage}&search=${searchString}&status=${Number(
      status
    )}`;
    requestApi(`/transaction${query}`, "GET", [])
      .then((response) => {
        setTransaction(response.data.data);
        setNumOfPage(response.data.lastPage);
        console.log(response.data.lastPage);
        dispatch(actions.controlLoading(false));
      })
      .catch((err) => {
        console.log(err);
        dispatch(actions.controlLoading(false));
      });
  }, [currentPage, itemsPerPage, searchString, refresh, location.search]);

  return (
    <div id="layoutSidenav_content">
      <main>
        <div className="container-fluid px-4">
          <h1 className="mt-4">Danh sách giao dịch</h1>
          <ol className="breadcrumb mb-4">
            <li className="breadcrumb-item">
              <Link to="/admin/dashboard">Bảng tin</Link>
            </li>
            <li className="breadcrumb-item">Danh sách giao dịch</li>
          </ol>

          <DatatableTransaction
            name="Danh sách giao dịch"
            data={transaction}
            columns={columns}
            numOfPage={numOfPage}
            selectedStatus={selectedStatus}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onChangeItemsPerPage={setItemsPerPage}
            onKeySearch={(keyword) => {
              setSearchString(keyword);
            }}
          />
        </div>
      </main>
    </div>
  );
};

export default Transaction;
