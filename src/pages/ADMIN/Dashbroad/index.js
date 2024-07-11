import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Chart from "~/components/Chart";
import requestApi from "~/utils/api";
import styles from "./Dashboad.module.scss";
import classNames from "classnames/bind";
import formatPrice from "~/utils/formatPrice";
import Card from "~/layout/components/Card";
import CardCourseAdmin from "~/layout/components/CardCourseAdmin";

const cx = classNames.bind(styles);

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({});
  const [userStatistics, setUserStatistics] = useState([]);
  const [transactionStatistics, setTransactionStatistics] = useState([]);
  const [transactionSuccessStatistics, setTransactionSuccessStatistics] =
    useState([]);
  const [transactionFailStatistics, setTransactionFailStatistics] = useState(
    []
  );
  const [postStatistics, setPostStatistics] = useState([]);
  const [postPublishedStatistics, setPostPublishedStatistics] = useState([]);
  const [postUnPublishedStatistics, setPostUnPublishedStatistics] = useState(
    []
  );
  const [revenue, setRevenue] = useState(0);
  const [thisYear, setThisYear] = useState(2024);
  const [coursesStatistics, setCoursesStatistics] = useState([]);
  const [topCourses, setTopCourses] = useState([]);
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    setThisYear(currentYear);
    const fetchData = async () => {
      try {
        const [
          userRes,
          courseRes,
          postRes,
          categoryRes,
          transactionRes,
          userStatsRes,
          transactionStatsRes,
          postsStatsRes,
          revenueRes,
          transactionSuccessRes,
          transactionFailRes,
          postsPublishStatsRes,
          postsUnPublishStatsRes,
          coursesStatsRes,
          topRevenueRes,
        ] = await Promise.all([
          requestApi("/users?items_per_page=all", "GET"),
          requestApi("/courses?items_per_page=All", "GET"),
          requestApi("/posts?items_per_page=all", "GET"),
          requestApi("/categories?items_per_page=all", "GET"),
          requestApi("/transaction?items_per_page=all", "GET"),
          requestApi(`/statistics/users/${currentYear}`, "GET"),
          requestApi(`/statistics/transactions/${currentYear}`, "GET"),
          requestApi(`/statistics/posts/${currentYear}`, "GET"),
          requestApi(
            `/transaction/calculateRevenueForYear/${currentYear}`,
            "GET"
          ),
          requestApi(`/statistics/transactions/success/${currentYear}`, "GET"),
          requestApi(`/statistics/transactions/fail/${currentYear}`, "GET"),
          requestApi(`/statistics/posts/publish/${currentYear}`, "GET"),
          requestApi(`/statistics/posts/un-publish/${currentYear}`, "GET"),
          requestApi(`/statistics/courses/${currentYear}`, "GET"),
          requestApi(`/statistics/top-revenue/3`, "GET"),
        ]);

        setDashboardData({
          totalUser: userRes.data.total,
          totalCourse: courseRes.data.total,
          totalPost: postRes.data.total,
          totalCategory: categoryRes.data.total,
          totalTransaction: transactionRes.data.total,
        });
        setUserStatistics(userStatsRes.data);
        setTransactionStatistics(transactionStatsRes.data);
        setPostStatistics(postsStatsRes.data);
        setRevenue(revenueRes.data);
        setTransactionSuccessStatistics(transactionSuccessRes.data);
        setTransactionFailStatistics(transactionFailRes.data);
        setPostPublishedStatistics(postsPublishStatsRes.data);
        setPostUnPublishedStatistics(postsUnPublishStatsRes.data);
        setCoursesStatistics(coursesStatsRes.data);
        setTopCourses(topRevenueRes.data);
        console.log(topRevenueRes.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container px-4 my-5 d-flex flex-column align-items-center justify-content-center">
      <h1 className="mt-4 fs-1 text-start d-flex align-items-start justify-content-start w-100">
        Bảng tin
      </h1>
      <ol className="breadcrumb mb-4 "></ol>
      <div className="row mb-4">
        <div className="col-lg-6 row ">
          <div className="col-md-6 ">
            <div className="card bg-success text-white">
              <div className="card-body">
                Doanh thu {thisYear}
                <h2 className="small text-white fs-1">
                  {formatPrice(revenue)}
                </h2>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card bg-primary text-white">
              <div className="card-body">
                Tổng người dùng
                {dashboardData.totalUser && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {dashboardData.totalUser}
                  </span>
                )}
              </div>
              <div className="card-footer d-flex align-items-center justify-content-between">
                <Link
                  className="small text-white stretched-link"
                  to={"/admin/user"}
                >
                  Xem chi tiết <i className="fas fa-angle-right"></i>
                </Link>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card bg-warning text-white">
              <div className="card-body">
                Tổng khoá học
                {dashboardData.totalCourse && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {dashboardData.totalCourse}
                  </span>
                )}
              </div>
              <div className="card-footer d-flex align-items-center justify-content-between">
                <Link
                  className="small text-white stretched-link"
                  to={"/admin/course"}
                >
                  Xem chi tiết <i className="fas fa-angle-right"></i>
                </Link>
              </div>
            </div>
          </div>
          <div className="col-md-6 ">
            <div className="card bg-success text-white">
              <div className="card-body">
                Tổng bài viết
                {dashboardData.totalPost && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {dashboardData.totalPost}
                  </span>
                )}
              </div>
              <div className="card-footer d-flex align-items-center justify-content-between">
                <Link
                  className="small text-white stretched-link"
                  to={"/admin/post"}
                >
                  Xem chi tiết <i className="fas fa-angle-right"></i>
                </Link>
              </div>
            </div>
          </div>
          <div className="col-md-6 ">
            <div className="card bg-secondary text-white">
              <div className="card-body">
                Tổng thể loại
                {dashboardData.totalCategory && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {dashboardData.totalCategory}
                  </span>
                )}
              </div>
              <div className="card-footer d-flex align-items-center justify-content-between">
                <Link
                  className="small text-white stretched-link"
                  to={"/admin/categories"}
                >
                  Xem chi tiết <i className="fas fa-angle-right"></i>
                </Link>
              </div>
            </div>
          </div>
          <div className="col-md-6 ">
            <div className="card bg-danger text-white">
              <div className="card-body">
                Tổng giao dịch
                {dashboardData.totalTransaction && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {dashboardData.totalTransaction}
                  </span>
                )}
              </div>
              <div className="card-footer d-flex align-items-center justify-content-between">
                <Link
                  className="small text-white stretched-link"
                  to={"/admin/transaction"}
                >
                  Xem chi tiết <i className="fas fa-angle-right"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6 ">
          <h2>Thông kê người dùng</h2>
          <div
            className={cx(
              "chart",
              "d-flex flex-column align-items-center justify-content-center"
            )}
          >
            {userStatistics.length > 0 && <Chart data={userStatistics} />}
            <label>
              <strong>Thống kê số người dùng mới trong năm {thisYear}</strong>
            </label>
          </div>
        </div>
      </div>
      <div className="col-12 mb-4">
        <h2>Thống kê Khóa học</h2>
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="chart d-flex flex-column align-items-center justify-content-center">
              {coursesStatistics.length > 0 && (
                <Chart data={coursesStatistics} />
              )}
              <label>
                <strong>Thống kê số bài viết mới trong năm {thisYear}</strong>
              </label>
            </div>
          </div>

          <div className="col-md-8 mb-4">
            <div className="chart d-flex flex-column align-items-center justify-content-center">
              <div className="row d-flex">
                {topCourses &&
                  topCourses.map((item, index) => (
                    <div className="col-md-4">
                      <CardCourseAdmin
                        data={item.course}
                        revenue={item.totalRevenue}
                      />
                    </div>
                  ))}
              </div>
              <label>
                <strong>Top khóa học bán chạy nhất {thisYear}</strong>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12 mb-4">
          <h2>Thống kê giao dịch</h2>
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="chart d-flex flex-column align-items-center justify-content-center">
                {transactionStatistics.length > 0 && (
                  <Chart data={transactionStatistics} />
                )}
                <label>
                  <strong>
                    Thống kê số giao dịch mới trong năm {thisYear}
                  </strong>
                </label>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="chart d-flex flex-column align-items-center justify-content-center">
                {transactionSuccessStatistics.length > 0 && (
                  <Chart data={transactionSuccessStatistics} />
                )}
                <label>
                  <strong>
                    Thống kê số giao dịch thành công trong năm {thisYear}
                  </strong>
                </label>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="chart d-flex flex-column align-items-center justify-content-center">
                {transactionFailStatistics.length > 0 && (
                  <Chart data={transactionFailStatistics} />
                )}
                <label>
                  <strong>
                    Thống kê số giao dịch thất bại trong năm {thisYear}
                  </strong>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 mb-4">
          <h2>Thông kê bài viết</h2>
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="chart d-flex flex-column align-items-center justify-content-center">
                {postStatistics.length > 0 && <Chart data={postStatistics} />}
                <label>
                  <strong>Thống kê số bài viết mới trong năm {thisYear}</strong>
                </label>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="chart d-flex flex-column align-items-center justify-content-center">
                {postPublishedStatistics.length > 0 && (
                  <Chart data={postPublishedStatistics} />
                )}
                <label>
                  <strong>
                    Thống kê số bài viết đã được xuất bản trong năm {thisYear}
                  </strong>
                </label>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="chart d-flex flex-column align-items-center justify-content-center">
                {postUnPublishedStatistics.length > 0 && (
                  <Chart data={postUnPublishedStatistics} />
                )}
                <label>
                  <strong>
                    Thống kê số bài viết chưa được xuất bản trong năm {thisYear}
                  </strong>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
