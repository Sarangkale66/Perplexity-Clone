import { useMutation } from "@tanstack/react-query";
import { LoginUser, RegisterUser } from "../../api/Auth";

export const useAuthMutation = () => {
  const signupMutation = useMutation({
    mutationFn: RegisterUser,
  });

  const signinMutation = useMutation({
    mutationFn: LoginUser
  });

  return [signinMutation, signupMutation];
}