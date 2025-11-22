# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ⚠️ CRITICAL: Development Rules

**BEFORE making any code changes, you MUST:**
1. Read and understand `regra.md` - This file contains ALL mandatory development rules, patterns, and architectural decisions
2. Follow ALL guidelines in `regra.md` strictly - These are not suggestions, they are requirements
3. When making architectural changes or adding significant features, UPDATE both `CLAUDE.md` and `regra.md` to reflect the changes
4. The `regra.md` file is the source of truth for development standards in Portuguese (PT-BR)
5. This `CLAUDE.md` file is the English reference for AI assistants

**Key rules from regra.md:**
- Views MUST only import `geminiService.ts` (never `groqService.ts` directly - Facade pattern)
- NEVER access `localStorage` directly - always use `databaseService.ts`
- Use `Promise.allSettled` for parallel AI generation (not `Promise.all`)
- Always use `MarkdownRenderer` component for LLM text output
- All UI text must be in Portuguese (PT-BR)
- ALWAYS use `useRouter` hook for navigation (never manipulate `window.location` directly)
- **ALWAYS use Design System components** - NEVER create custom UI elements with Tailwind directly
- **ALWAYS use semantic color tokens** - NEVER use Tailwind color classes directly (e.g., use `bg-primary-600` instead of `bg-purple-600`)
- Register all changes in `updates/updates.md`

## Project Overview

**PRD-Prompt.ai** is a React 19 + TypeScript SaaS web application that uses AI (Google Gemini and Groq) to help product managers and developers generate comprehensive Product Requirement Documents, development prompts, database schemas, and UI/UX flows. The application uses **Supabase** (PostgreSQL 17) as primary database with **localStorage fallback** for offline/demo mode.

## Commands

### Development

```bash
npm run dev       # Start Vite dev server on http://localhost:4001 with hot reload
npm run build     # Build for production → /dist directory
npm run preview   # Test production build locally
```

### Supabase Local Development

```bash
npx supabase start   # Start local Supabase (PostgreSQL, Auth, Storage, Studio)
npx supabase status  # Check running services and ports
npx supabase stop    # Stop all Supabase services
npx supabase db reset # Reset database (CAUTION: deletes all data)
npx supabase migration new <name> # Create new migration
npx supabase db push # Apply migrations to local database
```

### Running the App

1. Install dependencies: `npm install`
2. Set environment variables in `.env.local`:
   - `GEMINI_API_KEY` (required for Gemini API calls)
   - `VITE_SUPABASE_URL` (for Supabase integration)
   - `VITE_SUPABASE_ANON_KEY` (for Supabase auth)
3. Start Supabase local: `npx supabase start`
4. Run dev server: `npm run dev`
5. Access app at `http://localhost:4001`
6. Access Supabase Studio at `http://127.0.0.1:54423`

The app is primarily designed for Google Gemini but supports Groq as a fallback LLM provider. API key configuration happens in the Settings view (Settings.tsx).

### Environment Setup

**Required Variables in `.env.local`:**

```bash
# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# Supabase Local (Development)
VITE_SUPABASE_URL=http://127.0.0.1:54421
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

**Optional:**
- Groq API key can be added in the Settings view for alternative LLM provider

### Local Services (Supabase)

When running `npx supabase start`, the following services are available:

| Service | Port | URL |
|---------|------|-----|
| **Vite Dev Server** | 4001 | http://localhost:4001 |
| **Supabase API** | 54421 | http://127.0.0.1:54421 |
| **Supabase DB** | 54400 | postgresql://127.0.0.1:54400 |
| **Supabase Studio** | 54423 | http://127.0.0.1:54423 |
| **Inbucket (Email)** | 54424 | http://127.0.0.1:54424 |

## Architecture

### Supabase Integration (Nov 2025)

**Database Architecture - Hybrid Mode:**

The application uses a **hybrid approach** for data persistence:
- **Primary:** Supabase (PostgreSQL 17) with Row Level Security
- **Fallback:** localStorage for offline/demo mode
- **Auto-detection:** `databaseService.ts` automatically uses Supabase when available

**Database Schema (3 Tables):**

#### 1. **profiles** (User Profiles)
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  updated_at TIMESTAMPTZ,
  name TEXT,
  email TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'))
);
```

