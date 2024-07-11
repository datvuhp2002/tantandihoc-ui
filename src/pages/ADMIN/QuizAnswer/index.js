import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as actions from "../../../redux/actions";
import { Button, Modal } from "react-bootstrap";
import DataTable from "~/layout/components/Datatable";
import ButtonCustom from "~/components/Button";
import requestApi from "~/utils/api";
import { Link, useParams } from "react-router-dom";
import moment from "moment";

const QuizAnswer = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const [quizAnswer, setQuizAnswer] = useState([]);
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
      name: "Câu hỏi",
      element: (row) => row.ownership_quiz.question,
    },
    {
      name: "Câu trả lời",
      element: (row) => row.answer,
    },
    {
      name: "Đáp án",
      element: (row) => (row.correct ? "Đúng" : "Sai"),
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
        <div className="d-flex align-items-center justify-content-start align-items-center">
          <ButtonCustom
            update
            type="button"
            to={`/admin/quiz/quiz-answer/update/${row.id}`}
          >
            <i className="fa fa-pencil"></i> Sửa
          </ButtonCustom>
          <ButtonCustom
            remove
            type="button"
            onClick={() => handleDelete(row.id)}
          >
            <i className="fa fa-trash "></i> <span className="">Xóa</span>
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
      requestApi(`/quizAnswer/${deleteItem}`, "DELETE", [])
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
      requestApi(
        `/quizAnswer/multiple?ids=${selectedRows.toString()}`,
        "DELETE",
        []
      )
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
    requestApi(`/quiz-answer/getAllAnswerInQuiz/${params.id}`, "GET")
      .then((response) => {
        console.log(response.data);
        setQuizAnswer(response.data);
        console.log(response.data.lastPage);
        dispatch(actions.controlLoading(false));
      })
      .catch((err) => {
        console.log(err);
        dispatch(actions.controlLoading(false));
      });
  }, [refresh]);

  return (
    <div id="layoutSidenav_content">
      <main>
        <div className="container-fluid px-4">
          <h1 className="mt-4">Danh sách câu trả lời</h1>
          <ol className="breadcrumb mb-4">
            <li className="breadcrumb-item">
              <Link to="/admin/dashboard">Bảng tin</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/admin/quiz">Câu hỏi</Link>
            </li>
            <li className="breadcrumb-item">Câu trả lời</li>
          </ol>
          <div className="mb-3 d-flex">
            <ButtonCustom
              type="button"
              to={`/admin/quiz/quiz-answer/add/${params.id}`}
              btnAdminCreate
              className="btn  me-2 fs-4"
            >
              <i className="fa fa-plus"></i> Tạo mới
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
            name="Danh sách câu trả lời"
            data={quizAnswer}
            columns={columns}
            onKeySearch={(keyword) => {
              console.log("keyword in quizAnswer list comp=> ", keyword);
            }}
            onSelectedRows={(rows) => {
              console.log("selected rows in quizAnswer list=> ", rows);
              setSelectedRows(rows);
            }}
          />
        </div>
      </main>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn có chắc chắn muốn xóa câu trả lời?</Modal.Body>
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

export default QuizAnswer;
