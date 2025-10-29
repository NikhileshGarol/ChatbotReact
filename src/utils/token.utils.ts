import { jwtDecode } from "jwt-decode";

type DecodedToken = {
  exp?: number;
  [key: string]: any;
};

export function isTokenExpired(token: string): boolean {
  try {
    const decoded: DecodedToken = jwtDecode(token);
    if (!decoded.exp) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch {
    return true; // invalid or corrupt token
  }
}
