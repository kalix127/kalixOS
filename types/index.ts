export interface LoginForm {
  password: string;
}

export interface WifiNetwork {
  id: number;
  name: string;
  signal: number;
  isProtected: boolean;
}
