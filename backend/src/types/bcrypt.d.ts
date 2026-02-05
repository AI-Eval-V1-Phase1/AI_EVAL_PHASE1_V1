declare module "bcrypt" {
  export function hash(s: string, rounds: number): Promise<string>;
  export function compare(plain: string, hashed: string): Promise<boolean>;
  export function hashSync(s: string, rounds: number): string;
  export function compareSync(plain: string, hashed: string): boolean;
}
