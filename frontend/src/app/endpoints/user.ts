import api from "../api";

export interface UserLogged {
  email: string;
  username: string | null;
  avatar: string | null;
  last_login: string;
}

export async function getUserLogged(): Promise<UserLogged> {
  const res = await api.get<UserLogged>("/user/user");
  return res.data;
}

export interface UserProfile {
  username?: string;
  avatar_url?: string;
  address?: string;
  country?: string;
  phone_number?: string;
}

export const patchUserProfile = async (
  data: UserProfile
): Promise<UserProfile> => {
  const res = await api.patch<UserProfile>("/user/update-user", data);
  return res.data;
};

export type UserOut = {
  email: string;
  plan_code: string;
  created_at: string;
  updated_at: string;
};

export type Email = {
  email: string;
};

export const putChangeEmail = async (data: Email): Promise<UserOut> => {
  const res = await api.put<UserOut>("/user/change-email/", data);
  return res.data;
};

export type ChangePasswords = {
  password: string;
  new_password: string;
};

export const putChangePassword = async (
  data: ChangePasswords
): Promise<UserOut> => {
  const res = await api.put<UserOut>("/user/change-password", data);
  return res.data;
};
