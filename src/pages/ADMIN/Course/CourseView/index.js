import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Modal } from "react-bootstrap";
import DataTable from "~/layout/components/Datatable";
import ButtonCustom from "~/components/Button";
import { Link, useLocation } from "react-router-dom";
import moment from "moment";
import calPrice from "~/utils/calPrice";
import formatPrice from "~/utils/formatPrice";
import requestApi from "~/utils/api";
import ViewCourseInfo from "./ViewCourseInfo";
const CourseView = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  return (
    <div id="layoutSidenav_content">
      <main>
        <div className="container-fluid px-4">
          <h1 className="mt-4">Danh sách khóa học</h1>
          <ol className="breadcrumb mb-4">
            <li className="breadcrumb-item">
              <Link to="/admin/dashboard">Bảng tin</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/admin/courses">Khóa học</Link>
            </li>
            <li className="breadcrumb-item">Thông tin khóa học</li>
          </ol>
          <ViewCourseInfo />
        </div>
      </main>
    </div>
  );
};

export default CourseView;
