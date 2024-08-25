import { ActionEnum } from "@prisma/client";
import { z } from "zod";

export const BaseContextSchema = z.object({
  termination_handler_function_name: z.string().optional(),
});

export const SequentialPlanContextSchema = BaseContextSchema.extend({
  attempts: z.number(),
  sequential_plan_history: z.array(z.array(z.string())),
  sequential_plan_review_feedback_history: z.array(z.string()),
});

export const RouteActionContextSchema = BaseContextSchema.extend({
  content: z.string(),
  start_node_id: z.string().optional(),
  current_node_id: z.string().optional(),
  marked_node_ids: z.array(z.string()),
});

export const ParallelPlanContextSchema = BaseContextSchema.extend({
  attempts: z.number(),
  parallel_plan_history: z.array(z.array(z.string())),
  parallel_plan_review_feedback_history: z.array(z.string()),
});

export const QuestionContextSchema = BaseContextSchema.extend({
  questions: z.array(z.string()),
});

export const ActionContextSchemaMap = {
  [ActionEnum.FOLDER]: BaseContextSchema,
  [ActionEnum.PARALLEL_PLAN]: ParallelPlanContextSchema,
  [ActionEnum.SEQUENTIAL_PLAN]: SequentialPlanContextSchema,
  [ActionEnum.ROUTE_ACTION]: RouteActionContextSchema,
  [ActionEnum.CODE]: BaseContextSchema,
  [ActionEnum.SEARCH]: BaseContextSchema,
  [ActionEnum.REVIEW_GOAL_PROGRESS]: QuestionContextSchema,
};

export type ActionContextMap = {
  [K in ActionEnum]: z.infer<typeof ActionContextSchemaMap[K]>
};
