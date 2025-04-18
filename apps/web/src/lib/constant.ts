export const TECH_OPTIONS = {
	frontend: [
		{
			id: "tanstack-router",
			name: "TanStack Router",
			description: "Modern type-safe router for React",
			icon: "🌐",
			color: "from-blue-400 to-blue-600",
			default: true,
		},
		{
			id: "react-router",
			name: "React Router",
			description: "Declarative routing for React",
			icon: "🧭",
			color: "from-cyan-400 to-cyan-600",
			default: false,
		},
		{
			id: "native",
			name: "React Native",
			description: "Expo with NativeWind",
			icon: "📱",
			color: "from-purple-400 to-purple-600",
			default: false,
		},
		{
			id: "none",
			name: "No Frontend",
			description: "API-only backend",
			icon: "⚙️",
			color: "from-gray-400 to-gray-600",
			default: false,
		},
	],
	runtime: [
		{
			id: "bun",
			name: "Bun",
			description: "Fast JavaScript runtime & toolkit",
			icon: "🥟",
			color: "from-amber-400 to-amber-600",
			default: true,
		},
		{
			id: "node",
			name: "Node.js",
			description: "JavaScript runtime environment",
			icon: "🟩",
			color: "from-green-400 to-green-600",
		},
	],
	backendFramework: [
		{
			id: "hono",
			name: "Hono",
			description: "Ultrafast web framework",
			icon: "⚡",
			color: "from-blue-500 to-blue-700",
			default: true,
		},
		{
			id: "elysia",
			name: "Elysia",
			description: "TypeScript web framework",
			icon: "🦊",
			color: "from-purple-500 to-purple-700",
		},
	],
	database: [
		{
			id: "sqlite",
			name: "SQLite",
			description: "File-based SQL database",
			icon: "🗃️",
			color: "from-blue-400 to-cyan-500",
			default: true,
		},
		{
			id: "postgres",
			name: "PostgreSQL",
			description: "Advanced SQL database",
			icon: "🐘",
			color: "from-indigo-400 to-indigo-600",
		},
		{
			id: "none",
			name: "No Database",
			description: "Skip database integration",
			icon: "🚫",
			color: "from-gray-400 to-gray-600",
		},
	],
	orm: [
		{
			id: "drizzle",
			name: "Drizzle",
			description: "TypeScript ORM",
			icon: "💧",
			color: "from-cyan-400 to-cyan-600",
			default: true,
		},
		{
			id: "prisma",
			name: "Prisma",
			description: "Next-gen ORM",
			icon: "◮",
			color: "from-purple-400 to-purple-600",
		},
	],
	auth: [
		{
			id: "true",
			name: "Better Auth",
			description: "Simple authentication",
			icon: "🔐",
			color: "from-green-400 to-green-600",
			default: true,
		},
		{
			id: "false",
			name: "No Auth",
			description: "Skip authentication",
			icon: "🔓",
			color: "from-red-400 to-red-600",
		},
	],
	turso: [
		{
			id: "true",
			name: "Turso",
			description: "SQLite cloud database",
			icon: "☁️",
			color: "from-pink-400 to-pink-600",
			default: false,
		},
		{
			id: "false",
			name: "No Turso",
			description: "Skip Turso integration",
			icon: "🚫",
			color: "from-gray-400 to-gray-600",
			default: true,
		},
	],
	prismaPostgres: [
		{
			id: "true",
			name: "Prisma PostgreSQL",
			description: "Set up PostgreSQL with Prisma",
			icon: "🐘",
			color: "from-indigo-400 to-indigo-600",
			default: false,
		},
		{
			id: "false",
			name: "Skip Prisma PostgreSQL",
			description: "Basic Prisma setup",
			icon: "🚫",
			color: "from-gray-400 to-gray-600",
			default: true,
		},
	],
	packageManager: [
		{
			id: "npm",
			name: "npm",
			description: "Default package manager",
			icon: "📦",
			color: "from-red-500 to-red-700",
		},
		{
			id: "pnpm",
			name: "pnpm",
			description: "Fast, disk space efficient",
			icon: "🚀",
			color: "from-orange-500 to-orange-700",
		},
		{
			id: "bun",
			name: "bun",
			description: "All-in-one toolkit",
			icon: "🥟",
			color: "from-amber-500 to-amber-700",
			default: true,
		},
	],
	addons: [
		{
			id: "pwa",
			name: "PWA",
			description: "Progressive Web App",
			icon: "📱",
			color: "from-blue-500 to-blue-700",
			default: false,
		},
		{
			id: "tauri",
			name: "Tauri",
			description: "Desktop app support",
			icon: "🖥️",
			color: "from-amber-500 to-amber-700",
			default: false,
		},
		{
			id: "biome",
			name: "Biome",
			description: "Linting & formatting",
			icon: "🌿",
			color: "from-green-500 to-green-700",
			default: false,
		},
		{
			id: "husky",
			name: "Husky",
			description: "Git hooks & lint-staged",
			icon: "🐶",
			color: "from-purple-500 to-purple-700",
			default: false,
		},
	],
	examples: [
		{
			id: "todo",
			name: "Todo Example",
			description: "Simple todo application",
			icon: "✅",
			color: "from-indigo-500 to-indigo-700",
			default: false,
		},
		{
			id: "ai",
			name: "AI Example",
			description: "AI integration example using AI SDK",
			icon: "🤖",
			color: "from-purple-500 to-purple-700",
			default: false,
		},
	],
	git: [
		{
			id: "true",
			name: "Git",
			description: "Initialize Git repository",
			icon: "📝",
			color: "from-gray-500 to-gray-700",
			default: true,
		},
		{
			id: "false",
			name: "No Git",
			description: "Skip Git initialization",
			icon: "🚫",
			color: "from-red-400 to-red-600",
		},
	],
	install: [
		{
			id: "true",
			name: "Install Dependencies",
			description: "Install packages automatically",
			icon: "📥",
			color: "from-green-400 to-green-600",
			default: true,
		},
		{
			id: "false",
			name: "Skip Install",
			description: "Skip dependency installation",
			icon: "⏭️",
			color: "from-yellow-400 to-yellow-600",
		},
	],
};

