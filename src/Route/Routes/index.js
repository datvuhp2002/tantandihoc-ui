import config from "~/config";
import Home from "~/pages/Home";
import Login from "~/pages/Login";
import Register from "~/pages/Register";
import Blog from "~/pages/Blog";
import ThietLapUngDung from "~/pages/thietlapungdung";
import Info from "~/pages/Info";
import Setting from "~/pages/Setting";
import FooterOnly from "~/layout/FooterOnly";
import CourseDetail from "~/pages/CourseDetail";
import CreatePost from "~/pages/CreatePost";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faCircleQuestion,
  faDashboard,
  faGraduationCap,
  faHome,
  faIcons,
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
import MyCourses from "~/pages/MyCourse";
import Learning from "~/pages/Learning";
import LessonLayout from "~/layout/LessonLayout";
import ProfileLayout from "~/layout/ProfileLayout";
import PostLayout from "~/layout/PostLayout";
import SettingLayout from "~/layout/SettingLayout";
import UserPost from "~/pages/UserPost";
import Category from "~/pages/ADMIN/Category";
import CategoryAdd from "~/pages/ADMIN/Category/CategoryAdd";
import CategoryUpdate from "~/pages/ADMIN/Category/CategoryUpdate";
import Lesson from "~/pages/ADMIN/Lesson";
import CoursePage from "~/pages/Course";
import LessonAddNoVideo from "~/pages/ADMIN/Lesson/LessonAdd/LessonAddNoVideo";
import LessonAddUploadLocalVid from "~/pages/ADMIN/Lesson/LessonAdd/LessonAddUploadLocalVid";
import LessonAddYoutubeVideo from "~/pages/ADMIN/Lesson/LessonAdd/LessonAddYoutubeVideo";
import CourseReceivedAdd from "~/pages/ADMIN/Course/CourseReceived/CourseReceivedAdd";
import LessonUpdate from "~/pages/ADMIN/Lesson/LessonUpdate";
import Quiz from "~/pages/ADMIN/Quiz";
import QuizAnswer from "~/pages/ADMIN/QuizAnswer";
import QuizAdd from "~/pages/ADMIN/Quiz/QuizAdd";
import QuizUpdate from "~/pages/ADMIN/Quiz/QuizUpdate";
import QuizAnswerAdd from "~/pages/ADMIN/QuizAnswer/QuizAnswerAdd";
import QuizAnswerUpdate from "~/pages/ADMIN/QuizAnswer/QuizAnswerUpdate";
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
    path: config.routes.courses,
    component: CoursePage,
    name: "Khóa học",
    icon: <FontAwesomeIcon icon={faBook} />,
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
    path: config.routes.userPost,
    component: UserPost,
  },
  {
    path: config.routes.myCourses,
    component: MyCourses,
  },
  { path: config.routes.courseDetail, component: CourseDetail },
  { path: config.routes.postDetail, component: PostDetail, layout: PostLayout },
  { path: config.routes.createPost, component: CreatePost },
  { path: config.routes.setting, component: Setting, layout: SettingLayout },
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
    path: config.routesAdmin.courseReceivedAdd,
    component: CourseReceivedAdd,
  },
  {
    path: config.routesAdmin.courseReceived,
    component: CourseReceived,
  },
  {
    name: "Lesson",
    path: config.routesAdmin.lesson,
    component: Lesson,
    icon: <FontAwesomeIcon icon={faGraduationCap} />,
  },
  {
    path: config.routesAdmin.lessonAddUrlVid,
    component: LessonAddYoutubeVideo,
  },

  {
    path: config.routesAdmin.lessonAddNoVid,
    component: LessonAddNoVideo,
  },
  //
  {
    path: config.routesAdmin.lessonUpdate,
    component: LessonUpdate,
  },
  {
    path: config.routesAdmin.lessonAddUploadVid,
    component: LessonAddUploadLocalVid,
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
    name: "Category",
    path: config.routesAdmin.category,
    component: Category,
    icon: <FontAwesomeIcon icon={faIcons} />,
  },
  {
    path: config.routesAdmin.categoryAdd,
    component: CategoryAdd,
  },
  {
    path: config.routesAdmin.categoryUpdate,
    component: CategoryUpdate,
  },

  {
    name: "Quiz",
    path: config.routesAdmin.quiz,
    component: Quiz,
    icon: <FontAwesomeIcon icon={faCircleQuestion} />,
  },
  {
    path: config.routesAdmin.quizAdd,
    component: QuizAdd,
  },
  {
    path: config.routesAdmin.quizUpdate,
    component: QuizUpdate,
  },
  {
    path: config.routesAdmin.quizAnswer,
    component: QuizAnswer,
  },
  {
    path: config.routesAdmin.quizAnswerAdd,
    component: QuizAnswerAdd,
  },
  {
    path: config.routesAdmin.quizAnswerUpdate,
    component: QuizAnswerUpdate,
  },
];
export { publicRoutes, privateRoutes, adminRoutes };
