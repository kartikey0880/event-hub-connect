-- ============================================
-- CREATE ADMIN USER
-- Run this in Supabase SQL Editor AFTER running setup-database.sql
-- ============================================

-- First, you need to create the user manually in Supabase Auth
-- Go to Authentication > Users > Add User
-- Email: admin123@gmail.com
-- Password: admin@123
-- Then run this script to assign admin role

-- If user already exists, this will assign admin role
-- Replace 'USER_ID_HERE' with the actual user ID from auth.users table

-- To find the user ID, run this first:
-- SELECT id, email FROM auth.users WHERE email = 'admin123@gmail.com';

-- Then insert admin role (replace the UUID with actual user ID):
-- INSERT INTO public.user_roles (user_id, role)
-- VALUES ('USER_ID_HERE', 'admin')
-- ON CONFLICT (user_id, role) DO NOTHING;

-- OR use this automated approach:
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Get the user ID for admin email
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = 'admin123@gmail.com';
  
  -- If user exists, assign admin role
  IF admin_user_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (admin_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
    
    RAISE NOTICE 'Admin role assigned to user: %', admin_user_id;
  ELSE
    RAISE NOTICE 'User with email admin123@gmail.com not found. Please create the user first in Authentication > Users';
  END IF;
END $$;
