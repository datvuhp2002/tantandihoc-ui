import config from "~/config";
import Home from "~/pages/Home";
import Login from "~/pages/Login";
import Register from "~/pages/Register";
import Blog from "~/pages/Blog";
import Info from "~/pages/Info";
import Setting from "~/pages/Setting";
import FooterOnly from "~/layout/FooterOnly";
import CourseDetail from "~/pages/CourseDetail";
import CreatePost from "~/pages/CreatePost";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faCashRegister,
  faCircleQuestion,
  faDashboard,
  faGraduationCap,
  faHome,
  faIcons,
  faNewspaper,
  faPercent,
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
import Discount from "~/pages/ADMIN/Discount";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import DiscountAdd from "~/pages/ADMIN/Discount/DiscountAdd";
import DiscountUpdate from "~/pages/ADMIN/Discount/DiscountUpdate";
import PaymentError from "~/layout/PaymentError";
import PaymentSuccess from "~/layout/PaymentSuccess";
import CourseView from "~/pages/ADMIN/Course/CourseView";
import CourseReceivedUpdate from "~/pages/ADMIN/Course/CourseReceived/CourseReceivedUpdate";
import Transaction from "~/pages/ADMIN/Transaction";
import MyPostPublished from "~/pages/MyPostPublished";
import MyPostUnPublished from "~/pages/MyPostUnPublished";
import EditPost from "~/pages/EditPost";
import ForgetPassword from "~/pages/ForgetPassword";
import VerifyOTP from "~/pages/VerifyOTP";
import TrashCourse from "~/pages/ADMIN/Course/Trash";
import UserTrash from "~/pages/ADMIN/User/UserTrash";
import PracticeProgramming from "~/pages/PracticeProgramming";
import LessonTrash from "~/pages/ADMIN/Lesson/Trash";
import QuizTrash from "~/pages/ADMIN/Quiz/Trash";
import PostTrash from "~/pages/ADMIN/Post/Trash";
import CommentPost from "~/pages/ADMIN/CommentPost";
import LessonView from "~/pages/ADMIN/Lesson/View";
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
  {
    path: config.routes.forgetPassword,
    component: ForgetPassword,
    layout: FooterOnly,
  },
  {
    path: config.routes.verifyToken,
    component: VerifyOTP,
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
    path: config.routes.paymentSuccess,
    component: PaymentSuccess,
  },
  {
    path: config.routes.paymentError,
    component: PaymentError,
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
    path: config.routes.myPostPublished,
    component: MyPostPublished,
  },
  {
    path: config.routes.myPostUnpublished,
    component: MyPostUnPublished,
  },
  {
    path: config.routes.updatePost,
    component: EditPost,
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
    path: config.routes.practiceProgramming,
    component: PracticeProgramming,
  },
  {
    path: config.routes.learning,
    component: Learning,
    layout: LessonLayout,
    isNotNeedContainer: true,
  },
];
const adminRoutes = [
  {
    name: "Bảng tin",
    path: config.routesAdmin.dashboard,
    component: Dashboard,
    icon: <FontAwesomeIcon icon={faDashboard} />,
  },
  {
    name: "Giao dịch",
    path: config.routesAdmin.transaction,
    component: Transaction,
    icon: <FontAwesomeIcon icon={faCashRegister} />,
  },
  {
    name: "Người dùng",
    path: config.routesAdmin.user,
    component: User,
    icon: <FontAwesomeIcon icon={faUser} />,
  },
  {
    path: config.routesAdmin.userTrash,
    component: UserTrash,
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
    name: "Giảm giá",
    path: config.routesAdmin.discount,
    component: Discount,
    icon: <FontAwesomeIcon icon={faPercent} />,
  },
  {
    path: config.routesAdmin.discountAdd,
    component: DiscountAdd,
  },
  {
    path: config.routesAdmin.discountUpdate,
    component: DiscountUpdate,
  },

  {
    name: "Khóa học",
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
    path: config.routesAdmin.courseView,
    component: CourseView,
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
    path: config.routesAdmin.courseReceivedUpdate,
    component: CourseReceivedUpdate,
  },
  {
    path: config.routesAdmin.courseTrash,
    component: TrashCourse,
  },
  {
    name: "Bài học",
    path: config.routesAdmin.lesson,
    component: Lesson,
    icon: <FontAwesomeIcon icon={faGraduationCap} />,
  },
  {
    path: config.routesAdmin.lessonView,
    component: LessonView,
  },
  {
    path: config.routesAdmin.lessonAddUrlVid,
    component: LessonAddYoutubeVideo,
  },
  {
    path: config.routesAdmin.lessonTrash,
    component: LessonTrash,
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
    name: "Bài tập",
    path: config.routesAdmin.quiz,
    component: Quiz,
    icon: <FontAwesomeIcon icon={faCircleQuestion} />,
  },
  {
    path: config.routesAdmin.quizAdd,
    component: QuizAdd,
  },
  {
    path: config.routesAdmin.quizTrash,
    component: QuizTrash,
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
  {
    name: "Bài viết",
    path: config.routesAdmin.post,
    component: Post,
    icon: <FontAwesomeIcon icon={faNewspaper} />,
  },
  {
    path: config.routesAdmin.postAdd,
    component: PostAdd,
  },
  {
    path: config.routesAdmin.commentPost,
    component: CommentPost,
  },
  {
    path: config.routesAdmin.postTrash,
    component: PostTrash,
  },
  {
    path: config.routesAdmin.postUpdate,
    component: PostUpdate,
  },
  {
    name: "Thể loại",
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
];
export { publicRoutes, privateRoutes, adminRoutes };
