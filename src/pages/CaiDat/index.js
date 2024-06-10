import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import styles from "./Caidat.module.scss";
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);
const SettingsForm = () => {
  // State cho các giá trị trong form
  const [display, setDisplay] = useState("light");
  const [language, setLanguage] = useState("tiengAnh");
  const [currencyUnit, setCurrencyUnit] = useState("VND");
  const [currencyRate, setCurrencyRate] = useState(1);
  const [currencyFormat, setCurrencyFormat] = useState("");
  const [dateFormat, setDateFormat] = useState("dd/mm/yyyy");
  const [ngayDauTuan, setNgayDauTuan] = useState("thuHai");
  const [ngayDauThang, setNgayDauThang] = useState("ngay1");
  const [ngayDauNam, setNgayDauNam] = useState("2000");
  const [appSound, setAppSound] = useState(true);
  const [notificationType, setNotificationType] = useState("ring");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);

  // Xử lý thay đổi đơn vị tiền
  const handleCurrencyUnitChange = (e) => {
    setCurrencyUnit(e.target.value);
  };

  // Xử lý thay đổi tỉ giá tiền
  const handleCurrencyRateChange = (e) => {
    setCurrencyRate(e.target.value);
  };

  // Xử lý thay đổi định dạng tiền
  const handleCurrencyFormatChange = (e) => {
    setCurrencyFormat(e.target.value);
  };

  // Xử lý khi nhấn nút Lưu trong phần tiền tệ
  const handleCurrencySave = () => {
    // Code xử lý khi lưu dữ liệu về tiền tệ
    console.log(
      "Dữ liệu tiền tệ đã được lưu:",
      currencyUnit,
      currencyRate,
      currencyFormat
    );
    // Hiển thị thông báo lưu thành công
    setSaveSuccess(true);
    // Sau 3 giây, ẩn thông báo thành công
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  // Xử lý khi nhấn nút Hủy trong phần tiền tệ
  const handleCurrencyCancel = () => {
    // Code xử lý khi hủy
    console.log("Hủy cập nhật tiền tệ");
    // Hiển thị thông báo hủy thành công
    setCancelSuccess(true);
    // Sau 3 giây, ẩn thông báo thành công
    setTimeout(() => {
      setCancelSuccess(false);
    }, 3000);
  };

  // Xử lý khi nhấn nút Lưu
  const handleSave = () => {
    // Code xử lý khi lưu
    console.log("Nút Lưu được nhấn");
    // Hiển thị thông báo lưu thành công
    setSaveSuccess(true);
    // Sau 3 giây, ẩn thông báo thành công
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  // Xử lý khi nhấn nút Hủy
  const handleCancel = () => {
    // Code xử lý khi hủy
    console.log("Nút Hủy được nhấn");
    // Hiển thị thông báo hủy thành công
    setCancelSuccess(true);
    // Sau 3 giây, ẩn thông báo thành công
    setTimeout(() => {
      setCancelSuccess(false);
    }, 3000);
  };

  return (
    <Container className={cx("wrapper")}>
      <Row>
        <Col
          md={4}
          className={cx("hienthi", "border rounded border-primary m-5 p-3")}
        >
          <h2>Cài Đặt Hiển Thị</h2>
          <Form>
            <Form.Group>
              <Form.Label>Chế Độ Hiển Thị</Form.Label>
              <Form.Control
                as="select"
                value={display}
                onChange={(e) => setDisplay(e.target.value)}
              >
                <option value="sang">Sáng</option>
                <option value="toi">Tối</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Ngôn Ngữ</Form.Label>
              <Form.Control
                as="select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="tiengviet">Tiếng Việt</option>
                <option value="tiengAnh">Tiếng Anh</option>
              </Form.Control>
            </Form.Group>
            <Button
              variant="primary"
              className={cx("custom-button")}
              onClick={handleSave}
            >
              Lưu
            </Button>{" "}
            <Button
              variant="secondary"
              className={cx("custom-button")}
              onClick={handleCancel}
            >
              Hủy
            </Button>
            {saveSuccess && (
              <Alert variant="success" className="mt-2">
                Lưu thành công!
              </Alert>
            )}
            {cancelSuccess && (
              <Alert variant="danger" className="mt-2">
                Hủy thành công!
              </Alert>
            )}
          </Form>
        </Col>
        <Col
          md={4}
          className={cx("hethong", "border rounded border-success m-5 p-3")}
        >
          <h2>Cài Đặt Hệ Thống</h2>
          <Form>
            <Form.Group>
              <Form.Label className={cx("me-4")}>Âm Thanh Ứng Dụng</Form.Label>
              <Form.Control
                as="select"
                value={appSound}
                onChange={(e) => setAppSound(e.target.value)}
              >
                <option value="sang">Tắt</option>
                <option value="toi">Mở</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Loại Thông Báo</Form.Label>
              <Form.Control
                as="select"
                value={notificationType}
                onChange={(e) => setNotificationType(e.target.value)}
              >
                <option value="ring">Chuông</option>
                <option value="vibrate">Gửi Thông Báo</option>
                <option value="silent">Im Lặng</option>
              </Form.Control>
            </Form.Group>
            <Button
              variant="primary"
              className={cx("custom-button")}
              onClick={handleSave}
            >
              Lưu
            </Button>
            <Button
              variant="secondary"
              className={cx("custom-button")}
              onClick={handleCancel}
            >
              Hủy
            </Button>
          </Form>
        </Col>
        <Col
          md={4}
          className={cx("tiente", "border rounded border-danger m-5 p-3")}
        >
          <h2>Cài Đặt Tiền Tệ</h2>
          <Form>
            <Form.Group>
              <Form.Label>Đơn Vị Tiền</Form.Label>
              <Form.Control
                type="text"
                placeholder="Đơn Vị Tiền"
                value={currencyUnit}
                onChange={handleCurrencyUnitChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Tỉ Giá Tiền</Form.Label>
              <Form.Control
                type="text"
                placeholder="Tỉ Giá Tiền"
                value={currencyRate}
                onChange={handleCurrencyRateChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Định Dạng Tiền </Form.Label>
              <Form.Control
                type="text"
                placeholder="Định Dạng Tiền"
                value={currencyFormat}
                onChange={handleCurrencyFormatChange}
              />
            </Form.Group>
            <Button
              variant="primary"
              className={cx("custom-button")}
              onClick={handleCurrencySave}
            >
              Lưu
            </Button>{" "}
            <Button
              variant="secondary"
              className={cx("custom-button")}
              onClick={handleCurrencyCancel}
            >
              Hủy
            </Button>
          </Form>
        </Col>

        <Col
          md={4}
          className={cx("ngaythang", "border rounded border-secondary m-5 p-3")}
        >
          <h2>Cài Đặt Ngày Tháng</h2>
          <Form>
            <Form.Group controlId="ngayDauTuan">
              <Form.Label>Ngày Đầu Tuần</Form.Label>
              <Form.Control
                as="select"
                value={ngayDauTuan}
                onChange={(e) => setNgayDauTuan(e.target.value)}
              >
                <option value="thuHai">Thứ Hai</option>
                <option value="thuBa">Thứ Ba</option>
                <option value="thuTu">Thứ Tư</option>
                <option value="thuNam">Thứ Năm</option>
                <option value="thuSau">Thứ Sáu</option>
                <option value="thuBay">Thứ Bảy</option>
                <option value="chuNhat">Chủ Nhật</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="ngayDauThang">
              <Form.Label>Ngày Đầu Tháng</Form.Label>
              <Form.Control
                as="select"
                value={ngayDauThang}
                onChange={(e) => setNgayDauThang(e.target.value)}
              >
                {[...Array(31).keys()].map((i) => (
                  <option key={i + 1} value={`ngay${i + 1}`}>
                    {i + 1}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="ngayDauNam">
              <Form.Label>Đầu Năm</Form.Label>
              <Form.Control
                as="select"
                value={ngayDauNam}
                onChange={(e) => setNgayDauNam(e.target.value)}
              >
                {[...Array(26).keys()].map((i) => (
                  <option key={2000 + i} value={2000 + i}>
                    {2000 + i}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="dateFormat">
              <Form.Label>Định Dạng Ngày Tháng</Form.Label>
              <Form.Control
                as="select"
                value={dateFormat}
                onChange={(e) => setDateFormat(e.target.value)}
              >
                <option value="dd/mm/yyyy">Ngày/Tháng/Năm</option>
                <option value="mm/dd/yyyy">Tháng/Ngày/Năm</option>
                <option value="yyyy/mm/dd">Năm/Tháng/Ngày</option>
              </Form.Control>
            </Form.Group>
            <Button
              variant="primary"
              className={cx("custom-button")}
              onClick={handleSave}
            >
              Lưu
            </Button>
            <Button
              variant="secondary"
              className={cx("custom-button")}
              onClick={handleCancel}
            >
              Hủy
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default SettingsForm;