**Row Level Security (RLS):**
- ✅ Public profiles viewable by everyone
- ✅ Users can insert/update own profile
- ✅ Admins can view all profiles (via `is_admin()` function)

#### 2. **prds** (Product Requirement Documents)
```sql
CREATE TABLE prds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content JSONB NOT NULL,  -- Full PRD object (competitors, ui, db, logo, etc.)
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
```

**Row Level Security (RLS):**
- ✅ Users view/edit/delete only own PRDs
- ✅ Admins view all PRDs (read-only)

#### 3. **prompts** (Development Prompts)
```sql
CREATE TABLE prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  prd_id UUID REFERENCES prds(id) ON DELETE SET NULL,
  prd_title TEXT,
  content TEXT NOT NULL,
  meta JSONB,  -- { type, platform, stack, framework, specialRequirements }
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
```

**Row Level Security (RLS):**
- ✅ Users view/insert/delete only own prompts
- ✅ Admins view all prompts (read-only)

**Database Triggers:**

```sql
-- Auto-create profile when user registers
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Helper function to check if user is admin
CREATE FUNCTION public.is_admin() RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;
```

**Migrations:**

Located in `supabase/migrations/`:
- `20251122113726_init_schema.sql` - Initial schema (tables + RLS + triggers)
- `20251122115203_backfill_profiles.sql` - Backfill existing users

**Supabase Studio Access:**

Access the web UI at `http://127.0.0.1:54423` to:
- Browse tables and data
- Run SQL queries
- Manage auth users
- View RLS policies
- Monitor real-time activity

### Component Structure

The app follows a clear layered architecture:

```
App.tsx (root - auth state, view routing)
  ├── designSystem.ts      (design tokens - colors, spacing, etc.)
  ├── components/          (reusable UI components following Design System)
  ├── views/               (page-level components for each feature)
  ├── services/            (business logic & API integration)
  ├── contexts/            (global state via React Context)
  └── types.ts             (TypeScript interfaces)
```

### Design System (Nov 2025)

**Complete design system** with centralized tokens and reusable components:

**Files:**
- `designSystem.ts` - All design tokens (colors, spacing, typography, shadows, etc.)
- `DESIGN_SYSTEM.md` - Complete documentation with examples
- `index.html` - Tailwind configuration with semantic colors

**Available Components:**
- `Button` - 4 variants (primary, secondary, danger, ghost), 3 sizes
- `Badge` - 6 variants for tags and status indicators
- `Alert` - 4 variants (success, error, warning, info) for user feedback
- `Avatar` - With automatic initials fallback
- `IconButton` - Icon-only buttons with accessibility
- `Skeleton` - Loading states (SkeletonCard, SkeletonAvatar, SkeletonTable)
- `Input`, `Select`, `Textarea` - Form components with tooltip support
- `Card`, `Modal` - Layout containers

**Design Tokens:**
- **Colors**: `primary-*`, `secondary-*`, `success-*`, `error-*`, `warning-*`, `info-*`
- **Spacing**: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`
- **Typography**: `text-xs` to `text-3xl`, font weights
- **Shadows**: `shadow-sm` to `shadow-xl`
- **Border Radius**: `rounded-sm` to `rounded-2xl`, `rounded-full`

**Critical Rules:**
1. ALWAYS use Design System components instead of creating custom Tailwind styles
2. ALWAYS use semantic color tokens (`bg-primary-600` NOT `bg-purple-600`)
3. NEVER use arbitrary values (`w-[342px]`) - use design tokens
4. NEVER duplicate component UI code - extract to components/

**Example Usage:**
```tsx
// ✅ CORRECT
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Alert } from '../components/Alert';

<Button variant="primary" size="md">Salvar</Button>
<Badge variant="success" rounded="full">Novo</Badge>
<Alert variant="error">Erro ao salvar</Alert>

