import "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    idToken?: string;
    error?: string;
  }

  interface User {
    roles?: string[];
  }

  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    idToken?: string;
    user?: {
      name?: string;
      email?: string;
      roles?: string[];
    };
    error?: string;
  }
}
