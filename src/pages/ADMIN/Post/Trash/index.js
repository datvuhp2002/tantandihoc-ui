import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as actions from "../../../../redux/actions";
import { Button, Modal } from "react-bootstrap";
import DataTable from "~/layout/components/Datatable";
import ButtonCustom from "~/components/Button";
import requestApi from "~/utils/api";
import { Link, useLocation } from "react-router-dom";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRecycle, faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

const PostTrash = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [posts, setPosts] = useState([]);
  const [numOfPage, setNumOfPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchString, setSearchString] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [deleteItem, setDeleteItem] = useState(null);
  const [deleteType, setDeleteType] = useState("single");
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [refresh, setRefresh] = useState(Date.now());

  const columns = [
    {
      name: "ID",
      element: (row) => row.id,
    },
    {
      name: "Thumbnail",
      element: (row) => (
        <img
          src={`${process.env.REACT_APP_API_URL}/${row.thumbnail}`}
          alt="Thumbnail"
          width={50}
          height={50}
        />
      ),
    },
    {
      name: "Tiêu đề",
      element: (row) => row.title,
    },
    {
      name: "Tóm tắt",
      element: (row) => row.summary,
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
        <div className="d-flex align-items-center justify-content-end">
          <ButtonCustom
            create
            onClick={() => handleRestore(row.id)}
            leftIcon={<FontAwesomeIcon icon={faRecycle} />}
            className="text-nowrap me-2"
          >
            Khôi phục
          </ButtonCustom>
          <ButtonCustom remove onClick={() => handleDelete(row.id)}>
            <FontAwesomeIcon icon={faTrash} className="me-1" /> Xóa
          </ButtonCustom>
        </div>
      ),
    },
  ];

  const handleDelete = (id) => {
    setShowDeleteModal(true);
    setDeleteItem(id);
    setDeleteType("single");
  };

  const handleRestore = (id) => {
    setShowRestoreModal(true);
    setDeleteItem(id);
    setDeleteType("restore");
  };

  const handleMultiDelete = () => {
    setShowDeleteModal(true);
    setDeleteType("multi");
  };

  const handleMultiRestore = () => {
    setShowRestoreModal(true);
    setDeleteType("multiRestore");
  };

  const requestDeleteApi = () => {
    dispatch(actions.controlLoading(true));
    if (deleteType === "single") {
      requestApi(`/posts/force-delete/${deleteItem}`, "DELETE", [])
        .then((response) => {
          setShowDeleteModal(false);
          setRefresh(Date.now());
          toast.success("Xóa bài viết thành công", {
            position: "top-right",
            autoClose: 3000,
          });
          dispatch(actions.controlLoading(false));
        })
        .catch((err) => {
          console.log(err);
          setShowDeleteModal(false);
          dispatch(actions.controlLoading(false));
        });
    } else {
      const ids = selectedRows.map((id) => Number(id));

      requestApi(`/posts/multiple-force-delete`, "DELETE", ids)
        .then((response) => {
          setShowDeleteModal(false);
          setRefresh(Date.now());
          setSelectedRows([]);
          toast.success("Xóa bài viết thành công", {
            position: "top-right",
            autoClose: 3000,
          });
          dispatch(actions.controlLoading(false));
        })
        .catch((err) => {
          console.log(err);
          setShowDeleteModal(false);
          dispatch(actions.controlLoading(false));
        });
    }
  };

  const requestRestoreApi = () => {
    dispatch(actions.controlLoading(true));
    if (deleteType === "restore") {
      requestApi(`/posts/restore/${deleteItem}`, "PUT", [])
        .then((response) => {
          setShowRestoreModal(false);
          setRefresh(Date.now());
          toast.success("Khôi phục bài viết thành công", {
            position: "top-right",
            autoClose: 3000,
          });
          dispatch(actions.controlLoading(false));
        })
        .catch((err) => {
          console.log(err);
          setShowRestoreModal(false);
          dispatch(actions.controlLoading(false));
        });
    } else {
      const ids = selectedRows.map((id) => Number(id));

      requestApi(`/posts/multiple-restore`, "PUT", ids)
        .then((response) => {
          setShowRestoreModal(false);
          setRefresh(Date.now());
          setSelectedRows([]);
          toast.success("Khôi phục bài viết thành công", {
            position: "top-right",
            autoClose: 3000,
          });
          dispatch(actions.controlLoading(false));
        })
        .catch((err) => {
          console.log(err);
          setShowRestoreModal(false);
          dispatch(actions.controlLoading(false));
        });
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const category = searchParams.get("category");
    dispatch(actions.controlLoading(true));
    let query = `?items_per_page=${itemsPerPage}&page=${currentPage}&search=${searchString}&category_id=${category}`;
    requestApi(`/posts/trash${query}`, "GET", [])
      .then((response) => {
        setPosts(response.data.data);
        setNumOfPage(response.data.lastPage);
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
          <h1 className="mt-4">Thùng rác bài viết</h1>
          <ol className="breadcrumb mb-4">
            <li className="breadcrumb-item">
              <Link to="/admin/dashboard">Bảng tin</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/admin/post">Bài viết</Link>
            </li>
            <li className="breadcrumb-item">Thùng rác</li>
          </ol>
          <div className="mb-3 d-flex">
            {selectedRows.length > 0 && (
              <>
                <ButtonCustom
                  type="button"
                  create
                  className="btn btn-sm btn-success me-2"
                  onClick={handleMultiRestore}
                >
                  <FontAwesomeIcon icon={faRecycle} className="me-1" /> Khôi
                  phục
                </ButtonCustom>
                <ButtonCustom
                  type="button"
                  remove
                  className="btn btn-sm btn-danger"
                  onClick={handleMultiDelete}
                >
                  <FontAwesomeIcon icon={faTrash} className="me-1" /> Xóa
                </ButtonCustom>
              </>
            )}
          </div>
          <DataTable
            name="Danh sách bài viết"
            data={posts}
            columns={columns}
            numOfPage={numOfPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onChangeItemsPerPage={setItemsPerPage}
            onKeySearch={(keyword) => {
              setSearchString(keyword);
            }}
            onSelectedRows={(rows) => {
              setSelectedRows(rows);
            }}
          />
        </div>
      </main>
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn có chắc chắn muốn xóa bài viết này?</Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => setShowDeleteModal(false)}
            className="p-2 fs-5"
          >
            Đóng
          </Button>
          <Button className="p-2 fs-5 btn-danger" onClick={requestDeleteApi}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showRestoreModal}
        onHide={() => setShowRestoreModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn có chắc chắn muốn khôi phục bài viết này?</Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => setShowRestoreModal(false)}
            className="p-2 fs-5"
          >
            Đóng
          </Button>
          <Button className="p-2 fs-5 btn-success" onClick={requestRestoreApi}>
            Khôi phục
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PostTrash;
