import type { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: string | (JwtPayload & { email?: string; userId?: string });
      /** User row from DB, set by onboarding middleware after lookup by token email */
      onboardingUser?: {
        id: number;
        email: string;
<<<<<<< HEAD
        organization_id: number;
        organization_name?: string;
=======
        organization_name: string;
>>>>>>> d489068cfa70d9e03e76d61725aed9495ad2eba8
        user_onboarding_completed: string | null;
        [key: string]: unknown;
      };
    }
  }
}

export {};
