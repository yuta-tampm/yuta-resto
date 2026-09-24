CREATE TABLE "pointage_continuations" (
	"id" uuid PRIMARY KEY NOT NULL,
	"organization_id" uuid NOT NULL,
	"establishment_id" uuid NOT NULL,
	"personnel_dossier_id" uuid NOT NULL,
	"token_digest" varchar(64) NOT NULL,
	"credential_id" uuid NOT NULL,
	"credential_version" integer NOT NULL,
	"issued_at" timestamp(6) with time zone NOT NULL,
	"absolute_expires_at" timestamp(6) with time zone NOT NULL,
	"idle_expires_at" timestamp(6) with time zone NOT NULL,
	"ended_at" timestamp(6) with time zone,
	CONSTRAINT "pointage_continuations_scoped_digest" UNIQUE("organization_id","establishment_id","token_digest"),
	CONSTRAINT "pointage_continuations_digest" CHECK ("pointage_continuations"."token_digest" ~ '^[0-9a-f]{64}$'),
	CONSTRAINT "pointage_continuations_credential_version" CHECK ("pointage_continuations"."credential_version" > 0),
	CONSTRAINT "pointage_continuations_absolute" CHECK ("pointage_continuations"."absolute_expires_at" = "pointage_continuations"."issued_at" + interval '120 seconds'),
	CONSTRAINT "pointage_continuations_idle" CHECK ("pointage_continuations"."issued_at" < "pointage_continuations"."idle_expires_at" and "pointage_continuations"."idle_expires_at" <= "pointage_continuations"."absolute_expires_at")
);
--> statement-breakpoint
CREATE TABLE "pointage_raw_command_receipts" (
	"organization_id" uuid NOT NULL,
	"establishment_id" uuid NOT NULL,
	"personnel_dossier_id" uuid NOT NULL,
	"request_id" uuid NOT NULL,
	"event_id" uuid NOT NULL,
	"intent_version" smallint NOT NULL,
	"intent_fingerprint" varchar(64) NOT NULL,
	CONSTRAINT "pointage_raw_receipts_request_pk" PRIMARY KEY("organization_id","establishment_id","personnel_dossier_id","request_id"),
	CONSTRAINT "pointage_raw_receipts_scoped_event" UNIQUE("organization_id","establishment_id","personnel_dossier_id","event_id"),
	CONSTRAINT "pointage_raw_receipts_intent_version" CHECK ("pointage_raw_command_receipts"."intent_version" = 1),
	CONSTRAINT "pointage_raw_receipts_fingerprint" CHECK ("pointage_raw_command_receipts"."intent_fingerprint" ~ '^[0-9a-f]{64}$')
);
--> statement-breakpoint
CREATE TABLE "pointage_raw_events" (
	"id" uuid PRIMARY KEY NOT NULL,
	"organization_id" uuid NOT NULL,
	"establishment_id" uuid NOT NULL,
	"personnel_dossier_id" uuid NOT NULL,
	"ordinal" bigint NOT NULL,
	"kind" varchar(16) NOT NULL,
	"accepted_at" timestamp(6) with time zone NOT NULL,
	"timezone_name" text NOT NULL,
	"utc_offset_seconds" integer NOT NULL,
	"business_date" date NOT NULL,
	CONSTRAINT "pointage_raw_events_scoped_id" UNIQUE("organization_id","establishment_id","personnel_dossier_id","id"),
	CONSTRAINT "pointage_raw_events_scoped_ordinal" UNIQUE("organization_id","establishment_id","personnel_dossier_id","ordinal"),
	CONSTRAINT "pointage_raw_events_positive_ordinal" CHECK ("pointage_raw_events"."ordinal" > 0),
	CONSTRAINT "pointage_raw_events_kind" CHECK ("pointage_raw_events"."kind" in ('CLOCK_IN', 'CLOCK_OUT'))
);
--> statement-breakpoint
ALTER TABLE "pointage_continuations" ADD CONSTRAINT "pointage_continuations_dossier_fk" FOREIGN KEY ("organization_id","establishment_id","personnel_dossier_id") REFERENCES "public"."personnel_employee_dossiers"("organization_id","establishment_id","id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pointage_employee_credentials" ADD CONSTRAINT "pointage_credentials_continuation_binding_unique" UNIQUE("organization_id","establishment_id","personnel_dossier_id","id","credential_version");--> statement-breakpoint
ALTER TABLE "pointage_continuations" ADD CONSTRAINT "pointage_continuations_credential_fk" FOREIGN KEY ("organization_id","establishment_id","personnel_dossier_id","credential_id","credential_version") REFERENCES "public"."pointage_employee_credentials"("organization_id","establishment_id","personnel_dossier_id","id","credential_version") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pointage_raw_command_receipts" ADD CONSTRAINT "pointage_raw_receipts_event_fk" FOREIGN KEY ("organization_id","establishment_id","personnel_dossier_id","event_id") REFERENCES "public"."pointage_raw_events"("organization_id","establishment_id","personnel_dossier_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pointage_raw_events" ADD CONSTRAINT "pointage_raw_events_establishment_fk" FOREIGN KEY ("organization_id","establishment_id") REFERENCES "public"."establishments"("organization_id","id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pointage_raw_events" ADD CONSTRAINT "pointage_raw_events_dossier_fk" FOREIGN KEY ("organization_id","establishment_id","personnel_dossier_id") REFERENCES "public"."personnel_employee_dossiers"("organization_id","establishment_id","id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "pointage_raw_events_scoped_day" ON "pointage_raw_events" USING btree ("organization_id","establishment_id","business_date","accepted_at");--> statement-breakpoint
-- D4a/D4b and D6 enforcement belongs to this journaled migration. The migrator
-- must publish every statement below in its single outer transaction.
ALTER TABLE public.pointage_raw_command_receipts
  ALTER CONSTRAINT pointage_raw_receipts_event_fk DEFERRABLE INITIALLY DEFERRED;
--> statement-breakpoint
ALTER TABLE public.pointage_raw_events ADD CONSTRAINT pointage_raw_events_receipt_fk
  FOREIGN KEY (organization_id, establishment_id, personnel_dossier_id, id)
  REFERENCES public.pointage_raw_command_receipts
    (organization_id, establishment_id, personnel_dossier_id, event_id)
  ON DELETE NO ACTION DEFERRABLE INITIALLY DEFERRED;
--> statement-breakpoint
DO $roles$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_roles
    WHERE rolname = 'yuta_pointage_raw_lock_owner' AND NOT rolcanlogin
      AND NOT rolsuper AND NOT rolcreatedb AND NOT rolcreaterole
      AND NOT rolreplication AND NOT rolbypassrls AND NOT rolinherit
  ) OR NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_roles
    WHERE rolname = 'yuta_pointage_raw_writer' AND rolcanlogin
      AND NOT rolsuper AND NOT rolcreatedb AND NOT rolcreaterole
      AND NOT rolreplication AND NOT rolbypassrls AND NOT rolinherit
  ) OR EXISTS (
    SELECT 1 FROM pg_catalog.pg_auth_members m
    JOIN pg_catalog.pg_roles r ON r.oid = m.member
    WHERE r.rolname IN ('yuta_pointage_raw_lock_owner', 'yuta_pointage_raw_writer')
  ) THEN
    RAISE EXCEPTION 'POINTAGE_ROLE_BOUNDARY_UNAVAILABLE';
  END IF;
