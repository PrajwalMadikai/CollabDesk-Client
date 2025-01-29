import { z } from 'zod'

export const workspaceSchema=z.object({
  workspaceName: z.string()
  .min(3, "workspace name must be at least 3 characters")
  .max(15, "workspace name must be less than 15 characters"),
})