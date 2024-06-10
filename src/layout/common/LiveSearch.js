import React, { useEffect, useState } from "react";
import Input from "~/components/Input";
const LiveSearch = ({ onKeySearch }) => {
  const [keyword, setKeyword] = useState("");
  //   debounce search
  useEffect(() => {
    const delayDebounce = setTimeout(() => {}, 500);
    onKeySearch(keyword);
    return () => clearTimeout(delayDebounce);
  }, [keyword]);
  const onTyping = (e) => {
    const target = e.target;
    console.log(target.value);
    setKeyword(target.value);
  };
  return (
    <Input
      type="search"
      onChange={onTyping}
      placeholder="Tìm kiếm theo ghi chú"
    />
  );
};

export default LiveSearch;