END
$roles$;
--> statement-breakpoint
CREATE FUNCTION public.pointage_raw_lock_dossier(
  p_organization_id pg_catalog.uuid,
  p_establishment_id pg_catalog.uuid,
  p_personnel_dossier_id pg_catalog.uuid
) RETURNS pg_catalog.void
LANGUAGE plpgsql VOLATILE PARALLEL UNSAFE SECURITY DEFINER CALLED ON NULL INPUT
SET search_path = pg_catalog, pg_temp
AS $lock$
BEGIN
  IF session_user OPERATOR(pg_catalog.<>) 'yuta_pointage_raw_writer'::pg_catalog.name
    OR p_organization_id IS NULL OR p_establishment_id IS NULL
    OR p_personnel_dossier_id IS NULL THEN
    RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'POINTAGE_LOCK_UNAVAILABLE';
  END IF;
  PERFORM 1 FROM public.organizations
    WHERE id OPERATOR(pg_catalog.=) p_organization_id
      AND status OPERATOR(pg_catalog.=) 'active' FOR SHARE;
  IF NOT FOUND THEN
    RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'POINTAGE_LOCK_UNAVAILABLE';
  END IF;
  PERFORM 1 FROM public.establishments
    WHERE organization_id OPERATOR(pg_catalog.=) p_organization_id
      AND id OPERATOR(pg_catalog.=) p_establishment_id
      AND status OPERATOR(pg_catalog.=) 'active' FOR SHARE;
  IF NOT FOUND THEN
    RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'POINTAGE_LOCK_UNAVAILABLE';
  END IF;
  PERFORM 1 FROM public.personnel_employee_dossiers
    WHERE organization_id OPERATOR(pg_catalog.=) p_organization_id
      AND establishment_id OPERATOR(pg_catalog.=) p_establishment_id
      AND id OPERATOR(pg_catalog.=) p_personnel_dossier_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'POINTAGE_LOCK_UNAVAILABLE';
  END IF;
