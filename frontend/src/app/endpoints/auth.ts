import api from "../api";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export const postLogin = async (data: LoginPayload): Promise<LoginResponse> => {
  const res = await api.post<LoginResponse>("/auth/login", data);
  return res.data;
};

export interface RegisterPayload {
  email: string;
  plan_code: "free";
  password: string;
}

export interface RegisterResponse {
  email: string;
  plan_code: string;
  created_at: string;
  updated_at: string;
}

export const postRegister = async (
  data: RegisterPayload
): Promise<RegisterResponse> => {
  const res = await api.post<RegisterResponse>("/auth/register", data);
  return res.data;
};
