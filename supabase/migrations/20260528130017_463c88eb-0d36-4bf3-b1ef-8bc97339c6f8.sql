
-- ============ TRAININGS ============
CREATE TABLE public.trainings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  tagline text,
  hours integer NOT NULL DEFAULT 60,
  crewdle_focus text,
  big_picture_md text,
  outcomes jsonb NOT NULL DEFAULT '[]'::jsonb,
  audience_md text,
  hero_quote text,
  cta_label text NOT NULL DEFAULT 'Enroll',
  delivery_breakdown jsonb,
  order_index integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'published',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.trainings TO anon, authenticated;
GRANT ALL ON public.trainings TO service_role;
ALTER TABLE public.trainings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published trainings" ON public.trainings
  FOR SELECT USING (status = 'published');
CREATE POLICY "Admins manage trainings" ON public.trainings
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trainings_updated_at BEFORE UPDATE ON public.trainings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ MODULES ============
CREATE TABLE public.training_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  training_id uuid NOT NULL REFERENCES public.trainings(id) ON DELETE CASCADE,
  order_index integer NOT NULL DEFAULT 0,
  title text NOT NULL,
  summary text,
  hours numeric(5,2),
  video_title text,
  video_duration_min integer,
  video_theme text,
  video_placeholder_url text,
  content_md text,
  hands_on_md text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_training_modules_training ON public.training_modules(training_id, order_index);
GRANT SELECT ON public.training_modules TO anon, authenticated;
GRANT ALL ON public.training_modules TO service_role;
ALTER TABLE public.training_modules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view modules of published trainings" ON public.training_modules
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.trainings t WHERE t.id = training_id AND t.status = 'published'
  ));
CREATE POLICY "Admins manage modules" ON public.training_modules
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER training_modules_updated_at BEFORE UPDATE ON public.training_modules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ QUESTIONS ============
CREATE TABLE public.training_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid NOT NULL REFERENCES public.training_modules(id) ON DELETE CASCADE,
  order_index integer NOT NULL DEFAULT 0,
  prompt text NOT NULL,
  kind text NOT NULL DEFAULT 'mcq',
  options jsonb NOT NULL DEFAULT '[]'::jsonb,
  correct_answer jsonb,
  explanation_md text,
  weight integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_training_questions_module ON public.training_questions(module_id, order_index);
GRANT SELECT ON public.training_questions TO anon, authenticated;
GRANT ALL ON public.training_questions TO service_role;
ALTER TABLE public.training_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view questions of published trainings" ON public.training_questions
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.training_modules m
    JOIN public.trainings t ON t.id = m.training_id
    WHERE m.id = module_id AND t.status = 'published'
  ));
CREATE POLICY "Admins manage questions" ON public.training_questions
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- ============ ENROLLMENTS ============
CREATE TABLE public.training_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  training_slug text NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  org text,
  role text,
  productivity_style text,
  data_maturity integer,
  goals text,
  language text NOT NULL DEFAULT 'en',
  utm jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.training_enrollments TO anon, authenticated;
GRANT ALL ON public.training_enrollments TO service_role;
ALTER TABLE public.training_enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a valid enrollment" ON public.training_enrollments
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    char_length(name) BETWEEN 1 AND 120
    AND char_length(email) BETWEEN 5 AND 254
    AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    AND language IN ('en','fr')
    AND (data_maturity IS NULL OR data_maturity BETWEEN 1 AND 5)
  );
CREATE POLICY "Admins view enrollments" ON public.training_enrollments
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins manage enrollments" ON public.training_enrollments
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- ============ ATTEMPTS ============
CREATE TABLE public.training_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  module_id uuid NOT NULL REFERENCES public.training_modules(id) ON DELETE CASCADE,
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  score numeric(5,2),
  passed boolean,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.training_attempts TO authenticated;
