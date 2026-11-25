import { CareerDefinition } from "@/types";

export const CAREER_DATABASE: CareerDefinition[] = [
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
      { id: "html_css_modern", name: "HTML5 / Modern CSS / Responsive Layouts", benchmark: 90, category: "Frontend" },
      { id: "javascript_ts", name: "JavaScript (ES6+) & TypeScript", benchmark: 95, category: "Frontend" },
      { id: "frontend_framework", name: "Component Architecture (React / Next.js)", benchmark: 90, category: "Frontend" },
      { id: "nodejs_backend", name: "Node.js / Express Server APIs", benchmark: 85, category: "Backend" },
      { id: "databases_sql", name: "Databases (PostgreSQL, SQL & NoSQL)", benchmark: 80, category: "Backend" },
      { id: "git_collaboration", name: "Git Version Control & PR Workflows", benchmark: 90, category: "DevOps" },
      { id: "api_design", name: "RESTful API Architecture & JWT Auth", benchmark: 85, category: "Backend" },
      { id: "docker_cloud", name: "Docker Containers & Cloud Deployment", benchmark: 75, category: "DevOps" }
    ],
    roadmapPhases: [
      {
        id: "phase-1",
        title: "Phase 1: Foundations & Web Core",
        timeline: "Weeks 1 - 4 • 10-12 hrs/wk",
        description: "Master modern semantic HTML5, CSS responsive layouts, modern JavaScript (ES6+), and Git version control.",
        topics: [
          { id: "topic-1-1", title: "Semantic HTML5, Accessibility (a11y), and SEO Best Practices", resourceUrl: "https://developer.mozilla.org/en-US/docs/Learn/HTML" },
          { id: "topic-1-2", title: "CSS3 Flexbox, CSS Grid, and Modern Responsive Design", resourceUrl: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/" },
          { id: "topic-1-3", title: "Core JavaScript: Async/Await, Closures, DOM Manipulation, and Fetch API", resourceUrl: "https://javascript.info/" },
          { id: "topic-1-4", title: "Git Fundamentals: Commits, Branching, Pull Requests & GitHub Workflows", resourceUrl: "https://git-scm.com/book/en/v2" }
        ],
        tasks: [
          { id: "task-1-1", title: "Build an accessible, mobile-responsive interactive landing page" },
          { id: "task-1-2", title: "Create a DOM-based interactive expense tracker with persistence" }
        ],
        project: "Responsive Multi-Page Web Application with GitHub Actions deployment"
      },
      {
        id: "phase-2",
        title: "Phase 2: Frontend Engineering & TypeScript",
        timeline: "Weeks 5 - 8 • 12-14 hrs/wk",
        description: "Level up with strongly-typed JavaScript, component lifecycle, reusable UI design systems, and client-side state.",
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
          { id: "topic-3-4", title: "API Security: Rate Limiting, CORS, Input Validation, and Sanitization", resourceUrl: "https://cheatsheetseries.owasp.org/" }
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
    overview: "Cybersecurity Analysts protect networks and applications from vulnerabilities, monitor SIEM systems, and conduct incident response.",
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
      }
    ]
  }
];

export function getCareerById(id: string): CareerDefinition | undefined {
  return CAREER_DATABASE.find(c => c.id === id);
}

/**
 * Resolves a career definition from either an exact ID, exact title,
 * or common role aliases/partial names (e.g., "Data Analyst" -> "Data Scientist & Analytics Lead").
 */
export function findCareerDefinition(careerTitleOrId?: string | null): CareerDefinition | undefined {
  if (!careerTitleOrId) return undefined;
  const normalized = careerTitleOrId.trim().toLowerCase();
  if (!normalized) return undefined;

  // 1. Exact ID or Title match
  const exact = CAREER_DATABASE.find(
    (c) => c.id.toLowerCase() === normalized || c.title.toLowerCase() === normalized
  );
  if (exact) return exact;

  // 2. Common aliases / partial substring match
  if (normalized.includes("data analyst") || normalized.includes("data scien") || normalized.includes("analytics")) {
    return CAREER_DATABASE.find((c) => c.id === "data-scientist");
  }
  if (normalized.includes("machine learning") || normalized.includes("ai ") || normalized === "ai") {
    return CAREER_DATABASE.find((c) => c.id === "ai-ml-engineer");
  }
  if (normalized.includes("full stack") || normalized.includes("full-stack") || normalized.includes("web developer")) {
    return CAREER_DATABASE.find((c) => c.id === "full-stack-developer");
  }
  if (normalized.includes("ui/ux") || normalized.includes("designer")) {
    return CAREER_DATABASE.find((c) => c.id === "ui-ux-designer");
  }
  if (normalized.includes("devops") || normalized.includes("cloud")) {
    return CAREER_DATABASE.find((c) => c.id === "cloud-devops-engineer");
  }
  if (normalized.includes("cyber") || normalized.includes("security")) {
    return CAREER_DATABASE.find((c) => c.id === "cybersecurity-analyst");
  }
  if (normalized.includes("product manager") || normalized.includes("product")) {
    return CAREER_DATABASE.find((c) => c.id === "product-manager");
  }

  return CAREER_DATABASE.find(
    (c) => c.title.toLowerCase().includes(normalized) || normalized.includes(c.title.toLowerCase())
  );
}
