import config from "~/config";
import Home from "~/pages/Home";
import Login from "~/pages/Login";
import Register from "~/pages/Register";
import LearningParts from "~/pages/LearningParts";
import Blog from "~/pages/Blog";
import ThietLapUngDung from "~/pages/thietlapungdung";
import Info from "~/pages/Info";
import CaiDat from "~/pages/CaiDat";
import ReportErrorPage from "~/pages/CaiDat/Error";
import FooterOnly from "~/layout/FooterOnly";
import CourseDetail from "~/pages/CourseDetail";
import CreatePost from "~/pages/CreatePost";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faNewspaper, faRoad } from "@fortawesome/free-solid-svg-icons";
import PostDetail from "~/pages/PostDetail";
const publicRoutes = [
  {
    path: config.routes.login,
    component: Login,
    layout: FooterOnly,
  },
  {
    path: config.routes.register,
    component: Register,
    layout: FooterOnly,
  },
];
const privateRoutes = [
  {
    path: config.routes.home,
    component: Home,
    name: "Trang chủ",
    icon: <FontAwesomeIcon icon={faHome} />,
  },
  {
    path: config.routes.LearningParts,
    component: LearningParts,
    name: "Lộ trình",
    icon: <FontAwesomeIcon icon={faRoad} />,
  },
  {
    path: config.routes.blog,
    component: Blog,
    name: "Bài viết",
    icon: <FontAwesomeIcon icon={faNewspaper} />,
  },
  {
    path: config.routes.Info,
    component: Info,
  },
  { path: config.routes.courseDetail, component: CourseDetail },
  { path: config.routes.postDetail, component: PostDetail },
  { path: config.routes.createPost, component: CreatePost },
  { path: config.routes.caidat, component: CaiDat },
  { path: config.routes.error, component: ReportErrorPage },
];
export { publicRoutes, privateRoutes };
