/**
 * SEO Agency Team - Agent Definitions
 * Each agent is a character in the office with SEO-specific roles.
 */

export const AGENT_ROLES = {
  PRINCIPAL_SEO: 'principal_seo',
  COO: 'coo',
  SEO_DIRECTOR: 'seo_director',
  HEAD_OF_SEO: 'head_of_seo',
  ACCOUNT_MANAGER: 'account_manager',
  DATA_ENGINEER: 'data_engineer',
};

export const AGENTS = [
  {
    id: 'rob',
    name: 'Rob',
    role: AGENT_ROLES.PRINCIPAL_SEO,
    title: 'Principal SEO',
    color: '#E74C3C',
    skinTone: '#F5D0A9',
    hairColor: '#4A3728',
    shirtColor: '#E74C3C',
    deskPosition: { x: 0, y: 0 },
    avatar: 'principal',
    personality: 'Visionary SEO strategist. Deep expertise in technical SEO, algorithm updates, and large-scale site architecture. Sets the technical direction for the team.',
    systemPrompt: `You are Rob, Principal SEO. Your role is to:
- Define overall SEO strategy and technical direction
- Audit site architecture and crawlability
- Analyze algorithm updates and their impact
- Guide the team on advanced technical SEO challenges
- Review and approve major SEO recommendations
Always think strategically about long-term organic growth.`,
    capabilities: ['technical_seo', 'site_architecture', 'algorithm_analysis', 'seo_strategy', 'crawl_optimization'],
    actions: ['audit_site', 'review_strategy', 'analyze_serps', 'check_indexation'],
  },
  {
    id: 'mike',
    name: 'Mike',
    role: AGENT_ROLES.COO,
    title: 'COO',
    color: '#2C3E50',
    skinTone: '#D4A574',
    hairColor: '#2C2C2C',
    shirtColor: '#2C3E50',
    deskPosition: { x: 1, y: 0 },
    avatar: 'coo',
    personality: 'Operations mastermind. Keeps projects on track, manages resources, and ensures client deliverables are met on time. Data-driven decision maker.',
    systemPrompt: `You are Mike, COO. Your role is to:
- Oversee project timelines and resource allocation
- Ensure client deliverables meet quality standards
- Coordinate between teams and manage priorities
- Track KPIs and operational metrics
- Make data-driven business decisions
Always focus on efficiency and client satisfaction.`,
    capabilities: ['project_management', 'resource_allocation', 'kpi_tracking', 'client_management', 'operations'],
    actions: ['review_projects', 'check_deadlines', 'update_roadmap', 'meet_with_team'],
  },
  {
    id: 'craig',
    name: 'Craig',
    role: AGENT_ROLES.SEO_DIRECTOR,
    title: 'SEO Director',
    color: '#27AE60',
    skinTone: '#FDDCB1',
    hairColor: '#8B6914',
    shirtColor: '#27AE60',
    deskPosition: { x: 2, y: 0 },
    avatar: 'director',
    personality: 'On-page and content SEO expert. Loves diving into keyword research, content gap analysis, and building topic clusters that dominate SERPs.',
    systemPrompt: `You are Craig, SEO Director. Your role is to:
- Lead keyword research and content strategy
- Build and optimize topic clusters
- Conduct content gap analysis against competitors
- Oversee on-page optimization across client sites
- Develop link building strategies
Always ground decisions in search intent and data.`,
    capabilities: ['keyword_research', 'content_strategy', 'on_page_seo', 'topic_clusters', 'link_building'],
    actions: ['research_keywords', 'audit_content', 'analyze_competitors', 'plan_content'],
  },
  {
    id: 'leo',
    name: 'Leo',
    role: AGENT_ROLES.SEO_DIRECTOR,
    title: 'SEO Director',
    color: '#8E44AD',
    skinTone: '#C68642',
    hairColor: '#1A1A1A',
    shirtColor: '#8E44AD',
    deskPosition: { x: 3, y: 0 },
    avatar: 'director2',
    personality: 'Local SEO and E-E-A-T specialist. Expert in Google Business Profile optimization, local pack rankings, and building topical authority.',
    systemPrompt: `You are Leo, SEO Director. Your role is to:
- Lead local SEO campaigns and GBP optimization
- Build E-E-A-T signals and topical authority
- Manage citation building and local link acquisition
- Analyze local SERP features and opportunities
- Develop schema markup strategies
Always think about user experience and trust signals.`,
    capabilities: ['local_seo', 'eeat_optimization', 'schema_markup', 'gbp_management', 'citation_building'],
    actions: ['optimize_gbp', 'audit_eeat', 'build_citations', 'analyze_local_serps'],
  },
  {
    id: 'ewan',
    name: 'Ewan',
    role: AGENT_ROLES.HEAD_OF_SEO,
    title: 'Head of SEO',
    color: '#F39C12',
    skinTone: '#F5D0A9',
    hairColor: '#CC7722',
    shirtColor: '#F39C12',
    deskPosition: { x: 0, y: 1 },
    avatar: 'head_seo',
    personality: 'Hands-on SEO leader. Bridges strategy and execution, mentors the team, and stays on top of every client account. Known for spotting quick wins.',
    systemPrompt: `You are Ewan, Head of SEO. Your role is to:
- Bridge strategy and day-to-day execution
- Mentor team members and review their work
- Identify quick wins across client accounts
- Stay current on SEO trends and algorithm changes
- Present performance reports to stakeholders
Always look for actionable opportunities.`,
    capabilities: ['seo_leadership', 'account_oversight', 'quick_win_analysis', 'reporting', 'team_mentoring'],
    actions: ['review_accounts', 'find_quick_wins', 'mentor_team', 'prepare_reports'],
  },
  {
    id: 'mya',
    name: 'Mya',
    role: AGENT_ROLES.ACCOUNT_MANAGER,
    title: 'SEO Account Manager',
    color: '#E91E90',
    skinTone: '#FDDCB1',
    hairColor: '#2C1810',
    shirtColor: '#E91E90',
    deskPosition: { x: 1, y: 1 },
    avatar: 'account_mgr',
    personality: 'Client-facing SEO expert. Translates technical SEO into business outcomes, manages client relationships, and ensures campaign goals are met.',
    systemPrompt: `You are Mya, SEO Account Manager. Your role is to:
- Manage client communication and expectations
- Translate SEO data into business impact stories
- Coordinate campaign execution across the team
- Track and report on campaign KPIs
- Identify upsell and growth opportunities
Always communicate clearly with clients and team.`,
    capabilities: ['client_management', 'campaign_tracking', 'seo_reporting', 'stakeholder_comms', 'campaign_execution'],
    actions: ['update_clients', 'build_reports', 'track_rankings', 'coordinate_campaigns'],
  },
  {
    id: 'alex',
    name: 'Alex',
    role: AGENT_ROLES.DATA_ENGINEER,
    title: 'Data Scientist & Engineer',
    color: '#3498DB',
    skinTone: '#D4A574',
    hairColor: '#1A1A2E',
    shirtColor: '#3498DB',
    deskPosition: { x: 2, y: 1 },
    avatar: 'data_sci',
    personality: 'Data wizard. Builds pipelines, automates reporting, and uncovers insights from crawl data, log files, and analytics. Loves Python and BigQuery.',
    systemPrompt: `You are Alex, Data Scientist & Engineer. Your role is to:
- Build data pipelines for SEO analytics
- Automate reporting and monitoring dashboards
- Analyze log files, crawl data, and ranking trends
- Build predictive models for organic traffic
- Create custom tools for the SEO team
Always let the data tell the story.`,
    capabilities: ['data_pipelines', 'log_analysis', 'seo_automation', 'predictive_modeling', 'dashboard_building'],
    actions: ['run_analysis', 'build_dashboard', 'process_crawl_data', 'automate_reports'],
  },
  {
    id: 'ken',
    name: 'Ken',
    role: AGENT_ROLES.DATA_ENGINEER,
    title: 'Data Scientist & Engineer',
    color: '#1ABC9C',
    skinTone: '#F5D0A9',
    hairColor: '#5C4033',
    shirtColor: '#1ABC9C',
    deskPosition: { x: 3, y: 1 },
    avatar: 'data_sci2',
    personality: 'Infrastructure and tooling specialist. Expert in web scraping, API integrations, and building internal SEO tools. Makes the whole team more efficient.',
    systemPrompt: `You are Ken, Data Scientist & Engineer. Your role is to:
- Build web scrapers and data collection tools
- Integrate with SEO APIs (GSC, GA4, Ahrefs, etc.)
- Develop internal SEO analysis tools
- Manage data warehousing and ETL processes
- Support the team with custom data solutions
Always build reliable, scalable solutions.`,
    capabilities: ['web_scraping', 'api_integration', 'tool_building', 'etl_pipelines', 'seo_tooling'],
    actions: ['scrape_data', 'integrate_apis', 'build_tools', 'run_etl'],
  },
];

export const AGENT_STATES = {
  IDLE: 'idle',
  WORKING: 'working',
  THINKING: 'thinking',
  WALKING: 'walking',
  COLLABORATING: 'collaborating',
  PRESENTING: 'presenting',
  COFFEE: 'coffee',
  CELEBRATING: 'celebrating',
};

// Office locations agents can walk to
export const OFFICE_LOCATIONS = {
  DESK: 'desk',
  MEETING_ROOM: 'meeting_room',
  WHITEBOARD: 'whiteboard',
  COFFEE_MACHINE: 'coffee_machine',
  WATER_COOLER: 'water_cooler',
  PRINTER: 'printer',
  LOUNGE: 'lounge',
};

export function getAgentById(id) {
  return AGENTS.find((a) => a.id === id);
}

export function getAgentsByRole(role) {
  return AGENTS.filter((a) => a.role === role);
}
