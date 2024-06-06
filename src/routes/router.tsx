import { createBrowserRouter } from "react-router-dom";
import Main from "../pages/Main";
import Error from "../pages/error/Error";
import Detail from "../pages/Detail";

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
]);

export default router;