GRANT ALL ON public.training_attempts TO service_role;
ALTER TABLE public.training_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users insert own attempts" ON public.training_attempts
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users read own attempts" ON public.training_attempts
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins read all attempts" ON public.training_attempts
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- ============ SEED ============
INSERT INTO public.trainings (slug, title, tagline, hours, crewdle_focus, big_picture_md, outcomes, audience_md, hero_quote, cta_label, delivery_breakdown, order_index) VALUES
('glitch',
 'GL!TCH — Formation Crewdle AI',
 'The official Crewdle AI Formation, bound to the GL!TCH playbook by Paracosm.',
 65,
 'Crewdle Chat · Connect · Admin · Loi 25',
 E'AI is reshaping the industrial society. GL!TCH names the rupture and gives organizations a maturity-aware platform — Crewdle — that unifies LLMs, workflows and autonomous agents in a single, model-agnostic environment that preserves your enterprise projects'' memory and context.\n\nThis is the **official Crewdle AI Formation**, co-delivered with Technologies Crewdle inc. and bound to the GL!TCH playbook for cultural adoption.',
 '["Read the AI shift in industrial society without panic or hype","Operate Crewdle Chat, Connect and Admin with confidence","Design and deploy autonomous agents that respect Loi 25","Build an enterprise AI culture that survives model churn"]'::jsonb,
 'Leaders, operators and culture-carriers ready to make AI safe, useful and aligned with Québec''s Loi 25.',
 'Name the glitch before automating it.',
 'Enroll in GL!TCH',
 '{"personalization_h":15,"facilitated_h":20,"online_h":30,"total_h":65,"subvention":"Eligible — Emploi-Québec (per SOW art. 4.5)"}'::jsonb,
 1),
('drift',
 'Drift — Co-Assisted Exploration',
 'Crewdle Build + Lovable: explore co-assisted development of apps and systems.',
 60,
 'Crewdle Build · Lovable',
 E'Drift trains intermediate practitioners to **co-assist** with AI on real development work — from prompt to prototype to product. We pair Crewdle Build with Lovable to compress the loop between intention and shipped software, while keeping the conversation itself as the living ontology.',
 '["Move from prompt to working prototype in hours, not weeks","Use Crewdle Build to scaffold systems with enterprise memory","Use Lovable to iterate on UI and flows with full-stack feedback","Preserve ontological integrity across co-assisted iterations"]'::jsonb,
 'Product managers, designers and builders ready to ship with AI as a peer, not a tool.',
 'Drift is not distraction — it is directed exploration.',
 'Enroll in Drift',
 '{"live_h":24,"labs_h":24,"capstone_h":12,"total_h":60}'::jsonb,
 2),
('tune',
 'Tune — Orchestrating Autonomy',
 'Crewdle Forge: orchestrate automation workflows and autonomous agents at scale.',
 60,
 'Crewdle Forge',
 E'Tune is the advanced training for organizations ready to **orchestrate autonomy**. Using Crewdle Forge, teams compose agent ecosystems, automation workflows and governance rails that scale without losing the thread of human intention.',
 '["Compose multi-agent workflows in Crewdle Forge","Design governance rails that prevent automating chaos","Measure agent ROI against organizational maturity","Bind autonomy to a preferable-futures velocity"]'::jsonb,
 'Operations, platform and transformation leaders orchestrating AI across departments.',
 'Tune the system, not just the prompt.',
 'Enroll in Tune',
 '{"live_h":24,"labs_h":24,"capstone_h":12,"total_h":60}'::jsonb,
 3);

