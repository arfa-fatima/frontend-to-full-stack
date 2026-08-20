CREATE TABLE IF NOT EXISTS public.admin_emails (
  email text PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.admin_emails TO authenticated;
GRANT ALL ON public.admin_emails TO service_role;

ALTER TABLE public.admin_emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read admin emails" ON public.admin_emails
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'ADMIN'::app_role));

INSERT INTO public.admin_emails (email) VALUES ('tester123@example.com')
  ON CONFLICT (email) DO NOTHING;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  is_admin boolean;
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name')
  ON CONFLICT (id) DO NOTHING;

  SELECT (
    EXISTS (SELECT 1 FROM public.admin_emails ae WHERE lower(ae.email) = lower(NEW.email))
    OR NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'ADMIN'::app_role)
  ) INTO is_admin;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'USER')
  ON CONFLICT (user_id, role) DO NOTHING;

  IF is_admin THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'ADMIN'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;

  RETURN NEW;
END; $function$;

CREATE OR REPLACE FUNCTION public.claim_admin_role()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  uid uuid := auth.uid();
  uemail text;
  allowed boolean;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT email INTO uemail FROM auth.users WHERE id = uid;

  SELECT (
    EXISTS (SELECT 1 FROM public.admin_emails ae WHERE lower(ae.email) = lower(uemail))
    OR NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'ADMIN'::app_role)
    OR EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = uid AND role = 'ADMIN'::app_role)
  ) INTO allowed;

  IF NOT allowed THEN
    RAISE EXCEPTION 'An administrator already exists for this project.';
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (uid, 'ADMIN'::app_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN true;
END; $function$;

REVOKE ALL ON FUNCTION public.claim_admin_role() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.claim_admin_role() TO authenticated;
GRANT EXECUTE ON FUNCTION public.claim_admin_role() TO service_role;

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'ADMIN'::app_role FROM auth.users WHERE lower(email) = 'tester123@example.com'
ON CONFLICT (user_id, role) DO NOTHING;