END
$lock$;
--> statement-breakpoint
-- CREATE is temporary only for ownership transfer. The runtime never receives it.
GRANT USAGE, CREATE ON SCHEMA public TO yuta_pointage_raw_lock_owner;
--> statement-breakpoint
ALTER FUNCTION public.pointage_raw_lock_dossier(pg_catalog.uuid, pg_catalog.uuid, pg_catalog.uuid)
  OWNER TO yuta_pointage_raw_lock_owner;
--> statement-breakpoint
REVOKE CREATE ON SCHEMA public FROM PUBLIC, yuta_pointage_raw_lock_owner, yuta_pointage_raw_writer;
--> statement-breakpoint
REVOKE ALL ON FUNCTION public.pointage_raw_lock_dossier(pg_catalog.uuid, pg_catalog.uuid, pg_catalog.uuid) FROM PUBLIC;
--> statement-breakpoint
GRANT EXECUTE ON FUNCTION public.pointage_raw_lock_dossier(pg_catalog.uuid, pg_catalog.uuid, pg_catalog.uuid)
  TO yuta_pointage_raw_writer;
--> statement-breakpoint
GRANT SELECT (id, status), UPDATE (id) ON public.organizations TO yuta_pointage_raw_lock_owner;
--> statement-breakpoint
GRANT SELECT (id, organization_id, status), UPDATE (id) ON public.establishments TO yuta_pointage_raw_lock_owner;
--> statement-breakpoint
GRANT SELECT (id, organization_id, establishment_id), UPDATE (id)
  ON public.personnel_employee_dossiers TO yuta_pointage_raw_lock_owner;
--> statement-breakpoint
CREATE FUNCTION public.pointage_raw_reject_mutation() RETURNS trigger
LANGUAGE plpgsql VOLATILE PARALLEL UNSAFE SECURITY INVOKER
SET search_path = pg_catalog, pg_temp
AS $immutable$
BEGIN
  RAISE EXCEPTION USING ERRCODE = '23514', MESSAGE = 'POINTAGE_IMMUTABLE_EVIDENCE';
END
$immutable$;
--> statement-breakpoint
CREATE TRIGGER pointage_raw_events_immutable BEFORE UPDATE OR DELETE ON public.pointage_raw_events
  FOR EACH ROW EXECUTE FUNCTION public.pointage_raw_reject_mutation();
--> statement-breakpoint
CREATE TRIGGER pointage_raw_events_no_truncate BEFORE TRUNCATE ON public.pointage_raw_events
  FOR EACH STATEMENT EXECUTE FUNCTION public.pointage_raw_reject_mutation();
--> statement-breakpoint
CREATE TRIGGER pointage_raw_receipts_immutable BEFORE UPDATE OR DELETE ON public.pointage_raw_command_receipts
  FOR EACH ROW EXECUTE FUNCTION public.pointage_raw_reject_mutation();
--> statement-breakpoint
CREATE TRIGGER pointage_raw_receipts_no_truncate BEFORE TRUNCATE ON public.pointage_raw_command_receipts
  FOR EACH STATEMENT EXECUTE FUNCTION public.pointage_raw_reject_mutation();
--> statement-breakpoint
CREATE FUNCTION public.pointage_continuation_enforce() RETURNS trigger
LANGUAGE plpgsql VOLATILE PARALLEL UNSAFE SECURITY INVOKER
SET search_path = pg_catalog, pg_temp
AS $continuation$
DECLARE
  observed_at pg_catalog.timestamptz := pg_catalog.clock_timestamp();
