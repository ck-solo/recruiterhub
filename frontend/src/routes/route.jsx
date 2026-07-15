import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute.jsx";
import { PublicRoute } from "./PublicRoute.jsx";
import App from "../app/App.jsx";
import AppLayout from "../shared/layout/AppLayout.jsx";
import ErrorRoute from "./ErrorRoute.jsx";

const Login = lazy(() => import("../features/auth/pages/Login.jsx"));
const Register = lazy(() => import("../features/auth/pages/Register.jsx"));
const Dashboard = lazy(() => import("../features/dashboard/pages/Dashboard.jsx"));
const JobSearch = lazy(() => import("../features/jobs/pages/JobSearch.jsx"));
const JobDetails = lazy(() => import("../features/jobs/pages/JobDetails.jsx"));
const ExcelImport = lazy(() => import("../features/import/pages/ExcelImport.jsx"));
const DuplicateResolver = lazy(() => import("../features/duplicates/pages/DuplicateResolver.jsx"));
const ResumeTailor = lazy(() => import("../features/resume/pages/ResumeTailor.jsx"));

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        element: <PublicRoute />,
        children: [
          {
            path: "/login",
            element: <Login />,
          },
          {
            path: "/register",
            element: <Register />,
          },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/",
            element: <AppLayout />,
            children: [
              {
                path: "",
                element: <Dashboard />,
              },
              {
                path: "jobs",
                element: <JobSearch />,
              },
              {
                path: "jobs/:id",
                element: <JobDetails />,
              },
              {
                path: "import",
                element: <ExcelImport />,
              },
              {
                path: "duplicates",
                element: <DuplicateResolver />,
              },
              {
                path: "resume",
                element: <ResumeTailor />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <ErrorRoute />,
  },
]);
