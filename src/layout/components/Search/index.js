import React, { useEffect, useState, useRef } from "react";
import {
  faCircleXmark,
  faMagnifyingGlass,
  faSpinner,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import HeadlessTippy from "@tippyjs/react/headless";
import classNames from "classnames/bind";

import useDebounce from "~/hooks/useDebounce";
import styles from "./Search.module.scss";
import { Wrapper } from "../Popper";
import requestApi from "~/utils/api";
import Button from "~/components/Button";
import SearchCourseResult from "~/components/SearchCourseResult";
import SearchPostResult from "~/components/SearchPostResult";

const cx = classNames.bind(styles);

function Search() {
  const [searchValue, setSearchValue] = useState("");
  const [searchCoursesResult, setSearchCoursesResult] = useState([]);
  const [searchPostsResult, setSearchPostsResult] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);

  const debouncedValue = useDebounce(searchValue, 500);

  const inputRef = useRef();

  useEffect(() => {
    if (!debouncedValue.trim()) {
      setSearchCoursesResult([]);
      setSearchPostsResult([]);
      return;
    }
    const fetchApi = async () => {
      setLoading(true);
      const postPromiseData = requestApi(
        `/posts?items_per_page=3&search=${searchValue}`,
        "GET"
      );
      const coursePromiseData = requestApi(
        `/courses?items_per_page=3&search=${searchValue}`,
        "GET"
      );
      Promise.all([coursePromiseData, postPromiseData]).then((res) => {
        setSearchCoursesResult(res[0].data.data);
        setSearchPostsResult(res[1].data.data);
        console.log(res[1].data.data);
        setLoading(false);
      });
    };
    fetchApi();
  }, [debouncedValue]);
  const handleClear = () => {
    setSearchValue("");
    setSearchCoursesResult([]);
    setSearchPostsResult([]);
    inputRef.current.focus();
  };

  const handleHideResult = () => {
    setShowResult(false);
  };
  const handleHideResultsAndResetInput = () => {
    setShowResult(false);
    setSearchValue("");
  };
  const handleChange = (e) => {
    const searchValue = e.target.value;
    if (!searchValue.startsWith(" ")) {
      setSearchValue(searchValue);
    }
  };

  return (
    <div
      className={cx("body", "d-flex justify-content-center align-items-center")}
    >
      <HeadlessTippy
        interactive
        visible={showResult && searchValue.length > 0}
        render={(attrs) => (
          <div className={cx("search-result")} tabIndex="-1" {...attrs}>
            <Wrapper>
              {loading ? (
                <div className="d-flex">
                  <FontAwesomeIcon className={cx("loading")} icon={faSpinner} />
                  <span className="ms-3">
                    Đang tìm kiếm kết quả cho {searchValue}
                  </span>
                </div>
              ) : (
                <>
                  <div className="d-flex align-items-center">
                    {searchCoursesResult.length === 0 ? (
                      <div
                        className={cx(
                          "d-flex align-items-center justify-content-between my-2"
                        )}
                      >
                        <FontAwesomeIcon
                          className={cx(
                            "search-title",
                            "d-flex align-items-end justify-content-end text-end fs-3"
                          )}
                          icon={faMagnifyingGlass}
                        />
                        <span className="ms-2">
                          Không tìm thấy khóa học nào là {searchValue}
                        </span>
                      </div>
                    ) : (
                      <div className="w-100 mb-3">
                        <div
                          className={cx(
                            "search_heading",
                            "d-flex align-items-center justify-content-between mt-2"
                          )}
                        >
                          <h4 className={cx("search-title")}>KHÓA HỌC</h4>
                          <Button more className="d-flex align-items-end fs-5">
                            Xem thêm
                          </Button>
                        </div>
                        {searchCoursesResult.map((result) => (
                          <SearchCourseResult
                            key={result.id}
                            data={result}
                            onClick={() => handleHideResultsAndResetInput()}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="d-flex align-items-center">
                    {searchPostsResult.length === 0 ? (
                      <div className="d-flex w-100 align-items-center">
                        <FontAwesomeIcon
                          className={cx(
                            "search-title",
                            "d-flex align-items-end justify-content-end text-end fs-3"
                          )}
                          icon={faMagnifyingGlass}
                        />
                        <span className="ms-2">
                          Không tìm thấy bài viết nào là {searchValue}
                        </span>
                      </div>
                    ) : (
                      <div className="w-100 mb-3">
                        <div
                          className={cx(
                            "search_heading",
                            "d-flex align-items-center justify-content-between"
                          )}
                        >
                          <h4 className={cx("search-title")}>BÀI VIẾT</h4>
                          <Button more className="d-flex align-items-end fs-5">
                            Xem thêm
                          </Button>
                        </div>
                        {searchPostsResult.map((result) => (
                          <SearchPostResult
                            key={result.id}
                            data={result}
                            onClick={() => handleHideResultsAndResetInput()}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </Wrapper>
          </div>
        )}
        onClickOutside={handleHideResult}
      >
        <div
          className={cx(
            "SearchWrapper",
            "d-flex justify-content-start align-items-center"
          )}
        >
          <FontAwesomeIcon
            className={cx("SearchIcon")}
            icon={faMagnifyingGlass}
          />
          <input
            value={searchValue}
            spellCheck={false}
            ref={inputRef}
            onChange={handleChange}
            className={cx("SearchInput", "w-100")}
            onFocus={() => setShowResult(true)}
            type="text"
            placeholder="Tìm kiếm khóa học, bài viết, video, ..."
          />
          {!!searchValue && !loading && (
            <button
              className="d-flex align-items-center h-100 ps-3 justify-content-end border border-0 bg-transparent"
              onClick={handleClear}
            >
              <FontAwesomeIcon className={cx("", "fs-5")} icon={faX} />
            </button>
          )}
        </div>
      </HeadlessTippy>
    </div>
  );
}

export default Search;
