--
-- PostgreSQL database dump
--

\restrict K7YxaNma4iHG0zUVFIto5QRjJUvN6q1oZbuEHWME0tEIFcgzzS9XoDUCiDfiFGu

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: drizzle; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA drizzle;


ALTER SCHEMA drizzle OWNER TO postgres;

--
-- Name: account_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.account_status AS ENUM (
    'invited',
    'confirmed'
);


ALTER TYPE public.account_status OWNER TO postgres;

--
-- Name: assessment_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.assessment_status AS ENUM (
    'draft',
    'submitted'
);


ALTER TYPE public.assessment_status OWNER TO postgres;

--
-- Name: assessment_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.assessment_type AS ENUM (
    'custom_ai',
    'cots_buyer',
    'cots_vendor',
    'vendor_self_attestation'
);


ALTER TYPE public.assessment_type OWNER TO postgres;

--
-- Name: organizationStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."organizationStatus" AS ENUM (
    'active',
    'inactive'
);


ALTER TYPE public."organizationStatus" OWNER TO postgres;

--
-- Name: organization_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.organization_type AS ENUM (
    'buyer',
    'vendor'
);


ALTER TYPE public.organization_type OWNER TO postgres;

--
-- Name: user_onboarding_completed; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_onboarding_completed AS ENUM (
    'true',
    'false'
);


ALTER TYPE public.user_onboarding_completed OWNER TO postgres;

--
-- Name: user_signup_completed; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_signup_completed AS ENUM (
    'true',
    'false'
);


ALTER TYPE public.user_signup_completed OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: __drizzle_migrations; Type: TABLE; Schema: drizzle; Owner: postgres
--

CREATE TABLE drizzle.__drizzle_migrations (
    id integer NOT NULL,
    hash text NOT NULL,
    created_at bigint
);


ALTER TABLE drizzle.__drizzle_migrations OWNER TO postgres;

--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE; Schema: drizzle; Owner: postgres
--

CREATE SEQUENCE drizzle.__drizzle_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE drizzle.__drizzle_migrations_id_seq OWNER TO postgres;

--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: drizzle; Owner: postgres
--

ALTER SEQUENCE drizzle.__drizzle_migrations_id_seq OWNED BY drizzle.__drizzle_migrations.id;


