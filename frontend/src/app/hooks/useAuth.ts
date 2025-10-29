import { useMutation } from "@tanstack/react-query";
import { postLogin, postRegister } from "../endpoints/auth";
import type {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
} from "../endpoints/auth";

export function useLogin() {
  return useMutation<LoginResponse, unknown, LoginPayload>({
    mutationFn: postLogin,

    onSuccess: (data) => {
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
    },
  });
}

export function useRegister() {
  return useMutation<RegisterResponse, unknown, RegisterPayload>({
    mutationFn: postRegister,
  });
}