// ❌ WRONG
<button className="bg-purple-600 text-white px-4 py-2 rounded-lg">Salvar</button>
<span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">Novo</span>
<div className="bg-red-50 text-red-700">Erro ao salvar</div>
```

### Core Views (pages)

- **Dashboard.tsx** - Welcome/intro with user workflow
- **GeneratePrd.tsx** - 6-step wizard for PRD generation (generates competitors analysis, UI flows, database schema, logo suggestions)
- **GeneratePrompt.tsx** - Customization interface for generated prompts
- **AgentHub.tsx** - Discovery and interaction with 5+ specialist AI agents (Product Manager, Market Analyst, UX Designer, Database Architect, Brand Director)
- **MyDocuments.tsx** - List and manage saved documents
- **DocumentViewer.tsx** - View/edit generated PRDs and prompts
- **Settings.tsx** - Configure AI model (Gemini/Groq) and API keys
- **Auth.tsx** - Login/register with Supabase Auth
- **IdeaCatalog.tsx** - Browse sample ideas
- **AdminDashboard.tsx** - 🆕 Admin panel with 5 tabs (Overview, Users, Activity, System, Security) - **REFACTORED Nov 2025**

### Services Layer

**geminiService.ts** - Google Gemini SDK wrapper
- `generateJSON<T>(prompt, schema)` - Generate structured data with JSON schema validation
- `generateText(prompt)` - Generate plain text
- `generateWithImage(prompt, imageBase64)` - Multimodal (image + text input)
- Includes fallback logic for 401 auth errors

**groqService.ts** - Groq REST API wrapper
- `generateText(prompt)` - Alternative LLM provider
- `generateJSON<T>(prompt, schema)` - Structured generation with schema validation
- Supports multiple models: Llama, Mixtral, DeepSeek, Gemma

**databaseService.ts** - Supabase + localStorage hybrid abstraction (796 lines)
- **User auth:** `registerUser()`, `loginUser()`, `logoutUser()`, `getCurrentUser()`
- **PRD management:** `createPrd()`, `getPrds()`, `getPrdById()`, `deletePrd()`
- **Prompt management:** `createPrompt()`, `getPrompts()`, `deletePrompt()`
- **Chat sessions:** `getChatSessions()`, `saveChatSession()`
- **Settings:** `saveSettings()`, `getSettings()`
- **Agent preferences:** `toggleFavoriteAgent()`, `getAgentPrefs()`
- **🆕 Admin operations:**
  - `getAllUsers()` - Get all users (admin only)
  - `updateUserRole(userId, role)` - Promote/demote users
  - `getSystemStats()` - Get system metrics (users, prds, prompts, storage)
  - `clearDatabase()` - Clear all data (CAUTION)
  - `deleteUser(userId)` - Delete user and their data
  - `resetUserPassword(userId)` - Reset user password
- **🆕 Activity Logs:**
  - `getActivityLogs()` - Get audit logs
  - `logActivity(params)` - Log admin actions (auto-called)
- **🆕 Export/Import:**
  - `exportAllData()` - Export full database backup (JSON)

**Hybrid Mode Logic:**
```typescript
private hasSupabase = !!supabase && !!import.meta.env.VITE_SUPABASE_URL;

