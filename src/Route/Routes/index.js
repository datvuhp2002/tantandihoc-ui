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
import {
  faBook,
  faDashboard,
  faHome,
  faNewspaper,
  faRoad,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import PostDetail from "~/pages/PostDetail";
import SavedPost from "~/pages/SavedPost";
import MyPost from "~/pages/MyPost";
import Dashboard from "~/pages/ADMIN/Dashbroad";
import User from "~/pages/ADMIN/User";
import UserAdd from "~/pages/ADMIN/User/UserAdd";
import UserUpdate from "~/pages/ADMIN/User/UserUpdate";
import Course from "~/pages/ADMIN/Course";
import CourseAdd from "~/pages/ADMIN/Course/CourseAdd";
import CourseUpdate from "~/pages/ADMIN/Course/CourseUpdate";
import Post from "~/pages/ADMIN/Post";
import PostAdd from "~/pages/ADMIN/Post/PostAdd";
import PostUpdate from "~/pages/ADMIN/Post/PostUpdate";
import CourseReceived from "~/pages/ADMIN/Course/CourseReceived";
import LessonAdd from "~/pages/ADMIN/Lesson/LessonAdd";
import MyCourses from "~/pages/MyCourse";
import Learning from "~/pages/Learning";
import LessonLayout from "~/layout/LessonLayout";
import ProfileLayout from "~/layout/ProfileLayout";
import PostLayout from "~/layout/PostLayout";
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
    path: config.routes.learningParts,
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
    layout: ProfileLayout,
  },
  {
    path: config.routes.savedPost,
    component: SavedPost,
  },
  {
    path: config.routes.myPost,
    component: MyPost,
  },
  {
    path: config.routes.myCourses,
    component: MyCourses,
  },
  { path: config.routes.courseDetail, component: CourseDetail },
  { path: config.routes.postDetail, component: PostDetail, layout: PostLayout },
  { path: config.routes.createPost, component: CreatePost },
  { path: config.routes.caidat, component: CaiDat },
  { path: config.routes.error, component: ReportErrorPage },
  {
    path: config.routes.learning,
    component: Learning,
    layout: LessonLayout,
    isNotNeedContainer: true,
  },
];
const adminRoutes = [
  {
    name: "Dashboard",
    path: config.routesAdmin.dashboard,
    component: Dashboard,
    icon: <FontAwesomeIcon icon={faDashboard} />,
  },
  {
    name: "User",
    path: config.routesAdmin.user,
    component: User,
    icon: <FontAwesomeIcon icon={faUser} />,
  },
  {
    path: config.routesAdmin.userAdd,
    component: UserAdd,
  },
  {
    path: config.routesAdmin.userUpdate,
    component: UserUpdate,
  },
  {
    name: "Course",
    path: config.routesAdmin.course,
    component: Course,
    icon: <FontAwesomeIcon icon={faBook} />,
  },
  {
    path: config.routesAdmin.courseAdd,
    component: CourseAdd,
  },
  {
    path: config.routesAdmin.courseUpdate,
    component: CourseUpdate,
  },
  {
    path: config.routesAdmin.courseReceived,
    component: CourseReceived,
  },
  {
    name: "Post",
    path: config.routesAdmin.post,
    component: Post,
    icon: <FontAwesomeIcon icon={faNewspaper} />,
  },
  {
    path: config.routesAdmin.postAdd,
    component: PostAdd,
  },
  {
    path: config.routesAdmin.postUpdate,
    component: PostUpdate,
  },
  {
    path: config.routesAdmin.lessonAdd,
    component: LessonAdd,
  },
];
export { publicRoutes, privateRoutes, adminRoutes };
