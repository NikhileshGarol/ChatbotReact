// src/validation/userSchema.ts
import * as yup from 'yup';

interface ContextType {
  isSuperAdmin?: boolean;
}

export const userSchema = yup.object({
  display_name: yup.string().required('Name is required').max(20, 'Max 20 characters allowed'),
  email: yup.string().email('Invalid email').required('Email is required'),
  contact_number: yup.string().required('Phone number is required').matches(/^\+?[0-9\- ]{10}$/, 'Invalid phone number'),
  role: yup.mixed<'admin' | 'user'>().oneOf(['admin', 'user']).required('Role required'),
  companyId: yup.string().nullable().test(
    'required-if-superadmin',
    'Select Company',
    function (value) {
      // Explicitly type the context
      const context = this.options.context as ContextType | undefined;
      const isSuperAdmin = context?.isSuperAdmin ?? false;
      if (isSuperAdmin) {
        return value != null && value !== '';
      }
      return true;
    }
  ),
  // status: yup.mixed<'active' | 'inactive'>().oneOf(['active', 'inactive']).required(),
  tenant_code: yup.string().required('Tenant code is required'),
  user_code: yup.string().required('User code is required').max(6, 'Max 6 characters allowed'),
  address: yup.string().notRequired(),
  password: yup.string().required(),
}).required();
