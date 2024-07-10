import React, { useEffect, useState } from "react";
import styles from "./Course.module.scss";
import classNames from "classnames/bind";
import Card from "~/layout/components/Card";
import { useDispatch } from "react-redux";
import requestApi from "~/utils/api";
import * as actions from "~/redux/actions";
const cx = classNames.bind(styles);
const CoursePage = () => {
  const dispatch = useDispatch();
  const [numOfPage, setNumOfPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [coursesData, setCoursesData] = useState([]);
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
    dispatch(actions.controlLoading(true));
    let query = `?items_per_page=${itemsPerPage}&page=${currentPage}`;
    requestApi(`/courses${query}`, "GET")
      .then((res) => {
        setCoursesData(res.data.data);
        setNumOfPage(res.data.lastPage);
        dispatch(actions.controlLoading(false));
      })
      .catch((err) => {
        dispatch(actions.controlLoading(false));
      });
  }, [currentPage, itemsPerPage]);
  return (
    <div className={cx("wrapper")}>
      <div className="mb-5">
        <div className={cx("", "d-flex row mt-5")}>
          <h2 className="fs-2">
            <strong>Khóa học mới</strong>
          </h2>
          <div className={cx("group-corse", "row")}>
            {coursesData && coursesData.length > 0 ? (
              coursesData.map((item, index) => {
                return (
                  <div key={index} className="col-3 mb-4">
                    <Card data={item} />
                  </div>
                );
              })
            ) : (
              <p>No posts available</p>
            )}
          </div>
        </div>
      </div>
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

export default CoursePage;
