/**
 * data/projects.js
 * ─────────────────────────────────────────────────────────
 * Purpose : Single source of truth for all project data.
 *           Updating a project means editing one object
 *           here — the DOM is rebuilt automatically.
 *
 * Author  : Lungani Zungu
 * ─────────────────────────────────────────────────────────
 */

/**
 * @typedef {Object} Project
 * @property {string}   id          - Unique kebab-case identifier
 * @property {string}   icon        - Emoji icon (displayed in banner)
 * @property {string}   visualClass - CSS class for banner colour theme
 * @property {number[]} bars        - Bar chart heights as percentages (8 values)
 * @property {string}   title       - Project display name
 * @property {string}   status      - 'live' | 'in-development'
 * @property {string}   problem     - One-paragraph problem statement
 * @property {string}   solution    - One-paragraph solution description
 * @property {string}   result      - Quantified impact metric
 * @property {string}   resultExtra - Supporting detail after the bullet
 * @property {string[]} tech        - Ordered list of technologies used
 * @property {Object[]} links       - Array of { label, href, icon } objects
 */

/** @type {Project[]} */
export const PROJECTS = [
  {
    id: 'workforce-management',
    icon: '👥',
    visualClass: 'pv-workforce',
    bars: [40, 70, 55, 90, 65, 80, 50, 75],
    title: 'Workforce Management Platform',
    status: 'live',
    problem:
      'Team leaders spent hours manually planning worker rotations on paper, with no system to track skill levels, training expiry, or ergonomic exposure limits. Mismatches caused compliance risks and production delays.',
    solution:
      '7-module system: rotation planning, attendance with automated escalation alerts, skills matrix with decay logic, training management & automated shift reports. Used daily by hundreds of plant-floor workers.',
    result: '⚡ 75% reduction in rotation planning time',
    resultExtra: '· 95%+ user adoption rate',
    tech: ['React', 'Node.js 20', 'AWS Lambda', 'DynamoDB', 'Cognito', 'EventBridge', 'S3 + CloudFront'],
    links: [
      { label: '🔒 Internal System', href: null },
      { label: '📄 Read Case Study →', href: 'case-studies.html' },
    ],
  },
  {
    id: 'job-card-system',
    icon: '🔧',
    visualClass: 'pv-jobcard',
    bars: [60, 45, 80, 35, 90, 55, 70, 40],
    title: 'Workshop Job Card System',
    status: 'live',
    problem:
      'Workshop technicians tracked all maintenance jobs on paper job cards — prone to loss, illegibility, and zero real-time visibility for supervisors.',
    solution:
      'End-to-end digital job card system: technicians create, track, and close jobs digitally with file uploads and automated alerts. Built with AWS SAM and a relational PostgreSQL database.',
    result: '⚡ Zero paper job cards',
    resultExtra: '· Full audit trail on every job',
    tech: ['Node.js 20', 'AWS Lambda', 'PostgreSQL (RDS)', 'API Gateway', 'S3', 'SNS', 'AWS SAM'],
    links: [
      { label: '🔒 Internal System', href: null },
    ],
  },
  {
    id: 'rework-tracking',
    icon: '📈',
    visualClass: 'pv-rework',
    bars: [90, 60, 75, 50, 85, 40, 65, 55],
    title: 'Rework Tracking System',
    status: 'live',
    problem:
      'When vehicles entered rework bays, technicians manually looked up defects by VIN, filtered by work area, and logged time by hand — a slow, error-prone process with no quality feedback loop.',
    solution:
      'Integrated geofencing with the quality defect management system to automatically detect vehicles entering rework bays, pull defects by VIN, filter by work area, and log session durations.',
    result: '⚡ 20% reduction in rework rate',
    resultExtra: '· Zero manual lookups',
    tech: ['React', 'Geofencing API', 'AWS Lambda', 'DynamoDB'],
    links: [
      { label: '🔒 Internal System', href: null },
      { label: '📄 Read Case Study →', href: 'case-studies.html' },
    ],
  },
  {
    id: 'headcount-dashboard',
    icon: '📊',
    visualClass: 'pv-headcount',
    bars: [50, 80, 65, 95, 45, 70, 55, 85],
    title: 'Headcount Management Dashboard',
    status: 'live',
    problem:
      'Monthly headcount reporting for Resource & Technology Steering relied on manual Excel files emailed between stakeholders — delays, version conflicts, and no single source of truth.',
    solution:
      'Cloud-based headcount pipeline with automated monthly upload, processing, and a serverless HTTP API backend delivering data to a CloudFront-hosted dashboard secured by Cognito.',
    result: '⚡ Manual Excel reporting eliminated',
    resultExtra: '· Real-time leadership visibility',
    tech: ['Node.js', 'AWS Lambda', 'API Gateway', 'S3 + CloudFront', 'Cognito'],
    links: [
      { label: '🔒 Internal System', href: null },
    ],
  },
  {
    id: 'takt-monitoring',
    icon: '⏱',
    visualClass: 'pv-takt',
    bars: [70, 90, 55, 40, 85, 60, 75, 50],
    title: 'Production Takt Monitoring Dashboard',
    status: 'live',
    problem:
      'Line managers had no real-time visibility into takt stability. Production rhythm deviations were only discovered at shift-end debriefs — too late to intervene.',
    solution:
      'Real-time dashboard that flags takt instability instantly, giving line managers live visibility into production rhythm adherence with configurable threshold alerts.',
    result: '⚡ Live production monitoring',
    resultExtra: '· Instant deviation alerts',
    tech: ['React', 'S3 + CloudFront', 'AWS Amplify'],
    links: [
      { label: '🔒 Internal System', href: null },
    ],
  },
  {
    id: 'attendance-tracker',
    icon: '✅',
    visualClass: 'pv-attendance',
    bars: [45, 75, 60, 90, 35, 80, 55, 70],
    title: 'Attendance Tracker',
    status: 'live',
    problem:
      'Shop-floor attendance tools were either too heavy to load on limited-connectivity devices or required installation. Workers needed a lightweight, zero-friction option on any browser.',
    solution:
      'Lightweight browser-based check-in/check-out tool with Excel export via SheetJS. Zero framework dependencies — intentionally lean for fast load on any device with any connectivity.',
    result: '⚡ Zero-install, runs on any device',
    resultExtra: '· Instant Excel export',
    tech: ['HTML5', 'CSS3', 'Vanilla JavaScript', 'SheetJS', 'S3 + CloudFront'],
    links: [
      { label: '🔒 Internal System', href: null },
    ],
  },
  {
    id: 'ml-rotation-engine',
    icon: '🧠',
    visualClass: 'pv-ml',
    bars: [55, 85, 40, 70, 95, 50, 65, 80],
    title: 'ML Rotation Suggestion Engine',
    status: 'in-development',
    problem:
      'The workforce platform could plan rotations, but the "best" rotation was still a human judgment call — balancing skill levels, ergonomic exposure limits, and fairness across the workforce.',
    solution:
      'ML engine suggesting optimal worker rotations using skill decay logic (6-week window), ergonomic safety rules (max exposure days per station), and fairness scoring. Integrates with the workforce platform.',
    result: '🔬 Currently in development',
    resultExtra: '· Targeting Q3 2026 integration',
    resultStyle: 'border-color:#a855f7;background:rgba(168,85,247,0.07);color:#a855f7;',
    tech: ['Python', 'scikit-learn', 'AWS Lambda'],
    links: [
      { label: '🐙 GitHub Profile →', href: 'https://github.com/2190lunga', external: true },
    ],
  },
  {
    id: 'powerbi-suite',
    icon: '📉',
    visualClass: 'pv-powerbi',
    bars: [80, 50, 95, 65, 40, 85, 70, 55],
    title: 'Power BI Dashboard Suite',
    status: 'live',
    problem:
      'Leadership reporting relied on manually updated Excel files with inconsistent formats — data was always days old, and extracting actionable insights required analyst hours every month.',
    solution:
      '4 production Power BI dashboards: headcount waterfall (month-on-month variance), line balancing (station loadings & KPIs), defect tracking, and scrap cost analysis. Used daily by section managers and plant leadership.',
    result: '⚡ Used by leadership daily',
    resultExtra: '· Replaced all manual Excel reports',
    tech: ['Power BI', 'DAX', 'Excel', 'ETL'],
    links: [
      { label: '🔒 Internal System', href: null },
    ],
  },
  {
    id: 'serverless-pipeline',
    icon: '🏆',
    visualClass: 'pv-pipeline',
    bars: [65, 90, 50, 75, 40, 85, 60, 95],
    title: 'AWS Serverless Data Pipeline',
    status: 'live',
    badge: 'Hackathon',
    problem:
      'Internal AWS Hackathon challenge: design and build a fully serverless, end-to-end data pipeline from raw data ingestion to interactive dashboard — in a single day.',
    solution:
      'S3 data landing → Lambda ETL → Glue schema discovery → Athena querying → QuickSight dashboards → Cognito auth → React embed. Fully serverless, zero idle cost architecture.',
    result: '🏆 Certificate awarded',
    resultExtra: '· 100% serverless · Zero idle cost',
    tech: ['S3', 'Lambda', 'Glue', 'Athena', 'QuickSight', 'Cognito', 'React'],
    links: [
      { label: '📄 Read Case Study →', href: 'case-studies.html' },
      { label: '🐙 GitHub →', href: 'https://github.com/2190lunga', external: true },
    ],
  },
];
