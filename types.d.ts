declare global {
  interface Error {
    status: number;
  }

  namespace Express {
    export interface User {
      zerocho: string;
    }
  }
}

export {};
