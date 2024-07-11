import React, { useState, useEffect } from "react";
import styles from "./Blog.module.scss";
import classNames from "classnames/bind";
import PostCard from "~/layout/components/PostCard";
import * as actions from "~/redux/actions";
import requestApi from "~/utils/api";
import { useDispatch } from "react-redux";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useLocation, useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

const Blog = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [numOfPage, setNumOfPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [postData, setPostData] = useState({});
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const updateQueryCategoryParams = (category) => {
    const params = new URLSearchParams(location.search);
    if (category) {
      params.set("category", category.id);
    } else {
      params.delete("category");
    }
    navigate({ search: params.toString() });
  };

  const renderPagination = () => {
    const pagination = [];
    const nextPage = currentPage + 1 > numOfPage ? null : currentPage + 1;
    const prevPage = currentPage - 1 < 1 ? null : currentPage - 1;
    pagination.push(
      <li key="prev" className={prevPage ? "page-item" : "page-item disabled"}>
        <button
          className="page-link p-4"
          onClick={() => setCurrentPage(prevPage)}
        >
          &laquo;
        </button>
      </li>
    );
    for (let i = 1; i <= numOfPage; i++) {
      pagination.push(
        <li
          key={i}
          className={currentPage === i ? "page-item active" : "page-item"}
        >
          <button className="page-link p-4" onClick={() => setCurrentPage(i)}>
            {i}
          </button>
        </li>
      );
    }
    pagination.push(
      <li key="next" className={nextPage ? "page-item" : "page-item disabled"}>
        <button
          className="page-link p-4"
          onClick={() => setCurrentPage(nextPage)}
        >
          &raquo;
        </button>
      </li>
    );
    return pagination;
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const category = searchParams.get("category");
    dispatch(actions.controlLoading(true));
    let query = `?items_per_page=${itemsPerPage}&page=${currentPage}&isPublished=true&category_id=${category}`;
    requestApi(`/posts${query}`, "GET")
      .then((res) => {
        setPostData(res.data);
        setNumOfPage(res.data.lastPage);
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
      })
      .catch((err) => {
        console.error(err);
      });
  }, [location.search, currentPage, itemsPerPage, dispatch]);

  return (
    <div className={cx("wrapper", "row d-flex")}>
      <div className={cx("header")}>
        <h2 className="fw-2">
          <strong>Bài viết mới nhất</strong>
        </h2>
      </div>
      <div className="d-flex mb-4">
        <div className="w-50 me-3">
          <Autocomplete
            options={categories}
            getOptionLabel={(option) => option.name}
            value={selectedCategory}
            onChange={(event, value) => {
              setSelectedCategory(value);
              updateQueryCategoryParams(value);
            }}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" label="Thể loại" />
            )}
          />
        </div>
      </div>
      {postData.data && postData.data.length > 0 ? (
        postData.data.map((item, index) => {
          return <PostCard key={index} data={item} />;
        })
      ) : (
        <p>Không có bài viết nào.</p>
      )}
      {numOfPage > 1 && (
        <div className="row mt-3">
          <div className="col-sm-12 col-md-7">
            <ul className="pagination justify-content-end">
              {renderPagination()}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;
