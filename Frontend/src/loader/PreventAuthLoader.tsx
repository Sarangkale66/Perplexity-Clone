import { redirect } from "react-router-dom";
import Cookies from "js-cookie";

export function preventAuthLoader() {
  const token = Cookies.get("token");

  if (token) {
    throw redirect("/");
  }

  return null;
}