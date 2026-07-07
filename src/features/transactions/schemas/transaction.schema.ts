import { z } from "zod";

export const transactionSchema = z.object({
  id: z.string().uuid().optional(),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  type: z.enum(["income", "expense"]),
  category_id: z.string().uuid("Please select a category"),
  date: z.string().or(z.date()),
  location: z.string().optional(),
  description: z.string().min(1, "Description is required"),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;

export type Transaction = {
  id: string;
  user_id: string;
  category_id: string | null;
  type: "income" | "expense";
  amount: number;
  description: string | null;
  date: string;
  location: string | null;
  payment_method: string | null;
  created_at: string;
  updated_at: string;
  categories?: {
    name: string;
    icon: string;
    color: string;
  } | null;
};
