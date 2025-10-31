// src/validation/companySchema.ts
import * as yup from 'yup';

export const companySchema = yup.object({
  name: yup.string().required('Company name is required').max(50, 'Max 50 characters allowed'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone number is required').matches(/^\+?[0-9\- ]{10}$/, 'Invalid phone number'),
  website: yup.string().url('Invalid website URL').required('Company website is required'),
  address: yup.string().required('Company address is required'),
  // slug_url: yup.string().required('Company URL is required').url('Invalid URL'),
//   .matches(/^[a-z0-9-]+$/, 'Lowercase alphanumeric and hyphen only')
  tenant_code: yup.string().required('Tenant Code is required').max(20, 'Max 20 characters allowed'),
  // status: yup.mixed<'active' | 'inactive'>().oneOf(['active', 'inactive']).required(),
    country: yup.string().required("Country is required"),
  state: yup.string().required("State is required"),
  city: yup.string().required("City is required"),
}).required();
