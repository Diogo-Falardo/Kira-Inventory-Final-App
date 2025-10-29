import api from "../api";

export interface User_logged {
  email: string;
  username: string | null;
  avatar: string | null;
  last_login: string;
}

export async function getUserLogged(): Promise<User_logged> {
  const res = await api.get<User_logged>("/user/user");
  return res.data;
}
