import bcrypt from "bcrypt";

export function Encrypter(value: string, saltValue: number): string {
  return bcrypt.hashSync(value, saltValue);
}