BEGIN
  IF TG_OP = 'INSERT' THEN
    NEW.issued_at := observed_at;
    NEW.absolute_expires_at := observed_at + interval '120 seconds';
    NEW.idle_expires_at := observed_at + interval '60 seconds';
    NEW.ended_at := NULL;
    RETURN NEW;
  END IF;
  IF ROW(OLD.id, OLD.organization_id, OLD.establishment_id, OLD.personnel_dossier_id,
    OLD.token_digest, OLD.credential_id, OLD.credential_version, OLD.issued_at,
    OLD.absolute_expires_at) IS DISTINCT FROM
    ROW(NEW.id, NEW.organization_id, NEW.establishment_id, NEW.personnel_dossier_id,
    NEW.token_digest, NEW.credential_id, NEW.credential_version, NEW.issued_at,
    NEW.absolute_expires_at) THEN
    RAISE EXCEPTION USING ERRCODE = '23514', MESSAGE = 'POINTAGE_CONTINUATION_IMMUTABLE';
  END IF;
  IF OLD.ended_at IS NOT NULL THEN
    IF OLD IS DISTINCT FROM NEW THEN
      RAISE EXCEPTION USING ERRCODE = '23514', MESSAGE = 'POINTAGE_CONTINUATION_ENDED';
    END IF;
    RETURN NEW;
  END IF;
  IF NEW.idle_expires_at IS NULL OR NEW.idle_expires_at < OLD.idle_expires_at
    OR NEW.idle_expires_at > OLD.absolute_expires_at THEN
    RAISE EXCEPTION USING ERRCODE = '23514', MESSAGE = 'POINTAGE_CONTINUATION_IDLE';
  END IF;
  IF NEW.ended_at IS NOT NULL THEN
    IF NEW.idle_expires_at IS DISTINCT FROM OLD.idle_expires_at THEN
      RAISE EXCEPTION USING ERRCODE = '23514', MESSAGE = 'POINTAGE_CONTINUATION_END_TOUCH';
    END IF;
    NEW.ended_at := observed_at;
  ELSIF NEW.idle_expires_at > OLD.idle_expires_at THEN
    IF observed_at >= OLD.idle_expires_at OR observed_at >= OLD.absolute_expires_at
      OR NEW.idle_expires_at > LEAST(observed_at + interval '60 seconds', OLD.absolute_expires_at) THEN
      RAISE EXCEPTION USING ERRCODE = '23514', MESSAGE = 'POINTAGE_CONTINUATION_EXPIRED';
    END IF;
  END IF;
  RETURN NEW;
END
$continuation$;
--> statement-breakpoint
CREATE TRIGGER pointage_continuations_enforce BEFORE INSERT OR UPDATE ON public.pointage_continuations
  FOR EACH ROW EXECUTE FUNCTION public.pointage_continuation_enforce();
--> statement-breakpoint
CREATE FUNCTION public.pointage_raw_enforce_append() RETURNS trigger
LANGUAGE plpgsql VOLATILE PARALLEL UNSAFE SECURITY INVOKER
SET search_path = pg_catalog, pg_temp
AS $append$
DECLARE
  prior record;
  next_ordinal pg_catalog.int8 := 1;
  next_kind pg_catalog.text := 'CLOCK_IN';
  previous_instant pg_catalog.timestamptz;
  observed_at pg_catalog.timestamptz;
  current_zone pg_catalog.text;
  entry_on pg_catalog.date;
  departure_on pg_catalog.date;
  local_day pg_catalog.date;
