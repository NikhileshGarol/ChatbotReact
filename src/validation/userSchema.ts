// src/validation/userSchema.ts
import * as yup from 'yup';

export const userSchema = yup.object({
  display_name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  contact_number: yup.string().required('Phone number is required').matches(/^\+?[0-9\- ]{10}$/, 'Invalid phone number'),
  role: yup.mixed<'admin' | 'user'>().oneOf(['admin', 'user']).required('Role required'),
  // companyId: yup.string().nullable().notRequired(),
  status: yup.mixed<'active' | 'inactive'>().oneOf(['active', 'inactive']).required(),
  tenant_code: yup.string().required('Tenant code is required'),
  user_code: yup.string().required('User code is required'),
  address: yup.string().notRequired(),
  password: yup.string().required(),
}).required();
