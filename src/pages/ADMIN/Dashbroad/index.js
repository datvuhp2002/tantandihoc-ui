import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import requestApi from "~/utils/api";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({});
  useEffect(() => {
    const user = requestApi("/users", "GET");
    const course = requestApi("/courses", "GET");
    const post = requestApi("/posts", "GET");
    Promise.all([user, course, post])
      .then((res) => {
        setDashboardData({
          totalUser: res[0].data.total,
          totalCourse: res[1].data.total,
          totalPost: res[2].data.total,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className=" px-4">
      <h1 className="mt-4">Bảng tin</h1>
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item">Bảng tin</li>
      </ol>
      <div className="row">
        <div className="col-4">
          <div className="card bg-primary text-white mb-4">
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
                View Details
              </Link>
              <div className="small text-white">
                <i className="fas fa-angle-right"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-4">
          <div className="card bg-warning text-white mb-4">
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
                View Details
              </Link>
              <div className="small text-white">
                <i className="fas fa-angle-right"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-4">
          <div className="card bg-success text-white mb-4">
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
                View Details
              </Link>
              <div className="small text-white">
                <i className="fas fa-angle-right"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
