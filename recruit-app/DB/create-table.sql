--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3
-- Dumped by pg_dump version 16.3 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: application; Type: TABLE; Schema: public; Owner: jisukim
--

CREATE TABLE public.application (
    application_id character varying(21) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    user_id character varying(21) NOT NULL,
    job_id character varying(21) NOT NULL,
    title character varying(255) NOT NULL,
    content text NOT NULL,
    status character varying(20) DEFAULT 'submitted'::character varying NOT NULL
);


ALTER TABLE public.application OWNER TO jisukim;

--
-- Name: company; Type: TABLE; Schema: public; Owner: jisukim
--

CREATE TABLE public.company (
    company_id character varying(21) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    company_name character varying(255) NOT NULL,
    country character varying(255) NOT NULL,
    region character varying(255) NOT NULL,
    industry character varying(255) NOT NULL
);


ALTER TABLE public.company OWNER TO jisukim;

--
-- Name: job; Type: TABLE; Schema: public; Owner: jisukim
--

CREATE TABLE public.job (
    job_id character varying(21) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    "position" character varying(255) NOT NULL,
    skills character varying(512) NOT NULL,
    reward integer NOT NULL,
    description text NOT NULL,
    country character varying(255) NOT NULL,
    region character varying(255) NOT NULL,
    due_date date NOT NULL,
    company_id character varying(21) NOT NULL
);


ALTER TABLE public.job OWNER TO jisukim;

--
-- Name: users; Type: TABLE; Schema: public; Owner: jisukim
--

CREATE TABLE public.users (
    user_id character varying(21) NOT NULL,
    user_name character varying(255) NOT NULL,
    email character varying(320) NOT NULL,
    phone_number character varying(20) NOT NULL,
    password character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO jisukim;

--
-- Name: application PK_086e16ea19242fc5a8a1e9ed42d; Type: CONSTRAINT; Schema: public; Owner: jisukim
--

ALTER TABLE ONLY public.application
    ADD CONSTRAINT "PK_086e16ea19242fc5a8a1e9ed42d" PRIMARY KEY (application_id);


--
-- Name: job PK_25526336589e1d6f5b5d9c5b74b; Type: CONSTRAINT; Schema: public; Owner: jisukim
--

ALTER TABLE ONLY public.job
    ADD CONSTRAINT "PK_25526336589e1d6f5b5d9c5b74b" PRIMARY KEY (job_id);


--
-- Name: users PK_96aac72f1574b88752e9fb00089; Type: CONSTRAINT; Schema: public; Owner: jisukim
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_96aac72f1574b88752e9fb00089" PRIMARY KEY (user_id);


--
-- Name: company PK_b7f9888ba8bd654c4860ddfcb3a; Type: CONSTRAINT; Schema: public; Owner: jisukim
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "PK_b7f9888ba8bd654c4860ddfcb3a" PRIMARY KEY (company_id);


--
-- Name: application UQ_45c2b1215d732ecf0bb3783dad6; Type: CONSTRAINT; Schema: public; Owner: jisukim
--

ALTER TABLE ONLY public.application
    ADD CONSTRAINT "UQ_45c2b1215d732ecf0bb3783dad6" UNIQUE (user_id, job_id);


--
-- Name: application FK_42f0935cc814e694ed0e61fdece; Type: FK CONSTRAINT; Schema: public; Owner: jisukim
--

ALTER TABLE ONLY public.application
    ADD CONSTRAINT "FK_42f0935cc814e694ed0e61fdece" FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: job FK_51cb12c924d3e8c7465cc8edff2; Type: FK CONSTRAINT; Schema: public; Owner: jisukim
--

ALTER TABLE ONLY public.job
    ADD CONSTRAINT "FK_51cb12c924d3e8c7465cc8edff2" FOREIGN KEY (company_id) REFERENCES public.company(company_id);


--
-- Name: application FK_c67a88c0ec9a378c447df6a87ba; Type: FK CONSTRAINT; Schema: public; Owner: jisukim
--

ALTER TABLE ONLY public.application
    ADD CONSTRAINT "FK_c67a88c0ec9a378c447df6a87ba" FOREIGN KEY (job_id) REFERENCES public.job(job_id);


--
-- PostgreSQL database dump complete
--

