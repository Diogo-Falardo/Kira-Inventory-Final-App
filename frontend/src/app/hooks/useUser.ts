import { useMutation } from "@tanstack/react-query";
import {
  patchUserProfile,
  putChangeEmail,
  putChangePassword,
} from "../endpoints/user";
import type {
  UserOut,
  UserProfile,
  Email,
  ChangePasswords,
} from "../endpoints/user";

export function useUpdateUserProfile() {
  return useMutation<UserProfile, unknown, UserProfile>({
    mutationFn: patchUserProfile,
  });
}

export function useChangeEmail() {
  return useMutation<UserOut, unknown, Email>({
    mutationFn: putChangeEmail,
  });
}

export function useChangePassword() {
  return useMutation<UserOut, unknown, ChangePasswords>({
    mutationFn: putChangePassword,
  });
}
