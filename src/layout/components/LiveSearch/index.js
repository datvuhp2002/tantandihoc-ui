import React, { useEffect, useState } from "react";

const LiveSearch = ({ onKeySearch }) => {
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      console.log("call func onKeySearch");
      onKeySearch(keyword);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [keyword]);

  const onTyping = (event) => {
    const target = event.target;
    setKeyword(target.value);
  };
  return (
    <div className="d-flex align-items-center justify-content-center h-100">
      <input
        type="search"
        onChange={onTyping}
        value={keyword}
        className="form-control form-control-sm ms-1 p-3 fs-5"
        placeholder="Tìm kiếm..."
      />
    </div>
  );
};

export default LiveSearch;
