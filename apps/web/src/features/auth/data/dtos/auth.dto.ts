export interface AuthResponseDTO {
  accessToken: string;
  refreshToken: string;
  user: {
    userId: string;
    email: string;
    name: string;
    avatar?: string;
    role: string;
    createdAt: string;
  };
}

export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface RegisterRequestDTO {
  email: string;
  name: string;
  password: string;
}
