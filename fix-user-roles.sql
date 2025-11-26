-- Add missing user_roles for existing users
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'student'::app_role
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.user_roles)
ON CONFLICT (user_id, role) DO NOTHING;

-- Optional: Make a specific user an admin (replace with your user ID)
-- INSERT INTO public.user_roles (user_id, role)
-- VALUES ('151030f9-03d8-49c9-81f5-1ea4cc39f1da', 'admin')
-- ON CONFLICT (user_id, role) DO NOTHING;
