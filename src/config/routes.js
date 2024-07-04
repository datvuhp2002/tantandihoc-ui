const routes = {
  home: "/",
  login: "/login",
  register: "/register",
  blog: "/blog",
  Info: "/info/:username",
  courseDetail: "/course-detail/:id",
  learning: "/course/learning/:id",
  learningParts: "/learning-parts",
  setting: "setting",
  createPost: "/create-post",
  savedPost: "/saved-posts",
  myPost: "/my-posts",
  userPost: "/blog/user-posts",
  myCourses: "/my-courses",
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
  courseReceived: "/admin/course/course-received/:id",
  post: "/admin/post",
  postAdd: "/admin/post/post-add",
  postUpdate: "/admin/post/post-update/:id",
  lesson: "/admin/lesson",
  lessonAdd: "/admin/lesson/lesson-add/:id",
  lessonCreate: "/admin/lesson/lesson-add",
  category: "/admin/categories",
  categoryAdd: "/admin/categories/category-add",
  categoryUpdate: "/admin/categories/category-update/:id",
};
export { routes, routesAdmin };
