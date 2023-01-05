export type SignInInput = {
  username: string;
  password: string;
};
export type SignUpInput = {
  name?: string;
  username: string;
  password: string;
};

export interface ProfileAttributes {
  email: string;
  name?: string;
  family_name?: string;
}
export type ConfirmSignUpInput = {
  username: string;
  code: string;
};
export type ResendSignUpInput = {
  username: string;
};
export type ForgotPasswordInput = {
  username: string;
};
export type ResetPasswordInput = {
  username: string;
  code: string;
  password: string;
};
