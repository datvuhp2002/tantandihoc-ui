import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as actions from "../../../../redux/actions";
import { Button, Modal } from "react-bootstrap";
import DataTable from "~/layout/components/Datatable";
import requestApi from "~/utils/api";
import { Link } from "react-router-dom";
import moment from "moment";
import ButtonCustom from "~/components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDeleteLeft, faRecycle } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

const UserTrash = () => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [numOfPage, setNumOfPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchString, setSearchString] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [restoreItem, setRestoreItem] = useState(null);
  const [restoreType, setRestoreType] = useState("single");
  const [deleteItem, setDeleteItem] = useState(null);
  const [deleteType, setDeleteType] = useState("single");
  const [showModal, setShowModal] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [refresh, setRefresh] = useState(Date.now());

  const columns = [
    {
      name: "ID",
      element: (row) => row.id,
    },
    {
      name: "Tên người dùng",
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
      name: "Ngày xóa",
      element: (row) => moment(row.deletedAt).format("DD/MM/YYYY"),
    },
    {
      name: "Hành động",
      element: (row) => (
        <div className="d-flex align-items-center justify-content-start">
          <ButtonCustom
            type="button"
            className="text-nowrap"
            create
            onClick={() => handleRestore(row.id)}
            leftIcon={<FontAwesomeIcon icon={faRecycle} />}
          >
            Khôi phục
          </ButtonCustom>
          <ButtonCustom
            remove
            onClick={() => handleDelete(row.id)}
            leftIcon={<FontAwesomeIcon icon={faDeleteLeft} />}
          >
            Xóa
          </ButtonCustom>
        </div>
      ),
    },
  ];

  const handleDelete = (id) => {
    setShowModalDelete(true);
    setDeleteItem(id);
    setDeleteType("single");
  };

  const handleMultiDelete = () => {
    setShowModalDelete(true);
    setDeleteType("multi");
  };

  const handleRestore = (id) => {
    setShowModal(true);
    setRestoreItem(id);
    setRestoreType("single");
  };

  const handleMultiRestore = () => {
    setShowModal(true);
    setRestoreType("multi");
  };

  const requestDelete = () => {
    if (deleteType === "single") {
      dispatch(actions.controlLoading(true));
      requestApi(`/users/force-delete/${deleteItem}`, "DELETE", [])
        .then((response) => {
          setShowModalDelete(false);
          setRefresh(Date.now());
          dispatch(actions.controlLoading(false));
        })
        .catch((err) => {
          console.log(err);
          setShowModalDelete(false);
          dispatch(actions.controlLoading(false));
        });
    } else {
      dispatch(actions.controlLoading(true));
      const ids = selectedRows.map((i) => Number(i));
      requestApi(`/users/multiple-force-delete`, "DELETE", ids)
        .then((response) => {
          setShowModalDelete(false);
          setRefresh(Date.now());
          setSelectedRows([]);
          dispatch(actions.controlLoading(false));
        })
        .catch((err) => {
          console.log(err);
          setShowModalDelete(false);
          dispatch(actions.controlLoading(false));
        });
    }
  };

  const requestRestore = () => {
    if (restoreType === "single") {
      dispatch(actions.controlLoading(true));
      requestApi(`/users/restore/${restoreItem}`, "PUT", [])
        .then((response) => {
          setShowModal(false);
          setRefresh(Date.now());
          dispatch(actions.controlLoading(false));
          toast.success("Khôi phục người dùng thành công", {
            position: "top-right",
            autoClose: 3000,
          });
        })
        .catch((err) => {
          console.log(err);
          setShowModal(false);
          dispatch(actions.controlLoading(false));
        });
    } else {
      dispatch(actions.controlLoading(true));
      const ids = selectedRows.map((i) => Number(i));
      requestApi(`/users/multiple-restore`, "PUT", ids)
        .then((response) => {
          setShowModal(false);
          setRefresh(Date.now());
          setSelectedRows([]);
          dispatch(actions.controlLoading(false));
          toast.success("Khôi phục người dùng thành công", {
            position: "top-right",
            autoClose: 3000,
          });
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
    requestApi(`/users/trash${query}`, "GET", [])
      .then((response) => {
        setUsers(response.data.data);
        setNumOfPage(response.data.lastPage);
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
          <h1 className="mt-4">Danh sách người dùng</h1>
          <ol className="breadcrumb mb-4">
            <li className="breadcrumb-item">
              <Link to="/admin/dashboard">Bảng tin</Link>
            </li>
            <li className="breadcrumb-item">Người dùng</li>
          </ol>
          <div className="mb-3 d-flex">
            {selectedRows.length > 0 && (
              <ButtonCustom
                type="button"
                create
                className="btn"
                onClick={handleMultiRestore}
                leftIcon={<FontAwesomeIcon icon={faRecycle} />}
              >
                Khôi phục
              </ButtonCustom>
            )}
            {selectedRows.length > 0 && (
              <ButtonCustom
                type="button"
                remove
                className="btn"
                onClick={handleMultiDelete}
                leftIcon={<FontAwesomeIcon icon={faDeleteLeft} />}
              >
                Xóa
              </ButtonCustom>
            )}
          </div>
          <DataTable
            name="Danh sách người dùng"
            data={users}
            columns={columns}
            numOfPage={numOfPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onChangeItemsPerPage={setItemsPerPage}
            onKeySearch={(keyword) => setSearchString(keyword)}
            onSelectedRows={(rows) => setSelectedRows(rows)}
          />
        </div>
      </main>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn có chắc chắn muốn khôi phục người dùng này?</Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowModal(false)} className="p-2 fs-5">
            Đóng
          </Button>
          <Button className="btn-success p-2 fs-5" onClick={requestRestore}>
            Khôi phục
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showModalDelete}
        onHide={() => setShowModalDelete(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Sau khi xóa người dùng này sẽ mất hoàn toàn! Bạn có chắc chắn?
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => setShowModalDelete(false)}
            className="p-2 fs-5"
          >
            Đóng
          </Button>
          <Button
            create
            className="btn-danger p-2 fs-5"
            onClick={requestDelete}
          >
            Xoá
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserTrash;
