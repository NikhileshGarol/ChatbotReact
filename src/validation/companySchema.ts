// src/validation/companySchema.ts
import * as yup from 'yup';

export const companySchema = yup.object({
  name: yup.string().required('Company name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone number is required').matches(/^\+?[0-9\- ]{10}$/, 'Invalid phone number'),
  website: yup.string().url('Invalid website URL').required('Company website is required'),
  address: yup.string().required('Company address is required'),
  url: yup.string().required('Company URL is required').url('Invalid URL')
//   .matches(/^[a-z0-9-]+$/, 'Lowercase alphanumeric and hyphen only')
  ,
  status: yup.mixed<'active' | 'inactive'>().oneOf(['active', 'inactive']).required(),
}).required();
