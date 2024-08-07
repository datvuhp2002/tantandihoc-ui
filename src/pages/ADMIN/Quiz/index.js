import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as actions from "../../../redux/actions";
import { Button, Modal } from "react-bootstrap";
import DataTable from "~/layout/components/Datatable";
import ButtonCustom from "~/components/Button";
import requestApi from "~/utils/api";
import { Link, useLocation } from "react-router-dom";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

const Quiz = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [quiz, setQuiz] = useState([]);
  const [numOfPage, setNumOfPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchString, setSearchString] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [deleteItem, setDeleteItem] = useState(null);
  const [deleteType, setDeleteType] = useState("single");
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
      name: "Ngày cập nhật",
      element: (row) => moment(row.updatedAt).format("DD/MM/YYYY"),
    },
    {
      name: "Hành động",
      element: (row) => (
        <div className="d-flex align-items-center justify-content-start">
          <ButtonCustom
            view
            type="button"
            to={`quiz-answer/${row.id}`}
            className="btn btn-sm btn-primary me-1 p-3"
          >
            <span>Xem</span>
          </ButtonCustom>
          <ButtonCustom update type="button" to={`quiz-update/${row.id}`}>
            <i className="fa fa-pencil"></i> Sửa
          </ButtonCustom>
          <ButtonCustom
            type="button"
            remove
            onClick={() => handleDelete(row.id)}
          >
            <i className="fa fa-trash "></i> Xóa
          </ButtonCustom>
        </div>
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
      requestApi(`/quiz/${deleteItem}`, "DELETE", [])
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
      const ids = selectedRows.map((i) => Number(i));
      requestApi(`/quiz/multiple-soft-delete`, "DELETE", ids)
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
    requestApi(`/quiz${query}`, "GET", [])
      .then((response) => {
        console.log(response.data);
        setQuiz(response.data.data);
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
          <h1 className="mt-4">Danh sách bài tập</h1>
          <ol className="breadcrumb mb-4">
            <li className="breadcrumb-item">
              <Link to="/admin/dashboard">Bảng tin</Link>
            </li>
            <li className="breadcrumb-item">Bài tập</li>
          </ol>
          <div className="mb-3 d-flex">
            <ButtonCustom
              type="button"
              to={!hasLesson ? "quiz-add" : `quiz-add?lesson_id=${lesson}`}
              btnAdminCreate
              className="btn  me-2 fs-4"
            >
              <i className="fa fa-plus"></i> Tạo mới
            </ButtonCustom>
            <ButtonCustom
              type="button"
              remove
              to="trash"
              className="btn  me-2 fs-4"
              leftIcon={<FontAwesomeIcon icon={faTrashCan} />}
            >
              Thùng rác
            </ButtonCustom>
            {selectedRows.length > 0 && (
              <ButtonCustom
                type="button"
                className="btn"
                onClick={handleMultiDelete}
                remove
              >
                <i className="fa fa-trash"></i> Xóa
              </ButtonCustom>
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
              console.log("keyword in quiz list comp=> ", keyword);
              setSearchString(keyword);
            }}
            onSelectedRows={(rows) => {
              console.log("selected rows in quiz list=> ", rows);
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
          Nếu bạn xóa câu bài thì những câu trả lời sẽ bị xóa theo, bạn có chắc
          chắn muốn xóa bài tập này?
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowModal(false)} className="p-2 fs-5">
            Đóng
          </Button>
          <Button className="btn-danger p-2 fs-5" onClick={requestDeleteApi}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Quiz;
