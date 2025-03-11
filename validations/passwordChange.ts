import { z } from 'zod';

const passwordChangeSchema = z.object({
  newPassword: z.string()
    .min(7, "Password must be at least 7 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character")
    .regex(/[0-9]/, "Password must contain at least one number")
});

export default passwordChangeSchema;