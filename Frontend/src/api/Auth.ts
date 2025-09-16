import type { LoginPayload, RegisterPayload } from "../feature/authReducer/AuthSlice";
import api from "."

export const RegisterUser = async (obj: RegisterPayload) => {
  const res = await api.post("/auth/register", obj);
  return res.data;
}

export const LoginUser = async (obj: LoginPayload) => {
  const res = await api.post("/auth/login", obj);
  return res.data;
}
