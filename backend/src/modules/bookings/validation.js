import { z } from "zod";

export const createBookingSchema = z.object({
  mentorId: z.guid(),
  slotId: z.guid(),
  jobDescriptionId: z.guid().optional(),
  preparationPlanId: z.guid().optional(),
  preparationPlanVersion: z.number().int().positive().optional(),
  selectedTopicIds: z.array(z.guid()).min(1).max(30),
  goal: z.string().trim().min(10).max(1000),
  interviewType: z.string().trim().min(2).max(100),
  timezone: z.string().max(80).optional(),
}).refine((value) => Boolean(value.jobDescriptionId || value.preparationPlanId), {
  message: "Cần chọn JD hoặc kế hoạch chuẩn bị", path: ["preparationPlanId"],
}).refine((value) => !value.preparationPlanId || value.preparationPlanVersion !== undefined, {
  message: "Thiếu phiên bản kế hoạch", path: ["preparationPlanVersion"],
});