--
-- Name: assessment_documents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.assessment_documents (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    assessment_id uuid NOT NULL,
    document_type character varying(50) NOT NULL,
    file_path character varying(500) NOT NULL,
    file_name character varying(255),
    mime_type character varying(100),
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.assessment_documents OWNER TO postgres;

--
-- Name: assessment_risks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.assessment_risks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    assessment_id uuid NOT NULL,
    risk_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.assessment_risks OWNER TO postgres;

--
-- Name: assessments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.assessments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    type public.assessment_type NOT NULL,
    organization_id uuid NOT NULL,
    status public.assessment_status DEFAULT 'draft'::public.assessment_status NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.assessments OWNER TO postgres;

--
-- Name: buyer_onboarding; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.buyer_onboarding (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id character varying(255) NOT NULL,
    organization_name character varying(200) NOT NULL,
    organization_type character varying(100),
    sector character varying(500),
    organization_website character varying(500),
    organization_description character varying(500),
    primary_contact_name character varying(100) NOT NULL,
    primary_contact_email character varying(255) NOT NULL,
    primary_contact_role character varying(100),
    department_owner character varying(100),
    employee_count character varying(50),
    annual_revenue character varying(50),
    year_founded integer,
    headquarters_location character varying(100),
    operating_regions jsonb,
    data_residency_requirements jsonb,
    existing_ai_initiatives character varying(100),
    ai_governance_maturity character varying(100),
    data_governance_maturity character varying(100),
    ai_skills_availability character varying(100),
    change_management_capability character varying(100),
    primary_regulatory_frameworks jsonb,
    regulatory_penalty_exposure character varying(50),
    data_classification_handled jsonb,
    pii_handling character varying(100),
    existing_tech_stack jsonb,
    ai_risk_appetite character varying(100),
    acceptable_risk_level character varying(50),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.buyer_onboarding OWNER TO postgres;

--
-- Name: cots_buyer_assessments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cots_buyer_assessments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    assessment_id uuid NOT NULL,
    business_pain_point text,
    expected_outcomes character varying(300),
    owning_department character varying(100),
    budget_range character varying(100),
    target_timeline character varying(100),
    criticality character varying(100),
    vendor_name character varying(200),
    product_name character varying(200),
    requirement_gaps text,
    integration_systems jsonb,
    tech_stack jsonb,
    digital_maturity_level character varying(100),
    data_governance_maturity character varying(100),
    ai_governance_board character varying(100),
    ai_ethics_policy character varying(100),
    implementation_team_composition jsonb,
    data_sensitivity character varying(100),
    regulatory_requirements jsonb,
    risk_appetite character varying(100),
    decision_stakes character varying(100),
    impacted_stakeholders jsonb,
    vendor_validation_approach character varying(100),
    vendor_security_posture character varying(100),
    vendor_certifications jsonb,
    pilot_rollout_plan character varying(100),
    rollback_capability character varying(100),
    change_management_plan character varying(100),
    monitoring_data_available character varying(100),
    audit_logs_available character varying(100),
    testing_results_available character varying(100),
    identified_risks text,
    risk_domain_scores text,
    contextual_multipliers text,
    risk_mitigation text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.cots_buyer_assessments OWNER TO postgres;

--
-- Name: cots_vendor_assessments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cots_vendor_assessments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    assessment_id uuid NOT NULL,
    customer_organization_name character varying(200),
    customer_sector character varying(200),
    primary_pain_point text,
    expected_outcomes character varying(300),
    customer_budget_range character varying(100),
    implementation_timeline character varying(100),
    product_features jsonb,
    implementation_approach character varying(100),
    customization_level character varying(100),
    integration_complexity character varying(100),
    regulatory_requirements jsonb,
    data_sensitivity character varying(100),
    customer_risk_tolerance character varying(100),
    alternatives_considered text,
    key_advantages text,
    customer_specific_risks jsonb,
    identified_risks text,
    risk_domain_scores text,
    contextual_multipliers text,
    risk_mitigation text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.cots_vendor_assessments OWNER TO postgres;

--
-- Name: custom_ai_assessments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.custom_ai_assessments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    assessment_id uuid NOT NULL,
    business_pain_point text,
    expected_outcomes character varying(300),
    owning_department character varying(100),
    target_timeline character varying(100),
    criticality character varying(100),
    build_rationale text,
    development_platform jsonb,
    ml_frameworks jsonb,
    ai_model_types jsonb,
    customization_level character varying(100),
    development_stage character varying(100),
    training_data_source jsonb,
    training_data_volume character varying(100),
    training_data_quality character varying(100),
    training_data_biases character varying(100),
    data_labeling_process character varying(100),
    bias_testing_plan jsonb,
    adversarial_testing character varying(100),
    interpretability_approach character varying(100),
    human_oversight jsonb,
    decision_autonomy character varying(100),
    continuous_learning character varying(100),
    ai_governance_board character varying(100),
    ai_ethics_policy character varying(100),
    executive_sponsorship character varying(100),
    team_composition jsonb,
    development_budget character varying(100),
    hosting_type character varying(100),
    deployment_options jsonb,
    data_residency jsonb,
    model_version_control character varying(100),
    rollback_procedures character varying(100),
    data_sensitivity character varying(100),
    regulatory_requirements jsonb,
    risk_appetite character varying(100),
    decision_stakes character varying(100),
    validation_approach character varying(100),
    identified_risks text,
    risk_domain_scores text,
    contextual_multipliers text,
    risk_mitigation text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.custom_ai_assessments OWNER TO postgres;

--
-- Name: organizationEditLogs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."organizationEditLogs" (
    id integer NOT NULL,
    "organizationId" character varying NOT NULL,
    "organizationName" character varying NOT NULL,
    "organizationStatus" public."organizationStatus" NOT NULL,
    updated_by character varying NOT NULL,
    reason character varying NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public."organizationEditLogs" OWNER TO postgres;

--
-- Name: organizationEditLogs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."organizationEditLogs_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."organizationEditLogs_id_seq" OWNER TO postgres;

--
-- Name: organizationEditLogs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."organizationEditLogs_id_seq" OWNED BY public."organizationEditLogs".id;


--
-- Name: organizations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.organizations (
    id integer NOT NULL,
    "organizationName" character varying NOT NULL,
    "organizationStatus" public."organizationStatus" DEFAULT 'active'::public."organizationStatus" NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    created_by character varying NOT NULL
);


ALTER TABLE public.organizations OWNER TO postgres;

--
-- Name: organizations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.organizations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.organizations_id_seq OWNER TO postgres;

--
-- Name: organizations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.organizations_id_seq OWNED BY public.organizations.id;


--
-- Name: risk_top5_mitigations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.risk_top5_mitigations (
    mapping_id integer NOT NULL,
    risk_id character varying(50) NOT NULL,
    mitigation_action_id character varying(100) NOT NULL,
    mitigation_action_name character varying(500) NOT NULL,
    mitigation_category character varying(200) NOT NULL,
    mitigation_definition text
);


ALTER TABLE public.risk_top5_mitigations OWNER TO postgres;

--
-- Name: risks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.risks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    risk_id character varying(50) NOT NULL,
    title character varying(500) NOT NULL,
    domain character varying(100),
    description text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.risks OWNER TO postgres;

--
-- Name: userEditLogs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."userEditLogs" (
    id integer NOT NULL,
    "userId" character varying NOT NULL,
    email character varying(255) NOT NULL,
    "organizationName" character varying NOT NULL,
    "userStatus" public."organizationStatus" NOT NULL,
    updated_by character varying NOT NULL,
    reason character varying NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public."userEditLogs" OWNER TO postgres;

--
-- Name: userEditLogs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."userEditLogs_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."userEditLogs_id_seq" OWNER TO postgres;

--
-- Name: userEditLogs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."userEditLogs_id_seq" OWNED BY public."userEditLogs".id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    organization_name character varying NOT NULL,
    role character varying(255) NOT NULL,
    invited_at timestamp without time zone DEFAULT now() NOT NULL,
    account_status public.account_status DEFAULT 'invited'::public.account_status NOT NULL,
    user_name character varying,
    user_first_name character varying,
    user_last_name character varying,
    user_password text,
    "userStatus" public."organizationStatus" DEFAULT 'active'::public."organizationStatus" NOT NULL,
    user_signup_completed public.user_signup_completed DEFAULT 'false'::public.user_signup_completed NOT NULL,
    user_onboarding_completed public.user_onboarding_completed DEFAULT 'false'::public.user_onboarding_completed NOT NULL,
    invited_by character varying NOT NULL,
    user_platform_role character varying
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: vendor_onboarding; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vendor_onboarding (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id character varying(255) NOT NULL,
    vendor_type character varying(100) NOT NULL,
    sector character varying(500),
    vendor_maturity character varying(100),
    company_website character varying(500) NOT NULL,
    company_description character varying(500) NOT NULL,
    primary_contact_name character varying(100) NOT NULL,
    primary_contact_email character varying(255) NOT NULL,
    primary_contact_role character varying(100),
    employee_count character varying(50) NOT NULL,
    year_founded integer NOT NULL,
    headquarters_location character varying(100) NOT NULL,
    operating_regions jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.vendor_onboarding OWNER TO postgres;

--
-- Name: vendor_self_attestations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vendor_self_attestations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    assessment_id uuid NOT NULL,
    purchase_decision_makers jsonb,
    pain_points_solved text,
    alternatives_considered text,
    unique_value_proposition text,
    typical_customer_roi character varying(500),
    ai_capabilities jsonb,
    ai_model_types jsonb,
    model_transparency character varying(100),
    decision_autonomy character varying(100),
    security_certifications jsonb,
    assessment_completion_level character varying(100),
    pii_handling character varying(100),
    data_residency_options jsonb,
    data_retention_policy text,
    bias_testing_approach jsonb,
    adversarial_security_testing character varying(100),
    human_oversight jsonb,
    training_data_documentation character varying(100),
    uptime_sla character varying(100),
    incident_response_plan character varying(100),
    rollback_capability character varying(100),
    hosting_deployment jsonb,
    deployment_scale character varying(100),
    product_stage character varying(100),
    interaction_data_available character varying(100),
    audit_logs_available character varying(100),
    testing_results_available character varying(100),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.vendor_self_attestations OWNER TO postgres;

--
-- Name: __drizzle_migrations id; Type: DEFAULT; Schema: drizzle; Owner: postgres
--

ALTER TABLE ONLY drizzle.__drizzle_migrations ALTER COLUMN id SET DEFAULT nextval('drizzle.__drizzle_migrations_id_seq'::regclass);


--
-- Name: organizationEditLogs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."organizationEditLogs" ALTER COLUMN id SET DEFAULT nextval('public."organizationEditLogs_id_seq"'::regclass);


--
-- Name: organizations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organizations ALTER COLUMN id SET DEFAULT nextval('public.organizations_id_seq'::regclass);


--
-- Name: userEditLogs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."userEditLogs" ALTER COLUMN id SET DEFAULT nextval('public."userEditLogs_id_seq"'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: __drizzle_migrations; Type: TABLE DATA; Schema: drizzle; Owner: postgres
--

COPY drizzle.__drizzle_migrations (id, hash, created_at) FROM stdin;
1	b3cc75fa802f8a5b333c480eb0d77f3d2185602e108f36fb33d3ade3c6939413	1769871073786
2	383561b0534963508f7ad562176a658123ff8d651e1838c87a570c009eb06e44	1769871800640
3	b42229289c72af25c79b256476d480b8fee1923fd1658288ee73a8aa6689521f	1770205240661
\.


--
-- Data for Name: assessment_documents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.assessment_documents (id, assessment_id, document_type, file_path, file_name, mime_type, notes, created_at) FROM stdin;
\.


--
-- Data for Name: assessment_risks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.assessment_risks (id, assessment_id, risk_id, created_at) FROM stdin;
\.


--
-- Data for Name: assessments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.assessments (id, type, organization_id, status, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: buyer_onboarding; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.buyer_onboarding (id, organization_id, organization_name, organization_type, sector, organization_website, organization_description, primary_contact_name, primary_contact_email, primary_contact_role, department_owner, employee_count, annual_revenue, year_founded, headquarters_location, operating_regions, data_residency_requirements, existing_ai_initiatives, ai_governance_maturity, data_governance_maturity, ai_skills_availability, change_management_capability, primary_regulatory_frameworks, regulatory_penalty_exposure, data_classification_handled, pii_handling, existing_tech_stack, ai_risk_appetite, acceptable_risk_level, created_at, updated_at, user_id) FROM stdin;
a0c3dd0e-c044-4deb-8874-5c2fd6fc1e36	17	gdgdfgdfg	Mid-Market (500–1,000 employees)	{"public_sector":["Federal Government (US)","State Government (US)","Local Government (US)","International Governments","Educational Institutions (Public)","Public Healthcare Systems","Public Utilities","Defense & Military","Law Enforcement & Emergency Services"],"private_sector":[],"non_profit_sector":[]}	sfdsdfs	fsdfsdf	sdfsdf	sdfsdfsd	VP of Operations	Human Resources	501-1,000	$10M - $50M	2020	United Kingdom	["United States Only"]	["Must remain in home country"]	Pilot projects (1-2)	Intermediate (AI policies with oversight committee)	Defined (Basic data policies documented)	Strong (5-10 person AI/ML team)	Basic (Documented change processes)	["HITRUST"]	Low ($100K - $1M)	["Public"]	Extensive (Detailed personal profiles)	["Cloud (Google Cloud Platform)", "Cloud (Azure)"]	Aggressive (Accept higher risk for faster innovation)	Very Low (0-25)	2026-02-04 23:59:41.580612+05:30	2026-02-04 23:59:41.580612+05:30	32
7fea730a-704b-4a20-8d77-d20747ac1963	20	Org1	Enterprise (5,000+ employees)	{"public_sector":["Federal Government (US)","State Government (US)","Local Government (US)","International Governments","Educational Institutions (Public)","Public Healthcare Systems","Public Utilities","Defense & Military","Law Enforcement & Emergency Services"],"private_sector":[],"non_profit_sector":[]}	Website	Description	Example	email address	Director of Data/Analytics	Human Resources	51-200	$100M - $500M	2016	United Kingdom	["European Union", "United States Only"]	["Must remain in home country", "EU (GDPR)"]	Exploring/Researching AI	Basic (Documented AI policies exist)	Ad-hoc (Minimal or no formal data policies)	Moderate (3-5 person AI/ML team)	Intermediate (Structured change management program)	["HIPAA", "None/Minimal regulation"]	Minimal (Less than $100K)	["Internal/Confidential"]	Moderate (Standard personal data)	["Cloud (Azure)", "Cloud (AWS)"]	Moderate (Balance risk and innovation)	Medium (41-60)	2026-02-05 08:58:33.735195+05:30	2026-02-05 08:58:33.735195+05:30	33
\.


--
-- Data for Name: cots_buyer_assessments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cots_buyer_assessments (id, assessment_id, business_pain_point, expected_outcomes, owning_department, budget_range, target_timeline, criticality, vendor_name, product_name, requirement_gaps, integration_systems, tech_stack, digital_maturity_level, data_governance_maturity, ai_governance_board, ai_ethics_policy, implementation_team_composition, data_sensitivity, regulatory_requirements, risk_appetite, decision_stakes, impacted_stakeholders, vendor_validation_approach, vendor_security_posture, vendor_certifications, pilot_rollout_plan, rollback_capability, change_management_plan, monitoring_data_available, audit_logs_available, testing_results_available, identified_risks, risk_domain_scores, contextual_multipliers, risk_mitigation, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: cots_vendor_assessments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cots_vendor_assessments (id, assessment_id, customer_organization_name, customer_sector, primary_pain_point, expected_outcomes, customer_budget_range, implementation_timeline, product_features, implementation_approach, customization_level, integration_complexity, regulatory_requirements, data_sensitivity, customer_risk_tolerance, alternatives_considered, key_advantages, customer_specific_risks, identified_risks, risk_domain_scores, contextual_multipliers, risk_mitigation, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: custom_ai_assessments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.custom_ai_assessments (id, assessment_id, business_pain_point, expected_outcomes, owning_department, target_timeline, criticality, build_rationale, development_platform, ml_frameworks, ai_model_types, customization_level, development_stage, training_data_source, training_data_volume, training_data_quality, training_data_biases, data_labeling_process, bias_testing_plan, adversarial_testing, interpretability_approach, human_oversight, decision_autonomy, continuous_learning, ai_governance_board, ai_ethics_policy, executive_sponsorship, team_composition, development_budget, hosting_type, deployment_options, data_residency, model_version_control, rollback_procedures, data_sensitivity, regulatory_requirements, risk_appetite, decision_stakes, validation_approach, identified_risks, risk_domain_scores, contextual_multipliers, risk_mitigation, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: organizationEditLogs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."organizationEditLogs" (id, "organizationId", "organizationName", "organizationStatus", updated_by, reason, updated_at) FROM stdin;
1	16	organization1	inactive	19	Reason	2026-02-01 11:16:28.419547
2	16	organization1	active	19		2026-02-01 11:17:08.815473
3	16	organization1	active	19	111	2026-02-02 19:29:47.943072
4	19	Qualesce	active	24	Change	2026-02-04 21:24:46.125158
5	20	qualesce	active	24		2026-02-05 08:51:03.473847
6	20	qualesce	inactive	24	reason	2026-02-05 08:51:34.023169
\.


--
-- Data for Name: organizations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.organizations (id, "organizationName", "organizationStatus", created_at, created_by) FROM stdin;
17	org1	active	2026-02-01 11:30:22.273178	19
16	organization1	active	2026-01-31 16:44:45.653367	12
18	q	active	2026-02-04 19:13:00.341627	24
19	Qualesce	active	2026-02-04 19:31:47.272803	24
20	qualesce	inactive	2026-02-05 08:50:40.095801	24
\.


--
-- Data for Name: risk_top5_mitigations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.risk_top5_mitigations (mapping_id, risk_id, mitigation_action_id, mitigation_action_name, mitigation_category, mitigation_definition) FROM stdin;
\.


--
-- Data for Name: risks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.risks (id, risk_id, title, domain, description, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: userEditLogs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."userEditLogs" (id, "userId", email, "organizationName", "userStatus", updated_by, reason, updated_at) FROM stdin;
5	19	user2@domain.com	16	inactive	19	inactive	2026-02-01 12:59:30.51728
6	19	chinmayeesettipalli02@gmail.com	16	active	19	AI 	2026-02-02 18:57:34.964284
8	19	user2@domain.com	16	active	19	reason	2026-02-02 19:01:21.667297
9	24	chinmayeesettipalli02@gmail.com	AI EVAL	active	24	Change role	2026-02-03 10:25:14.266073
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, organization_name, role, invited_at, account_status, user_name, user_first_name, user_last_name, user_password, "userStatus", user_signup_completed, user_onboarding_completed, invited_by, user_platform_role) FROM stdin;
29	example4@domain.com	16	admin	2026-02-04 17:48:28.415	confirmed	Example	Example	4	$2b$10$Pz9n5yzvLwxvJycLX.5oDODJObIBbyKoO4PCQSBAn.mWbaNrKylTO	active	true	true	24	
31	example6@domain.com	16	admin	2026-02-04 18:06:17.549	confirmed	sdfdsf	dfsdf	sdfsdf	$2b$10$xjJd2HFMN/NUI31MFSSD4e.sL.WRaghLcKo1TqJ4tvwMg0Zkb1576	active	true	true	24	
23	asad@accelerateai.io	AI EVAL	admin	2026-02-01 09:54:49.779	confirmed	Asad	Asad	Mansoor	$2b$10$LsATTL3Wnwiy383L8DkpmOP88pQq4OTDX2EAmOzQjdEc2VZZwbDJq	active	true	true	19	system admin
30	exampl5@domain.com	16	admin	2026-02-04 17:52:22.804	confirmed	dfdgdfg	gdfgdfg	fgdfgdf	$2b$10$GLU8L4OLupKgsiQdxs25uux46OnXE5dJI4hkEBpi10KUVAxdJ.z.C	active	true	true	24	vendor
25	example@domain.com	17	analyst	2026-02-03 11:33:42.085	invited	\N	\N	\N	\N	active	false	false	24	
24	chinmayeesettipalli02@gmail.com	AI EVAL	system admin	2026-02-02 10:30:11.592	confirmed	Settipalli	Chinmayee	Settipalli	$2b$10$LsATTL3Wnwiy383L8DkpmOP88pQq4OTDX2EAmOzQjdEc2VZZwbDJq	active	true	true	19	system admin
26	example@gmail.com	16	admin	2026-02-04 15:58:26.078	confirmed	exampleUser	Example	User	$2b$10$83ASw8Q4wIIcRqnTTFiWWea68lIWTYB6NBzrdXlBYCo.aaVoGzd1e	active	true	true	24	vendor
27	example2@domain.com	16	admin	2026-02-04 17:38:33.25	confirmed	example2	example	2	$2b$10$rQR.YGF4m/GkAfLPTdk4iemq2vrh7L0VVWijuZzi78ViQB5skIVe6	active	true	true	24	vendor
28	example3@domain.com	16	admin	2026-02-04 17:45:14.463	confirmed	example	example	3	$2b$10$vQKwFSx98NjNoXhRYfmlvOx6TFqbkLkrbCDbeRDj5.Hx6urjPvcyy	active	true	false	24	
32	example10@domain.com	17	admin	2026-02-04 18:28:03.306	confirmed	wewerwe	wrwerwe	werwerw	$2b$10$CEt9LuvqkX7oSPAiUFjxIeorwI9EkaT7LuQNE8kMtsvU1OodTls9C	active	true	true	24	buyer
33	exampleuser@domain.com	20	admin	2026-02-05 03:24:04.07	confirmed	ExampleUser	Q	Last	$2b$10$RMy0oPKkhQ4158r3wLWCN.YTEFg/fqfD/LQrITNc/Vei38rJJoXUa	active	true	true	24	buyer
34	examplecheck@domain.com	16	admin	2026-02-05 03:31:04.973	confirmed	ExampleCheck	Check	One	$2b$10$B3f7XlMmpLl9Da4m/ETBvuIBMJQa9O3e1lI0Q6baX99KLczq1upFy	active	true	true	24	vendor
\.


--
-- Data for Name: vendor_onboarding; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vendor_onboarding (id, organization_id, vendor_type, sector, vendor_maturity, company_website, company_description, primary_contact_name, primary_contact_email, primary_contact_role, employee_count, year_founded, headquarters_location, operating_regions, created_at, updated_at, user_id) FROM stdin;
3f1bbec3-5d35-4fab-b956-7df4599c34d9	16	AI Product Company	{"public_sector":["Federal Government (US)","State Government (US)","Local Government (US)","International Governments","Educational Institutions (Public)","Public Healthcare Systems","Public Utilities","Defense & Military","Law Enforcement & Emergency Services"],"private_sector":[],"non_profit_sector":[]}	Startup - Early-stage, innovative solutions	fdsdfsdf	dsfsdfsdf	dsfsdf	dsfsdf	Director of Product	11–50	2021	France	["Europe (EU)"]	2026-02-04 23:06:37.668299+05:30	2026-02-04 23:10:21.287838+05:30	27
\.


--
-- Data for Name: vendor_self_attestations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vendor_self_attestations (id, assessment_id, purchase_decision_makers, pain_points_solved, alternatives_considered, unique_value_proposition, typical_customer_roi, ai_capabilities, ai_model_types, model_transparency, decision_autonomy, security_certifications, assessment_completion_level, pii_handling, data_residency_options, data_retention_policy, bias_testing_approach, adversarial_security_testing, human_oversight, training_data_documentation, uptime_sla, incident_response_plan, rollback_capability, hosting_deployment, deployment_scale, product_stage, interaction_data_available, audit_logs_available, testing_results_available, created_at, updated_at) FROM stdin;
\.


--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE SET; Schema: drizzle; Owner: postgres
--

SELECT pg_catalog.setval('drizzle.__drizzle_migrations_id_seq', 3, true);


--
-- Name: organizationEditLogs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."organizationEditLogs_id_seq"', 6, true);


--
-- Name: organizations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.organizations_id_seq', 20, true);


--
-- Name: userEditLogs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."userEditLogs_id_seq"', 9, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 34, true);


--
-- Name: __drizzle_migrations __drizzle_migrations_pkey; Type: CONSTRAINT; Schema: drizzle; Owner: postgres
--

ALTER TABLE ONLY drizzle.__drizzle_migrations
    ADD CONSTRAINT __drizzle_migrations_pkey PRIMARY KEY (id);


--
-- Name: assessment_documents assessment_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assessment_documents
    ADD CONSTRAINT assessment_documents_pkey PRIMARY KEY (id);


--
-- Name: assessment_risks assessment_risks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assessment_risks
    ADD CONSTRAINT assessment_risks_pkey PRIMARY KEY (id);


--
-- Name: assessments assessments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assessments
    ADD CONSTRAINT assessments_pkey PRIMARY KEY (id);


--
-- Name: buyer_onboarding buyer_onboarding_organization_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.buyer_onboarding
    ADD CONSTRAINT buyer_onboarding_organization_id_unique UNIQUE (organization_id);


--
-- Name: buyer_onboarding buyer_onboarding_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.buyer_onboarding
    ADD CONSTRAINT buyer_onboarding_pkey PRIMARY KEY (id);


--
-- Name: cots_buyer_assessments cots_buyer_assessments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cots_buyer_assessments
    ADD CONSTRAINT cots_buyer_assessments_pkey PRIMARY KEY (id);


--
-- Name: cots_vendor_assessments cots_vendor_assessments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cots_vendor_assessments
    ADD CONSTRAINT cots_vendor_assessments_pkey PRIMARY KEY (id);


--
-- Name: custom_ai_assessments custom_ai_assessments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.custom_ai_assessments
    ADD CONSTRAINT custom_ai_assessments_pkey PRIMARY KEY (id);


--
-- Name: organizationEditLogs organizationEditLogs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."organizationEditLogs"
    ADD CONSTRAINT "organizationEditLogs_pkey" PRIMARY KEY (id);


--
-- Name: organizations organizations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organizations
    ADD CONSTRAINT organizations_pkey PRIMARY KEY (id);


--
-- Name: risks risks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.risks
    ADD CONSTRAINT risks_pkey PRIMARY KEY (id);


--
-- Name: userEditLogs userEditLogs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."userEditLogs"
    ADD CONSTRAINT "userEditLogs_pkey" PRIMARY KEY (id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_user_name_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_user_name_unique UNIQUE (user_name);


--
-- Name: vendor_onboarding vendor_onboarding_organization_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendor_onboarding
    ADD CONSTRAINT vendor_onboarding_organization_id_unique UNIQUE (organization_id);


--
-- Name: vendor_onboarding vendor_onboarding_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendor_onboarding
    ADD CONSTRAINT vendor_onboarding_pkey PRIMARY KEY (id);


--
-- Name: vendor_self_attestations vendor_self_attestations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendor_self_attestations
    ADD CONSTRAINT vendor_self_attestations_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

\unrestrict K7YxaNma4iHG0zUVFIto5QRjJUvN6q1oZbuEHWME0tEIFcgzzS9XoDUCiDfiFGu