-- GL!TCH modules (official Crewdle SOW)
WITH t AS (SELECT id FROM public.trainings WHERE slug='glitch')
INSERT INTO public.training_modules (training_id, order_index, title, summary, hours, video_title, video_duration_min, video_theme, content_md, hands_on_md)
SELECT t.id, v.ord, v.title, v.summary, v.hours, v.vtitle, v.vmin, v.vtheme, v.content, v.handson
FROM t, (VALUES
  (1,'L''intelligence artificielle : comprendre avant d''agir',
   'Acquérir une vision claire et nuancée de l''IA pour démystifier ses usages, ses risques et ses opportunités en contexte professionnel.',
   6::numeric, 'Big Picture: AI in Industrial Society', 10, 'Foundations',
   E'- Histoire et évolution de l''IA\n- Types d''IA (générative, prédictive, agents)\n- Cas d''usage en entreprise\n- Limites, biais et zones d''ombre\n- Cadre éthique et culturel québécois',
   E'**GL!TCH exercise:** Map three ruptures the AI shift is creating inside your organization. Name each glitch before proposing any tool.'),
  (2,'Communiquer avec l''IA : l''art du prompt',
   'Développer les compétences fondamentales pour formuler des requêtes efficaces et obtenir des résultats pertinents avec les LLM.',
   8::numeric, 'Prompting as Choreography', 12, 'Craft',
   E'- Anatomie d''un prompt efficace\n- Patterns: rôle, contexte, contraintes, format\n- Chaînes de prompts et raffinement itératif\n- Prompts pour analyse, synthèse, création\n- Mesurer la qualité d''une réponse',
   E'**GL!TCH exercise:** Take one recurring email/report task and convert it into a reusable prompt template. Test it across three different LLMs in Crewdle Chat.'),
  (3,'Crewdle Chat : outil central de productivité',
   'Maîtriser Crewdle Chat comme point d''entrée unique vers les LLM, model-agnostic et préservant la mémoire d''entreprise.',
   6::numeric, 'Crewdle Chat as Productivity Spine', 10, 'Platform',
   E'- Tour de l''interface Crewdle Chat\n- Switching de modèles sans perdre le contexte\n- Espaces de travail et mémoire projet\n- Partage et collaboration\n- Bonnes pratiques de gouvernance',
   E'**GL!TCH exercise:** Onboard one teammate into a shared Crewdle Chat workspace and run a 25-minute GL!TCH cycle together.'),
  (4,'Crewdle Connect : conception et déploiement d''agents autonomes',
   'Concevoir, configurer et déployer des agents autonomes via Crewdle Connect pour automatiser des tâches métier.',
   10::numeric, 'Designing Your First Autonomous Agent', 12, 'Agents',
   E'- Anatomie d''un agent Crewdle Connect\n- Sources de connaissance et outils\n- Garde-fous et permissions\n- Déploiement et test\n- Itération basée sur les conversations réelles',
   E'**GL!TCH exercise:** Build a first agent that answers one recurring internal question using your team''s documents. Ship it to one real user.'),
  (5,'Crewdle Connect : cas d''usage avancés et écosystème d''agents',
   'Orchestrer plusieurs agents en écosystème pour couvrir des processus complets, avec supervision humaine.',
   8::numeric, 'Agent Ecosystems', 12, 'Orchestration',
   E'- Agents spécialisés vs généralistes\n- Handoffs entre agents\n- Supervision et journalisation\n- Cas d''usage: support, ventes, opérations\n- Mesure d''impact',
   E'**GL!TCH exercise:** Compose two agents that hand off to each other on a real cross-functional process. Document the handoff contract.'),
  (6,'Crewdle Admin : gouvernance et environnement IA',
   'Administrer l''environnement Crewdle: utilisateurs, permissions, journaux, conformité.',
   4::numeric, 'Governance for the AI-Native Org', 8, 'Governance',
   E'- Gestion des utilisateurs et rôles\n- Politiques d''usage\n- Journaux d''audit\n- Coûts et quotas\n- Intégration avec l''écosystème IT existant',
   E'**GL!TCH exercise:** Draft your org''s one-page Crewdle usage policy and review it with one stakeholder outside IT.'),
  (7,'Loi 25, confidentialité et utilisation responsable de l''IA',
   'Comprendre les obligations de la Loi 25 et les bonnes pratiques d''IA responsable au Québec.',
   8::numeric, 'Loi 25 & Responsible AI', 12, 'Compliance',
   E'- Cadre légal Loi 25\n- Données personnelles et IA\n- Évaluation des facteurs relatifs à la vie privée\n- Transparence et consentement\n- Cas pratiques d''arbitrage',
   E'**GL!TCH exercise:** Run a mini-EFVP on one agent you built in module 4 or 5. Identify and close one gap.')
) AS v(ord,title,summary,hours,vtitle,vmin,vtheme,content,handson);

