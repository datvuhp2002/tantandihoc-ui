import React, { useEffect, useState } from "react";
import styles from "./Course.module.scss";
import classNames from "classnames/bind";
import Card from "~/layout/components/Card";
import { useDispatch } from "react-redux";
import requestApi from "~/utils/api";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import * as actions from "~/redux/actions";
import { useLocation, useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

const CoursePage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [numOfPage, setNumOfPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [coursesData, setCoursesData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [discountData, setDiscountData] = useState([]);
  const [selectedDiscount, setSelectedDiscount] = useState(null);

  const updateQueryCategoryParams = (category) => {
    const params = new URLSearchParams(location.search);
    if (category) {
      params.set("category", category.id);
    } else {
      params.delete("category");
    }
    navigate({ search: params.toString() });
  };

  const updateQueryDiscountParams = (discount) => {
    const params = new URLSearchParams(location.search);
    if (discount) {
      params.set("discount", discount.id);
    } else {
      params.delete("discount");
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
    const discount = searchParams.get("discount");
    dispatch(actions.controlLoading(true));
    let query = `?items_per_page=${itemsPerPage}&page=${currentPage}&category=${category}&discount=${discount}`;
    requestApi(`/courses${query}`, "GET", [])
      .then((response) => {
        setCoursesData(response.data.data);
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
      })
      .catch((err) => {
        console.error(err);
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
      })
      .catch((err) => {
        console.error(err);
      });
  }, [location.search, currentPage, itemsPerPage]);

  return (
    <div className={cx("course-page")}>
      <h1 className={cx("title", "mb-4")}>Danh sách khóa học</h1>
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
        <div className="w-50">
          <Autocomplete
            options={discountData}
            getOptionLabel={(option) => option.name}
            value={selectedDiscount}
            onChange={(event, value) => {
              setSelectedDiscount(value);
              updateQueryDiscountParams(value);
            }}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" label="Mã giảm giá" />
            )}
          />
        </div>
      </div>
      <div className="courses-list row">
        {coursesData.map((course) => (
          <div className="col-md-3">
            <Card key={course.id} data={course} />
          </div>
        ))}
      </div>
      {numOfPage > 1 && (
        <div className="pagination-container">
          <ul className="pagination">{renderPagination()}</ul>
        </div>
      )}
    </div>
  );
};

export default CoursePage;
