import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as actions from "~/redux/actions";
import { Button, Modal } from "react-bootstrap";
import DataTable from "~/layout/components/Datatable";
import ButtonCustom from "~/components/Button";
import requestApi from "~/utils/api";
import { Link, useParams } from "react-router-dom";
import moment from "moment";

const LessonFromCourse = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const [lessons, setLessons] = useState([]);
  const [numOfPage, setNumOfPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchString, setSearchString] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [deleteItem, setDeleteItem] = useState(null);
  const [deleteType, setDeleteType] = useState("single");
  const [showModal, setShowModal] = useState(false);
  const [refresh, setRefresh] = useState(Date.now());
  const [courseId, setCourseId] = useState("");
  const columns = [
    {
      name: "ID",
      element: (row) => row.id,
    },
    {
      name: "Course",
      element: (row) => row.ownership_course.name,
    },
    {
      name: "Title",
      element: (row) => row.title,
    },

    {
      name: "Status",
      element: (row) => row.status,
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
        <div className="d-flex align-items-center justify-content-end">
          <ButtonCustom
            type="button"
            update
            to={`/admin/lesson/lesson-update/${row.id}`}
          >
            <i className="fa fa-pencil"></i> Sửa
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
      requestApi(`/lessons/${deleteItem}`, "DELETE", [])
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
        `/lessons/multiple?ids=${selectedRows.toString()}`,
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
    let query = `?items_per_page=${itemsPerPage}&page=${currentPage}&search=${searchString}&course_id=${courseId}`;
    requestApi(`/lessons${query}`, "GET", [])
      .then((response) => {
        setLessons(response.data.data);
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
        <div className="mb-3 d-flex">
          <ButtonCustom
            type="button"
            to={`/admin/lesson/lesson-add/no-vid?course_id=${params.id}`}
            btnAdminCreate
            className="btn me-2 fs-4"
          >
            <i className="fa fa-plus"></i> Tạo mới
          </ButtonCustom>
          {selectedRows.length > 0 && (
            <ButtonCustom
              type="button"
              className="btn btn-sm btn-danger"
              onClick={handleMultiDelete}
            >
              <i className="fa fa-trash"></i> Delete
            </ButtonCustom>
          )}
        </div>
        <DataTable
          name="Danh sách bài học"
          data={lessons}
          columns={columns}
          numOfPage={numOfPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onChangeItemsPerPage={setItemsPerPage}
          onKeySearch={(keyword) => {
            console.log("keyword in courses list comp=> ", keyword);
            setSearchString(keyword);
          }}
          onSelectedRows={(rows) => {
            console.log("selected rows in courses list=> ", rows);
            setSelectedRows(rows);
          }}
        />
      </main>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn có chắc là muốn xóa bài học này?</Modal.Body>
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

export default LessonFromCourse;
