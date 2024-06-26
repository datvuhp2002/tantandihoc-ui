const routes = {
  home: "/",
  login: "/login",
  register: "/register",
  LearningParts: "/learning-parts",
  blog: "/blog",
  thietlapungdung: "/thietlapungdung",
  Info: "/info",
  courseDetail: "/course-detail/:id",
  caidat: "caidat",
  error: "/Error",
  createPost: "/create-post",
  savedPost: "/saved-posts",
  myPost: "/my-posts",
  postDetail: "/blog/post-detail/:id",
};
const routesAdmin = {
  dashboard: "/admin/dashboard",
  user: "/admin/user",
  userAdd: "/admin/user/user-add",
  userUpdate: "/admin/user/user-update/:id",
  course: "/admin/course",
  courseAdd: "/admin/course/course-add",
  courseUpdate: "/admin/course/course-update/:id",
  post: "/admin/post",
  postAdd: "/admin/post/post-add",
  postUpdate: "/admin/post/post-update/:id",
};
export { routes, routesAdmin };
