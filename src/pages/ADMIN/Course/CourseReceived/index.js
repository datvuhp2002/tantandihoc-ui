import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as actions from "~/redux/actions";
import { Button, Modal } from "react-bootstrap";
import DataTable from "~/layout/components/Datatable";
import ButtonCustom from "~/components/Button";
import requestApi from "~/utils/api";
import { Link, useParams } from "react-router-dom";
import moment from "moment";

const CourseReceived = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const [data, setData] = useState([]);
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
      name: "Tên",
      element: (row) => row.name,
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
        <div className="d-flex align-items-center justify-content-end">
          <ButtonCustom type="button" update to={`lesson-update/${row.id}`}>
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
    let query = `?items_per_page=${itemsPerPage}&page=${currentPage}&search=${searchString}&course_id=${courseId}&sort=decs`;
    requestApi(`/course-received/${params.id}${query}`, "GET", [])
      .then((response) => {
        setData(response.data.data);
        setNumOfPage(response.data.lastPage);
        console.log(response.data);
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
            to={`/admin/course/course-received-add/${params.id}`}
            btnAdminCreate
            className="btn me-2 fs-4"
          >
            <i className="fa fa-plus"></i> Tạo mới
          </ButtonCustom>
          {selectedRows.length > 0 && (
            <ButtonCustom
              type="button"
              remove
              className="btn"
              onClick={handleMultiDelete}
            >
              <i className="fa fa-trash"></i> Xóa
            </ButtonCustom>
          )}
        </div>
        <DataTable
          name="Danh sách lợi ích của khóa học"
          data={data}
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
      </main>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn có muốn xóa mục này?</Modal.Body>
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

export default CourseReceived;
