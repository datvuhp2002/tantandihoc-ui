import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as actions from "../../../redux/actions";
import { Button, Modal } from "react-bootstrap";
import DataTable from "~/layout/components/Datatable";
import ButtonCustom from "~/components/Button";
import requestApi from "~/utils/api";
import { Link, useLocation } from "react-router-dom";
import moment from "moment";
import DatatablePost from "~/layout/components/DatatablePost";
import { toast } from "react-toastify";

const Post = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [posts, setPosts] = useState([]);
  const [numOfPage, setNumOfPage] = useState(1);
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
  const [category, setCategory] = useState();
  const [isPublished, setIsPublished] = useState(true);
  const [selectedPublished, setSelectedPublished] = useState(null);

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
      name: "Ngày cập nhật",
      element: (row) => moment(row.updatedAt).format("DD/MM/YYYY"),
    },
    {
      name: "Hành động",
      element: (row) => (
        <div className="d-flex align-items-center justify-content-end">
          <ButtonCustom type="button" update to={`post-update/${row.id}`}>
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
    setShowModal(true);
    setDeleteType("multi");
  };
  const handlePublishPost = async () => {
    console.log("multi delete => ", selectedRows);
    const formatIds = selectedRows.map((id) => Number(id));
    dispatch(actions.controlLoading(true));
    await requestApi("/posts/publishPost", "PUT", formatIds)
      .then((res) => {
        console.log(res.data);
        setRefresh(Date.now());
        dispatch(actions.controlLoading(false));
        toast.success("Duyệt bài viết thành công", {
          position: "top-right",
          autoClose: 3000,
        });
      })
      .catch((err) => {
        console.log(err);
        dispatch(actions.controlLoading(false));
      });
  };
  const handleUnPublishPost = async () => {
    console.log("multi delete => ", selectedRows);
    const formatIds = selectedRows.map((id) => Number(id));
    dispatch(actions.controlLoading(true));
    await requestApi("/posts/unPublishPost", "PUT", formatIds)
      .then((res) => {
        console.log(res.data);
        setRefresh(Date.now());
        dispatch(actions.controlLoading(false));
        toast.success("Gỡ bài viết thành công", {
          position: "top-right",
          autoClose: 3000,
        });
      })
      .catch((err) => {
        console.log(err);
        dispatch(actions.controlLoading(false));
      });
  };
  const requestDeleteApi = () => {
    if (deleteType === "single") {
      dispatch(actions.controlLoading(true));
      requestApi(`/posts/${deleteItem}`, "DELETE", [])
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
      requestApi(`/posts/multiple?ids=${selectedRows.toString()}`, "DELETE", [])
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
    const category = searchParams.get("category");
    const isPublished = searchParams.get("isPublished");
    if (isPublished) {
      setSelectedPublished(isPublished);
      if (isPublished === "false") {
        setIsPublished(false);
      }
      if (isPublished === "true") {
        setIsPublished(true);
      }
    } else {
      setSelectedPublished("all");
      setIsPublished(null);
    }
    setCategory(category);
    dispatch(actions.controlLoading(true));
    let query = `?items_per_page=${itemsPerPage}&page=${currentPage}&search=${searchString}&category_id=${category}&isPublished=${isPublished}`;
    console.log("query=> ", query);
    requestApi(`/posts${query}`, "GET", [])
      .then((response) => {
        setPosts(response.data.data);
        setNumOfPage(response.data.lastPage);
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
  }, [currentPage, itemsPerPage, searchString, refresh, location.search]);

  return (
    <div id="layoutSidenav_content">
      <main>
        <div className="container-fluid px-4">
          <h1 className="mt-4">Danh sách bài viết</h1>
          <ol className="breadcrumb mb-4">
            <li className="breadcrumb-item">
              <Link to="/admin/dashboard">Bảng tin</Link>
            </li>
            <li className="breadcrumb-item">Bài viết</li>
          </ol>
          <div className="mb-3 d-flex">
            <ButtonCustom
              type="button"
              to="post-add"
              btnAdminCreate
              className="btn btn-sm btn-success me-2 fs-4"
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
            {selectedRows.length > 0 && isPublished && isPublished !== null && (
              <ButtonCustom
                type="button"
                update
                className="btn"
                onClick={handleUnPublishPost}
              >
                Gỡ bài
              </ButtonCustom>
            )}
            {selectedRows.length > 0 &&
              !isPublished &&
              isPublished !== null && (
                <ButtonCustom
                  type="button"
                  update
                  className="btn"
                  onClick={handlePublishPost}
                >
                  Duyệt
                </ButtonCustom>
              )}
          </div>
          <DatatablePost
            name="Danh sách bài viết"
            data={posts}
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedPublished={selectedPublished}
            setSelectedPublished={setSelectedPublished}
            columns={columns}
            numOfPage={numOfPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onChangeItemsPerPage={setItemsPerPage}
            onKeySearch={(keyword) => {
              console.log("keyword in posts list comp=> ", keyword);
              setSearchString(keyword);
            }}
            onSelectedRows={(rows) => {
              console.log("selected rows in posts list=> ", rows);
              setSelectedRows(rows);
            }}
          />
        </div>
      </main>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn có chắc chắn muốn xóa bài viết này?</Modal.Body>
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

export default Post;
