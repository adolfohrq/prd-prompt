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
- Register all changes in `updates/updates.md`

## Project Overview

**PRD-Prompt.ai** is a React 19 + TypeScript SaaS web application that uses AI (Google Gemini and Groq) to help product managers and developers generate comprehensive Product Requirement Documents, development prompts, database schemas, and UI/UX flows. The application is designed to run in Google AI Studio and uses browser localStorage for data persistence (no backend required).

## Commands

### Development

```bash
npm run dev       # Start Vite dev server on http://localhost:3000 with hot reload
npm run build     # Build for production → /dist directory
npm run preview   # Test production build locally
```

### Running the App

1. Install dependencies: `npm install`
2. Set `GEMINI_API_KEY` in `.env.local` (required for Gemini API calls)
3. Run `npm run dev`

The app is primarily designed for Google Gemini but supports Groq as a fallback LLM provider. API key configuration happens in the Settings view (Settings.tsx).

### Environment Setup

- **Required**: `GEMINI_API_KEY` in `.env.local` for Gemini API access
- **Optional**: Groq API key can be added in the Settings view for alternative LLM provider

## Architecture

### Component Structure

The app follows a clear layered architecture:

```
App.tsx (root - auth state, view routing)
  ├── components/           (reusable UI components)
  ├── views/               (page-level components for each feature)
  ├── services/            (business logic & API integration)
  ├── contexts/            (global state via React Context)
  └── types.ts             (TypeScript interfaces)
```

### Core Views (pages)

- **Dashboard.tsx** - Welcome/intro with user workflow
- **GeneratePrd.tsx** - 6-step wizard for PRD generation (generates competitors analysis, UI flows, database schema, logo suggestions)
- **GeneratePrompt.tsx** - Customization interface for generated prompts
- **AgentHub.tsx** - Discovery and interaction with 5+ specialist AI agents (Product Manager, Market Analyst, UX Designer, Database Architect, Brand Director)
- **MyDocuments.tsx** - List and manage saved documents
- **DocumentViewer.tsx** - View/edit generated PRDs and prompts
- **Settings.tsx** - Configure AI model (Gemini/Groq) and API keys
- **Auth.tsx** - Login/register with localStorage persistence
- **IdeaCatalog.tsx** - Browse sample ideas

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

**databaseService.ts** - localStorage CRUD operations
- User auth: `registerUser()`, `loginUser()`, `logoutUser()`
- PRD management: `createPrd()`, `getPrds()`, `updatePrd()`, `deletePrd()`
- Prompt management: `createPrompt()`, `getPrompts()`, `updatePrompt()`, `deletePrompt()`
- Chat sessions: `getChatSessions()`, `saveChatSession()`
- Settings: `saveSettings()`, `getSettings()`
- Agent preferences: `toggleFavoriteAgent()`, `getAgentPreferences()`

### State Management

**AppContext** (contexts/AppContext.ts) - Global state for:
- Current user (`user`)
- Selected AI model (`currentModel`)
- Toast notifications (`showToast()`)
- Logout function (`logout()`)

State flows down via context provider in App.tsx. Components use `useContext(AppContext)` to access global state.

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

All data persists to browser localStorage via databaseService:
- User accounts (email, password hashed)
- Generated PRDs and prompts
- Chat session histories
- AI model preferences
- Agent favorites

This approach enables AI Studio deployment without a backend server. Data is scoped per user based on login.

### LLM Provider Switching

Users can switch between Gemini and Groq in Settings:
1. Settings view allows selecting model and entering API keys
2. `updateModel()` updates AppContext
3. Services (geminiService/groqService) have methods to configure API keys
4. All subsequent AI calls automatically use the selected provider
5. Fallback logic in geminiService automatically switches to Groq on 401 errors

## Large Files to Be Aware Of

- **views/GeneratePrd.tsx** (~393 lines) - **REFACTORED Nov 2025** - Main orchestrator for 6-step PRD wizard, now 67% smaller
- **geminiService.ts** (~28KB) - AI integration with fallback logic and JSON schema handling
- **AgentHub.tsx** (~16KB) - Agent discovery, chat management, and favorites system

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
- **Target**: Google AI Studio platform (can also run standalone)
- **Dev server**: Vite with HMR enabled on port 3000
- **CSS**: Tailwind CSS via CDN in index.html
- **Icons**: Custom SVG component library (components/icons/Icons.tsx)

## Development Notes

### Adding a New View

1. Create component in `views/` directory
2. Add route logic to App.tsx (check `currentView` state)
3. Add sidebar navigation link in Sidebar.tsx
4. If it needs AI generation, use geminiService or groqService
5. Persist data via databaseService
6. Show user feedback via `showToast()` from AppContext

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

### localStorage Limitations

- 5-10MB typical limit per domain
- All data is client-side only (lost on browser clear)
- Good for demo/prototyping, not production user data
- Consider backend migration if scaling beyond single user

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
