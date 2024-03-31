import {
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import Login from "../authentication/Login";
import MainPage from "./MainPage";
import FileUpload from "../ai/FileUpload"

function Routers() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="/" element={<MainPage />} />
      <Route path="/trainModel" element={<FileUpload />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default Routers;