BEGIN
  PERFORM public.pointage_raw_lock_dossier(NEW.organization_id, NEW.establishment_id, NEW.personnel_dossier_id);
  SELECT timezone INTO current_zone FROM public.establishments
    WHERE organization_id = NEW.organization_id AND id = NEW.establishment_id;
  SELECT entry_date, departure_date INTO entry_on, departure_on FROM public.personnel_employee_dossiers
    WHERE organization_id = NEW.organization_id AND establishment_id = NEW.establishment_id
      AND id = NEW.personnel_dossier_id;
  IF current_zone IS NULL OR NOT EXISTS (SELECT 1 FROM pg_catalog.pg_timezone_names WHERE name = current_zone) THEN
    RAISE EXCEPTION USING ERRCODE = '23514', MESSAGE = 'POINTAGE_CALENDAR_UNAVAILABLE';
  END IF;
  FOR prior IN SELECT * FROM public.pointage_raw_events
    WHERE organization_id = NEW.organization_id AND establishment_id = NEW.establishment_id
      AND personnel_dossier_id = NEW.personnel_dossier_id ORDER BY ordinal
  LOOP
    -- Historical calendar uses the retained offset, never today's zone/tzdb.
    -- The approved inclusive seconds domain has no divisibility requirement.
    IF NOT pg_catalog.isfinite(prior.accepted_at)
      OR NOT pg_catalog.isfinite(prior.business_date)
      OR prior.utc_offset_seconds NOT BETWEEN -50400 AND 50400
      OR NOT EXISTS (SELECT 1 FROM pg_catalog.pg_timezone_names WHERE name = prior.timezone_name) THEN
      RAISE EXCEPTION USING ERRCODE = '23514', MESSAGE = 'POINTAGE_CHAIN_UNAVAILABLE';
    END IF;
    IF prior.business_date IS DISTINCT FROM
      ((prior.accepted_at AT TIME ZONE 'UTC') + pg_catalog.make_interval(secs => prior.utc_offset_seconds))::pg_catalog.date THEN
      RAISE EXCEPTION USING ERRCODE = '23514', MESSAGE = 'POINTAGE_CHAIN_UNAVAILABLE';
    END IF;
    IF prior.ordinal <> next_ordinal OR prior.kind <> next_kind
      OR (previous_instant IS NOT NULL AND prior.accepted_at < previous_instant)
      OR NOT EXISTS (SELECT 1 FROM public.pointage_raw_command_receipts r
        WHERE r.organization_id = NEW.organization_id AND r.establishment_id = NEW.establishment_id
          AND r.personnel_dossier_id = NEW.personnel_dossier_id AND r.event_id = prior.id) THEN
      RAISE EXCEPTION USING ERRCODE = '23514', MESSAGE = 'POINTAGE_CHAIN_UNAVAILABLE';
    END IF;
    next_ordinal := next_ordinal + 1;
    next_kind := CASE next_kind WHEN 'CLOCK_IN' THEN 'CLOCK_OUT' ELSE 'CLOCK_IN' END;
    previous_instant := prior.accepted_at;
  END LOOP;
  IF NEW.kind IS DISTINCT FROM next_kind THEN
    RAISE EXCEPTION USING ERRCODE = '23514', MESSAGE = 'POINTAGE_TRANSITION_CONFLICT';
  END IF;
  observed_at := pg_catalog.clock_timestamp();
  local_day := (observed_at AT TIME ZONE current_zone)::pg_catalog.date;
  IF entry_on IS NULL OR local_day < entry_on OR (departure_on IS NOT NULL
    AND (departure_on < entry_on OR local_day > departure_on)) THEN
    RAISE EXCEPTION USING ERRCODE = '23514', MESSAGE = 'POINTAGE_LIFECYCLE_UNAVAILABLE';
  END IF;
  IF previous_instant IS NOT NULL AND observed_at < previous_instant THEN
    RAISE EXCEPTION USING ERRCODE = '23514', MESSAGE = 'POINTAGE_CLOCK_UNAVAILABLE';
  END IF;
  NEW.ordinal := next_ordinal;
  NEW.accepted_at := observed_at;
  NEW.timezone_name := current_zone;
  NEW.utc_offset_seconds := EXTRACT(EPOCH FROM
    (observed_at AT TIME ZONE current_zone) - (observed_at AT TIME ZONE 'UTC'))::pg_catalog.int4;
  IF NEW.utc_offset_seconds NOT BETWEEN -50400 AND 50400 THEN
    RAISE EXCEPTION USING ERRCODE = '23514', MESSAGE = 'POINTAGE_CALENDAR_UNAVAILABLE';
  END IF;
  NEW.business_date := local_day;
  RETURN NEW;
END
$append$;
--> statement-breakpoint
CREATE TRIGGER pointage_raw_events_append BEFORE INSERT ON public.pointage_raw_events
  FOR EACH ROW EXECUTE FUNCTION public.pointage_raw_enforce_append();
--> statement-breakpoint
REVOKE ALL ON FUNCTION public.pointage_raw_reject_mutation(), public.pointage_continuation_enforce(), public.pointage_raw_enforce_append() FROM PUBLIC;
--> statement-breakpoint
GRANT USAGE ON SCHEMA public TO yuta_pointage_raw_writer;
--> statement-breakpoint
GRANT SELECT (id, status) ON public.organizations TO yuta_pointage_raw_writer;
--> statement-breakpoint
GRANT SELECT (id, organization_id, status, timezone) ON public.establishments TO yuta_pointage_raw_writer;
--> statement-breakpoint
GRANT SELECT (id, organization_id, establishment_id, given_names, family_name, entry_date, departure_date)
  ON public.personnel_employee_dossiers TO yuta_pointage_raw_writer;
--> statement-breakpoint
GRANT SELECT (id, organization_id, establishment_id, personnel_dossier_id, credential_version, superseded_at)
  ON public.pointage_employee_credentials TO yuta_pointage_raw_writer;
--> statement-breakpoint
GRANT SELECT, INSERT ON public.pointage_raw_events, public.pointage_raw_command_receipts, public.pointage_continuations
  TO yuta_pointage_raw_writer;
--> statement-breakpoint
GRANT UPDATE (idle_expires_at, ended_at) ON public.pointage_continuations TO yuta_pointage_raw_writer;
