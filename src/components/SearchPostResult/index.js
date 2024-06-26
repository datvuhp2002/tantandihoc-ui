import PropTypes from "prop-types";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import classNames from "classnames/bind";
import Image from "~/components/Image";
import styles from "./SearchPostResult.module.scss";

const cx = classNames.bind(styles);

function SearchPostResult({ data, onClick }) {
  return (
    <Link
      to={`/blog/post-detail/${data.id}`}
      className={cx("wrapper")}
      onClick={onClick}
    >
      <Image
        className={cx("avatar")}
        src={`${process.env.REACT_APP_API_URL}/${data.thumbnail}`}
      />
      <div className={cx("info")}>
        <h4 className={cx("title")}>
          <span>{data.title}</span>
          {data.tick && (
            <FontAwesomeIcon className={cx("check")} icon={faCheckCircle} />
          )}
        </h4>
        <span className={cx("username")}>{data.nickname}</span>
      </div>
    </Link>
  );
}

SearchPostResult.propTypes = {
  data: PropTypes.object.isRequired,
};

export default SearchPostResult;
