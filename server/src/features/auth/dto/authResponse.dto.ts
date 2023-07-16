export class AuthResponseDto {
  userData: {
    id: number;
    name: string;
    avaUrl?: string;
  };
  accessToken: string;
  refreshToken: string;
}