export const PRESET_TEMPLATES = [
	{
		id: "default",
		name: "Default Stack",
		description: "Standard web app with TanStack Router, Bun, Hono and SQLite",
		stack: {
			projectName: "my-better-t-app",
			frontend: ["tanstack-router"],
			runtime: "bun",
			backendFramework: "hono",
			database: "sqlite",
			orm: "drizzle",
			auth: "true",
			turso: "false",
			prismaPostgres: "false",
			packageManager: "bun",
			addons: [],
			examples: [],
			git: "true",
			install: "true",
		},
	},
	{
		id: "native-app",
		name: "Mobile App",
		description: "React Native with Expo and SQLite database",
		stack: {
			projectName: "my-better-t-app",
			frontend: ["native"],
			runtime: "bun",
			backendFramework: "hono",
			database: "sqlite",
			orm: "drizzle",
			auth: "true",
			turso: "false",
			prismaPostgres: "false",
			packageManager: "bun",
			addons: [],
			examples: [],
			git: "true",
			install: "true",
		},
	},
	{
		id: "api-only",
		name: "API Only",
		description: "Backend API with Hono and PostgreSQL",
		stack: {
			projectName: "my-better-t-app",
			frontend: ["none"],
			runtime: "bun",
			backendFramework: "hono",
			database: "postgres",
			orm: "drizzle",
			auth: "false",
			turso: "false",
			prismaPostgres: "false",
			packageManager: "bun",
			addons: [],
			examples: [],
			git: "true",
			install: "true",
		},
	},
	{
		id: "full-featured",
		name: "Full Featured",
		description: "Complete setup with all the bells and whistles",
		stack: {
			projectName: "my-better-t-app",
			frontend: ["tanstack-router", "native"],
			runtime: "bun",
			backendFramework: "hono",
			database: "sqlite",
			orm: "drizzle",
			auth: "true",
			turso: "true",
			prismaPostgres: "false",
			packageManager: "bun",
			addons: ["pwa", "biome", "husky", "tauri"],
			examples: ["todo", "ai"],
			git: "true",
			install: "true",
		},
	},
];

export type StackState = {
	projectName: string;
	frontend: string[];
	runtime: string;
	backendFramework: string;
	database: string;
	orm: string | null;
	auth: string;
	turso: string;
	prismaPostgres: string;
	packageManager: string;
	addons: string[];
	examples: string[];
	git: string;
	install: string;
};

export const DEFAULT_STACK: StackState = {
	projectName: "my-better-t-app",
	frontend: ["tanstack-router"],
	runtime: "bun",
	backendFramework: "hono",
	database: "sqlite",
	orm: "drizzle",
	auth: "true",
	turso: "false",
	prismaPostgres: "false",
	packageManager: "bun",
	addons: [],
	examples: [],
	git: "true",
	install: "true",
};
