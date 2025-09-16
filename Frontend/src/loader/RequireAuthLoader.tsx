import { redirect } from "react-router-dom";
import Cookies from "js-cookie";

export function requireAuthLoader() {
  const token = Cookies.get("token");

  if (!token) {
    throw redirect("/auth/login");
  }

  return null;
}