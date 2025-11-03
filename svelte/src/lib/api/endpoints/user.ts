import { z } from 'zod';
import { apiFetch } from '../api';
import { formatZodError } from '../api';

// schemas
export const ProfileSchema = z.object({
  username: z.string().trim().min(1, 'Username is required').optional(),
  avatar_url: z.string().url('Invalid URL').optional(),
  address: z.string().optional(),
  country: z.string().optional(),
  phone_number: z.string().optional(),
});

export type ProfilePayload = z.infer<typeof ProfileSchema>;

export const EmailSchema = z.object({
  email: z.string().email('Invalid email'),
});
export type EmailPayload = z.infer<typeof EmailSchema>;

export const PasswordSchema = z.object({
  password: z.string().min(1, 'Current password is required'),
  new_password: z.string().min(6, 'Password must be at least 6 characters'),
});
export type PasswordPayload = z.infer<typeof PasswordSchema>;

// response
export type UserLogged = {
  email: string;
  username: string | null;
  avatar: string | null;
  last_login: string;
};

export type UserOut = {
  email: string;
  plan_code: string;
  created_at: string;
  updated_at: string;
};

export async function getUserLogged(): Promise<UserLogged> {
  return apiFetch<UserLogged>('/user/user');
}

export async function patchUserProfile(data: ProfilePayload): Promise<unknown> {
  const parsed = ProfileSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(formatZodError(parsed.error));
  }

  return apiFetch('/user/update-user', {
    method: 'PATCH',
    body: JSON.stringify(parsed.data),
  });
}

export async function putChangeEmail(data: EmailPayload): Promise<UserOut> {
  const parsed = EmailSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(formatZodError(parsed.error));
  }

  return apiFetch<UserOut>('/user/change-email/', {
    method: 'PUT',
    body: JSON.stringify(parsed.data),
  });
}

export async function putChangePassword(data: PasswordPayload): Promise<UserOut> {
  const parsed = PasswordSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(formatZodError(parsed.error));
  }

  return apiFetch<UserOut>('/user/change-password', {
    method: 'PUT',
    body: JSON.stringify(parsed.data),
  });
}
