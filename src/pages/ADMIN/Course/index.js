import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as actions from "../../../redux/actions";
import { Button, Modal } from "react-bootstrap";
import DataTable from "~/layout/components/Datatable";
import ButtonCustom from "~/components/Button";
import requestApi from "~/utils/api";
import { Link, useLocation } from "react-router-dom";
import moment from "moment";
import calPrice from "~/utils/calPrice";
import formatPrice from "~/utils/formatPrice";
import DataTableCourse from "~/layout/components/DatatableCourse";
const Course = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [numOfPage, setNumOfPage] = useState(1);
  const [discount, setDiscount] = useState();
  const [category, setCategory] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchString, setSearchString] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [deleteItem, setDeleteItem] = useState(null);
  const [deleteType, setDeleteType] = useState("single");
  const [showModal, setShowModal] = useState(false);
  const [refresh, setRefresh] = useState(Date.now());
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [discountData, setDiscountData] = useState([]);
  const [selectedDiscount, setSelectedDiscount] = useState(null);

  const columns = [
    {
      name: "ID",
      element: (row) => row.id,
    },
    {
      name: "Thumbnail",
      element: (row) => `${process.env.REACT_APP_API_URL}/${row.thumbnail}`,
    },
    {
      name: "Tên",
      element: (row) => row.name,
    },
    {
      name: "Miêu tả",
      element: (row) => row.description,
    },
    {
      name: "Giá khóa học",
      element: (row) => formatPrice(row.price),
    },
    {
      name: "Giá cuối",
      element: (row) =>
        formatPrice(calPrice(row.price, row.ownership_discount)),
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
        <div className="d-flex align-items-center justify-content-start h-100">
          <ButtonCustom type="button" to={`view/${row.id}`} view>
            Xem
          </ButtonCustom>
          <ButtonCustom type="button" to={`course-update/${row.id}`} update>
            <i className="fa fa-pencil"></i> Sửa
          </ButtonCustom>
          <ButtonCustom
            remove
            type="button"
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
      requestApi(`/courses/${deleteItem}`, "DELETE", [])
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
        `/courses/multiple?ids=${selectedRows.toString()}`,
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
    const searchParams = new URLSearchParams(location.search);
    const discount = searchParams.get("discount");
    setDiscount(discount);
    const category = searchParams.get("category");
    setCategory(category);
    dispatch(actions.controlLoading(true));
    let query = `?items_per_page=${itemsPerPage}&page=${currentPage}&search=${searchString}&discount=${discount}&category=${category}`;
    requestApi(`/courses${query}`, "GET", [])
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
    requestApi("/categories?items_per_page=All", "GET")
      .then((res) => {
        setCategories(res.data.data);
        if (category) {
          setSelectedCategory(
            res.data.data.find((item) => String(item.id) === category)
          );
        } else {
          setSelectedCategory(null);
        }
        dispatch(actions.controlLoading(false));
      })
      .catch((err) => {
        console.error(err);
        dispatch(actions.controlLoading(false));
      });
    requestApi("/discount?items_per_page=All", "GET")
      .then((res) => {
        setDiscountData(res.data.data);
        if (discount) {
          setSelectedDiscount(
            res.data.data.find((item) => String(item.id) === discount)
          );
        } else {
          setSelectedDiscount(null);
        }
        dispatch(actions.controlLoading(false));
      })
      .catch((err) => {
        console.error(err);
        dispatch(actions.controlLoading(false));
      });
  }, [location.search, currentPage, itemsPerPage, searchString, refresh]);
  return (
    <div id="layoutSidenav_content">
      <main>
        <div className="container-fluid px-4">
          <h1 className="mt-4">Danh sách khóa học</h1>
          <ol className="breadcrumb mb-4">
            <li className="breadcrumb-item">
              <Link to="/admin/dashboard">Bảng tin</Link>
            </li>
            <li className="breadcrumb-item">Khóa học</li>
          </ol>
          <div className="mb-3 d-flex">
            <ButtonCustom
              type="button"
              btnAdminCreate
              to="course-add"
              className="btn  me-2 fs-4"
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
          <DataTableCourse
            name="Danh sách khóa học"
            data={users}
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            discount={discountData}
            selectedDiscount={selectedDiscount}
            setSelectedDiscount={setSelectedDiscount}
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
        </div>
      </main>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn có chắc muốn xóa khóa học này?</Modal.Body>
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

export default Course;
