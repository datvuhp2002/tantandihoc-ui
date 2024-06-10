import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import styles from "./error.module.scss";
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
const cx = classNames.bind(styles);

const ReportErrorPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error state

    // Kiểm tra xem email và message có được nhập hay không
    if (!email || !message) {
      setError("Vui lòng nhập địa chỉ email và nội dung.");
      return;
    }

    // Tạo đối tượng FormData để gửi dữ liệu và tập tin
    const formData = new FormData();
    formData.append("email", email);
    formData.append("message", message);
    if (file) {
      formData.append("file", file);
    }

    try {
      // Gửi formData qua email
      // Ví dụ: sử dụng API để gửi email
      const response = await fetch("https://example.com/send-email", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Có lỗi xảy ra khi gửi báo cáo.");
      }
      setSuccess(true);
    } catch (error) {
      console.error("Error:", error);
      setError("Có lỗi xảy ra khi gửi báo cáo.");
    }
  };

  return (
    <div className={cx("wrapper")}>
      <Container>
        <h1>
          <FontAwesomeIcon
            icon={faCircleExclamation}
            className={cx("text-danger")}
          />{" "}
          Báo cáo lỗi
        </h1>
        <Form onSubmit={handleSubmit}>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && (
            <Alert variant="success">Báo cáo đã được gửi thành công!</Alert>
          )}
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Địa chỉ email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={handleEmailChange}
            />
          </Form.Group>

          <Form.Group controlId="formBasicMessage">
            <Form.Label>Nội dung</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter your message here"
              value={message}
              onChange={handleMessageChange}
            />
          </Form.Group>

          <Form.Group controlId="formBasicFile">
            <Form.Label>Tập tin kèm</Form.Label>
            <Form.Control type="file" onChange={handleFileChange} />
          </Form.Group>
          <div className={cx("button-container")}>
            <Button
              variant="primary"
              className={cx("gui")}
              type="submit"
              disabled={success} // Disable nút khi báo cáo đã gửi thành công
            >
              {success ? "Đã gửi" : "Gửi"}
            </Button>
          </div>
        </Form>
      </Container>
    </div>
  );
};

export default ReportErrorPage;
