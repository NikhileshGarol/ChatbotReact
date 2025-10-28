// src/validation/trainingSchema.ts
import * as yup from 'yup';

export const uploadFormSchema = yup.object({
  title: yup.string().nullable().notRequired(),
  description: yup.string().nullable().notRequired(),
  // the file itself is handled by input; we validate existence at submit time in the component
}).required();