// Automatically uses Supabase if available, otherwise localStorage
async getPrds(userId: string): Promise<PRD[]> {
  if (this.hasSupabase) {
    // Use Supabase with RLS
    const { data } = await supabase.from('prds').select('*')...
  } else {
    // Fallback to localStorage
    return this.getListFromStorage<PRD>('prds')...
  }
}
```

**routerService.ts** - URL-based navigation system (Nov 2025)
- Singleton service managing browser History API
- Maps Views to URL slugs (e.g., `generate-prd` → `/criar-prd`)
- `navigate(view, params?)` - Navigate to a view with optional params
- `replace(view, params?)` - Replace current history entry
- `getCurrentView()` - Get current view from URL
- `getParams()` - Extract URL parameters (documentId, action, etc.)
- `back()` / `forward()` - Browser history navigation
- Automatically listens to `popstate` events (back/forward buttons)

### State Management

**AppContext** (contexts/AppContext.ts) - Global state for:
- Current user (`user`)
- Selected AI model (`currentModel`)
- Toast notifications (`showToast()`)
- Logout function (`logout()`)

State flows down via context provider in App.tsx. Components use `useContext(AppContext)` to access global state.

**useRouter** (hooks/useRouter.ts) - Navigation hook for:
- Current view from URL (`currentView`)
- URL parameters (`params`)
- Navigation functions (`navigate()`, `replace()`, `back()`, `forward()`)
- URL generation (`getUrl()`)

Components use this hook instead of managing view state locally.

### Key Design Patterns

1. **Component Extraction** for modularity (GeneratePrd refactored Nov 2025)
   - Extract modals, steps, and hooks from monolithic components
   - Each component has a single responsibility
   - Barrel exports (`index.ts`) for clean imports

2. **Custom Hooks for Business Logic**
   - Extract handlers and complex logic into hooks
   - Keep view components focused on rendering
   - Example: `usePrdGeneration`, `useChatHandlers`, `useFormHandlers`

3. **Prop drilling** for view-level component communication
   - State remains centralized in orchestrator components
   - Handlers passed down as props
   - Type-safe prop interfaces in `types.ts` files

4. **React Context API** for global state (avoiding prop drilling)
   - Used for app-wide state (user, model, toasts)
   - Not used for view-specific state

5. **TypeScript generics** in services for type-safe API responses

6. **localStorage abstraction** via databaseService to simulate backend persistence

7. **Fallback logic** in geminiService for graceful degradation between LLM providers

8. **URL-based routing** via routerService for shareable URLs and browser history support (Nov 2025)

## Important Architecture Details

### AI Generation Flow

The app supports three types of AI generation:

1. **Structured JSON** - Used for PRD generation, competitor analysis, database schemas
   - Calls `generateJSON<T>()` with TypeScript interface as schema
   - Parses response into typed objects
   - Example: `generateJSON<PRD>()` returns PRD with `sections`, `competitors`, `flows`, etc.

2. **Free Text** - Used for prompts, chat messages
   - Calls `generateText()` for streaming or complete responses
   - Used by AgentHub chat system

3. **Multimodal** - Used for logo generation and image analysis
   - Calls `generateWithImage()` with base64-encoded images
   - GeneratePrd.tsx generates logo suggestions using this

### Specialist Agents System

The app includes 5+ pre-configured AI personas stored in `constants.ts`:
- Each agent has custom system instructions (role-specific context)
- Agents have suggested chat topics
- Persistent chat sessions per agent per user
- Chat history saved in databaseService
- When user selects an agent, ChatDrawer opens with agent-specific system instruction

### Data Persistence Strategy

**Hybrid Mode (Supabase + localStorage):**

The application uses a smart hybrid approach via `databaseService.ts`:
- **Primary:** Supabase (PostgreSQL 17) with Row Level Security
- **Fallback:** localStorage for offline/demo mode
- **Auto-detection:** Checks `VITE_SUPABASE_URL` environment variable

**Data Stored:**
- User accounts (via Supabase Auth - bcrypt hashed passwords)
- Generated PRDs and prompts (JSONB content in PostgreSQL)
- Chat session histories (localStorage for performance)
- AI model preferences (per-user settings)
- Agent favorites (localStorage)
- Activity logs (last 500 entries in localStorage)

**Benefits:**
- ✅ Production-ready with Supabase Cloud
- ✅ Works offline with localStorage fallback
- ✅ Row Level Security protects user data
- ✅ No migration needed - same API surface

### LLM Provider Switching

Users can switch between Gemini and Groq in Settings:
1. Settings view allows selecting model and entering API keys
2. `updateModel()` updates AppContext
3. Services (geminiService/groqService) have methods to configure API keys
4. All subsequent AI calls automatically use the selected provider
5. Fallback logic in geminiService automatically switches to Groq on 401 errors

## Large Files to Be Aware Of

**Refactored Views (Modular Architecture):**
- **views/GeneratePrd.tsx** (~393 lines) - **REFACTORED Nov 2025** - Main orchestrator for 6-step PRD wizard, 67% reduction
- **views/DocumentViewer.tsx** (~224 lines) - **REFACTORED Nov 2025** - Document viewer with 5 tabs, 56.8% reduction
- **views/AdminDashboard.tsx** (~120 lines) - **REFACTORED Nov 2025** - Admin panel with 5 tabs, 51% reduction

**Services & Large Components:**
- **services/databaseService.ts** (~796 lines) - Hybrid Supabase + localStorage abstraction with 19 methods
- **services/geminiService.ts** (~28KB) - AI integration with fallback logic and JSON schema handling
- **views/AgentHub.tsx** (~362 lines) - Agent discovery, chat management, and favorites system (candidate for refactoring)

**Modular Component Counts:**
- **GeneratePrd:** 13 files (steps, modals, hooks)
- **DocumentViewer:** 12 files (tabs, hooks)
- **AdminDashboard:** 15 files (tabs, hooks, components)

### GeneratePrd Component Architecture (Modular - Nov 2025)

The GeneratePrd view has been refactored into a modular architecture following Single Responsibility Principle:

```
components/GeneratePrd/
├── modals/                         (3 modal components)
│   ├── MagicMatchModal.tsx        (73 lines)
│   ├── CreativeDirectionModal.tsx (177 lines)
│   ├── TurboProgressModal.tsx     (37 lines)
│   └── types.ts, index.ts
├── steps/                          (6 step components)
│   ├── DocumentStep.tsx           (112 lines)
│   ├── CompetitorsStep.tsx        (88 lines)
│   ├── UiPlanStep.tsx             (88 lines)
│   ├── DatabaseStep.tsx           (117 lines)
│   ├── LogoStep.tsx               (97 lines)
│   ├── ReviewStep.tsx             (152 lines)
│   └── types.ts, index.ts
└── hooks/                          (3 custom hooks)
    ├── usePrdGeneration.ts        (260 lines - AI generation handlers)
    ├── useChatHandlers.ts         (173 lines - chat/agent logic)
    ├── useFormHandlers.ts         (87 lines - form/navigation)
    └── index.ts
