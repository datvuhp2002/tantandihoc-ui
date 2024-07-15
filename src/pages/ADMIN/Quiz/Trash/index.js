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
import { faRecycle, faTrashCan } from "@fortawesome/free-solid-svg-icons";

const QuizTrash = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [quiz, setQuiz] = useState([]);
  const [numOfPage, setNumOfPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchString, setSearchString] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [actionItem, setActionItem] = useState(null);
  const [actionType, setActionType] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [refresh, setRefresh] = useState(Date.now());
  const [hasLesson, setHasLesson] = useState(false);
  const [lesson, setLesson] = useState();

  const columns = [
    {
      name: "ID",
      element: (row) => row.id,
    },
    {
      name: "Bài học",
      element: (row) => row.ownership_Lesson.title,
    },
    {
      name: "Câu hỏi",
      element: (row) => row.question,
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
            leftIcon={<FontAwesomeIcon icon={faRecycle} />}
            type="button"
            onClick={() => handleRestore(row.id)}
          >
            Khôi phục
          </ButtonCustom>
          <ButtonCustom
            type="button"
            remove
            onClick={() => handleDelete(row.id)}
          >
            <i className="fa fa-trash"></i> Xóa
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
      apiEndpoint = `/quiz/force-delete/${actionItem}`;
      method = "DELETE";
    } else if (actionType === "restore") {
      apiEndpoint = `/quiz/restore/${actionItem}`;
      method = "PUT";
    } else if (actionType === "multiDelete") {
      apiEndpoint = `/quiz/multiple-force-delete`;
      method = "DELETE";
    } else if (actionType === "multiRestore") {
      apiEndpoint = `/quiz/multiple-restore`;
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
    const searchParams = new URLSearchParams(location.search);
    const lesson = searchParams.get("lesson");
    if (lesson) {
      setHasLesson(true);
      setLesson(lesson);
    } else {
      setHasLesson(false);
    }
    dispatch(actions.controlLoading(true));
    let query = `?items_per_page=${itemsPerPage}&page=${currentPage}&search=${searchString}&lesson_id=${lesson}`;
    requestApi(`/quiz/trash${query}`, "GET", [])
      .then((response) => {
        setQuiz(response.data.data);
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
          <h1 className="mt-4">Thùng rác bài tập</h1>
          <ol className="breadcrumb mb-4">
            <li className="breadcrumb-item">
              <Link to="/admin/dashboard">Bảng tin</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/admin/quiz">Bài tập</Link>
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
                  <i className="fa fa-recycle"></i> Khôi phục
                </ButtonCustom>
                <ButtonCustom
                  type="button"
                  remove
                  className="btn btn-sm btn-danger"
                  onClick={handleMultiDelete}
                >
                  <i className="fa fa-trash"></i> Xóa
                </ButtonCustom>
              </>
            )}
          </div>
          <DataTable
            name="Danh sách câu hỏi"
            data={quiz}
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
            ? "Bạn có chắc muốn khôi phục bài tập này?"
            : "Nếu bạn xóa câu bài thì những câu trả lời sẽ bị xóa theo, bạn có chắc chắn muốn xóa bài tập này?"}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowModal(false)} className="p-2 fs-5">
            Đóng
          </Button>
          <Button
            className={`p-2 fs-5 ${
              actionType === "restore" || actionType === "multiRestore"
                ? "btn-success"
                : "btn-danger"
            }`}
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

export default QuizTrash;
