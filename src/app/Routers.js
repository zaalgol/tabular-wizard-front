import {
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import Login from "../authentication/Login";
import TrainModel from "../ai/TrainModel"
import UserModels from "../ai/UserModels"
import Inference from "../ai/Inference"
import PrivateRoute from '../authentication/PrivateRoute';

function Routers() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route exact element={<PrivateRoute />}>
          <Route exact path="/" element={<TrainModel />} />
          <Route path="/trainModel" element={<TrainModel />} />
          <Route path="/userModels" element={<UserModels />} />
          <Route path="/inference" element={<Inference />} />
          <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
      
    </Routes>
  );
}

export default Routers;