```

**Key Architectural Decisions:**
- **Separation of Concerns**: UI (steps) vs Logic (hooks) vs State (main component)
- **Custom Hooks**: Business logic extracted from view into reusable hooks
- **Type Safety**: All components have strict TypeScript interfaces in `types.ts` files
- **Barrel Exports**: Clean imports via `index.ts` files
- **Props Drilling**: State management kept centralized in main component

**When Working with GeneratePrd:**
1. **Adding new step**: Create component in `steps/`, add interface to `steps/types.ts`
2. **Adding new modal**: Create component in `modals/`, add interface to `modals/types.ts`
3. **Adding AI generation**: Add handler to `usePrdGeneration.ts` hook
4. **Adding form logic**: Add handler to `useFormHandlers.ts` hook
5. **Adding chat logic**: Add handler to `useChatHandlers.ts` hook

**Performance:**
- Build time: ~2.10s (no regression after refactoring)
- Code reduction: 1200 → 393 lines in main file (-67.3%)
- Total components: 13 reusable components
- Testability: High (each component can be tested in isolation)

### DocumentViewer Component Architecture (Modular - Nov 2025)

The DocumentViewer view has been refactored following the same modular pattern:

```
components/DocumentViewer/
├── tabs/                           (5 tab components)
│   ├── OverviewTab.tsx            (78 lines - executive summary, metadata)
│   ├── MarketTab.tsx              (56 lines - competitor table)
│   ├── UiTab.tsx                  (71 lines - flowchart, screen specs)
│   ├── DatabaseTab.tsx            (89 lines - schema cards, SQL)
│   ├── BrandTab.tsx               (66 lines - logo, color palette)
│   └── types.ts, index.ts
└── hooks/                          (2 custom hooks)
    ├── useChatHandlers.ts         (70 lines - chat by persona)
    ├── useDocumentExport.ts       (19 lines - copy/print)
    └── index.ts
```

**Key Architectural Decisions:**
- **Tab Extraction**: Each PRD section (overview, market, ui, db, brand) is an isolated component
- **Shared Hooks**: Chat and export logic reusable across views
- **Type Safety**: Strict interfaces in `tabs/types.ts`
- **Props Drilling**: Tab state managed in parent, passed as props

**Performance:**
- Build time: ~2.31s (no regression)
- Code reduction: 519 → 224 lines in main file (-56.8%)
- Total modular files: 12 files (449 lines total)
- Reusability: Hooks can be used in other document viewers

### AdminDashboard Component Architecture (Modular - Nov 2025)

The AdminDashboard view has been refactored into a modular architecture following the same pattern:

```
views/AdminDashboard.tsx (120 lines) - Main orchestrator

