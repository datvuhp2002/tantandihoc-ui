import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Chart from "~/components/Chart";
import requestApi from "~/utils/api";
import styles from "./Dashboard.module.scss";
import classNames from "classnames/bind";
import formatPrice from "~/utils/formatPrice";
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
  const [thisYear, setThisYear] = useState(new Date().getFullYear());
  const [coursesStatistics, setCoursesStatistics] = useState([]);
  const [topCourses, setTopCourses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentYear = new Date().getFullYear();
        setThisYear(currentYear);

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
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container px-4 my-5">
      <h1 className="mt-4 fs-1">Bảng tin</h1>
      <div className="row mt-4">
        <div className="col-lg-6">
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="card bg-success text-white mb-3">
                <div className="card-body">
                  Doanh thu {thisYear}
                  <h2 className="small text-white fs-1">
                    {formatPrice(revenue)}
                  </h2>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card bg-primary text-white mb-3">
                <div className="card-body">
                  Tổng người dùng
                  <span className="badge bg-danger">
                    {dashboardData.totalUser}
                  </span>
                </div>
                <div className="card-footer">
                  <Link className="small text-white" to="/admin/user">
                    Xem chi tiết <i className="fas fa-angle-right"></i>
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card bg-warning text-white mb-3">
                <div className="card-body">
                  Tổng khoá học
                  <span className="badge bg-danger">
                    {dashboardData.totalCourse}
                  </span>
                </div>
                <div className="card-footer">
                  <Link className="small text-white" to="/admin/course">
                    Xem chi tiết <i className="fas fa-angle-right"></i>
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card bg-success text-white mb-3">
                <div className="card-body">
                  Tổng bài viết
                  <span className="badge bg-danger">
                    {dashboardData.totalPost}
                  </span>
                </div>
                <div className="card-footer">
                  <Link className="small text-white" to="/admin/post">
                    Xem chi tiết <i className="fas fa-angle-right"></i>
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card bg-secondary text-white mb-3">
                <div className="card-body">
                  Tổng thể loại
                  <span className="badge bg-danger">
                    {dashboardData.totalCategory}
                  </span>
                </div>
                <div className="card-footer">
                  <Link className="small text-white" to="/admin/categories">
                    Xem chi tiết <i className="fas fa-angle-right"></i>
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card bg-danger text-white mb-3">
                <div className="card-body">
                  Tổng giao dịch
                  <span className="badge bg-danger">
                    {dashboardData.totalTransaction}
                  </span>
                </div>
                <div className="card-footer">
                  <Link className="small text-white" to="/admin/transaction">
                    Xem chi tiết <i className="fas fa-angle-right"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <h2 className="mb-3">Thông kê người dùng</h2>
          <div
            className={cx(
              "chart",
              "d-flex flex-column align-items-center justify-content-center",
              "mb-4"
            )}
          >
            {userStatistics.length > 0 && <Chart data={userStatistics} />}
            <strong>Thống kê số người dùng mới trong năm {thisYear}</strong>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <h2 className="mb-3">Thống kê Khóa học</h2>
          <div className="row">
            <div className="col-md-4 mb-4">
              <div
                className={cx(
                  "chart",
                  "d-flex flex-column align-items-center justify-content-center",
                  "mb-3"
                )}
              >
                {coursesStatistics.length > 0 && (
                  <Chart data={coursesStatistics} />
                )}
                <strong>Thống kê số bài viết mới trong năm {thisYear}</strong>
              </div>
            </div>
            <div className="col-md-8 mb-4">
              <div className="row">
                {topCourses.map((item, index) => (
                  <div className="col-md-4 mb-3" key={index}>
                    <CardCourseAdmin
                      data={item.course}
                      revenue={item.totalRevenue}
                    />
                  </div>
                ))}
              </div>
              <strong>Top khóa học bán chạy nhất {thisYear}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <h2 className="mb-3">Thống kê giao dịch</h2>
          <div className="row">
            <div className="col-md-4 mb-4">
              <div
                className={cx(
                  "chart",
                  "d-flex flex-column align-items-center justify-content-center",
                  "mb-3"
                )}
              >
                {transactionStatistics.length > 0 && (
                  <Chart data={transactionStatistics} />
                )}
                <strong>Thống kê số giao dịch mới trong năm {thisYear}</strong>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div
                className={cx(
                  "chart",
                  "d-flex flex-column align-items-center justify-content-center",
                  "mb-3"
                )}
              >
                {transactionSuccessStatistics.length > 0 && (
                  <Chart data={transactionSuccessStatistics} />
                )}
                <strong>
                  Thống kê số giao dịch thành công trong năm {thisYear}
                </strong>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div
                className={cx(
                  "chart",
                  "d-flex flex-column align-items-center justify-content-center",
                  "mb-3"
                )}
              >
                {transactionFailStatistics.length > 0 && (
                  <Chart data={transactionFailStatistics} />
                )}
                <strong>
                  Thống kê số giao dịch thất bại trong năm {thisYear}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <h2>Thống kê bài viết</h2>
          <div className="row">
            <div className="col-md-4 mb-4">
              <div
                className={cx(
                  "chart",
                  "d-flex flex-column align-items-center justify-content-center",
                  "mb-3"
                )}
              >
                {postStatistics.length > 0 && <Chart data={postStatistics} />}
                <strong>Thống kê số bài viết mới trong năm {thisYear}</strong>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div
                className={cx(
                  "chart",
                  "d-flex flex-column align-items-center justify-content-center",
                  "mb-3"
                )}
              >
                {postPublishedStatistics.length > 0 && (
                  <Chart data={postPublishedStatistics} />
                )}
                <strong>
                  Thống kê số bài viết được xuất bản trong năm {thisYear}
                </strong>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div
                className={cx(
                  "chart",
                  "d-flex flex-column align-items-center justify-content-center",
                  "mb-3"
                )}
              >
                {postUnPublishedStatistics.length > 0 && (
                  <Chart data={postUnPublishedStatistics} />
                )}
                <strong>
                  Thống kê số bài viết chưa xuất bản trong năm {thisYear}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
