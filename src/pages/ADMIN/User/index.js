import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as actions from "../../../redux/actions";
import { Button, Modal } from "react-bootstrap";
import DataTable from "~/layout/components/Datatable";
import requestApi from "~/utils/api";
import { Link } from "react-router-dom";
import moment from "moment";

const User = () => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [numOfPage, setNumOfPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchString, setSearchString] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [deleteItem, setDeleteItem] = useState(null);
  const [deleteType, setDeleteType] = useState("single");
  const [showModal, setShowModal] = useState(false);
  const [refresh, setRefresh] = useState(Date.now());

  const columns = [
    {
      name: "ID",
      element: (row) => row.id,
    },
    {
      name: "Username",
      element: (row) => row.username,
    },
    {
      name: "Email",
      element: (row) => row.email,
    },
    {
      name: "Ngày tạo",
      element: (row) => moment(row.createdAt).format("DD/MM/YYYY"),
    },
    {
      name: "Ngày cập nhật",
      element: (row) => moment(row.updatedAt).format("DD/MM/YYYY"),
    },
    {
      name: "Actions",
      element: (row) => (
        <>
          <Link
            type="button"
            to={`user-update/${row.id}`}
            className="btn btn-sm btn-warning me-1"
          >
            <i className="fa fa-pencil"></i> Edit
          </Link>
          <button
            type="button"
            className="btn btn-sm btn-danger me-1"
            onClick={() => handleDelete(row.id)}
          >
            <i className="fa fa-trash"></i> Delete
          </button>
        </>
      ),
    },
  ];

  const handleDelete = (id) => {
    console.log("single delete with id => ", id);
    setShowModal(true);
    setDeleteItem(id);
    setDeleteType("single");
  };

  const handleMultiDelete = () => {
    console.log("multi delete => ", selectedRows);
    setShowModal(true);
    setDeleteType("multi");
  };

  const requestDeleteApi = () => {
    if (deleteType === "single") {
      dispatch(actions.controlLoading(true));
      requestApi(`/users/${deleteItem}`, "DELETE", [])
        .then((response) => {
          setShowModal(false);
          setRefresh(Date.now());
          dispatch(actions.controlLoading(false));
        })
        .catch((err) => {
          console.log(err);
          setShowModal(false);
          dispatch(actions.controlLoading(false));
        });
    } else {
      dispatch(actions.controlLoading(true));
      requestApi(`/users/multiple?ids=${selectedRows.toString()}`, "DELETE", [])
        .then((response) => {
          setShowModal(false);
          setRefresh(Date.now());
          setSelectedRows([]);
          dispatch(actions.controlLoading(false));
        })
        .catch((err) => {
          console.log(err);
          setShowModal(false);
          dispatch(actions.controlLoading(false));
        });
    }
  };

  useEffect(() => {
    dispatch(actions.controlLoading(true));
    let query = `?items_per_page=${itemsPerPage}&page=${currentPage}&search=${searchString}`;
    requestApi(`/users${query}`, "GET", [])
      .then((response) => {
        console.log("response=> ", response.data);
        setUsers(response.data.data);
        setNumOfPage(response.data.lastPage);
        console.log(response.data.lastPage);
        dispatch(actions.controlLoading(false));
      })
      .catch((err) => {
        console.log(err);
        dispatch(actions.controlLoading(false));
      });
  }, [currentPage, itemsPerPage, searchString, refresh]);

  return (
    <div id="layoutSidenav_content">
      <main>
        <div className="container-fluid px-4">
          <h1 className="mt-4">Users List</h1>
          <ol className="breadcrumb mb-4">
            <li className="breadcrumb-item">
              <Link to="/admin/dashboard">Dashboard</Link>
            </li>
            <li className="breadcrumb-item">User</li>
          </ol>
          <div className="mb-3">
            <Link
              type="button"
              to="user-add"
              className="btn btn-sm btn-success me-2"
            >
              <i className="fa fa-plus"></i> Add new
            </Link>
            {selectedRows.length > 0 && (
              <button
                type="button"
                className="btn btn-sm btn-danger"
                onClick={handleMultiDelete}
              >
                <i className="fa fa-trash"></i> Delete
              </button>
            )}
          </div>
          <DataTable
            name="List Users"
            data={users}
            columns={columns}
            numOfPage={numOfPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onChangeItemsPerPage={setItemsPerPage}
            onKeySearch={(keyword) => {
              console.log("keyword in user list comp=> ", keyword);
              setSearchString(keyword);
            }}
            onSelectedRows={(rows) => {
              console.log("selected rows in uselist=> ", rows);
              setSelectedRows(rows);
            }}
          />
        </div>
      </main>
      <Modal show={showModal} onHide={() => setShowModal(false)} size="sm">
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure want to delete?</Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowModal(false)}>Close</Button>
          <Button className="btn-danger" onClick={requestDeleteApi}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default User;
