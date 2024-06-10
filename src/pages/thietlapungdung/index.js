import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./Thietlapungdung.module.scss";
import { Row, Col, Modal, Badge } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBolt,
  faTint,
  faPlane,
  faCar,
  faUser,
  faMoneyBill,
} from "@fortawesome/free-solid-svg-icons";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Button from "~/components/Button";
const cx = classNames.bind(styles);

const ThietLapUngDung = () => {
  const [notification, setNotification] = useState(false);
  const [amount, setAmount] = useState(1000000);

  const [selectedCategory, setSelectedCategory] = useState("expense");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemIcon, setNewItemIcon] = useState("");
  const [newItemName, setNewItemName] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedIcon, setSelectedIcon] = useState(null);

  //lịch
  const [date, setDate] = useState(new Date());

  const onChange = (newDate) => {
    setDate(newDate);
  };

  const handleNotificationChange = () => {
    setNotification(!notification);
  };

  const handleAmountChange = (e) => {
    setAmount(parseInt(e.target.value));
  };

  const renderAmountOptions = () => {
    const options = [];
    for (let amount = 1000000; amount <= 100000000; amount += 4000000) {
      options.push(
        <option key={amount} value={amount}>
          {amount.toLocaleString()} VND
        </option>
      );
    }
    return options;
  };

  // danh mục
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleAddItem = () => {
    setShowAddModal(true);
  };

  const handleModalSave = () => {
    if (newItemIcon.trim() === "" || newItemName.trim() === "") {
      console.log("Vui lòng điền đầy đủ thông tin");
      return;
    }

    const newCategory = {
      type: selectedCategory,
      icon: newItemIcon,
      name: newItemName,
    };
    setCategories([...categories, newCategory]);
    setShowAddModal(false);
  };

  const handleModalClose = () => {
    setNewItemIcon("");
    setNewItemName("");
    setShowAddModal(false);
  };

  const handleIconSelect = (icon) => {
    setSelectedIcon(icon);
    setNewItemIcon(icon.iconName);
  };

  const renderCategories = (categoryType) => {
    return categories
      .filter((category) => category.type === categoryType)
      .map((category, index) => (
        <Badge key={index} variant="primary" className="mr-2">
          <FontAwesomeIcon icon={category.icon} /> {category.name}
        </Badge>
      ));
  };

  const renderSubcategories = (category) => {
    switch (category) {
      case "expense":
        return (
          <div className="d-flex  flex-wrap p-4 mt-4 h-100">
            <Button
              leftIcon={<FontAwesomeIcon icon={faTint} />}
              variant="outline-primary"
            >
              Tiền điện
            </Button>
            <Button
              leftIcon={<FontAwesomeIcon icon={faTint} />}
              variant="outline-primary"
            >
              Tiền nước
            </Button>
            <Button
              leftIcon={<FontAwesomeIcon icon={faTint} />}
              variant="outline-primary"
            >
              Tiền nước
            </Button>
            <Button
              leftIcon={<FontAwesomeIcon icon={faTint} />}
              variant="outline-primary"
            >
              Tiền nước
            </Button>
            <Button
              leftIcon={<FontAwesomeIcon icon={faPlane} />}
              variant="outline-primary"
            >
              Đi chơi
            </Button>
            <Button
              leftIcon={<FontAwesomeIcon icon={faTint} />}
              variant="outline-primary"
            >
              Du lịch
            </Button>
            <Button
              leftIcon={<FontAwesomeIcon icon={faCar} />}
              variant="outline-primary"
            >
              Lái xe
            </Button>
            <Button
              leftIcon={<FontAwesomeIcon icon={faCar} />}
              variant="outline-primary"
            >
              Lái xe
            </Button>
            <Button
              leftIcon={<FontAwesomeIcon icon={faCar} />}
              variant="outline-primary"
            >
              Lái xe
            </Button>
            <Button variant="outline-primary" onClick={handleAddItem}>
              <FontAwesomeIcon icon={faMoneyBill} /> Thêm mới
            </Button>
          </div>
        );
      case "income":
        return (
          <div className="d-flex flex-wrap p-4 mt-4 h-100">
            <Button
              leftIcon={<FontAwesomeIcon icon={faUser} />}
              variant="outline-primary"
            >
              Lương
            </Button>
            <Button
              leftIcon={<FontAwesomeIcon icon={faBolt} />}
              variant="outline-primary"
            >
              Thưởng
            </Button>
            <Button
              leftIcon={<FontAwesomeIcon icon={faTint} />}
              variant="outline-primary"
            >
              Tiết kiệm
            </Button>
            <Button
              leftIcon={<FontAwesomeIcon icon={faMoneyBill} />}
              variant="outline-primary"
              onClick={handleAddItem}
            >
              Thêm mới
            </Button>
          </div>
        );
      default:
        return null;
    }
  };
  return (
    <div className={cx("wrapper", "d-flex")}>
      <div manager_information className={cx("col-5 p-4")}>
        <div className={cx("mt-3 p-3")}>
          <h3>Hạn Mức Chi Tiêu</h3>
          <label>Đặt Hạn Mức Ngày</label>
          <select
            className="form-control"
            value={amount}
            onChange={handleAmountChange}
          >
            {renderAmountOptions()}
          </select>
          <label>Đặt Hạn Mức Tuần</label>
          <select
            className="form-control"
            value={amount}
            onChange={handleAmountChange}
          >
            {renderAmountOptions()}
          </select>
          <label>Đặt Hạn Mức Tháng</label>
          <select
            className="form-control"
            value={amount}
            onChange={handleAmountChange}
          >
            {renderAmountOptions()}
          </select>
          <div className="form-check mt-2">
            <input
              type="checkbox"
              className="form-check-input"
              id="notificationCheck"
              checked={notification}
              onChange={handleNotificationChange}
            />
            <label className="form-check-label" htmlFor="notificationCheck">
              Thông báo
            </label>
          </div>
          <div className="d-flex mt-2">
            <Button className={cx("button", "primary")}>Lưu</Button>
            <Button className={cx("button", "secondary")}>Hủy</Button>
          </div>
        </div>
        <div className={cx("mt-3 p-3")}>
          <h2>Nhắc nhở Thanh Toán</h2>
          <div className="row">
            <div className="col">
              <h3>Danh Mục</h3>
              <div className="row">
                <div className="col d-flex">
                  <Button
                    className={cx("button", "outline-primary")}
                    onClick={() => handleCategoryChange("expense")}
                  >
                    Chi
                  </Button>
                  <Button
                    className={cx("button", "outline-primary")}
                    onClick={() => handleCategoryChange("income")}
                  >
                    Thu
                  </Button>
                </div>
                <div className={cx("chondanhmuc", "")}>
                  {renderSubcategories(selectedCategory)}
                </div>
              </div>
            </div>

            <div className="col">
              <Calendar onChange={onChange} value={date} />
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="notificationCheck"
                  checked={notification}
                  onChange={handleNotificationChange}
                />
                <label className="form-check-label" htmlFor="notificationCheck">
                  Thông báo
                </label>
              </div>
              <div className="d-flex">
                <Button className={cx("button", "primary")}>Lưu</Button>
                <Button className={cx("button", "secondary")}>Hủy</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={cx("danhmuc", "col-7 ms-4")}>
        <div className={cx("thietlap", "p-3")}>
          <h3 style={{ textAlign: "center" }}>Thiết Lập Danh Mục</h3>
          <div className="row">
            <div className="col d-flex aligin-items-center justify-content-center">
              <Button
                className={cx("button", "outline-primary")}
                onClick={() => handleCategoryChange("expense")}
              >
                Chi
              </Button>
              <Button
                className={cx("button", "outline-primary")}
                onClick={() => handleCategoryChange("income")}
              >
                Thu
              </Button>
            </div>
          </div>
          <div className="row">
            <div className="col">{renderSubcategories(selectedCategory)}</div>
          </div>

          <Modal show={showAddModal} onHide={handleModalClose}>
            <Modal.Header closeButton>
              <Modal.Title>Thêm Mục Mới</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>
                <label>Danh mục:</label>
                <select
                  className="form-control"
                  onChange={(e) => handleCategoryChange(e.target.value)}
                >
                  <option value="expense">Chi</option>
                  <option value="income">Thu</option>
                </select>
              </div>
              <div>
                <label>Biểu tượng:</label>
                <select
                  className="form-control"
                  value={selectedIcon}
                  onChange={(e) => handleIconSelect(e.target.value)}
                >
                  <option value={faBolt}>Lượng</option>
                  <option value={faTint}>Nước</option>
                  <option value={faPlane}>Máy bay</option>
                  <option value={faCar}>Xe</option>
                  <option value={faUser}>Người dùng</option>
                  <option value={faMoneyBill}>Tiền</option>
                </select>
              </div>
              <div>
                <label>+</label>
                <input
                  type="text"
                  className="form-control"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                />
              </div>
            </Modal.Body>
            <div className="d-flex aligin-items-center justify-content-center mb-3">
              <Button
                className={cx("button", "primary")}
                onClick={handleModalSave}
              >
                Thêm
              </Button>
              <Button
                className={cx("button", "secondary")}
                onClick={handleModalClose}
              >
                Hủy
              </Button>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default ThietLapUngDung;