components/AdminDashboard/
├── tabs/                           (5 tab components)
│   ├── OverviewTab.tsx            (Metrics + system status - 6 stat cards)
│   ├── UsersTab.tsx               (User management - search, filters, role changes)
│   ├── ActivityTab.tsx            (Audit logs - severity filtering, pagination)
│   ├── SystemTab.tsx              (DB cleanup, export, cache clear, tech info)
│   ├── SecurityTab.tsx            (Security events, IP tracking, recommendations)
│   └── types.ts, index.ts
├── hooks/                          (3 custom hooks)
│   ├── useAdminData.ts            (260 lines - data loading & refresh)
│   ├── useUserManagement.ts       (173 lines - user operations)
│   ├── useSystemOps.ts            (87 lines - system maintenance)
│   └── index.ts
└── components/                     (2 reusable components)
    ├── StatCard.tsx               (Metric cards with trends)
    ├── ActivityLogItem.tsx        (Log item with severity badges)
    └── index.ts
```

**Key Features by Tab:**

1. **Overview Tab:**
   - 6 metric cards (Users, Active Users, PRDs, Prompts, Documents, Storage)
   - Activity panels (averages per user)
   - System status (DB, Storage, API status)

2. **Users Tab:**
   - Search by name/email
   - Filter by role (Admin/User)
   - Sort by name/email/role
   - Promote/Demote with modal confirmation
   - Real-time user count

3. **Activity Tab:**
   - Filter by severity (Info, Warning, Error)
   - Pagination (25, 50, 100, 500 records)
   - Relative timestamps ("5min ago")
   - Stats cards per severity type
   - Auto-logged admin actions

4. **System Tab:**
   - Clear Database (requires typing "CONFIRMAR")
   - Export data (JSON/CSV with auto-download)
   - Clear cache (sessionStorage only)
   - Technical info (version, user agent, screen resolution)

5. **Security Tab:**
   - Security metrics (Status, Active Sessions, Failed Logins)
   - Event log (login, logout, role changes, data access)
   - IP and User Agent tracking
   - Security recommendations (2FA, backups, reviews)

**Key Architectural Decisions:**
- **5 Tabs:** Each admin function is isolated (Overview, Users, Activity, System, Security)
- **3 Custom Hooks:** Data loading, user operations, system operations
- **Modal Confirmations:** Uses `Modal` component (not native `confirm()`)
- **Activity Logging:** All admin actions automatically logged via `db.logActivity()`
- **Type Safety:** All tabs have strict interfaces in `tabs/types.ts`
- **Design System:** 100% compliance (Button, Badge, Alert, Modal, Input)

**When Working with AdminDashboard:**
1. **Adding new tab**: Create component in `tabs/`, add to navigation array
2. **Adding admin operation**: Add method to appropriate hook (`useUserManagement`, `useSystemOps`)
3. **Adding metric**: Use `StatCard` component in OverviewTab
4. **Adding audit log**: Call `db.logActivity()` after action completes

**Performance:**
- Build time: ~2.90s (no regression)
- Code reduction: 244 → 120 lines in main file (-51%)
- Total modular files: 15 files
- Activity Logs: Keeps last 500 records in localStorage

**New databaseService Methods (for Admin):**
- `getAllUsers()`, `updateUserRole()`, `getSystemStats()`
- `getActivityLogs()`, `logActivity()`, `exportAllData()`
- `deleteUser()`, `resetUserPassword()`, `clearDatabase()`

## Type Safety

All components, services, and data structures are fully typed with TypeScript:
- View props extend `React.FC<Props>`
- Service functions return typed objects using `<T>` generics
- Key interfaces: `User`, `PRD`, `Prompt`, `ChatSession`, `Agent` (see types.ts)
- `tsconfig.json` targets ES2022 with JSX support

## React Version Notes

The app uses **React 19.2.0** with React 19 APIs:
- Uses `React.FC` with TypeScript
- Context API with `useContext()`
- Local state with `useState()`
- Effects with `useEffect()`
- Custom hooks can be added as needed

## Build & Deployment

- **Build output**: Vite produces optimized bundle in `/dist` directory
- **Build time**: ~2.90s (849KB bundle, gzipped: 213KB)
- **Target**: Production deployment with Supabase Cloud
- **Dev server**: Vite with HMR enabled on port 4001
- **CSS**: Tailwind CSS via CDN in index.html (semantic tokens)
- **Icons**: Custom SVG component library (components/icons/Icons.tsx - 50+ icons)
- **Database**: Supabase PostgreSQL 17 (local dev + cloud production)

## Development Notes

### Adding a New View

1. Create component in `views/` directory
2. Add route mapping to `routerService.ts` in the `ROUTES` and `SLUG_TO_VIEW` objects
3. Update `App.tsx` switch statement to render the new view
4. Add sidebar navigation link in Sidebar.tsx
5. If it needs AI generation, use geminiService or groqService
6. Persist data via databaseService
7. Show user feedback via `showToast()` from AppContext

**Example - Adding a new "Reports" view:**

```typescript
// 1. Add to routerService.ts
export const ROUTES = {
  // ... existing routes
  'reports': '/relatorios',
};