-- Drift modules
WITH t AS (SELECT id FROM public.trainings WHERE slug='drift')
INSERT INTO public.training_modules (training_id, order_index, title, summary, hours, video_title, video_duration_min, video_theme, content_md, hands_on_md)
SELECT t.id, v.ord, v.title, v.summary, v.hours, v.vtitle, v.vmin, v.vtheme, v.content, v.handson
FROM t, (VALUES
  (1,'Co-assisted thinking: from prompt to PRD','Reframe prompting as a thinking partnership that produces shippable specifications.',10::numeric,'Prompt as PRD',10,'Mindset',
   E'- The conversation IS the ontology\n- From scattered prompts to structured PRDs\n- Capturing intention before tools',
   E'**Drift lab:** Convert one fuzzy idea into a 1-page PRD via dialogue with Crewdle Chat.'),
  (2,'Crewdle Build fundamentals','Scaffold systems with enterprise memory and model-agnostic foundations.',10::numeric,'Scaffolding with Crewdle Build',12,'Platform',
   E'- Project structure in Crewdle Build\n- Memory and context preservation\n- Connecting data sources',
   E'**Drift lab:** Scaffold a new internal tool from an existing PRD.'),
  (3,'Lovable for co-assisted UI','Use Lovable to iterate on UI and flows with full-stack feedback.',10::numeric,'Lovable in 30 minutes',10,'Build',
   E'- Lovable mental model\n- Iterating with feedback loops\n- Design tokens and consistency',
   E'**Drift lab:** Build a 3-screen flow that talks to a Crewdle Build backend.'),
  (4,'Ontological integrity across iterations','Keep semantic 1:1 mapping as features evolve.',10::numeric,'Ontology Under Pressure',12,'Architecture',
   E'- Naming entities clearly\n- Avoiding concatenation of distinct concepts\n- Refactoring without semantic drift',
   E'**Drift lab:** Audit one feature for ontological drift and propose a fix.'),
  (5,'Shipping with humans in the loop','Roll out co-assisted features without breaking trust.',10::numeric,'Humans in the Loop',10,'Delivery',
   E'- Release patterns for AI features\n- Feedback capture\n- Rollback strategies',
   E'**Drift lab:** Ship one Drift artifact to a real user and capture three pieces of feedback.'),
  (6,'Capstone: a real co-assisted product slice','Build, ship and present a vertical slice of a real product.',10::numeric,'Capstone Showcase',12,'Capstone',
   E'- Scoping a capstone\n- Building in public within the cohort\n- Presenting outcomes',
   E'**Drift capstone:** Deliver and demo a co-assisted slice solving a real problem in your org.')
) AS v(ord,title,summary,hours,vtitle,vmin,vtheme,content,handson);

-- Tune modules
WITH t AS (SELECT id FROM public.trainings WHERE slug='tune')
INSERT INTO public.training_modules (training_id, order_index, title, summary, hours, video_title, video_duration_min, video_theme, content_md, hands_on_md)
SELECT t.id, v.ord, v.title, v.summary, v.hours, v.vtitle, v.vmin, v.vtheme, v.content, v.handson
FROM t, (VALUES
  (1,'From agents to orchestration','Move from single agents to orchestrated ecosystems.',10::numeric,'Orchestration 101',10,'Foundations',
   E'- Why orchestration\n- Crewdle Forge mental model\n- Patterns from real deployments',
   E'**Tune lab:** Map one cross-departmental process as an agent orchestration sketch.'),
  (2,'Crewdle Forge fundamentals','Compose workflows and triggers in Crewdle Forge.',10::numeric,'Forge Fundamentals',12,'Platform',
   E'- Workflow primitives\n- Triggers and schedules\n- Connecting agents to systems',
   E'**Tune lab:** Build a 3-step workflow that automates one repetitive task.'),
  (3,'Governance rails for autonomy','Prevent automating chaos.',10::numeric,'Rails Before Speed',10,'Governance',
   E'- Approval gates\n- Audit and observability\n- Rollback and kill-switches',
   E'**Tune lab:** Add governance rails to the workflow from module 2.'),
  (4,'Measuring agent ROI','Tie autonomy to organizational maturity.',10::numeric,'Measuring What Matters',10,'Metrics',
   E'- Maturity-adjusted ROI\n- Leading vs lagging indicators\n- Storytelling with data',
   E'**Tune lab:** Define three KPIs for one deployed workflow.'),
  (5,'Preferable-futures velocity','Bind autonomy to direction, not just speed.',10::numeric,'Velocity = Speed × Direction',12,'Strategy',
   E'- Preferable-futures framing\n- Velocity vs speed\n- Aligning Forge roadmaps with strategy',
   E'**Tune lab:** Pick a workflow and re-articulate it toward a preferable future.'),
  (6,'Capstone: an orchestrated workflow in production','Ship and operate a real orchestrated workflow.',10::numeric,'Capstone Showcase',12,'Capstone',
   E'- Production-readiness checklist\n- Handoff to operators\n- Operating rhythms',
   E'**Tune capstone:** Operate your workflow for two weeks and report outcomes.')
) AS v(ord,title,summary,hours,vtitle,vmin,vtheme,content,handson);

-- 3 placeholder MCQ per module
INSERT INTO public.training_questions (module_id, order_index, prompt, kind, options, correct_answer, explanation_md, weight)
SELECT m.id, g.ord,
  'Knowledge check ' || g.ord || ' — ' || m.title,
  'mcq',
  '["Option A","Option B","Option C","Option D"]'::jsonb,
  to_jsonb(0),
  'Placeholder explanation. Replace with module-specific rationale.',
  1
FROM public.training_modules m
CROSS JOIN (VALUES (1),(2),(3)) AS g(ord);
