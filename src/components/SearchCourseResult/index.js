import PropTypes from "prop-types";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import classNames from "classnames/bind";
import Image from "~/components/Image";
import styles from "./SearchCourseResult.module.scss";

const cx = classNames.bind(styles);

function SearchCourseResult({ data, onClick }) {
  return (
    <Link
      to={`/course-detail/${data.id}`}
      className={cx("wrapper")}
      onClick={onClick}
    >
      <Image
        className={cx("avatar")}
        src={`${process.env.REACT_APP_API_URL}/${data.thumbnail}`}
      />
      <div className={cx("info")}>
        <h4 className={cx("title")}>
          <span>{data.name}</span>
          {data.tick && (
            <FontAwesomeIcon className={cx("check")} icon={faCheckCircle} />
          )}
        </h4>
        <span className={cx("username")}>{data.nickname}</span>
      </div>
    </Link>
  );
}

SearchCourseResult.propTypes = {
  data: PropTypes.object.isRequired,
};

export default SearchCourseResult;
