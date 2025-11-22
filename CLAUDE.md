# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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

1. **Prop drilling** for view-level component communication
2. **React Context API** for global state (avoiding prop drilling)
3. **TypeScript generics** in services for type-safe API responses
4. **localStorage abstraction** via databaseService to simulate backend persistence
5. **Fallback logic** in geminiService for graceful degradation between LLM providers

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

- **GeneratePrd.tsx** (~85KB) - Contains the 6-step PRD generation wizard with complex state management for logos, competitors, UI flows
- **geminiService.ts** (~28KB) - AI integration with fallback logic and JSON schema handling
- **AgentHub.tsx** (~16KB) - Agent discovery, chat management, and favorites system
- **CreativeDirectionModalReimaginado.tsx** (~25KB) - Creative direction workflow (appears unused/legacy)

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
