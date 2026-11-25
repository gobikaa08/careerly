/**
 * CAREERLY - Core Storage & Data Engine
 * Centralized data models, localStorage synchronization, rule-based algorithms.
 */

// 1. Comprehensive Database of Careers
const CAREER_DATABASE = [
  {
    id: "full-stack-developer",
    title: "Full-Stack Web Developer",
    category: "Software & Web Development",
    categoryKey: "software",
    tagline: "Build end-to-end modern web applications from database architecture to responsive UI.",
    salaryRange: "$88,000 - $148,000 / yr",
    projectedGrowth: "+26% (High Demand)",
    difficulty: "Intermediate",
    badge: "Most Popular",
    overview: "Full-stack engineers architect both client-side interfaces and scalable backend server logic. They bridge user experience with resilient cloud databases and APIs.",
    responsibilities: [
      "Architect and build client-side responsive interfaces using modern component frameworks.",
      "Design robust RESTful and GraphQL APIs connected to relational/NoSQL databases.",
      "Implement authentication, authorization, session management, and data encryption.",
      "Set up CI/CD automation pipelines, automated test suites, and containerized deployments.",
      "Collaborate with UX designers and product owners to rapidly iterate on software features."
    ],
    tools: ["React", "TypeScript", "Node.js", "PostgreSQL", "Docker", "Git", "Tailwind CSS", "Vercel"],
    progression: [
      { role: "Junior Full-Stack Dev", exp: "0 - 2 yrs", salary: "$70k - $90k" },
      { role: "Mid Full-Stack Engineer", exp: "2 - 5 yrs", salary: "$95k - $130k" },
      { role: "Senior Software Engineer", exp: "5 - 8 yrs", salary: "$135k - $175k" },
      { role: "Lead / Principal Architect", exp: "8+ yrs", salary: "$180k - $240k+" }
    ],
    skills: [
      { id: "html_css_modern", name: "HTML5 / Modern CSS / Flexbox & Grid", benchmark: 90, category: "Frontend" },
      { id: "javascript_ts", name: "JavaScript (ES6+) & TypeScript", benchmark: 95, category: "Frontend" },
      { id: "frontend_framework", name: "Modern Component Frameworks (React/Vue)", benchmark: 85, category: "Frontend" },
      { id: "nodejs_backend", name: "Node.js / Express or Python APIs", benchmark: 85, category: "Backend" },
      { id: "databases_sql", name: "Databases (SQL & NoSQL / Data Modeling)", benchmark: 80, category: "Backend" },
      { id: "git_collaboration", name: "Git Version Control & Branching Workflows", benchmark: 90, category: "DevOps" },
      { id: "api_design", name: "RESTful API Architecture & Authentication", benchmark: 85, category: "Backend" },
      { id: "docker_cloud", name: "Docker & Cloud Deployment Basics", benchmark: 70, category: "DevOps" }
    ],
    roadmapPhases: [
      {
        id: "phase-1",
        title: "Phase 1: Foundations & Web Core",
        timeline: "Weeks 1 - 4 • 10-12 hrs/wk",
        description: "Master modern semantic HTML5, CSS responsive layouts (Grid & Flexbox), modern JavaScript (ES6+), and Git version control.",
        topics: [
          { id: "topic-1-1", title: "Semantic HTML5, Accessibility (a11y), and SEO Best Practices", resourceUrl: "https://developer.mozilla.org/en-US/docs/Learn/HTML" },
          { id: "topic-1-2", title: "CSS3 Flexbox, CSS Grid, and Modern Responsive Design", resourceUrl: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/" },
          { id: "topic-1-3", title: "Core JavaScript: Async/Await, Closures, DOM Manipulation, and Fetch API", resourceUrl: "https://javascript.info/" },
          { id: "topic-1-4", title: "Git Fundamentals: Commits, Branching, Pull Requests & GitHub Workflows", resourceUrl: "https://git-scm.com/book/en/v2" }
        ],
        tasks: [
          { id: "task-1-1", title: "Build an accessible, mobile-responsive interactive landing page" },
          { id: "task-1-2", title: "Create a DOM-based interactive expense tracker with LocalStorage persistence" }
        ],
        project: "Responsive Multi-Page Web Application with GitHub Actions deployment"
      },
      {
        id: "phase-2",
        title: "Phase 2: Frontend Engineering & TypeScript",
        timeline: "Weeks 5 - 8 • 12-14 hrs/wk",
        description: "Level up with typed JavaScript, component lifecycle, reusable UI design systems, and client-side state management.",
        topics: [
          { id: "topic-2-1", title: "TypeScript Essentials: Types, Interfaces, Generics, and Strict Configs", resourceUrl: "https://www.typescriptlang.org/docs/" },
          { id: "topic-2-2", title: "Component Architecture: State, Props, Hooks, and Component Lifecycle", resourceUrl: "https://react.dev/learn" },
          { id: "topic-2-3", title: "State Management & Optimistic UI Updates", resourceUrl: "https://react.dev/learn/managing-state" },
          { id: "topic-2-4", title: "Utility-First Styling with Tailwind CSS and CSS Modules", resourceUrl: "https://tailwindcss.com/docs" }
        ],
        tasks: [
          { id: "task-2-1", title: "Convert a vanilla JavaScript application to strongly-typed TypeScript" },
          { id: "task-2-2", title: "Build a filterable data dashboard with live search and debounce" }
        ],
        project: "Dynamic E-Commerce or SaaS Dashboard with modular component architecture"
      },
      {
        id: "phase-3",
        title: "Phase 3: Backend APIs & Database Architecture",
        timeline: "Weeks 9 - 12 • 12-14 hrs/wk",
        description: "Build robust server applications, relational database schemas, secure authentication, and RESTful endpoints.",
        topics: [
          { id: "topic-3-1", title: "Node.js & Express REST API Architecture and Middleware", resourceUrl: "https://expressjs.com/" },
          { id: "topic-3-2", title: "Relational Database Design with PostgreSQL and Prisma ORM", resourceUrl: "https://www.prisma.io/docs" },
          { id: "topic-3-3", title: "JWT & Cookie Authentication, Password Hashing, and Route Guards", resourceUrl: "https://auth0.com/intro-to-iam/what-is-jwt" },
          { id: "topic-3-4", title: "API Security: Rate Limiting, CORS, Input Validation (Zod), and Sanitization", resourceUrl: "https://cheatsheetseries.owasp.org/" }
        ],
        tasks: [
          { id: "task-3-1", title: "Build an authenticated CRUD REST API with PostgreSQL connection pooling" },
          { id: "task-3-2", title: "Implement token refresh flow and role-based access control (RBAC)" }
        ],
        project: "Production-ready REST API with PostgreSQL, Prisma, automated migrations and tests"
      },
      {
        id: "phase-4",
        title: "Phase 4: Full-Stack Integration, DevOps & Cloud",
        timeline: "Weeks 13 - 16 • 10-12 hrs/wk",
        description: "Connect frontend and backend, containerize with Docker, configure CI/CD pipelines, and deploy to modern cloud infrastructure.",
        topics: [
          { id: "topic-4-1", title: "Full-Stack Integration: Error Boundaries, Hydration, and API Clients", resourceUrl: "https://developer.mozilla.org/en-US/docs/Web/API" },
          { id: "topic-4-2", title: "Dockerizing Applications: Dockerfile, Docker Compose for Dev & Prod", resourceUrl: "https://docs.docker.com/get-started/" },
          { id: "topic-4-3", title: "Automated Testing: Unit, Integration, and End-to-End (Jest & Playwright)", resourceUrl: "https://playwright.dev/" },
          { id: "topic-4-4", title: "Cloud Deployment & Monitoring on Vercel, Render, or AWS", resourceUrl: "https://vercel.com/docs" }
        ],
        tasks: [
          { id: "task-4-1", title: "Dockerize a full-stack multi-container application" },
          { id: "task-4-2", title: "Set up GitHub Actions to run automated unit & lint checks on PR" }
        ],
        project: "Capstone Full-Stack SaaS application with live demo, auth, database, and CI/CD"
      },
      {
        id: "phase-5",
        title: "Phase 5: Portfolio, Resume & Technical Interview Prep",
        timeline: "Weeks 17 - 18 • 8-10 hrs/wk",
        description: "Polish codebases, optimize resume for ATS scanners, prepare behavioral STAR responses, and master live coding drills.",
        topics: [
          { id: "topic-5-1", title: "ATS-Optimized Resume Crafting with Quantifiable Impact Metrics", resourceUrl: "https://www.careercup.com/" },
          { id: "topic-5-2", title: "Data Structures & Algorithms Core Patterns (Arrays, Maps, Two Pointers)", resourceUrl: "https://neetcode.io/" },
          { id: "topic-5-3", title: "Full-Stack System Design Fundamentals (Caching, Load Balancing, DB Sharding)", resourceUrl: "https://github.com/donnemartin/system-design-primer" },
          { id: "topic-5-4", title: "Behavioral Interview Mastery using the STAR Method", resourceUrl: "https://hbr.org/" }
        ],
        tasks: [
          { id: "task-5-1", title: "Audit portfolio projects: live working demo URLs and clean README docs" },
          { id: "task-5-2", title: "Complete 15 mock technical interview questions and 3 mock system designs" }
        ],
        project: "Professional Developer Portfolio website showcasing live deployed capstones"
      }
    ]
  },
  {
    id: "ai-ml-engineer",
    title: "AI & Machine Learning Engineer",
    category: "Data, AI & Machine Learning",
    categoryKey: "data-ai",
    tagline: "Build, train, fine-tune, and deploy intelligent models and scalable LLM applications.",
    salaryRange: "$115,000 - $185,000 / yr",
    projectedGrowth: "+38% (Explosive Growth)",
    difficulty: "Advanced",
    badge: "Trending High",
    overview: "AI/ML Engineers develop machine learning architectures, pipeline data, train deep learning networks, and deploy real-time inference microservices.",
    responsibilities: [
      "Design and deploy production-grade machine learning models and LLM agent pipelines.",
      "Clean, curate, and preprocess massive structured and unstructured datasets.",
      "Fine-tune foundational models using LoRA/QLoRA and build RAG vector search systems.",
      "Monitor model drift, latency, token throughput, and cost optimization.",
      "Integrate ML models with backend microservices via FastAPI or gRPC."
    ],
    tools: ["Python", "PyTorch", "Hugging Face", "LangChain", "FastAPI", "Docker", "PostgreSQL (pgvector)", "Weights & Biases"],
    progression: [
      { role: "Associate ML Engineer", exp: "0 - 2 yrs", salary: "$90k - $115k" },
      { role: "Machine Learning Engineer", exp: "2 - 5 yrs", salary: "$125k - $165k" },
      { role: "Senior AI Engineer", exp: "5 - 8 yrs", salary: "$170k - $220k" },
      { role: "Staff AI Researcher / Architect", exp: "8+ yrs", salary: "$230k - $320k+" }
    ],
    skills: [
      { id: "python_ecosystem", name: "Python Core, NumPy & Pandas Data Mastery", benchmark: 95, category: "Core" },
      { id: "math_stats", name: "Linear Algebra, Calculus & Applied Statistics", benchmark: 85, category: "Core" },
      { id: "machine_learning_core", name: "Scikit-Learn & Classical ML Algorithms", benchmark: 90, category: "ML" },
      { id: "deep_learning_pytorch", name: "PyTorch Deep Learning & Neural Architectures", benchmark: 85, category: "Deep Learning" },
      { id: "llm_rag_systems", name: "LLMs, Vector Databases (pgvector) & RAG Systems", benchmark: 85, category: "AI & LLM" },
      { id: "fastapi_serving", name: "Model Serving with FastAPI & Docker Containers", benchmark: 80, category: "Deployment" },
      { id: "data_pipelines", name: "Data Engineering & Feature Pipelines", benchmark: 75, category: "Data" },
      { id: "mlops_eval", name: "MLOps, Model Evaluation & Monitoring", benchmark: 75, category: "DevOps" }
    ],
    roadmapPhases: [
      {
        id: "phase-1",
        title: "Phase 1: Python Data Science Foundations & Math",
        timeline: "Weeks 1 - 4 • 12 hrs/wk",
        description: "Master Python for numerical computing, linear algebra concepts, probability distributions, and Pandas data wrangling.",
        topics: [
          { id: "topic-1-1", title: "Advanced Python: Comprehensions, Generators, OOP & Typing", resourceUrl: "https://docs.python.org/3/tutorial/" },
          { id: "topic-1-2", title: "Vector Math & NumPy Matrix Transformations", resourceUrl: "https://numpy.org/doc/stable/" },
          { id: "topic-1-3", title: "Data Wrangling and Feature Engineering with Pandas", resourceUrl: "https://pandas.pydata.org/docs/" },
          { id: "topic-1-4", title: "Applied Statistics: Hypothesis Testing, Probability, Distributions", resourceUrl: "https://www.khanacademy.org/math/statistics-probability" }
        ],
        tasks: [
          { id: "task-1-1", title: "Perform exploratory data analysis (EDA) on a 500k-row public dataset" },
          { id: "task-1-2", title: "Build custom statistical summaries and outlier detection algorithms" }
        ],
        project: "Comprehensive Exploratory Data Analysis Report with Seaborn/Plotly visualizations"
      },
      {
        id: "phase-2",
        title: "Phase 2: Supervised & Unsupervised Machine Learning",
        timeline: "Weeks 5 - 8 • 14 hrs/wk",
        description: "Build, evaluate, and tune classical machine learning models with Scikit-Learn.",
        topics: [
          { id: "topic-2-1", title: "Regression & Classification (Linear, Logistic, Random Forests, XGBoost)", resourceUrl: "https://scikit-learn.org/stable/" },
          { id: "topic-2-2", title: "Evaluation Metrics: Precision, Recall, F1, ROC-AUC, Confusion Matrix", resourceUrl: "https://scikit-learn.org/stable/modules/model_evaluation.html" },
          { id: "topic-2-3", title: "Hyperparameter Tuning, Cross-Validation & Regularization (L1/L2)", resourceUrl: "https://scikit-learn.org/" },
          { id: "topic-2-4", title: "Unsupervised Learning: K-Means Clustering, PCA Dimensionality Reduction", resourceUrl: "https://scikit-learn.org/" }
        ],
        tasks: [
          { id: "task-2-1", title: "Train an XGBoost model on tabular data and optimize ROC-AUC score" },
          { id: "task-2-2", title: "Implement customer segmentation clustering with PCA visual projection" }
        ],
        project: "Predictive Analytics Machine Learning Pipeline with cross-validation benchmarks"
      },
      {
        id: "phase-3",
        title: "Phase 3: Deep Learning with PyTorch",
        timeline: "Weeks 9 - 13 • 14 hrs/wk",
        description: "Understand neural networks, backpropagation, CNNs, RNNs, and modern Transformer architectures.",
        topics: [
          { id: "topic-3-1", title: "PyTorch Tensors, Autograd, Loss Functions, and Custom Training Loops", resourceUrl: "https://pytorch.org/tutorials/" },
          { id: "topic-3-2", title: "Convolutional Neural Networks (CNNs) for Computer Vision", resourceUrl: "https://cs231n.github.io/" },
          { id: "topic-3-3", title: "Transformers and Attention Mechanisms (Self-Attention, Multi-Head)", resourceUrl: "https://jalammar.github.io/illustrated-transformer/" },
          { id: "topic-3-4", title: "Transfer Learning and Hugging Face Pre-trained Models", resourceUrl: "https://huggingface.co/learn" }
        ],
        tasks: [
          { id: "task-3-1", title: "Train a custom neural classifier in PyTorch from scratch" },
          { id: "task-3-2", title: "Fine-tune a Hugging Face Transformer for domain-specific classification" }
        ],
        project: "Deep Learning Classifier with PyTorch and Hugging Face Transformers"
      },
      {
        id: "phase-4",
        title: "Phase 4: LLMs, RAG & Vector Databases",
        timeline: "Weeks 14 - 17 • 12 hrs/wk",
        description: "Build production AI applications utilizing embeddings, vector search, retrieval augmented generation, and agents.",
        topics: [
          { id: "topic-4-1", title: "Embeddings, Semantic Search & Vector Indexes (pgvector, Chroma, Qdrant)", resourceUrl: "https://github.com/pgvector/pgvector" },
          { id: "topic-4-2", title: "RAG Architecture: Chunking, Retrieval, Re-ranking & Context Ingestion", resourceUrl: "https://python.langchain.com/" },
          { id: "topic-4-3", title: "Prompt Engineering, Function Calling, and Structured Outputs", resourceUrl: "https://www.promptingguide.ai/" },
          { id: "topic-4-4", title: "Model Serving with FastAPI, Streaming SSE, and Docker", resourceUrl: "https://fastapi.tiangolo.com/" }
        ],
        tasks: [
          { id: "task-4-1", title: "Build a document-aware RAG QA assistant with semantic chunking" },
          { id: "task-4-2", title: "Expose model inference through high-throughput async FastAPI endpoints" }
        ],
        project: "Enterprise RAG AI Knowledge Navigator with streaming responses and Docker deployment"
      },
      {
        id: "phase-5",
        title: "Phase 5: MLOps, System Design & Portfolio",
        timeline: "Weeks 18 - 20 • 10 hrs/wk",
        description: "ML system design, model monitoring, latency optimization, and portfolio presentation.",
        topics: [
          { id: "topic-5-1", title: "ML System Design: Offline vs Online Training, Caching, Batch Inference", resourceUrl: "https://github.com/chiphuyen/machine-learning-systems-design" },
          { id: "topic-5-2", title: "Model Monitoring: Drift Detection, Hallucination Evals, and Logging", resourceUrl: "https://wandb.ai/" },
          { id: "topic-5-3", title: "AI Technical Resume Audit and GitHub Repository Curation", resourceUrl: "https://github.com" }
        ],
        tasks: [
          { id: "task-5-1", title: "Complete end-to-end READMEs with architecture diagrams and benchmarks" }
        ],
        project: "Deployed AI Service with benchmark graphs and latency metrics on GitHub"
      }
    ]
  },
  {
    id: "ui-ux-designer",
    title: "UI/UX Product Designer",
    category: "Design & User Experience",
    categoryKey: "design",
    tagline: "Design intuitive user journeys, high-fidelity design systems, and delightful digital products.",
    salaryRange: "$82,000 - $138,000 / yr",
    projectedGrowth: "+18% (Steady Growth)",
    difficulty: "Intermediate",
    badge: "Creative Impact",
    overview: "UI/UX Designers conduct user research, wireframe interaction flows, build scalable design systems in Figma, and craft high-fidelity prototypes that drive business results.",
    responsibilities: [
      "Conduct generative and evaluative user research, surveys, and usability tests.",
      "Design wireframes, user flow diagrams, and interactive clickable prototypes.",
      "Maintain tokenized design systems with auto-layout and component variables in Figma.",
      "Ensure digital accessibility compliance (WCAG 2.1 AA) across color and typography.",
      "Collaborate closely with frontend engineers during design handoff and QA reviews."
    ],
    tools: ["Figma", "FigJam", "Design Systems", "Prototyping", "UserTesting", "Maze", "HTML/CSS Basics"],
    progression: [
      { role: "Junior UI/UX Designer", exp: "0 - 2 yrs", salary: "$65k - $85k" },
      { role: "Product Designer", exp: "2 - 5 yrs", salary: "$90k - $125k" },
      { role: "Senior Product Designer", exp: "5 - 8 yrs", salary: "$130k - $165k" },
      { role: "Lead / Design Director", exp: "8+ yrs", salary: "$170k - $225k+" }
    ],
    skills: [
      { id: "user_research", name: "User Research & Usability Testing Methods", benchmark: 90, category: "UX Research" },
      { id: "information_arch", name: "Information Architecture & Wireframing", benchmark: 90, category: "UX" },
      { id: "figma_mastery", name: "Figma (Auto Layout, Variants, Variables)", benchmark: 95, category: "UI" },
      { id: "design_systems", name: "Design System Architecture & Tokens", benchmark: 85, category: "UI" },
      { id: "accessibility_a11y", name: "Accessibility Standards (WCAG 2.1)", benchmark: 85, category: "Core" },
      { id: "interaction_proto", name: "Interactive Micro-interactions & Prototyping", benchmark: 85, category: "UI" },
      { id: "frontend_basics", name: "Frontend Understanding (HTML/CSS Box Model)", benchmark: 75, category: "Handoff" },
      { id: "product_strategy", name: "Product Metrics, KPI Alignment & A/B Testing", benchmark: 75, category: "Product" }
    ],
    roadmapPhases: [
      {
        id: "phase-1",
        title: "Phase 1: Design Fundamentals & Figma Mastery",
        timeline: "Weeks 1 - 4 • 10 hrs/wk",
        description: "Master typography scales, color theory, layout grids, visual hierarchy, and Figma tools.",
        topics: [
          { id: "topic-1-1", title: "Visual Hierarchy: Contrast, Alignment, Proximity, and White Space", resourceUrl: "https://www.interaction-design.org/" },
          { id: "topic-1-2", title: "Typography Fundamentals: Scale, Leading, Kerning, and Pairing", resourceUrl: "https://fonts.google.com/knowledge" },
          { id: "topic-1-3", title: "Figma Deep Dive: Auto-Layout 5.0, Component Sets & Variants", resourceUrl: "https://help.figma.com/hc/en-us" }
        ],
        tasks: [
          { id: "task-1-1", title: "Replicate 3 world-class SaaS application interfaces pixel-for-pixel" },
          { id: "task-1-2", title: "Build a responsive landing page layout utilizing nested auto-layouts" }
        ],
        project: "Pixel-Perfect Responsive SaaS Landing Page & Mobile App Screens in Figma"
      },
      {
        id: "phase-2",
        title: "Phase 2: User Experience Research & Journey Mapping",
        timeline: "Weeks 5 - 8 • 10 hrs/wk",
        description: "Learn how to uncover real user pain points, build user personas, and map complex user journeys.",
        topics: [
          { id: "topic-2-1", title: "Qualitative User Interviews & Quantitative Survey Design", resourceUrl: "https://www.nngroup.com/articles/" },
          { id: "topic-2-2", title: "Customer Journey Maps and Service Blueprints", resourceUrl: "https://www.nngroup.com/articles/customer-journey-mapping/" },
          { id: "topic-2-3", title: "Low-Fidelity Wireframing & Rapid Usability Testing", resourceUrl: "https://balsamiq.com/learn/" }
        ],
        tasks: [
          { id: "task-2-1", title: "Conduct 4 recorded user interviews to identify onboarding friction" },
          { id: "task-2-2", title: "Create a detailed Customer Journey Map identifying opportunities" }
        ],
        project: "In-Depth UX Case Study: User Research, Problem Definition & Wireframes"
      },
      {
        id: "phase-3",
        title: "Phase 3: Design Systems & Tokenized UI Architecture",
        timeline: "Weeks 9 - 12 • 12 hrs/wk",
        description: "Build atomic design systems with semantic design tokens, light/dark modes, and WCAG AA compliance.",
        topics: [
          { id: "topic-3-1", title: "Atomic Design Methodology (Atoms, Molecules, Organisms, Templates)", resourceUrl: "https://atomicdesign.bradfrost.com/" },
          { id: "topic-3-2", title: "Design Tokens & Figma Variables (Color, Spacing, Radius, Modes)", resourceUrl: "https://www.figma.com/community" },
          { id: "topic-3-3", title: "Digital Accessibility (WCAG 2.1 AA Contrast, Focus States, Sizing)", resourceUrl: "https://webaim.org/" }
        ],
        tasks: [
          { id: "task-3-1", title: "Build a complete UI Kit: Buttons, Inputs, Modals, Cards with state variants" },
          { id: "task-3-2", title: "Configure a 1-click Light & Dark mode toggle using Figma Variables" }
        ],
        project: "Production Design System with 40+ modular components and tokenized styles"
      },
      {
        id: "phase-4",
        title: "Phase 4: Advanced Prototyping & Developer Handoff",
        timeline: "Weeks 13 - 16 • 10 hrs/wk",
        description: "Create high-fidelity interactive prototypes with smart animations, conditions, and developer documentation.",
        topics: [
          { id: "topic-4-1", title: "Figma Smart Animate, Interactive Component States & Logic", resourceUrl: "https://help.figma.com/" },
          { id: "topic-4-2", title: "Developer Handoff: Specs, Assets, Redlines, and Box Model Alignment", resourceUrl: "https://www.figma.com/dev-mode/" }
        ],
        tasks: [
          { id: "task-4-1", title: "Build a realistic checkout flow prototype with micro-interactions" }
        ],
        project: "Clickable High-Fidelity App Prototype with Dev Mode handoff documentation"
      },
      {
        id: "phase-5",
        title: "Phase 5: Portfolio Presentation & Storytelling",
        timeline: "Weeks 17 - 18 • 10 hrs/wk",
        description: "Package case studies into compelling visual stories highlighting business outcomes and design decisions.",
        topics: [
          { id: "topic-5-1", title: "Case Study Structure: Context, Problem, Constraints, Process, Impact", resourceUrl: "https://cofolios.com/" },
          { id: "topic-5-2", title: "UX Whiteboard & App Critique Interview Mastery", resourceUrl: "https://femke.design/" }
        ],
        tasks: [
          { id: "task-5-1", title: "Publish 2 comprehensive, polished case studies to a live portfolio" }
        ],
        project: "Live Online Design Portfolio featuring 2 in-depth product case studies"
      }
    ]
  },
  {
    id: "data-scientist",
    title: "Data Scientist & Analytics Lead",
    category: "Data, AI & Machine Learning",
    categoryKey: "data-ai",
    tagline: "Uncover hidden patterns, build predictive statistical models, and drive data-backed decisions.",
    salaryRange: "$95,000 - $155,000 / yr",
    projectedGrowth: "+35% (Very High Demand)",
    difficulty: "Advanced",
    badge: "High Salary",
    overview: "Data Scientists transform messy data into strategic business leverage using statistical modeling, machine learning, A/B testing experimentation, and interactive data storytelling.",
    responsibilities: [
      "Extract, aggregate, and validate data across enterprise SQL warehouses and lakes.",
      "Formulate statistical hypotheses and design rigorous A/B testing frameworks.",
      "Develop predictive classification, forecasting, and clustering algorithms.",
      "Translate complex statistical findings into actionable executive presentations.",
      "Build automated data quality monitoring and reproducible analytics pipelines."
    ],
    tools: ["Python", "SQL", "Tableau", "Pandas", "Scikit-Learn", "Snowflake", "Jupyter", "A/B Testing"],
    progression: [
      { role: "Junior Data Analyst / Scientist", exp: "0 - 2 yrs", salary: "$75k - $95k" },
      { role: "Data Scientist", exp: "2 - 5 yrs", salary: "$105k - $145k" },
      { role: "Senior Data Scientist", exp: "5 - 8 yrs", salary: "$150k - $190k" },
      { role: "Principal Data Scientist / Director", exp: "8+ yrs", salary: "$200k - $280k+" }
    ],
    skills: [
      { id: "sql_advanced", name: "Advanced SQL (Window Functions, CTEs, Optimization)", benchmark: 95, category: "Data" },
      { id: "python_analytics", name: "Python for Data Analysis (Pandas, NumPy)", benchmark: 90, category: "Programming" },
      { id: "stats_experiment", name: "Statistical Modeling & A/B Testing Design", benchmark: 90, category: "Math & Stats" },
      { id: "ml_predictive", name: "Predictive Modeling & Scikit-Learn", benchmark: 85, category: "Modeling" },
      { id: "data_viz_bi", name: "Data Storytelling & BI Dashboards (Tableau/PowerBI)", benchmark: 85, category: "Visualization" },
      { id: "data_warehousing", name: "Data Warehousing (Snowflake/BigQuery)", benchmark: 75, category: "Data Engineering" },
      { id: "business_acumen", name: "Executive Presentation & Business Acumen", benchmark: 80, category: "Strategy" }
    ],
    roadmapPhases: [
      {
        id: "phase-1",
        title: "Phase 1: Advanced SQL & Data Wrangling",
        timeline: "Weeks 1 - 4 • 12 hrs/wk",
        description: "Master complex SQL queries, window functions, common table expressions, and data cleaning.",
        topics: [
          { id: "topic-1-1", title: "Window Functions: OVER, PARTITION BY, LEAD, LAG, DENSE_RANK", resourceUrl: "https://mode.com/sql-tutorial/" },
          { id: "topic-1-2", title: "CTEs, Subqueries, and Complex Multi-Table Relational Joins", resourceUrl: "https://sqlbolt.com/" }
        ],
        tasks: [
          { id: "task-1-1", title: "Solve 30 advanced SQL business interview challenges on LeetCode/StrataScratch" }
        ],
        project: "SQL-Based Retention and Cohort Analysis on SaaS Subscription Data"
      },
      {
        id: "phase-2",
        title: "Phase 2: Applied Statistics & A/B Experimentation",
        timeline: "Weeks 5 - 8 • 12 hrs/wk",
        description: "P-values, confidence intervals, sample size power calculations, and randomized control trials.",
        topics: [
          { id: "topic-2-1", title: "Hypothesis Testing: T-Tests, Chi-Square, ANOVA & Bonferroni Correction", resourceUrl: "https://www.khanacademy.org/" },
          { id: "topic-2-2", title: "A/B Test Design: Minimum Detectable Effect & Sample Sizing", resourceUrl: "https://exp-platform.com/" }
        ],
        tasks: [
          { id: "task-2-1", title: "Design, simulate, and analyze an end-to-end A/B test with statistical significance" }
        ],
        project: "Complete Product Experimentation Analysis & Executive Decision Brief"
      },
      {
        id: "phase-3",
        title: "Phase 3: Machine Learning & Predictive Modeling",
        timeline: "Weeks 9 - 13 • 14 hrs/wk",
        description: "Customer churn prediction, linear & logistic regression, decision trees, and ensemble methods.",
        topics: [
          { id: "topic-3-1", title: "Supervised Learning for Business: Churn, LTV, and Fraud Detection", resourceUrl: "https://scikit-learn.org/" }
        ],
        tasks: [
          { id: "task-3-1", title: "Build an end-to-end customer churn prediction model with 85%+ accuracy" }
        ],
        project: "Customer Lifetime Value (LTV) & Churn Machine Learning Model"
      },
      {
        id: "phase-4",
        title: "Phase 4: BI Dashboards & Executive Storytelling",
        timeline: "Weeks 14 - 16 • 10 hrs/wk",
        description: "Design interactive Tableau/PowerBI dashboards and present insights clearly.",
        topics: [
          { id: "topic-4-1", title: "Executive Dashboard Design: Metric hierarchies and actionable KPIs", resourceUrl: "https://www.tableau.com/learn" }
        ],
        tasks: [
          { id: "task-4-1", title: "Build an interactive Tableau public dashboard with drill-down filters" }
        ],
        project: "Executive Revenue & Product Analytics BI Dashboard"
      }
    ]
  },
  {
    id: "cloud-devops-engineer",
    title: "Cloud & DevOps Solutions Engineer",
    category: "Cloud, DevOps & Cybersecurity",
    categoryKey: "cloud-security",
    tagline: "Automate resilient cloud infrastructure, CI/CD pipelines, and Kubernetes orchestration.",
    salaryRange: "$105,000 - $165,000 / yr",
    projectedGrowth: "+28% (High Demand)",
    difficulty: "Advanced",
    badge: "High Infrastructure Demand",
    overview: "DevOps engineers bridge software development with cloud operations. They automate infrastructure as code, build zero-downtime deployment pipelines, and guarantee high availability.",
    responsibilities: [
      "Provision and manage cloud infrastructure using Terraform and AWS/GCP.",
      "Design zero-downtime CI/CD delivery pipelines using GitHub Actions.",
      "Configure containerized microservices orchestration with Kubernetes.",
      "Set up observability, distributed tracing, metrics, and Prometheus/Grafana alerting.",
      "Enforce cloud security baselines, IAM roles, and secret rotation policies."
    ],
    tools: ["AWS", "Docker", "Kubernetes", "Terraform", "GitHub Actions", "Linux", "Prometheus", "Grafana"],
    progression: [
      { role: "Junior DevOps / Cloud Engineer", exp: "0 - 2 yrs", salary: "$80k - $100k" },
      { role: "DevOps Engineer", exp: "2 - 5 yrs", salary: "$110k - $145k" },
      { role: "Senior Cloud Architect", exp: "5 - 8 yrs", salary: "$155k - $195k" },
      { role: "Staff / Principal SRE", exp: "8+ yrs", salary: "$205k - $275k+" }
    ],
    skills: [
      { id: "linux_bash", name: "Linux Administration & Bash Shell Scripting", benchmark: 95, category: "OS" },
      { id: "cloud_aws", name: "AWS Cloud Architecture (EC2, S3, RDS, IAM, VPC)", benchmark: 90, category: "Cloud" },
      { id: "docker_containers", name: "Docker Containerization & Image Optimization", benchmark: 90, category: "Containers" },
      { id: "kubernetes_k8s", name: "Kubernetes Cluster Management & Helm", benchmark: 80, category: "Containers" },
      { id: "iac_terraform", name: "Infrastructure as Code (Terraform)", benchmark: 85, category: "IaC" },
      { id: "cicd_automation", name: "CI/CD Pipeline Automation (GitHub Actions)", benchmark: 90, category: "CI/CD" },
      { id: "observability", name: "Monitoring & Observability (Prometheus/Grafana)", benchmark: 75, category: "Monitoring" }
    ],
    roadmapPhases: [
      {
        id: "phase-1",
        title: "Phase 1: Linux Systems & Networking Fundamentals",
        timeline: "Weeks 1 - 4 • 10 hrs/wk",
        description: "Master Linux terminal commands, permissions, systemd services, SSH keys, DNS, and HTTP/HTTPS networking.",
        topics: [
          { id: "topic-1-1", title: "Linux Process Management, File Permissions, and Bash Scripting", resourceUrl: "https://linuxjourney.com/" },
          { id: "topic-1-2", title: "Computer Networking: TCP/IP, DNS, Subnets, Gateways, and Load Balancing", resourceUrl: "https://www.cloudflare.com/learning/" }
        ],
        tasks: [
          { id: "task-1-1", title: "Write an automated Bash backup & health monitoring script with cron" }
        ],
        project: "Automated Linux Server Provisioning & Hardening Script"
      },
      {
        id: "phase-2",
        title: "Phase 2: Docker Containers & CI/CD Pipelines",
        timeline: "Weeks 5 - 8 • 12 hrs/wk",
        description: "Containerize multi-service applications and automate test/build pipelines.",
        topics: [
          { id: "topic-2-1", title: "Multi-stage Dockerfiles & Security Best Practices", resourceUrl: "https://docs.docker.com/" },
          { id: "topic-2-2", title: "GitHub Actions CI/CD: Automated Linting, Testing, and Registry Publishing", resourceUrl: "https://docs.github.com/en/actions" }
        ],
        tasks: [
          { id: "task-2-1", title: "Build an automated pipeline that builds, tests, and pushes Docker images" }
        ],
        project: "Automated Multi-Stage CI/CD Deployment Pipeline on GitHub Actions"
      },
      {
        id: "phase-3",
        title: "Phase 3: Infrastructure as Code (Terraform) & AWS",
        timeline: "Weeks 9 - 13 • 14 hrs/wk",
        description: "Automate entire cloud environments with Terraform code.",
        topics: [
          { id: "topic-3-1", title: "Terraform Modules, State Management & Cloud Providers", resourceUrl: "https://developer.hashicorp.com/terraform/docs" },
          { id: "topic-3-2", title: "AWS Core Infrastructure: VPC, Subnets, EC2, RDS, IAM, S3", resourceUrl: "https://aws.amazon.com/architecture/" }
        ],
        tasks: [
          { id: "task-3-1", title: "Deploy a high-availability VPC with private DB subnets via Terraform" }
        ],
        project: "Production AWS Infrastructure Codebase using Terraform Modules"
      },
      {
        id: "phase-4",
        title: "Phase 4: Kubernetes Orchestration & Observability",
        timeline: "Weeks 14 - 18 • 12 hrs/wk",
        description: "Orchestrate microservices with K8s Pods, Deployments, Ingress, and monitor with Grafana.",
        topics: [
          { id: "topic-4-1", title: "Kubernetes Core: Deployments, Services, ConfigMaps, Secrets, Ingress", resourceUrl: "https://kubernetes.io/docs/home/" },
          { id: "topic-4-2", title: "Observability: Prometheus Metrics, Grafana Dashboards, Loki Logging", resourceUrl: "https://grafana.com/docs/" }
        ],
        tasks: [
          { id: "task-4-1", title: "Deploy a resilient microservice on Kubernetes with autoscaling" }
        ],
        project: "End-to-End Kubernetes Microservices Cluster with Grafana Dashboards"
      }
    ]
  },
  {
    id: "cybersecurity-analyst",
    title: "Cybersecurity Analyst & Threat Hunter",
    category: "Cloud, DevOps & Cybersecurity",
    categoryKey: "cloud-security",
    tagline: "Defend critical infrastructure, audit vulnerabilities, and analyze cyber threats.",
    salaryRange: "$86,000 - $142,000 / yr",
    projectedGrowth: "+32% (Critical Need)",
    difficulty: "Intermediate",
    badge: "Mission Critical",
    overview: "Cybersecurity Analysts protect networks and applications from vulnerabilities, monitor security information and event management (SIEM) systems, and conduct incident response.",
    responsibilities: [
      "Monitor SIEM logs for security anomalies, intrusion attempts, and unauthorized access.",
      "Conduct vulnerability assessments and penetration tests using industry frameworks.",
      "Implement zero-trust network access, encryption standards, and endpoint protection.",
      "Lead incident response procedures during security events and write post-mortems.",
      "Ensure compliance with SOC2, ISO 27001, and GDPR security requirements."
    ],
    tools: ["Wireshark", "Splunk", "Nmap", "Metasploit", "Burp Suite", "Linux", "Python", "SIEM"],
    progression: [
      { role: "SOC Tier 1 Analyst", exp: "0 - 2 yrs", salary: "$70k - $88k" },
      { role: "Cybersecurity Analyst / Pen Tester", exp: "2 - 5 yrs", salary: "$95k - $125k" },
      { role: "Senior Security Engineer", exp: "5 - 8 yrs", salary: "$135k - $170k" },
      { role: "Chief Information Security Officer (CISO)", exp: "8+ yrs", salary: "$180k - $250k+" }
    ],
    skills: [
      { id: "networking_protocols", name: "Network Security & Protocols (TCP/IP, TLS, DNS)", benchmark: 90, category: "Networking" },
      { id: "siem_logging", name: "SIEM & Log Analysis (Splunk / Elastic Security)", benchmark: 85, category: "Defense" },
      { id: "vulnerability_audit", name: "Vulnerability Scanning & Penetration Testing", benchmark: 85, category: "Offense" },
      { id: "incident_response", name: "Incident Response & Forensics", benchmark: 85, category: "Response" },
      { id: "owasp_web_sec", name: "OWASP Top 10 Web Application Security", benchmark: 90, category: "AppSec" },
      { id: "security_python", name: "Python Scripting for Security Automation", benchmark: 75, category: "Scripting" }
    ],
    roadmapPhases: [
      {
        id: "phase-1",
        title: "Phase 1: Security Fundamentals & Network Defense",
        timeline: "Weeks 1 - 4 • 10 hrs/wk",
        description: "Packet analysis with Wireshark, firewall configurations, and cryptography basics.",
        topics: [
          { id: "topic-1-1", title: "Packet Inspection & Protocol Analysis with Wireshark", resourceUrl: "https://www.wireshark.org/" },
          { id: "topic-1-2", title: "Public Key Cryptography, Hashing, and SSL/TLS Handshakes", resourceUrl: "https://www.coursera.org/" }
        ],
        tasks: [
          { id: "task-1-1", title: "Analyze PCAP network captures to detect suspicious reconnaissance traffic" }
        ],
        project: "Network Traffic Security Audit and Port Scanning Analysis"
      },
      {
        id: "phase-2",
        title: "Phase 2: Web Application Security & OWASP Top 10",
        timeline: "Weeks 5 - 8 • 12 hrs/wk",
        description: "SQL Injection, Cross-Site Scripting (XSS), CSRF, SSRF, and authentication bypasses.",
        topics: [
          { id: "topic-2-1", title: "OWASP Top 10 Web Vulnerabilities and Remediation", resourceUrl: "https://owasp.org/www-project-top-ten/" },
          { id: "topic-2-2", title: "Hands-on Web Exploitation Labs using PortSwigger Web Security Academy", resourceUrl: "https://portswigger.net/web-security" }
        ],
        tasks: [
          { id: "task-2-1", title: "Identify and patch 5 critical vulnerabilities in an intentionally flawed app" }
        ],
        project: "Web Application Penetration Test Report with Remediation Plan"
      },
      {
        id: "phase-3",
        title: "Phase 3: Threat Hunting, SIEM & Incident Response",
        timeline: "Weeks 9 - 14 • 12 hrs/wk",
        description: "Log correlation in Splunk, detecting malware behaviors, and incident response runbooks.",
        topics: [
          { id: "topic-3-1", title: "Splunk Query Language & Correlation Rules for Attack Detection", resourceUrl: "https://www.splunk.com/" }
        ],
        tasks: [
          { id: "task-3-1", title: "Build custom SIEM alert rules detecting brute force and lateral movement" }
        ],
        project: "SOC Incident Response Playbook and Detection Engine"
      }
    ]
  },
  {
    id: "product-manager",
    title: "Technical Product Manager",
    category: "Product, Management & Business Tech",
    categoryKey: "product",
    tagline: "Define product strategy, lead cross-functional squads, and launch high-impact digital solutions.",
    salaryRange: "$100,000 - $160,000 / yr",
    projectedGrowth: "+19% (Consistent Demand)",
    difficulty: "Intermediate",
    badge: "Leadership Track",
    overview: "Product Managers discover market opportunities, define roadmaps, write crisp user stories, align engineering with design, and obsess over user engagement metrics.",
    responsibilities: [
      "Define multi-quarter product roadmaps and strategic feature priorities.",
      "Write PRDs (Product Requirement Documents) with clear acceptance criteria.",
      "Conduct customer discovery interviews and translate findings into feature specs.",
      "Track adoption, retention, churn, and revenue metrics in Amplitude/Mixpanel.",
      "Facilitate agile sprints, backlog grooming, and cross-functional team alignment."
    ],
    tools: ["Jira", "Notion", "Figma", "Amplitude", "Mixpanel", "SQL Basics", "Roadmapping"],
    progression: [
      { role: "Associate Product Manager", exp: "0 - 2 yrs", salary: "$78k - $100k" },
      { role: "Product Manager", exp: "2 - 5 yrs", salary: "$110k - $145k" },
      { role: "Senior Product Manager", exp: "5 - 8 yrs", salary: "$150k - $190k" },
      { role: "VP of Product / CPO", exp: "8+ yrs", salary: "$200k - $300k+" }
    ],
    skills: [
      { id: "product_strategy_pm", name: "Product Strategy & Vision Articulation", benchmark: 90, category: "Strategy" },
      { id: "prd_authoring", name: "PRD Writing & User Story Definition", benchmark: 95, category: "Execution" },
      { id: "product_analytics", name: "Product Analytics (Mixpanel / Amplitude / SQL)", benchmark: 85, category: "Analytics" },
      { id: "user_discovery", name: "User Discovery & Customer Interviewing", benchmark: 90, category: "Discovery" },
      { id: "agile_scrum", name: "Agile, Scrum & Sprint Management", benchmark: 90, category: "Execution" },
      { id: "tech_literacy", name: "Technical Architecture Literacy", benchmark: 75, category: "Technical" }
    ],
    roadmapPhases: [
      {
        id: "phase-1",
        title: "Phase 1: Product Fundamentals & Customer Discovery",
        timeline: "Weeks 1 - 4 • 10 hrs/wk",
        description: "Learn the product lifecycle, problem vs solution spaces, and interviewing customers without bias.",
        topics: [
          { id: "topic-1-1", title: "The Mom Test: Uncovering authentic customer pain points without asking for opinions", resourceUrl: "https://www.momtestbook.com/" },
          { id: "topic-1-2", title: "Writing Clear Product Requirement Documents (PRDs) and User Stories", resourceUrl: "https://www.atlassian.com/agile/product-management/requirements" }
        ],
        tasks: [
          { id: "task-1-1", title: "Draft a comprehensive PRD for an innovative feature with user personas and edge cases" }
        ],
        project: "Complete Product Requirement Document (PRD) with interactive Figma wireframes"
      },
      {
        id: "phase-2",
        title: "Phase 2: Product Metrics, Analytics & Experimentation",
        timeline: "Weeks 5 - 8 • 10 hrs/wk",
        description: "North star metrics, funnels, cohort retention, and data-driven prioritization frameworks (RICE).",
        topics: [
          { id: "topic-2-1", title: "AARRR Pirate Metrics, Retention Curves, and Churn Calculation", resourceUrl: "https://amplitude.com/retention-guide" },
          { id: "topic-2-2", title: "Prioritization Frameworks: RICE, Kano, and Cost of Delay", resourceUrl: "https://www.intercom.com/blog/rice-simple-prioritization-for-product-managers/" }
        ],
        tasks: [
          { id: "task-2-1", title: "Prioritize a backlog of 20 features using a weighted RICE scoring matrix" }
        ],
        project: "Product Analytics Dashboard & Prioritized Feature Roadmap"
      }
    ]
  },
  {
    id: "growth-marketer",
    title: "Growth Marketing & SEO Strategist",
    category: "Marketing & Growth",
    categoryKey: "marketing",
    tagline: "Drive rapid customer acquisition, viral loops, search engine dominance, and conversion optimization.",
    salaryRange: "$75,000 - $130,000 / yr",
    projectedGrowth: "+17% (High Business Demand)",
    difficulty: "Intermediate",
    badge: "Revenue Driver",
    overview: "Growth Marketers engineer full-funnel acquisition engines. They combine content SEO, paid performance channels, email automation, and conversion rate optimization (CRO) to scale tech businesses.",
    responsibilities: [
      "Formulate and execute rapid growth marketing experiments across acquisition channels.",
      "Conduct in-depth technical and content SEO audits to capture high-intent search traffic.",
      "Set up lifecycle email automation workflows, onboarding journeys, and win-back campaigns.",
      "Run quantitative A/B landing page tests to systematically boost conversion rates.",
      "Analyze channel ROAS, customer acquisition cost (CAC), and customer lifetime value (LTV)."
    ],
    tools: ["Google Analytics 4", "Ahrefs", "HubSpot", "Meta Ads", "Google Ads", "Optimizely", "Hotjar"],
    progression: [
      { role: "Junior Growth Marketer", exp: "0 - 2 yrs", salary: "$58k - $78k" },
      { role: "Growth Marketing Manager", exp: "2 - 5 yrs", salary: "$85k - $120k" },
      { role: "Head of Growth", exp: "5 - 8 yrs", salary: "$130k - $175k" },
      { role: "VP of Growth & Marketing", exp: "8+ yrs", salary: "$180k - $240k+" }
    ],
    skills: [
      { id: "seo_technical", name: "Technical & Content SEO Architecture", benchmark: 90, category: "Organic" },
      { id: "cro_experimentation", name: "Conversion Rate Optimization (CRO) & A/B Testing", benchmark: 90, category: "Acquisition" },
      { id: "analytics_ga4", name: "Marketing Analytics & Attribution (GA4, Mixpanel)", benchmark: 85, category: "Analytics" },
      { id: "paid_performance", name: "Paid Ads Management (Meta, Google Search, LinkedIn)", benchmark: 85, category: "Paid" },
      { id: "lifecycle_email", name: "Lifecycle Email Marketing & Drip Automations", benchmark: 80, category: "Retention" },
      { id: "copywriting", name: "Direct-Response SaaS Copywriting & Messaging", benchmark: 85, category: "Creative" }
    ],
    roadmapPhases: [
      {
        id: "phase-1",
        title: "Phase 1: Technical SEO & Organic Acquisition",
        timeline: "Weeks 1 - 4 • 10 hrs/wk",
        description: "Keyword research, search intent mapping, technical site health audits, and link building.",
        topics: [
          { id: "topic-1-1", title: "Keyword Clustering and Search Intent Mapping", resourceUrl: "https://ahrefs.com/blog/keyword-research/" },
          { id: "topic-1-2", title: "Technical SEO: Core Web Vitals, Schema Markup, and Crawl Budget", resourceUrl: "https://web.dev/vitals/" }
        ],
        tasks: [
          { id: "task-1-1", title: "Perform a technical SEO audit on a live website and identify 10 key fixes" }
        ],
        project: "Comprehensive SEO Strategy Blueprint & Keyword Opportunity Matrix"
      },
      {
        id: "phase-2",
        title: "Phase 2: CRO, Landing Pages & Paid Funnels",
        timeline: "Weeks 5 - 8 • 10 hrs/wk",
        description: "Landing page conversion principles, copywriting heuristics, and paid ad creative testing.",
        topics: [
          { id: "topic-2-1", title: "LIFT Model for Conversion Rate Optimization", resourceUrl: "https://www.widerfunnel.com/" },
          { id: "topic-2-2", title: "Paid Search & Social Campaign Structure and Tracking", resourceUrl: "https://support.google.com/google-ads" }
        ],
        tasks: [
          { id: "task-2-1", title: "Design and copywrite a high-converting B2B SaaS landing page" }
        ],
        project: "Full-Funnel Growth Experiment Plan with Landing Page Wireframe"
      }
    ]
  }
];

// 2. Comprehensive Career Assessment Questions
const ASSESSMENT_QUESTIONS = [
  {
    id: "q1",
    phase: "Interests & Passions",
    question: "When approaching a challenging project, which type of activity excites you the most?",
    subtitle: "Select the option that feels most natural and energizing to you.",
    options: [
      { id: "q1_a", text: "Building tangible digital products and seeing code turn into working apps", icon: "code", tags: { "full-stack-developer": 30, "ui-ux-designer": 15, "ai-ml-engineer": 10 } },
      { id: "q1_b", text: "Training intelligent algorithms, analyzing trends, and solving mathematical puzzles", icon: "sparkles", tags: { "ai-ml-engineer": 30, "data-scientist": 30 } },
      { id: "q1_c", text: "Crafting visually stunning layouts, micro-interactions, and human-centered experiences", icon: "layout", tags: { "ui-ux-designer": 35, "full-stack-developer": 10 } },
      { id: "q1_d", text: "Securing systems, orchestrating cloud networks, and automating server infrastructure", icon: "shield", tags: { "cloud-devops-engineer": 30, "cybersecurity-analyst": 30 } },
      { id: "q1_e", text: "Defining product strategy, aligning teams, and driving business growth", icon: "target", tags: { "product-manager": 30, "growth-marketer": 25 } }
    ]
  },
  {
    id: "q2",
    phase: "Interests & Passions",
    question: "How do you prefer to spend your daily work time?",
    subtitle: "Choose the environment where you do your deepest, best work.",
    options: [
      { id: "q2_a", text: "Hands-on writing and debugging code across frontend and backend stacks", icon: "code", tags: { "full-stack-developer": 25, "cloud-devops-engineer": 15 } },
      { id: "q2_b", text: "Exploring data sets, running experiments, and building statistical models", icon: "chart", tags: { "data-scientist": 25, "ai-ml-engineer": 25 } },
      { id: "q2_c", text: "Sketching user flows, interviewing users, and designing interfaces in Figma", icon: "layout", tags: { "ui-ux-designer": 30 } },
      { id: "q2_d", text: "Hunting security vulnerabilities, monitoring traffic, and configuring firewalls", icon: "shield", tags: { "cybersecurity-analyst": 30, "cloud-devops-engineer": 20 } },
      { id: "q2_e", text: "Running user experiments, optimizing funnels, and scaling traffic", icon: "trendingUp", tags: { "growth-marketer": 30, "product-manager": 20 } }
    ]
  },
  {
    id: "q3",
    phase: "Technical Affinity",
    question: "What is your comfort or interest level with programming languages?",
    subtitle: "Be honest—there are great career paths for all technical preferences.",
    options: [
      { id: "q3_a", text: "Love programming deeply (JavaScript/TypeScript, Python, APIs, DBs)", icon: "code", tags: { "full-stack-developer": 30, "ai-ml-engineer": 25, "cloud-devops-engineer": 20 } },
      { id: "q3_b", text: "Excited by Python, SQL queries, and scientific libraries (Pandas, PyTorch)", icon: "database", tags: { "ai-ml-engineer": 30, "data-scientist": 30 } },
      { id: "q3_c", text: "Prefer visual design, UX psychology, and only light HTML/CSS understanding", icon: "layout", tags: { "ui-ux-designer": 35 } },
      { id: "q3_d", text: "Prefer scripting, terminal commands, Linux Bash, and cloud automation", icon: "zap", tags: { "cloud-devops-engineer": 30, "cybersecurity-analyst": 25 } },
      { id: "q3_e", text: "Prefer strategic thinking, user empathy, and no-code analytics over writing code", icon: "briefcase", tags: { "product-manager": 30, "growth-marketer": 25 } }
    ]
  },
  {
    id: "q4",
    phase: "Technical Affinity",
    question: "How do you feel about working with mathematics, statistics, and data models?",
    subtitle: "Helps calibrate analytical vs design vs engineering weighting.",
    options: [
      { id: "q4_a", text: "I love statistics, probability, matrices, and quantitative hypotheses", icon: "chart", tags: { "ai-ml-engineer": 30, "data-scientist": 35 } },
      { id: "q4_b", text: "Comfortable with logic and algorithms, but don't want pure academic math", icon: "code", tags: { "full-stack-developer": 25, "cloud-devops-engineer": 20, "cybersecurity-analyst": 20 } },
      { id: "q4_c", text: "I care about product business metrics (conversion rates, churn, ROAS)", icon: "trendingUp", tags: { "product-manager": 25, "growth-marketer": 30 } },
      { id: "q4_d", text: "I prefer visual creativity, emotional resonance, and ergonomics over numbers", icon: "sparkles", tags: { "ui-ux-designer": 30 } }
    ]
  },
  {
    id: "q5",
    phase: "Work Style & Strengths",
    question: "Which of these personal strengths best characterizes your problem-solving style?",
    subtitle: "Your innate cognitive strengths dictate which roles will feel effortless.",
    options: [
      { id: "q5_a", text: "Architectural builder: breaking complex requirements into elegant components", icon: "code", tags: { "full-stack-developer": 30, "cloud-devops-engineer": 20 } },
      { id: "q5_b", text: "Investigative analyst: questioning data, spotting anomalies, uncovering truth", icon: "search", tags: { "data-scientist": 30, "cybersecurity-analyst": 25 } },
      { id: "q5_c", text: "Empathic creator: deeply understanding human frustration and simplifying friction", icon: "user", tags: { "ui-ux-designer": 35 } },
      { id: "q5_d", text: "Resilience champion: protecting systems, anticipating disasters, ensuring uptime", icon: "shield", tags: { "cloud-devops-engineer": 25, "cybersecurity-analyst": 30 } },
      { id: "q5_e", text: "Strategic communicator: rallying people around a bold vision and prioritizing value", icon: "target", tags: { "product-manager": 30, "growth-marketer": 25 } }
    ]
  },
  {
    id: "q6",
    phase: "Work Style & Strengths",
    question: "How do you respond when a problem is ambiguous with no clear single answer?",
    subtitle: "Different tech disciplines handle ambiguity in distinct ways.",
    options: [
      { id: "q6_a", text: "I run prototypes and fast experiments to see what works practically", icon: "zap", tags: { "full-stack-developer": 25, "growth-marketer": 25 } },
      { id: "q6_b", text: "I gather data, conduct research, and calculate probabilities", icon: "chart", tags: { "data-scientist": 30, "ai-ml-engineer": 25 } },
      { id: "q6_c", text: "I talk to users, observe their behavior, and test wireframes", icon: "user", tags: { "ui-ux-designer": 30, "product-manager": 25 } },
      { id: "q6_d", text: "I perform threat assessments, audit configurations, and eliminate risks", icon: "shield", tags: { "cybersecurity-analyst": 30, "cloud-devops-engineer": 25 } }
    ]
  },
  {
    id: "q7",
    phase: "Career Goals & Outcomes",
    question: "What is your primary career motivation over the next 2-3 years?",
    subtitle: "Aligning your path with your true motivation leads to long-term success.",
    options: [
      { id: "q7_a", text: "Building high-demand technical craft with strong remote job opportunities", icon: "code", tags: { "full-stack-developer": 25, "cloud-devops-engineer": 20 } },
      { id: "q7_b", text: "Pioneering at the bleeding edge of Artificial Intelligence and deep tech", icon: "sparkles", tags: { "ai-ml-engineer": 35, "data-scientist": 20 } },
      { id: "q7_c", text: "Expressing creative design talent while influencing how millions experience software", icon: "layout", tags: { "ui-ux-designer": 30 } },
      { id: "q7_d", text: "High job security, mission-critical defense, and vital enterprise necessity", icon: "shield", tags: { "cybersecurity-analyst": 35, "cloud-devops-engineer": 25 } },
      { id: "q7_e", text: "Fast-tracking into leadership, executive influence, or founding a startup", icon: "target", tags: { "product-manager": 30, "growth-marketer": 25 } }
    ]
  },
  {
    id: "q8",
    phase: "Career Goals & Outcomes",
    question: "What type of project portfolio would you be proudest to show a prospective employer?",
    subtitle: "Your portfolio is your ultimate passport to landing interviews.",
    options: [
      { id: "q8_a", text: "A deployed, full-stack web application with responsive UI, auth, and database", icon: "rocket", tags: { "full-stack-developer": 35 } },
      { id: "q8_b", text: "An autonomous AI agent / RAG application with custom PyTorch models", icon: "sparkles", tags: { "ai-ml-engineer": 35 } },
      { id: "q8_c", text: "A Figma design system with verified user research case studies and prototypes", icon: "layout", tags: { "ui-ux-designer": 35 } },
      { id: "q8_d", text: "A multi-cloud automated CI/CD pipeline and Kubernetes cluster via Terraform", icon: "database", tags: { "cloud-devops-engineer": 35 } },
      { id: "q8_e", text: "A security audit report disclosing vulnerabilities and hardening strategies", icon: "shield", tags: { "cybersecurity-analyst": 35 } },
      { id: "q8_f", text: "A comprehensive PRD, product strategy roadmap, and user metrics analysis", icon: "briefcase", tags: { "product-manager": 35, "growth-marketer": 30 } }
    ]
  }
];

// 3. Centralized Resume Audit Checklist (32 Industry-Standard ATS Criteria)
const RESUME_CRITERIA = [
  {
    category: "Contact & Professional Brand",
    items: [
      { id: "contact_name", text: "Full name displayed prominently in large, clear font at top", weight: 3 },
      { id: "contact_title", text: "Target job title directly below name (matches job you are seeking)", weight: 4 },
      { id: "contact_email", text: "Professional, non-embarrassing email address (e.g. name@domain.com)", weight: 3 },
      { id: "contact_phone", text: "Phone number with international area code", weight: 2 },
      { id: "contact_location", text: "City, State/Country (exact street address omitted for privacy)", weight: 2 },
      { id: "contact_linkedin", text: "Customized LinkedIn profile URL (clean slug, no random numbers)", weight: 4 },
      { id: "contact_github", text: "Active GitHub / Live Portfolio link with working demo links", weight: 5 }
    ]
  },
  {
    category: "Summary & Objective",
    items: [
      { id: "summary_presence", text: "Concise 3-4 sentence professional summary tailored to target role", weight: 4 },
      { id: "summary_value_prop", text: "Highlights core technical strengths and value proposition clearly", weight: 4 },
      { id: "summary_no_buzzwords", text: "Avoids generic cliches ('hardworking team player', 'go-getter')", weight: 3 }
    ]
  },
  {
    category: "Core Technical Skills",
    items: [
      { id: "skills_categorized", text: "Skills organized neatly into categories (Languages, Frameworks, Tools, Cloud)", weight: 4 },
      { id: "skills_no_bars", text: "No subjective skill rating bars or star ratings (confuses ATS parsers)", weight: 4 },
      { id: "skills_keywords", text: "Includes high-priority keywords from specific target job descriptions", weight: 5 }
    ]
  },
  {
    category: "Projects & Portfolio Section",
    items: [
      { id: "proj_count", text: "Includes 2 to 3 production-grade, non-tutorial capstone projects", weight: 5 },
      { id: "proj_links", text: "Each project includes clickable Live Demo and GitHub Repo links", weight: 5 },
      { id: "proj_stack", text: "Explicitly lists the technical stack used for each project", weight: 3 },
      { id: "proj_star_impact", text: "Bullet points describe Problem Solved, Tech Implementation & Metrics", weight: 5 },
      { id: "proj_metrics", text: "Contains at least 2 quantifiable numbers (e.g. 40% faster, 500+ users)", weight: 5 }
    ]
  },
  {
    category: "Work & Internship Experience",
    items: [
      { id: "exp_action_verbs", text: "Every bullet point starts with a strong past-tense action verb (Built, Engineered, Scaled)", weight: 4 },
      { id: "exp_chronological", text: "Reverse chronological order (most recent position first)", weight: 3 },
      { id: "exp_results_focus", text: "Emphasizes accomplishments and business impact rather than job duties", weight: 5 },
      { id: "exp_consistent_dates", text: "Consistent date formatting (e.g., 'Jan 2024 – Present')", weight: 2 }
    ]
  },
  {
    category: "Education & Certifications",
    items: [
      { id: "edu_degree", text: "Degree, Major, and Institution name listed accurately", weight: 3 },
      { id: "edu_grad_date", text: "Graduation year or expected graduation year provided", weight: 2 },
      { id: "edu_certifications", text: "Industry certifications (AWS, Meta, CompTIA) or relevant coursework", weight: 3 }
    ]
  },
  {
    category: "ATS & Layout Formatting",
    items: [
      { id: "fmt_page_limit", text: "Strictly 1 page for less than 5 years of experience", weight: 4 },
      { id: "fmt_single_column", text: "Clean single-column layout (multi-column tables often fail ATS parsing)", weight: 4 },
      { id: "fmt_standard_font", text: "Standard, clean sans-serif typography (Inter, Arial, Roboto, Helvetica)", weight: 2 },
      { id: "fmt_no_graphics", text: "No embedded photos, icons, charts, or text boxes inside tables", weight: 3 },
      { id: "fmt_spelling_grammar", text: "100% free of spelling, grammar, and punctuation mistakes", weight: 4 }
    ]
  }
];

// 4. Default Storage State
const DEFAULT_STATE = {
  profile: {
    name: "Alex Morgan",
    headline: "Aspiring Full-Stack Software Engineer",
    email: "alex.morgan@careerly.dev",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, CA / Remote",
    linkedin: "https://linkedin.com/in/alexmorgan-dev",
    github: "https://github.com/alexmorgan-code",
    avatar: "avatar-1",
    bio: "Passionate developer dedicated to engineering scalable web products and intuitive user experiences. Currently mastering modern full-stack technologies.",
    weeklyCommitment: 12,
    learningStyle: "hands-on",
    targetDate: "2027-06-01"
  },
  targetCareerId: "full-stack-developer",
  assessmentAnswers: {},
  assessmentResults: null,
  skillGap: {}, // { [careerId]: { [skillId]: level (0, 25, 50, 75, 100) } }
  roadmapProgress: {}, // { [careerId]: [completedMilestoneIds] }
  resumeChecklist: {}, // { [itemId]: boolean }
  resumeDraft: {
    fullName: "Alex Morgan",
    jobTitle: "Full-Stack Software Engineer",
    email: "alex.morgan@careerly.dev",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, CA / Remote",
    linkedin: "linkedin.com/in/alexmorgan-dev",
    github: "github.com/alexmorgan-code",
    summary: "Dedicated Full-Stack Developer with practical experience engineering responsive web applications, RESTful APIs, and relational database schemas. Proven ability to bridge scalable backend architectures with accessible, intuitive user interfaces.",
    skillsTechnical: "JavaScript (ES6+), TypeScript, React, Node.js, Express, PostgreSQL, Git, Tailwind CSS, Docker Basics, REST APIs",
    education: "B.S. in Computer Science or Software Engineering • State University, 2026",
    projects: [
      {
        name: "DevPulse – Team Performance & Metrics SaaS",
        stack: "React, Node.js, Express, PostgreSQL, Tailwind CSS",
        demoUrl: "https://devpulse-demo.app",
        githubUrl: "https://github.com/alexmorgan-code/devpulse",
        bullets: [
          "Architected full-stack collaborative analytics dashboard supporting 50+ concurrent users with sub-100ms response times.",
          "Implemented JWT authentication, role-based access control (RBAC), and connection-pooled PostgreSQL queries with Prisma.",
          "Automated continuous integration and deployment pipeline using GitHub Actions and Vercel, reducing deployment time by 40%."
        ]
      },
      {
        name: "CloudTrack – Real-time Server Resource Monitor",
        stack: "TypeScript, Node.js, WebSockets, Chart.js, Docker",
        demoUrl: "https://cloudtrack-demo.app",
        githubUrl: "https://github.com/alexmorgan-code/cloudtrack",
        bullets: [
          "Developed real-time WebSocket telemetry engine visualizing CPU, memory, and latency metrics with live charts.",
          "Containerized application with Docker Compose for repeatable local development and production orchestration.",
          "Engineered automated alert triggers notifying webhook endpoints upon resource threshold breaches."
        ]
      }
    ]
  },
  studyActivity: [
    { day: "Mon", hours: 2.5, date: "2026-11-10" },
    { day: "Tue", hours: 3.0, date: "2026-11-11" },
    { day: "Wed", hours: 1.5, date: "2026-11-12" },
    { day: "Thu", hours: 4.0, date: "2026-11-13" },
    { day: "Fri", hours: 2.0, date: "2026-11-14" },
    { day: "Sat", hours: 5.5, date: "2026-11-15" },
    { day: "Sun", hours: 3.5, date: "2026-11-16" }
  ],
  theme: "light"
};

// 5. CareerlyStorage Singleton Engine
class CareerlyStorageEngine {
  constructor() {
    this.STORAGE_KEYS = {
      PROFILE: "careerly_profile",
      TARGET_CAREER: "careerly_target_career",
      ASSESSMENT_ANSWERS: "careerly_assessment_answers",
      ASSESSMENT_RESULTS: "careerly_assessment_results",
      SKILL_GAP: "careerly_skill_gap",
      ROADMAP: "careerly_roadmap",
      RESUME_CHECKLIST: "careerly_resume_checklist",
      RESUME_DRAFT: "careerly_resume_draft",
      STUDY_ACTIVITY: "careerly_study_activity",
      THEME: "careerly_theme"
    };
    this.init();
  }

  init() {
    // Check if initial target career is set
    if (!localStorage.getItem(this.STORAGE_KEYS.TARGET_CAREER)) {
      this.setTargetCareer(DEFAULT_STATE.targetCareerId);
    }
    // Check theme
    const savedTheme = localStorage.getItem(this.STORAGE_KEYS.THEME) || DEFAULT_STATE.theme;
    this.applyTheme(savedTheme);
  }

  // --- Theme Management ---
  getTheme() {
    return localStorage.getItem(this.STORAGE_KEYS.THEME) || "light";
  }

  setTheme(theme) {
    localStorage.setItem(this.STORAGE_KEYS.THEME, theme);
    this.applyTheme(theme);
    this.notify("theme-changed", { theme });
  }

  applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    const body = document.body;
    if (body) {
      if (theme === "dark") {
        body.classList.add("dark-theme");
      } else {
        body.classList.remove("dark-theme");
      }
    }
  }

  toggleTheme() {
    const current = this.getTheme();
    const next = current === "dark" ? "light" : "dark";
    this.setTheme(next);
    return next;
  }

  // --- Profile Management ---
  getProfile() {
    const data = localStorage.getItem(this.STORAGE_KEYS.PROFILE);
    if (!data) {
      return { ...DEFAULT_STATE.profile };
    }
    try {
      return { ...DEFAULT_STATE.profile, ...JSON.parse(data) };
    } catch (e) {
      return { ...DEFAULT_STATE.profile };
    }
  }

  saveProfile(profileData) {
    const current = this.getProfile();
    const updated = { ...current, ...profileData };
    localStorage.setItem(this.STORAGE_KEYS.PROFILE, JSON.stringify(updated));
    this.notify("profile-updated", updated);
    return updated;
  }

  // --- Target Career ---
  getTargetCareerId() {
    const val = localStorage.getItem(this.STORAGE_KEYS.TARGET_CAREER) || localStorage.getItem("careerly_target_career_id");
    if (!val) return DEFAULT_STATE.targetCareerId;
    const found = CAREER_DATABASE.find(c => c.id === val || c.title.toLowerCase() === val.toLowerCase());
    return found ? found.id : DEFAULT_STATE.targetCareerId;
  }

  getTargetCareer() {
    const val = localStorage.getItem(this.STORAGE_KEYS.TARGET_CAREER) || localStorage.getItem("careerly_target_career_id");
    if (!val) return CAREER_DATABASE[0];
    const found = CAREER_DATABASE.find(c => c.id === val || c.title.toLowerCase() === val.toLowerCase());
    return found || CAREER_DATABASE[0];
  }

  setTargetCareer(careerId) {
    const found = CAREER_DATABASE.find(c => c.id === careerId || c.title.toLowerCase() === (careerId || "").toLowerCase());
    const validId = found ? found.id : CAREER_DATABASE[0].id;
    const validTitle = found ? found.title : CAREER_DATABASE[0].title;
    localStorage.setItem(this.STORAGE_KEYS.TARGET_CAREER, validId);
    localStorage.setItem("careerly_target_career_id", validId);
    localStorage.setItem("careerly_target_career_title", validTitle);
    this.notify("target-career-changed", { careerId: validId });
    try {
      window.dispatchEvent(new CustomEvent("careerly_target_role_updated", { detail: { title: validTitle, id: validId } }));
    } catch (e) {}
    return validId;
  }

  getCareerById(id) {
    return CAREER_DATABASE.find(c => c.id === id) || null;
  }

  getAllCareers() {
    return CAREER_DATABASE;
  }

  // --- Assessment & Recommendation Logic ---
  getAssessmentAnswers() {
    const data = localStorage.getItem(this.STORAGE_KEYS.ASSESSMENT_ANSWERS);
    return data ? JSON.parse(data) : {};
  }

  getAssessmentResults() {
    const data = localStorage.getItem(this.STORAGE_KEYS.ASSESSMENT_RESULTS);
    return data ? JSON.parse(data) : null;
  }

  /**
   * Transparent, deterministic rule-based career match algorithm
   * Evaluates question responses against role competency matrices
   */
  calculateAssessmentRecommendations(answers) {
    // Scoring accumulator for every career
    const scores = {};
    const explanations = {};
    CAREER_DATABASE.forEach(career => {
      scores[career.id] = 0;
      explanations[career.id] = [];
    });

    // Compute scores based on question option tags
    Object.keys(answers).forEach(questionId => {
      const selectedOptionId = answers[questionId];
      const question = ASSESSMENT_QUESTIONS.find(q => q.id === questionId);
      if (!question) return;

      const option = question.options.find(o => o.id === selectedOptionId);
      if (!option || !option.tags) return;

      Object.entries(option.tags).forEach(([careerId, weight]) => {
        if (scores[careerId] !== undefined) {
          scores[careerId] += weight;
          if (weight >= 20) {
            explanations[careerId].push(option.text);
          }
        }
      });
    });

    // Find maximum theoretical points to calculate clean percentage
    const rankedCareers = CAREER_DATABASE.map(career => {
      const rawScore = scores[career.id] || 0;
      // Normalize to 55 - 98% range for realistic match feeling
      const maxPossible = 160;
      let matchPercentage = Math.round((rawScore / maxPossible) * 100);
      if (matchPercentage > 98) matchPercentage = 98;
      if (matchPercentage < 42) matchPercentage = 42;

      // Build coherent explanation
      let reason = `Strong alignment with your interest in ${career.category.toLowerCase()}.`;
      if (explanations[career.id].length > 0) {
        reason = `Matches your preference for: "${explanations[career.id][0]}".`;
      }

      return {
        careerId: career.id,
        careerTitle: career.title,
        careerCategory: career.category,
        salaryRange: career.salaryRange,
        matchPercentage,
        rawScore,
        reason,
        career
      };
    });

    // Sort descending by match percentage
    rankedCareers.sort((a, b) => b.matchPercentage - a.matchPercentage);

    const topRecommendation = rankedCareers[0];
    const secondaryRecommendations = rankedCareers.slice(1, 4);

    const result = {
      timestamp: new Date().toISOString(),
      topRecommendation,
      secondaryRecommendations,
      allRanked: rankedCareers,
      totalQuestionsAnswered: Object.keys(answers).length
    };

    // Save to storage
    localStorage.setItem(this.STORAGE_KEYS.ASSESSMENT_ANSWERS, JSON.stringify(answers));
    localStorage.setItem(this.STORAGE_KEYS.ASSESSMENT_RESULTS, JSON.stringify(result));

    // Automatically set top recommendation as target if not already explicitly set
    if (!localStorage.getItem(this.STORAGE_KEYS.TARGET_CAREER)) {
      this.setTargetCareer(topRecommendation.careerId);
    }

    this.notify("assessment-completed", result);
    return result;
  }

  // --- Skill Gap Analysis ---
  getSkillGapData(careerId) {
    const id = careerId || this.getTargetCareerId();
    const data = localStorage.getItem(this.STORAGE_KEYS.SKILL_GAP);
    const parsed = data ? JSON.parse(data) : {};
    return parsed[id] || {};
  }

  saveSkillLevel(careerId, skillId, levelPercentage) {
    const data = localStorage.getItem(this.STORAGE_KEYS.SKILL_GAP);
    const parsed = data ? JSON.parse(data) : {};
    if (!parsed[careerId]) parsed[careerId] = {};
    parsed[careerId][skillId] = levelPercentage;
    localStorage.setItem(this.STORAGE_KEYS.SKILL_GAP, JSON.stringify(parsed));
    this.notify("skill-gap-updated", { careerId, skillId, levelPercentage });
  }

  calculateSkillGapMetrics(careerId) {
    const career = this.getCareerById(careerId) || this.getTargetCareer();
    const userLevels = this.getSkillGapData(career.id);

    let totalRequired = 0;
    let totalAchieved = 0;
    let masteredCount = 0;
    let inProgressCount = 0;
    let criticalGaps = [];

    career.skills.forEach(skill => {
      const benchmark = skill.benchmark || 80;
      const userLevel = userLevels[skill.id] !== undefined ? userLevels[skill.id] : 0;

      totalRequired += benchmark;
      totalAchieved += userLevel;

      if (userLevel >= benchmark) {
        masteredCount++;
      } else if (userLevel > 0) {
        inProgressCount++;
        criticalGaps.push({ skill, gap: benchmark - userLevel });
      } else {
        criticalGaps.push({ skill, gap: benchmark });
      }
    });

    // Sort gaps highest first
    criticalGaps.sort((a, b) => b.gap - a.gap);

    const overallPercentage = totalRequired > 0 ? Math.min(100, Math.round((totalAchieved / totalRequired) * 100)) : 0;

    return {
      careerId: career.id,
      overallPercentage,
      totalSkills: career.skills.length,
      masteredCount,
      inProgressCount,
      gapCount: career.skills.length - masteredCount,
      criticalGaps: criticalGaps.slice(0, 3)
    };
  }

  // --- Roadmap Tracking ---
  getRoadmapProgress(careerId) {
    const id = careerId || this.getTargetCareerId();
    const data = localStorage.getItem(this.STORAGE_KEYS.ROADMAP);
    const parsed = data ? JSON.parse(data) : {};
    return parsed[id] || [];
  }

  toggleRoadmapMilestone(careerId, milestoneId) {
    const id = careerId || this.getTargetCareerId();
    const data = localStorage.getItem(this.STORAGE_KEYS.ROADMAP);
    const parsed = data ? JSON.parse(data) : {};
    let milestones = parsed[id] || [];

    if (milestones.includes(milestoneId)) {
      milestones = milestones.filter(m => m !== milestoneId);
    } else {
      milestones.push(milestoneId);
    }

    parsed[id] = milestones;
    localStorage.setItem(this.STORAGE_KEYS.ROADMAP, JSON.stringify(parsed));
    this.notify("roadmap-progress-updated", { careerId: id, milestones });
    return milestones;
  }

  calculateRoadmapMetrics(careerId) {
    const career = this.getCareerById(careerId) || this.getTargetCareer();
    const completed = this.getRoadmapProgress(career.id);

    let totalMilestones = 0;
    career.roadmapPhases.forEach(phase => {
      totalMilestones += (phase.topics ? phase.topics.length : 0);
      totalMilestones += (phase.tasks ? phase.tasks.length : 0);
      totalMilestones += 1; // Project counts as milestone
    });

    const completedCount = completed.length;
    const percentage = totalMilestones > 0 ? Math.min(100, Math.round((completedCount / totalMilestones) * 100)) : 0;

    return {
      completedCount,
      totalMilestones,
      percentage
    };
  }

  // --- Resume Improvement Checklist ---
  getResumeChecklist() {
    const data = localStorage.getItem(this.STORAGE_KEYS.RESUME_CHECKLIST);
    return data ? JSON.parse(data) : {};
  }

  toggleResumeItem(itemId) {
    const checklist = this.getResumeChecklist();
    checklist[itemId] = !checklist[itemId];
    localStorage.setItem(this.STORAGE_KEYS.RESUME_CHECKLIST, JSON.stringify(checklist));
    this.notify("resume-checklist-updated", checklist);
    return checklist[itemId];
  }

  calculateResumeScore() {
    const checked = this.getResumeChecklist();
    let totalPossibleWeight = 0;
    let earnedWeight = 0;
    let missingCritical = [];

    RESUME_CRITERIA.forEach(cat => {
      cat.items.forEach(item => {
        totalPossibleWeight += item.weight;
        if (checked[item.id]) {
          earnedWeight += item.weight;
        } else {
          missingCritical.push(item);
        }
      });
    });

    const score = totalPossibleWeight > 0 ? Math.min(100, Math.round((earnedWeight / totalPossibleWeight) * 100)) : 0;

    let grade = "Needs Immediate Attention";
    let gradeColor = "var(--danger)";
    if (score >= 90) {
      grade = "Interview Ready & ATS Optimized";
      gradeColor = "var(--success)";
    } else if (score >= 75) {
      grade = "Competitive & Strong";
      gradeColor = "var(--primary)";
    } else if (score >= 50) {
      grade = "Good Foundation / Developing";
      gradeColor = "var(--warning)";
    }

    return {
      score,
      grade,
      gradeColor,
      totalItems: totalPossibleWeight,
      checkedCount: Object.values(checked).filter(Boolean).length,
      missingCount: missingCritical.length,
      topSuggestions: missingCritical.sort((a, b) => b.weight - a.weight).slice(0, 4)
    };
  }

  getResumeDraft() {
    const data = localStorage.getItem(this.STORAGE_KEYS.RESUME_DRAFT);
    return data ? JSON.parse(data) : { ...DEFAULT_STATE.resumeDraft };
  }

  saveResumeDraft(draft) {
    localStorage.setItem(this.STORAGE_KEYS.RESUME_DRAFT, JSON.stringify(draft));
    this.notify("resume-draft-saved", draft);
  }

  // --- Study Activity Log ---
  getStudyActivity() {
    const data = localStorage.getItem(this.STORAGE_KEYS.STUDY_ACTIVITY);
    return data ? JSON.parse(data) : DEFAULT_STATE.studyActivity;
  }

  logStudyHours(hours) {
    const activities = this.getStudyActivity();
    const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
    const match = activities.find(a => a.day === today);
    if (match) {
      match.hours += Number(hours);
    } else {
      activities.push({ day: today, hours: Number(hours), date: new Date().toISOString().split('T')[0] });
      if (activities.length > 7) activities.shift();
    }
    localStorage.setItem(this.STORAGE_KEYS.STUDY_ACTIVITY, JSON.stringify(activities));
    this.notify("activity-logged", activities);
    return activities;
  }

  // --- Global Readiness Index Algorithm ---
  calculateOverallReadiness() {
    const assessmentResults = this.getAssessmentResults();
    const targetCareer = this.getTargetCareer();
    const skillMetrics = this.calculateSkillGapMetrics(targetCareer.id);
    const roadmapMetrics = this.calculateRoadmapMetrics(targetCareer.id);
    const resumeMetrics = this.calculateResumeScore();

    // 4 Core Weighted Components:
    // Assessment: 15% (full 15% if completed, else 0%)
    const assessmentScore = assessmentResults ? 100 : 0;
    // Skill Gap: 35% (based on average competency achieved)
    const skillScore = skillMetrics.overallPercentage;
    // Roadmap Milestones: 30% (percentage of roadmap completed)
    const roadmapScore = roadmapMetrics.percentage;
    // Resume Health Score: 20%
    const resumeScore = resumeMetrics.score;

    const overallScore = Math.round(
      (assessmentScore * 0.15) +
      (skillScore * 0.35) +
      (roadmapScore * 0.30) +
      (resumeScore * 0.20)
    );

    let readinessStatus = "Getting Started";
    if (overallScore >= 85) readinessStatus = "Job Ready & Market Competitive";
    else if (overallScore >= 65) readinessStatus = "Advanced Progress";
    else if (overallScore >= 40) readinessStatus = "Steady Growth";

    // Dynamic Next Best Actions Recommendation Engine
    const nextActions = [];

    if (!assessmentResults) {
      nextActions.push({
        title: "Complete Career Assessment",
        description: "Answer the 8-question evaluation to calculate your personalized career match percentage.",
        link: "assessment.html",
        badge: "Highest Priority",
        icon: "sparkles"
      });
    }

    if (skillMetrics.overallPercentage < 40) {
      nextActions.push({
        title: "Perform Skill Gap Analysis",
        description: `Rate your current proficiency in ${targetCareer.title} core skills to identify high-yield gaps.`,
        link: "skill-gap.html",
        badge: "Critical Step",
        icon: "target"
      });
    }

    if (roadmapMetrics.percentage < 25) {
      nextActions.push({
        title: "Tackle Roadmap Phase 1 Tasks",
        description: "Check off your first foundational milestone in your customized learning curriculum.",
        link: "roadmap.html",
        badge: "High Yield",
        icon: "map"
      });
    }

    if (resumeMetrics.score < 70) {
      nextActions.push({
        title: "Optimize Resume ATS Checklist",
        description: "Add quantifiable impact metrics and clean formatting to pass recruiter scanning systems.",
        link: "resume.html",
        badge: "Quick Win",
        icon: "fileText"
      });
    }

    // Fallback action if user is far along
    if (nextActions.length < 3) {
      nextActions.push({
        title: "Build Capstone Portfolio Project",
        description: "Deploy an authenticated production application with live demo and GitHub documentation.",
        link: "roadmap.html",
        badge: "Portfolio Boost",
        icon: "rocket"
      });
    }

    return {
      overallScore,
      readinessStatus,
      components: {
        assessment: { score: assessmentScore, weight: 15, completed: !!assessmentResults },
        skillGap: { score: skillScore, weight: 35, metrics: skillMetrics },
        roadmap: { score: roadmapScore, weight: 30, metrics: roadmapMetrics },
        resume: { score: resumeScore, weight: 20, metrics: resumeMetrics }
      },
      nextActions: nextActions.slice(0, 3)
    };
  }

  // --- Demo Data Generator (For Testing & Evaluator Walkthrough) ---
  loadDemoData() {
    const targetId = "full-stack-developer";
    this.setTargetCareer(targetId);

    // 1. Assessment answers
    const answers = {
      q1: "q1_a",
      q2: "q2_a",
      q3: "q3_a",
      q4: "q4_b",
      q5: "q5_a",
      q6: "q6_a",
      q7: "q7_a",
      q8: "q8_a"
    };
    this.calculateAssessmentRecommendations(answers);

    // 2. Skill Gap levels
    const career = this.getCareerById(targetId);
    const skillData = {};
    career.skills.forEach((skill, idx) => {
      // Set realistic varied levels (some mastered, some intermediate, some beginner)
      const levels = [100, 75, 75, 50, 75, 100, 50, 25];
      skillData[skill.id] = levels[idx % levels.length];
    });
    const parsedGap = {};
    parsedGap[targetId] = skillData;
    localStorage.setItem(this.STORAGE_KEYS.SKILL_GAP, JSON.stringify(parsedGap));

    // 3. Roadmap Milestones
    const completedMilestones = [
      "topic-1-1", "topic-1-2", "topic-1-3", "task-1-1",
      "topic-2-1", "topic-2-2", "task-2-1"
    ];
    const parsedRoadmap = {};
    parsedRoadmap[targetId] = completedMilestones;
    localStorage.setItem(this.STORAGE_KEYS.ROADMAP, JSON.stringify(parsedRoadmap));

    // 4. Resume Checklist
    const checkedResume = {};
    RESUME_CRITERIA.forEach((cat, cIdx) => {
      cat.items.forEach((item, iIdx) => {
        if ((cIdx + iIdx) % 3 !== 0) {
          checkedResume[item.id] = true;
        }
      });
    });
    localStorage.setItem(this.STORAGE_KEYS.RESUME_CHECKLIST, JSON.stringify(checkedResume));

    this.notify("demo-data-loaded", {});
    return true;
  }

  // --- Reset All Data ---
  resetAllData() {
    Object.values(this.STORAGE_KEYS).forEach(key => {
      if (key !== this.STORAGE_KEYS.THEME) {
        localStorage.removeItem(key);
      }
    });
    this.init();
    this.notify("data-reset", {});
    return true;
  }

  // --- Export & Import JSON Backup ---
  exportBackupJSON() {
    const backup = {};
    Object.entries(this.STORAGE_KEYS).forEach(([name, key]) => {
      const val = localStorage.getItem(key);
      if (val) {
        try {
          backup[key] = JSON.parse(val);
        } catch (e) {
          backup[key] = val;
        }
      }
    });
    return JSON.stringify(backup, null, 2);
  }

  importBackupJSON(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      Object.entries(data).forEach(([key, val]) => {
        if (typeof val === "object") {
          localStorage.setItem(key, JSON.stringify(val));
        } else {
          localStorage.setItem(key, String(val));
        }
      });
      this.init();
      this.notify("data-imported", {});
      return true;
    } catch (e) {
      console.error("Failed to import Careerly backup:", e);
      return false;
    }
  }

  // --- Event Dispatcher ---
  notify(eventName, detail) {
    const event = new CustomEvent(`careerly:${eventName}`, { detail });
    window.dispatchEvent(event);
  }
}

// Global Single Instance
window.CareerlyStorage = new CareerlyStorageEngine();
window.CAREER_DATABASE = CAREER_DATABASE;
window.ASSESSMENT_QUESTIONS = ASSESSMENT_QUESTIONS;
window.RESUME_CRITERIA = RESUME_CRITERIA;
