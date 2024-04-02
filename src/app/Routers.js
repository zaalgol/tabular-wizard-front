import {
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import Login from "../authentication/Login";
import MainPage from "./MainPage";
import TrainModel from "../ai/TrainModel"
import UserModels from "../ai/UserModels"

function Routers() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="/" element={<MainPage />} />
      <Route path="/trainModel" element={<TrainModel />} />
      <Route path="/userModels" element={<UserModels />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default Routers;
