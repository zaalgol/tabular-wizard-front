import {
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import React from 'react';
import Login from "../authentication/Login";
import Register from "../authentication/Register";
import ForgotPassword from "../authentication/ForgotPassword";
import ResetPassword from "../authentication/ResetPassword";
import UpdatePassword from "../authentication/UpdatePassword";
import TrainModel from "../ai/TrainModel"
import UserModels from "../ai/UserModels"
import Inference from "../ai/Inference"
import PrivateRoute from '../authentication/PrivateRoute';

function Routers() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgotPassword" element={<ForgotPassword />} />
      <Route path="/resetPassword" element={<ResetPassword />} />
      <Route exact element={<PrivateRoute />}>
          <Route exact path="/" element={<TrainModel />} />
          <Route path="/trainModel" element={<TrainModel />} />
          <Route path="/userModels" element={<UserModels />} />
          <Route path="/inference" element={<Inference />} />
          <Route path="/updatePassword" element={<UpdatePassword />} />
          <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
      
    </Routes>
  );
}

export default Routers;
