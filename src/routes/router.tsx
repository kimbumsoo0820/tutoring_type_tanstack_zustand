import { createBrowserRouter } from "react-router-dom";
import Main from "../pages/Main";
import Error from "../pages/error/Error";
import Detail from "../pages/Detail";
import User from "../pages/User";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    errorElement: <Error />,
  },
  {
    path: "/detail",
    element: <Detail />,
    errorElement: <Error />,
  },
  {
    path: "/user",
    element: <User />,
    errorElement: <Error />,
  },
]);

export default router;
