import React from "react";
import requestApi from "~/utils/api";

class CustomUploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }
  upload = () => {
    return this.loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          // upload image to server
          const formData = new FormData();
          formData.append("upload", file);
          requestApi(
            "/posts/cke-upload",
            "post",
            formData,
            "json",
            "multipart/form-data"
          )
            .then((res) => {
              resolve({
                default: `${process.env.REACT_APP_API_URL}/${res.data.url}`,
              });
            })

            .catch((err) => {
              reject(err);
              console.log(err);
            });
        })
    );
  };
}
export default CustomUploadAdapter;