const SLUG_TO_VIEW: Record<string, View> = {
  // ... existing mappings
  '/relatorios': 'reports',
};

// 2. Update types.ts
export type View =
  | 'dashboard'
  // ... existing views
  | 'reports';

// 3. Update App.tsx renderView()
case 'reports':
  return <Reports />;

// 4. Use navigation in components
const { navigate } = useRouter();
navigate('reports');
```

### Adding AI Generation

1. Define TypeScript interface for response type in types.ts
2. Use `geminiService.generateJSON<MyType>()` for structured data
3. Add error handling with try/catch
4. Show loading state while generating
5. Handle fallback to Groq on errors

### Chat Integration

The ChatDrawer component can be used by any feature:
1. Pass agent/system instruction to ChatDrawer
2. Messages are saved to databaseService automatically
3. Chat bubbles render with markdown support (MarkdownRenderer.tsx)
4. Chat state is managed within ChatDrawer component

### Data Storage Notes

**Supabase (Primary):**
- ✅ Unlimited storage (cloud-based PostgreSQL)
- ✅ Row Level Security protects user data
- ✅ Automatic backups and scaling
- ✅ Production-ready authentication

**localStorage (Fallback):**
- ⚠️ 5-10MB typical limit per domain
- ⚠️ Client-side only (lost on browser clear)
- ✅ Good for offline mode and demo
- ✅ Automatic fallback when Supabase unavailable

## Documentation Maintenance

### When to Update CLAUDE.md and regra.md

You MUST update these documentation files when:

1. **Adding new architectural patterns**
   - New service layer components
   - New state management approaches
   - New design patterns introduced

2. **Changing core workflows**
   - Build/deployment process changes
   - Development environment setup changes
   - New npm scripts or commands

3. **Adding major features**
   - New AI models or providers
   - New view/page types
   - New data persistence strategies

4. **Modifying critical rules**
   - Changes to the Facade pattern
   - Updates to error handling strategies
   - New TypeScript patterns or conventions

### How to Update

1. **For regra.md** (Portuguese - Primary):
   - Update with detailed technical rules and code examples
   - Maintain the numbered section structure
   - Add new sections if introducing entirely new concepts
   - Include TypeScript code examples for patterns

2. **For CLAUDE.md** (English - Reference):
   - Update the "CRITICAL: Development Rules" section with key changes
   - Add to relevant architecture sections
   - Keep it concise but comprehensive
   - Cross-reference with regra.md when appropriate

3. **Always update both files together** to maintain consistency

### Documentation Hierarchy

```
regra.md (Portuguese)
  ├── Source of truth for development rules
  ├── Detailed implementation guidelines
  └── Code examples and patterns

CLAUDE.md (English)
  ├── AI assistant reference
  ├── High-level architecture overview
  └── Quick reference for common tasks

updates/updates.md
  └── Chronological changelog of all modifications
```

**Remember**: Outdated documentation is worse than no documentation. Keep these files current!
