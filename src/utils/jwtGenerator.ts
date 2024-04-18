import jwt from "jsonwebtoken";
import "dotenv/config";

export function tokenGenerator(val: any): string {
  return jwt.sign(
    { val },
    process.env.SECRET_KEY ? process.env.SECRET_KEY : "SAFGDDD"
  );
}

export function tokenDecoder(token: string) {
  return jwt.verify(
    token,
    process.env.SECRET_KEY ? process.env.SECRET_KEY : "SAFGDDD"
  );
}
