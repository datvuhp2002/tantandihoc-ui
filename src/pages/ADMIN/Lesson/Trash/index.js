import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as actions from "../../../../redux/actions";
import { Button, Modal } from "react-bootstrap";
import DataTable from "~/layout/components/Datatable";
import ButtonCustom from "~/components/Button";
import requestApi from "~/utils/api";
import { Link } from "react-router-dom";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRecycle, faTrash } from "@fortawesome/free-solid-svg-icons";

const LessonTrash = () => {
  const dispatch = useDispatch();
  const [lessons, setLessons] = useState([]);
  const [numOfPage, setNumOfPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchString, setSearchString] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [actionItem, setActionItem] = useState(null);
  const [actionType, setActionType] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [refresh, setRefresh] = useState(Date.now());
  const [courseId, setCourseId] = useState("");

  const columns = [
    {
      name: "ID",
      element: (row) => row.id,
    },
    {
      name: "Khóa học",
      element: (row) => row.ownership_course.name,
    },
    {
      name: "Tiêu đề",
      element: (row) => row.title,
    },
    {
      name: "Trạng thái",
      element: (row) => row.status,
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
            create
            type="button"
            onClick={() => handleRestore(row.id)}
            leftIcon={<FontAwesomeIcon icon={faRecycle} />}
          >
            Khôi phục
          </ButtonCustom>
          <ButtonCustom
            type="button"
            remove
            onClick={() => handleDelete(row.id)}
          >
            <i className="fa fa-trash "></i> <span className="fs-4">Xóa</span>
          </ButtonCustom>
        </div>
      ),
    },
  ];

  const handleDelete = (id) => {
    setShowModal(true);
    setActionItem(id);
    setActionType("delete");
  };

  const handleRestore = (id) => {
    setShowModal(true);
    setActionItem(id);
    setActionType("restore");
  };

  const handleMultiDelete = () => {
    setShowModal(true);
    setActionType("multiDelete");
  };

  const handleMultiRestore = () => {
    setShowModal(true);
    setActionType("multiRestore");
  };

  const requestApiAction = () => {
    let apiEndpoint = "";
    let method = "";
    const ids = selectedRows.map((i) => Number(i));
    if (actionType === "delete") {
      apiEndpoint = `/lessons/force-delete/${actionItem}`;
      method = "DELETE";
    } else if (actionType === "restore") {
      apiEndpoint = `/lessons/restore/${actionItem}`;
      method = "PUT";
    } else if (actionType === "multiDelete") {
      apiEndpoint = `/lessons/multiple-force-delete`;
      method = "DELETE";
    } else if (actionType === "multiRestore") {
      apiEndpoint = `/lessons/multiple-restore`;
      method = "PUT";
    }
    if (apiEndpoint && method) {
      dispatch(actions.controlLoading(true));
      requestApi(apiEndpoint, method, ids)
        .then((response) => {
          setShowModal(false);
          setRefresh(Date.now());
          if (actionType === "multiDelete" || actionType === "multiRestore") {
            setSelectedRows([]);
          }
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
    let query = `?items_per_page=${itemsPerPage}&page=${currentPage}&search=${searchString}&course_id=${courseId}`;
    requestApi(`/lessons/trash${query}`, "GET", [])
      .then((response) => {
        setLessons(response.data.data);
        setNumOfPage(response.data.lastPage);
        dispatch(actions.controlLoading(false));
      })
      .catch((err) => {
        console.log(err);
        dispatch(actions.controlLoading(false));
      });
  }, [currentPage, itemsPerPage, searchString, refresh, courseId]);

  return (
    <div id="layoutSidenav_content">
      <main>
        <div className="container-fluid px-4">
          <h1 className="mt-4">Thùng rác bài học</h1>
          <ol className="breadcrumb mb-4">
            <li className="breadcrumb-item">
              <Link to="/admin/dashboard">Bảng tin</Link>
            </li>
            <li className="breadcrumb-item">Thùng rác bài học</li>
          </ol>
          <div className="mb-3 d-flex">
            {selectedRows.length > 0 && (
              <>
                <ButtonCustom
                  type="button"
                  remove
                  className="btn btn-sm btn-danger me-2"
                  onClick={handleMultiDelete}
                >
                  <i className="fa fa-trash"></i> Xóa
                </ButtonCustom>
                <ButtonCustom
                  type="button"
                  create
                  className="btn btn-sm btn-success"
                  onClick={handleMultiRestore}
                >
                  <i className="fa fa-recycle"></i> Khôi phục
                </ButtonCustom>
              </>
            )}
          </div>
          <DataTable
            name="Thùng rác bài học"
            data={lessons}
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
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {actionType === "restore" || actionType === "multiRestore"
            ? "Bạn có chắc muốn khôi phục bài học này?"
            : "Bạn có chắc muốn xóa bài học này?"}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowModal(false)} className="p-2 fs-5">
            Đóng
          </Button>
          <Button
            className={
              actionType === "restore" || actionType === "multiRestore"
                ? "btn-success p-2 fs-5"
                : "btn-danger p-2 fs-5"
            }
            onClick={requestApiAction}
          >
            {actionType === "restore" || actionType === "multiRestore"
              ? "Khôi phục"
              : "Xóa"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LessonTrash;
