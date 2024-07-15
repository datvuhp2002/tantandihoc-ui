import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as actions from "../../../redux/actions";
import { Button, Modal } from "react-bootstrap";
import DataTable from "~/layout/components/Datatable";
import ButtonCustom from "~/components/Button";
import requestApi from "~/utils/api";
import { Link, useLocation, useParams } from "react-router-dom";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

const CommentLesson = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const location = useLocation();
  const [comments, setComments] = useState([]);
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
      name: "Người viết",
      element: (row) => row.author.username,
    },
    {
      name: "Bài viết",
      element: (row) => row.ownership_lesson.title,
    },
    {
      name: "Bình luận",
      element: (row) => row.message,
    },

    {
      name: "Ngày viết",
      element: (row) => moment(row.createdAt).format("DD/MM/YYYY"),
    },
    {
      name: "Hành động",
      element: (row) => (
        <div className="d-flex align-items-center justify-content-start">
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
      requestApi(`/comment-lessons/${deleteItem}`, "DELETE", [])
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
      requestApi(`/comment-lessons/multiple-delete`, "DELETE", ids)
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
    let query = `?items_per_page=${itemsPerPage}&page=${currentPage}&search=${searchString}`;
    requestApi(
      `/comment-lessons/get-all-lessons-comment/${params.id}${query}`,
      "GET",
      []
    )
      .then((response) => {
        console.log(response.data);
        setComments(response.data.data);
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
          <h1 className="mt-4">Danh sách bình luận</h1>
          <ol className="breadcrumb mb-4">
            <li className="breadcrumb-item">
              <Link to="/admin/dashboard">Bảng tin</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/admin/lesson">Bài học</Link>
            </li>
            <li className="breadcrumb-item">Bình luận</li>
          </ol>
          <div className="mb-3 d-flex">
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
            data={comments}
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
        <Modal.Body>Bạn có chắc chắn muốn xóa bình luận này?</Modal.Body>
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

export default CommentLesson;
