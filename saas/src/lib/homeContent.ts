export function getHomeContent(isArabic: boolean) {
  return {
    hero: {
      badge: isArabic
        ? "نظام إدارة مكتب محاماة"
        : "Law Firm Management Platform",
      title: isArabic
        ? "حل متكامل لإدارة القضايا، العقود، والمهام في مكتب واحد."
        : "Complete solution for managing cases, contracts, and tasks in one office.",
      description: isArabic
        ? "منصة لإدارة أعمال مكاتب المحاماة وإدارات الشؤون القانونية على غرار حلول Lexzur Practice و Contra. قم بتجميع القضايا، العملاء، العقود، المستندات، والمهام في مساحة عمل واحدة مع سير عمل آلي ولوحات معلومات غنية بالبيانات"
        : "Platform for managing law firm operations and legal departments, similar to Lexzur Practice and Contra solutions. Centralize cases, clients, contracts, documents, and tasks in one workspace with automated workflows and data-rich dashboards.",
      ctaPrimary: isArabic ? "فتح لوحة القضايا المباشرة" : "Open Live Dashboard",
      ctaSecondary: isArabic ? "حجز جلسة تعريفية" : "Book a Demo",
      note: isArabic
        ? "تجربة أولية بدون بطاقة ائتمان · الواجهة مبنية بـ Next.js و Tailwind CSS"
        : "Free trial · No credit card required · Built with Next.js & Tailwind CSS",
    },
    trusted: {
      title: isArabic
        ? "موثوق به من قبل فرق قانونية في قطاعات متعددة"
        : "Trusted by legal teams across multiple sectors",
      items: isArabic
        ? [
            "مكاتب محاماة إقليمية",
            "إدارات الشؤون القانونية",
            "شركات الاتصالات",
            "البنوك والخدمات المالية",
            "الجهات الحكومية",
            "شركات أخرى خدمية",
          ]
        : [
            "Regional Law Firms",
            "Legal Departments",
            "Telecommunications",
            "Banking & Finance",
            "Government Entities",
            "Other Service Companies",
          ],
    },
    solutions: {
      badge: isArabic
        ? "مصمم لفرق الشؤون القانونية ومكاتب المحاماة"
        : "Designed for legal teams and law firms",
      title: isArabic
        ? "من إدارات الشؤون القانونية الداخلية إلى مكاتب المحاماة المتخصصة."
        : "From in-house legal departments to specialized law firms.",
      description: isArabic
        ? "استخدم منصة واحدة لإدارة القضايا، العقود، المستندات، الطلبات الداخلية، والمهام اليومية – مع إمكانية تهيئة سير العمل حسب نوع العميل أو القطاع، كما هو موضح في حلول Lexzur لقطاعات الاتصالات وغيرها."
        : "Use a single platform to manage cases, contracts, documents, internal requests, and daily tasks—with the ability to configure workflows by client type or sector, as shown in Lexzur solutions for telecommunications and other sectors.",
      button: isArabic ? "استكشف لوحات المعلومات" : "Explore Dashboards",
      cards: isArabic
        ? [
            {
              title: "إدارة الشؤون القانونية ومكاتب المحاماة",
              subtitle: "إدارة العملاء، القضايا، العقود، والأتعاب من مكان واحد.",
              description:
                "توحيد استقبال الطلبات، توزيع العمل بين الفريق، متابعة الجلسات، وإصدار فواتير الأتعاب مع لوحات معلومات للإدارة العليا والشركاء.",
            },
            {
              title: "العقود والالتزامات التجارية",
              subtitle: "إدارة دورة حياة العقود وتقليل المخاطر.",
              description:
                "أتمتة قوالب العقود، الموافقات، وتجديد العقود مع تتبع المهل النهائية والتنبيهات التلقائية كما في حلول Contra.",
            },
            {
              title: "إدارات أخرى داخل المؤسسة",
              subtitle: "الموارد البشرية، التحصيل، المشتريات، والمبيعات.",
              description:
                "إنشاء مساحات عمل مخصصة لكل إدارة مع ربط جميع المستندات والقضايا بالنظام القانوني الرئيسي، بما يشبه تقسيم الحلول حسب القطاع على موقع Lexzur.",
            },
          ]
        : [
            {
              title: "Legal Departments & Law Firms",
              subtitle: "Manage clients, cases, contracts, and fees from one place.",
              description:
                "Centralize intake, distribute work among the team, track hearings, and issue fee invoices with dashboards for senior management and partners.",
            },
            {
              title: "Contracts & Commercial Obligations",
              subtitle: "Manage contract lifecycle and reduce risks.",
              description:
                "Automate contract templates, approvals, and renewals with deadline tracking and automatic alerts, similar to Contra solutions.",
            },
            {
              title: "Other Internal Departments",
              subtitle: "Human Resources, Collections, Procurement, and Sales.",
              description:
                "Create customized workspaces for each department while linking all documents and cases to the main legal system, similar to Lexzur's sector-based solution division.",
            },
          ],
    },
    features: {
      items: isArabic
        ? [
            {
              badge: "دورة حياة العقود بالذكاء الاصطناعي والأتمتة",
              title: "إنشاء ومراجعة والموافقة على العقود مع ضوابط.",
              description:
                "استخدم الذكاء الاصطناعي لصياغة ومقارنة وتحليل البنود، وإبراز المخاطر، ودفع المستندات المعتمدة إلى نظام إدارة المستندات أو CRM بنقرة واحدة.",
            },
            {
              badge: "إدارة القضايا والممارسات",
              title: "القضايا، المهام، الوقت، والفوترة في مساحة عمل واحدة.",
              description:
                "تتبع القضايا من الاستقبال إلى الإغلاق، مع سير عمل للمهام، الموافقات، SLAs، والفوترة—معروضة من خلال لوحات معلومات مباشرة.",
            },
            {
              badge: "مساعد ذكي في كل سير عمل",
              title: "اسأل، حلل، وقرر بشكل أسرع.",
              description:
                "لخص القضايا، اشرح مخاطر العقود، أنشئ أدلة العمل، واستخرج مؤشرات الأداء الرئيسية مباشرة من بيانات مساحة العمل الخاصة بك.",
            },
          ]
        : [
            {
              badge: "AI Contract Lifecycle & Automation",
              title: "Generate, review, and approve contracts with guardrails.",
              description:
                "Use AI to draft, compare, and analyze clauses, highlight risk, and push approved documents to your DMS or CRM with one click.",
            },
            {
              badge: "Matter & Practice Management",
              title: "Cases, tasks, time, and billing in one workspace.",
              description:
                "Track matters from intake to closure, with workflows for tasks, approvals, SLAs, and billing—surfaced through live dashboards.",
            },
            {
              badge: "AI Assistant in Every Workflow",
              title: "Ask, analyze, and decide faster.",
              description:
                "Summarize matters, explain contract risk, generate playbooks, and surface KPIs directly from your workspace data.",
            },
          ],
    },
    integrations: {
      badge: isArabic ? "التكاملات والتحليلات" : "Integrations & Analytics",
      title: isArabic
        ? "اربط أدواتك. حول البيانات إلى قرارات."
        : "Connect your tools. Turn data into decisions.",
      description: isArabic
        ? "قم بتوصيل مساحة العمل هذه بمزود الهوية، تخزين المستندات، CRM، وأنظمة الفوترة. ثم أنشئ لوحات معلومات على نمط BI على بيانات نظيفة ومنظمة."
        : "Plug this workspace into your identity provider, document storage, CRM, and billing systems. Then build BI-style dashboards on top of clean, structured data.",
      items: isArabic
        ? [
            {
              title: "تسجيل الدخول الموحد",
              description:
                "أساس جاهز لـ SSO باستخدام أنماط Next.js الحديثة.",
            },
            {
              title: "خطوط البيانات",
              description:
                "شكل واجهات برمجة التطبيقات لتدفق القضايا والعقود إلى بحيرة البيانات الخاصة بك.",
            },
            {
              title: "لوحات معلومات BI",
              description:
                "اتصل بـ Power BI أو Tableau أو مخططات React مخصصة.",
            },
          ]
        : [
            {
              title: "Single sign-on",
              description:
                "SSO-ready foundation using modern Next.js patterns.",
            },
            {
              title: "Data pipelines",
              description:
                "Shape APIs to stream matters and contracts into your lake.",
            },
            {
              title: "BI dashboards",
              description:
                "Connect to Power BI, Tableau, or custom React charts.",
            },
          ],
      enterprise: {
        badge: isArabic ? "جاهز للمؤسسات" : "Enterprise-ready",
        title: isArabic
          ? "مبني على أسس ويب حديثة وآمنة."
          : "Built on secure, modern web foundations.",
        description: isArabic
          ? "Next.js app router و API routes والتخطيطات الدقيقة تجعل من السهل تنفيذ التحكم في الوصول والتدقيق والنشر متعدد المناطق."
          : "Next.js app router, API routes, and granular layouts make it easy to implement access control, auditing, and multi-region deployments.",
      },
      global: {
        badge: isArabic ? "جاهز عالميًا" : "Global-ready",
        title: isArabic
          ? "دعم متعدد اللغات والعملات والمناطق الزمنية."
          : "Multi-language, currency, and timezone support.",
        description: isArabic
          ? "وسّع هذا البداية لدعم العربية والإنجليزية والمزيد، مع الحفاظ على قاعدة كود واحدة، مثل النشرات العالمية لـ Lexzur."
          : "Extend this starter to support Arabic, English, and more, mirroring global deployments like Lexzur while keeping a single codebase.",
      },
    },
  };
}





