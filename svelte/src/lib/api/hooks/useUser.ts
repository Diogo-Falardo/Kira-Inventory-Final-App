// src/lib/hooks/useUser.ts
import {
  getUserLogged,
  patchUserProfile,
  putChangeEmail,
  putChangePassword,
  type ProfilePayload,
  type EmailPayload,
  type PasswordPayload,
  type UserLogged,
  type UserOut,
} from '$lib/api/endpoints/user';

import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query';

export function useUser() {
  const qc = useQueryClient();

  // GET /user/user
  const userQuery = createQuery<UserLogged, Error>(() => ({
    queryKey: ['user'] as const,
    queryFn: getUserLogged,
    staleTime: 60_000,
  }));

  // PATCH /user/update-user
  const updateProfile = createMutation<unknown, Error, ProfilePayload>(() => ({
    mutationFn: patchUserProfile,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['user'] }),
  }));

  // PUT /user/change-email/
  const changeEmail = createMutation<UserOut, Error, EmailPayload>(() => ({
    mutationFn: putChangeEmail,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['user'] }),
  }));

  // PUT /user/change-password
  const changePassword = createMutation<UserOut, Error, PasswordPayload>(() => ({
    mutationFn: putChangePassword,
  }));

  return { userQuery, updateProfile, changeEmail, changePassword };
}
