"use client";

import {
	DEFAULT_STACK,
	PRESET_TEMPLATES,
	type StackState,
	TECH_OPTIONS,
} from "@/lib/constant";
import { motion } from "framer-motion";
import {
	Check,
	Circle,
	CircleCheck,
	ClipboardCopy,
	HelpCircle,
	InfoIcon,
	RefreshCw,
	Settings,
	Star,
	Terminal,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const validateProjectName = (name: string): string | undefined => {
	const INVALID_CHARS = ["<", ">", ":", '"', "|", "?", "*"];
	const MAX_LENGTH = 255;

	if (name === ".") return undefined;

	if (!name) return "Project name cannot be empty";
	if (name.length > MAX_LENGTH) {
		return `Project name must be less than ${MAX_LENGTH} characters`;
	}
	if (INVALID_CHARS.some((char) => name.includes(char))) {
		return "Project name contains invalid characters";
	}
	if (name.startsWith(".") || name.startsWith("-")) {
		return "Project name cannot start with a dot or dash";
	}
	if (
		name.toLowerCase() === "node_modules" ||
		name.toLowerCase() === "favicon.ico"
	) {
		return "Project name is reserved";
	}
	return undefined;
};

const StackArchitect = () => {
	const [stack, setStack] = useState<StackState>(DEFAULT_STACK);
	const [command, setCommand] = useState(
		"npx create-better-t-stack@latest my-better-t-app --yes",
	);
	const [activeTab, setActiveTab] = useState("frontend");
	const [copied, setCopied] = useState(false);
	const [compatNotes, setCompatNotes] = useState<Record<string, string[]>>({});
	const [projectNameError, setProjectNameError] = useState<string | undefined>(
		undefined,
	);
	const [showPresets, setShowPresets] = useState(false);
	const [showHelp, setShowHelp] = useState(false);
	const [lastSavedStack, setLastSavedStack] = useState<StackState | null>(null);

	useEffect(() => {
		const savedStack = localStorage.getItem("betterTStackPreference");
		if (savedStack) {
			try {
				const parsedStack = JSON.parse(savedStack);
				setLastSavedStack(parsedStack);
			} catch (e) {
				console.error("Failed to parse saved stack", e);
			}
		}
	}, []);

	useEffect(() => {
		if (stack.database === "none" && stack.orm !== "none") {
			setStack((prev) => ({ ...prev, orm: "none" }));
		}

		if (stack.database !== "postgres" || stack.orm !== "prisma") {
			if (stack.prismaPostgres === "true") {
				setStack((prev) => ({ ...prev, prismaPostgres: "false" }));
			}
		}

		if (stack.database !== "sqlite" || stack.orm === "prisma") {
			if (stack.turso === "true") {
				setStack((prev) => ({ ...prev, turso: "false" }));
			}
		}

		if (stack.database === "none" && stack.auth === "true") {
			setStack((prev) => ({ ...prev, auth: "false" }));
		}
	}, [
		stack.database,
		stack.orm,
		stack.prismaPostgres,
		stack.turso,
		stack.auth,
	]);

	useEffect(() => {
		const cmd = generateCommand(stack);
		setCommand(cmd);

		const notes: Record<string, string[]> = {};
		const hasWebFrontend =
			stack.frontend.includes("tanstack-router") ||
			stack.frontend.includes("react-router");

		notes.frontend = [];

		notes.addons = [];
		if (!hasWebFrontend) {
			notes.addons.push("PWA and Tauri are only available with React Web.");
		}

		notes.database = [];

		notes.orm = [];
		if (stack.database === "none") {
			notes.orm.push(
				"ORM options are only available when a database is selected.",
			);
		}

		notes.auth = [];
		if (stack.database === "none") {
			notes.auth.push("Authentication requires a database.");
		}

		notes.turso = [];
		if (stack.database !== "sqlite") {
			notes.turso.push(
				"Turso integration is only available with SQLite database.",
			);
		}
		if (stack.orm === "prisma") {
			notes.turso.push("Turso is not compatible with Prisma ORM.");
		}

		notes.prismaPostgres = [];
		if (stack.database !== "postgres" || stack.orm !== "prisma") {
			notes.prismaPostgres.push(
				"Prisma PostgreSQL setup requires PostgreSQL database with Prisma ORM.",
			);
		}

		notes.examples = [];
		if (!hasWebFrontend) {
			notes.examples.push(
				"Todo and AI examples are only available with React Web.",
			);
		}
		if (stack.backendFramework === "elysia") {
			notes.examples.push("AI example is only compatible with Hono backend.");
		}

		setCompatNotes(notes);
	}, [stack]);

	const generateCommand = useCallback((stackState: StackState) => {
		let base: string;
		if (stackState.packageManager === "npm") {
			base = "npx create-better-t-stack@latest";
		} else if (stackState.packageManager === "pnpm") {
			base = "pnpm create better-t-stack@latest";
		} else {
			base = "bun create better-t-stack@latest";
		}

		const projectName = stackState.projectName || "my-better-t-app";
		const flags: string[] = ["--yes"];

		if (stackState.frontend.length === 1 && stackState.frontend[0] === "none") {
			flags.push("--frontend none");
		} else if (
			!(
				stackState.frontend.length === 1 &&
				stackState.frontend[0] === "tanstack-router"
			)
		) {
			flags.push(`--frontend ${stackState.frontend.join(" ")}`);
		}

		if (stackState.database !== "sqlite") {
			flags.push(`--database ${stackState.database}`);
		}

		if (stackState.database !== "none" && stackState.orm !== "drizzle") {
			flags.push(`--orm ${stackState.orm}`);
		}

		if (stackState.auth === "false") {
			flags.push("--no-auth");
		}

		if (stackState.turso === "true") {
			flags.push("--turso");
		}

		if (stackState.prismaPostgres === "true") {
			flags.push("--prisma-postgres");
		}

		if (stackState.backendFramework !== "hono") {
			flags.push(`--backend ${stackState.backendFramework}`);
		}

		if (stackState.runtime !== "bun") {
			flags.push(`--runtime ${stackState.runtime}`);
		}

		if (stackState.packageManager !== "bun") {
			flags.push(`--package-manager ${stackState.packageManager}`);
		}

		if (stackState.git === "false") {
			flags.push("--no-git");
		}

		if (stackState.install === "false") {
			flags.push("--no-install");
		}

		if (stackState.addons.length > 0) {
			flags.push(`--addons ${stackState.addons.join(" ")}`);
		}

		if (stackState.examples.length > 0) {
			flags.push(`--examples ${stackState.examples.join(" ")}`);
		}

		return `${base} ${projectName} ${flags.join(" ")}`;
	}, []);

	const handleTechSelect = useCallback(
		(category: keyof typeof TECH_OPTIONS, techId: string) => {
			setStack((prev) => {
				if (category === "frontend") {
					const currentSelection = [...prev.frontend];
					const webTypes = ["tanstack-router", "react-router"];

					if (techId === "none") {
						return {
							...prev,
							frontend: ["none"],
							examples: [],
							addons: prev.addons.filter(
								(addon) => addon !== "pwa" && addon !== "tauri",
							),
						};
					}

					if (currentSelection.includes(techId)) {
						if (currentSelection.length === 1) {
							return prev;
						}

						return {
							...prev,
							frontend: currentSelection.filter((id) => id !== techId),
						};
					}

					let newSelection = [...currentSelection];

					if (newSelection.includes("none")) {
						newSelection = [];
					}

					if (webTypes.includes(techId)) {
						newSelection = newSelection.filter((id) => !webTypes.includes(id));
					}

					newSelection.push(techId);

					return {
						...prev,
						frontend: newSelection,
					};
				}

				if (category === "addons" || category === "examples") {
					const currentArray = [...(prev[category] || [])];
					const index = currentArray.indexOf(techId);
					const hasWebFrontend =
						prev.frontend.includes("tanstack-router") ||
						prev.frontend.includes("react-router");

					if (index >= 0) {
						currentArray.splice(index, 1);
					} else {
						if (
							category === "examples" &&
							(techId === "todo" || techId === "ai") &&
							!hasWebFrontend
						) {
							return prev;
						}

						if (
							category === "examples" &&
							techId === "ai" &&
							prev.backendFramework === "elysia"
						) {
							return prev;
						}

						if (
							category === "addons" &&
							(techId === "pwa" || techId === "tauri") &&
							!hasWebFrontend
						) {
							return prev;
						}

						if (
							category === "addons" &&
							techId === "husky" &&
							!currentArray.includes("biome")
						) {
							currentArray.push("biome");
						}

						currentArray.push(techId);
					}

					return {
						...prev,
						[category]: currentArray,
					};
				}

				if (category === "database") {
					if (techId === "none") {
						return {
							...prev,
							database: techId,
							orm: "none",
							turso: "false",
							prismaPostgres: "false",
							auth: "false",
						};
					}

					if (prev.database === "none") {
						return {
							...prev,
							database: techId,
							orm: "drizzle",
							turso: techId === "sqlite" ? prev.turso : "false",
							prismaPostgres:
								techId === "postgres" && prev.orm === "prisma"
									? prev.prismaPostgres
									: "false",
							auth:
								hasWebFrontend(prev.frontend) ||
								prev.frontend.includes("native")
									? "true"
									: "false",
						};
					}

					const updatedState = {
						...prev,
						database: techId,
					};

					if (techId === "sqlite") {
						updatedState.prismaPostgres = "false";
					} else if (techId === "postgres" && prev.orm === "prisma") {
					} else {
						updatedState.turso = "false";
					}

					return updatedState;
				}

				if (category === "orm") {
					if (prev.database === "none") {
						return prev;
					}

					const updatedState = {
						...prev,
						orm: techId,
					};

					if (techId === "prisma") {
						updatedState.turso = "false";
						if (prev.database === "postgres") {
						} else {
							updatedState.prismaPostgres = "false";
						}
					} else if (techId === "drizzle" || techId === "none") {
						updatedState.prismaPostgres = "false";
					}

					return updatedState;
				}

				if (
					category === "turso" &&
					(prev.database !== "sqlite" || prev.orm === "prisma")
				) {
					return prev;
				}

				if (
					category === "prismaPostgres" &&
					(prev.database !== "postgres" || prev.orm !== "prisma")
				) {
					return prev;
				}

				if (
					category === "auth" &&
					prev.database === "none" &&
					techId === "true"
				) {
					return prev;
				}

				return {
					...prev,
					[category]: techId,
				};
			});
		},
		[],
	);

	const hasWebFrontend = useCallback((frontendOptions: string[]) => {
		return (
			frontendOptions.includes("tanstack-router") ||
			frontendOptions.includes("react-router") ||
			frontendOptions.includes("native")
		);
	}, []);

	const copyToClipboard = useCallback(() => {
		navigator.clipboard.writeText(command);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	}, [command]);

	const resetStack = useCallback(() => {
		setStack(DEFAULT_STACK);
		setActiveTab("frontend");
	}, []);

	const saveCurrentStack = useCallback(() => {
		localStorage.setItem("betterTStackPreference", JSON.stringify(stack));
		setLastSavedStack(stack);
		const saveMessage = document.createElement("div");
		saveMessage.textContent = "Stack preferences saved!";
		saveMessage.className =
			"fixed bottom-4 right-4 bg-green-500 text-white py-2 px-4 rounded-md shadow-lg z-50";
		document.body.appendChild(saveMessage);
		setTimeout(() => {
			document.body.removeChild(saveMessage);
		}, 3000);
	}, [stack]);

	const loadSavedStack = useCallback(() => {
		if (lastSavedStack) {
			setStack(lastSavedStack);
		}
	}, [lastSavedStack]);

	const applyPreset = useCallback((presetId: string) => {
		const preset = PRESET_TEMPLATES.find(
			(template) => template.id === presetId,
		);
		if (preset) {
			setStack(preset.stack);
			setShowPresets(false);
		}
	}, []);

	return (
		<div className="mx-auto w-full">
			<div className="overflow-hidden rounded-xl border border-gray-300 bg-gray-100 text-gray-800 shadow-xl dark:border-gray-700 dark:bg-gray-900 dark:text-white">
				<div className="flex items-center justify-between bg-gray-200 px-4 py-2 dark:bg-gray-800">
					<div className="flex space-x-2">
						<div className="h-3 w-3 rounded-full bg-red-500" />
						<div className="h-3 w-3 rounded-full bg-yellow-500" />
						<div className="h-3 w-3 rounded-full bg-green-500" />
					</div>
					<div className="font-mono text-gray-600 text-xs dark:text-gray-400">
						Stack Architect Terminal
					</div>
					<div className="flex space-x-2">
						<button
							type="button"
							onClick={() => setShowHelp(!showHelp)}
							className="text-gray-600 transition-colors hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
							title="Help"
						>
							<HelpCircle className="h-4 w-4" />
						</button>
						<button
							type="button"
							onClick={() => setShowPresets(!showPresets)}
							className="text-gray-600 transition-colors hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
							title="Presets"
						>
							<Star className="h-4 w-4" />
						</button>
						<button
							type="button"
							onClick={copyToClipboard}
							className="text-gray-600 transition-colors hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
							title="Copy command"
						>
							{copied ? (
								<Check className="h-4 w-4" />
							) : (
								<ClipboardCopy className="h-4 w-4" />
							)}
						</button>
					</div>
				</div>

				{showHelp && (
					<div className="border-gray-300 border-b bg-blue-50 p-4 dark:border-gray-700 dark:bg-blue-900/20">
						<h3 className="mb-2 font-medium text-blue-800 dark:text-blue-300">
							How to Use Stack Architect
						</h3>
						<ul className="list-disc space-y-1 pl-5 text-blue-700 text-sm dark:text-blue-400">
							<li>
								Select your preferred technologies from each category using the
								tabs below
							</li>
							<li>
								The command will automatically update based on your selections
							</li>
							<li>
								Click the copy button to copy the command to your clipboard
							</li>
							<li>
								You can reset to defaults or choose from presets for quick setup
							</li>
							<li>Save your preferences to load them later when you return</li>
						</ul>
					</div>
				)}

				{showPresets && (
					<div className="border-gray-300 border-b bg-amber-50 p-4 dark:border-gray-700 dark:bg-amber-900/20">
						<h3 className="mb-2 font-medium text-amber-800 dark:text-amber-300">
							Quick Start Presets
						</h3>
						<div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
							{PRESET_TEMPLATES.map((preset) => (
								<button
									type="button"
									key={preset.id}
									onClick={() => applyPreset(preset.id)}
									className="rounded border border-amber-200 p-2 text-left transition-colors hover:bg-amber-100 dark:border-amber-700 dark:hover:bg-amber-800/30"
								>
									<div className="font-medium text-amber-700 dark:text-amber-300">
										{preset.name}
									</div>
									<div className="text-amber-600 text-xs dark:text-amber-400">
										{preset.description}
									</div>
								</button>
							))}
						</div>
					</div>
				)}

				<div className="p-4 font-mono">
					<div className="mb-4 flex items-start justify-between">
						<label className="flex flex-col">
							<span className="mb-1 text-gray-600 text-xs dark:text-gray-400">
								Project Name:
							</span>
							<div className="flex items-center">
								<input
									type="text"
									value={stack.projectName || ""}
									onChange={(e) => {
										const newValue = e.target.value;
										setStack((prev) => ({ ...prev, projectName: newValue }));
										setProjectNameError(validateProjectName(newValue));
									}}
									className={`border bg-gray-200 dark:bg-gray-800 ${
										projectNameError
											? "border-red-500 dark:border-red-500"
											: "border-gray-300 dark:border-gray-700"
									} rounded px-2 py-1 font-mono text-sm focus:border-blue-500 focus:outline-none dark:focus:border-blue-400`}
									placeholder="my-better-t-app"
								/>
							</div>
							{projectNameError && (
								<p className="mt-1 text-red-500 text-xs">{projectNameError}</p>
							)}
						</label>

						<div className="flex gap-2">
							<button
								type="button"
								onClick={resetStack}
								className="flex items-center gap-1 rounded border border-gray-300 bg-gray-200 px-2 py-1 text-gray-700 text-xs hover:bg-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
								title="Reset to defaults"
							>
								<RefreshCw className="h-3 w-3" />
								Reset
							</button>

							{lastSavedStack && (
								<button
									type="button"
									onClick={loadSavedStack}
									className="flex items-center gap-1 rounded border border-blue-300 bg-blue-100 px-2 py-1 text-blue-700 text-xs hover:bg-blue-200 dark:border-blue-700 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-800/50"
									title="Load saved preferences"
								>
									<Settings className="h-3 w-3" />
									Load Saved
								</button>
							)}

							<button
								type="button"
								onClick={saveCurrentStack}
								className="flex items-center gap-1 rounded border border-green-300 bg-green-100 px-2 py-1 text-green-700 text-xs hover:bg-green-200 dark:border-green-700 dark:bg-green-900/50 dark:text-green-300 dark:hover:bg-green-800/50"
								title="Save current preferences"
							>
								<Star className="h-3 w-3" />
								Save
							</button>
						</div>
					</div>
					<div className="mb-4">
						<div className="flex">
							<span className="mr-2 text-green-600 dark:text-green-400">$</span>
							<code className="text-gray-700 dark:text-gray-300">
								{command}
							</code>
						</div>
					</div>
					{compatNotes[activeTab] && compatNotes[activeTab].length > 0 && (
						<div className="mb-4 rounded-md border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
							<div className="mb-2 flex items-center gap-2 font-medium text-blue-800 text-sm dark:text-blue-300">
								<InfoIcon className="h-4 w-4" />
								<span>Compatibility Notes</span>
							</div>
							<ul className="list-inside list-disc space-y-1 text-blue-700 text-xs dark:text-blue-400">
								{compatNotes[activeTab].map((note) => (
									<li key={note}>{note}</li>
								))}
							</ul>
						</div>
					)}
					<div className="border-gray-300 border-t pt-4 dark:border-gray-700">
						<div className="mb-3 flex items-center text-gray-600 dark:text-gray-400">
							<Terminal className="mr-2 h-4 w-4" />
							<span>
								Configure{" "}
								{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
							</span>
						</div>

						<div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
							{TECH_OPTIONS[activeTab as keyof typeof TECH_OPTIONS].map(
								(tech) => {
									let isSelected = false;
									if (activeTab === "addons" || activeTab === "examples") {
										isSelected = stack[activeTab].includes(tech.id);
									} else if (activeTab === "frontend") {
										isSelected = stack.frontend.includes(tech.id);
									} else {
										isSelected =
											stack[activeTab as keyof StackState] === tech.id;
									}

									const hasWebFrontendSelected =
										stack.frontend.includes("tanstack-router") ||
										stack.frontend.includes("react-router");

									const isDisabled =
										(activeTab === "orm" && stack.database === "none") ||
										(activeTab === "turso" &&
											(stack.database !== "sqlite" ||
												stack.orm === "prisma")) ||
										(activeTab === "prismaPostgres" &&
											(stack.database !== "postgres" ||
												stack.orm !== "prisma")) ||
										(activeTab === "examples" &&
											(((tech.id === "todo" || tech.id === "ai") &&
												!hasWebFrontendSelected) ||
												(tech.id === "ai" &&
													stack.backendFramework === "elysia"))) ||
										(activeTab === "addons" &&
											(tech.id === "pwa" || tech.id === "tauri") &&
											!hasWebFrontendSelected) ||
										(activeTab === "auth" &&
											tech.id === "true" &&
											stack.database === "none");

									const compatNote = isDisabled
										? compatNotes[activeTab]?.find((note) =>
												note.toLowerCase().includes(tech.name.toLowerCase()),
											)
										: null;

									return (
										<motion.div
											key={tech.id}
											className={`rounded p-2 px-3${
												isDisabled
													? " cursor-not-allowed opacity-50"
													: " cursor-pointer"
											}
                        ${
													isSelected
														? "border border-blue-300 bg-blue-100 dark:border-blue-500/50 dark:bg-blue-900/40"
														: "border border-gray-300 hover:bg-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
												}
                      `}
											title={
												isDisabled
													? compatNote ||
														"Option not available with current selection"
													: tech.description
											}
											whileHover={!isDisabled ? { scale: 1.02 } : undefined}
											whileTap={!isDisabled ? { scale: 0.98 } : undefined}
											onClick={() =>
												!isDisabled &&
												handleTechSelect(
													activeTab as keyof typeof TECH_OPTIONS,
													tech.id,
												)
											}
										>
											<div className="flex items-center">
												<div className="mr-2 flex-shrink-0">
													{isSelected ? (
														<CircleCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
													) : (
														<Circle className="h-4 w-4 text-gray-400 dark:text-gray-600" />
													)}
												</div>
												<div className="flex-grow">
													<div className="flex items-center">
														<span className="mr-2">{tech.icon}</span>
														<span
															className={
																isSelected
																	? "text-blue-700 dark:text-blue-300"
																	: "text-gray-700 dark:text-gray-300"
															}
														>
															{tech.name}
														</span>
													</div>
													<p className="text-gray-500 text-xs">
														{tech.description}
													</p>
												</div>
												{tech.default && !isSelected && (
													<span className="ml-2 text-gray-500 text-xs dark:text-gray-600">
														Default
													</span>
												)}
											</div>
										</motion.div>
									);
								},
							)}
						</div>

						<div className="mb-3 border-gray-300 border-t pt-3 dark:border-gray-700">
							<div className="mb-2 flex items-center justify-between">
								<div className="text-gray-600 text-xs dark:text-gray-400">
									Selected Stack
								</div>
								<button
									type="button"
									onClick={() => {
										alert(
											// biome-ignore lint/style/useTemplate: <explanation>
											"Stack Summary:\n\n" +
												Object.entries(stack)
													.map(([key, value]) => {
														if (Array.isArray(value)) {
															return `${key}: ${value.join(", ") || "none"}`;
														}
														return `${key}: ${value || "none"}`;
													})
													.join("\n"),
										);
									}}
									className="text-blue-600 text-xs hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
								>
									Full Summary
								</button>
							</div>
							<div className="flex flex-wrap gap-1">
								{stack.frontend.map((frontendId) => {
									const frontend = TECH_OPTIONS.frontend.find(
										(f) => f.id === frontendId,
									);
									return frontend ? (
										<span
											key={frontendId}
											className="inline-flex items-center rounded border border-blue-300 bg-blue-100 px-1.5 py-0.5 text-blue-800 text-xs dark:border-blue-700/30 dark:bg-blue-900/30 dark:text-blue-300"
										>
											{frontend.icon} {frontend.name}
										</span>
									) : null;
								})}
								<span className="inline-flex items-center rounded border border-amber-300 bg-amber-100 px-1.5 py-0.5 text-amber-800 text-xs dark:border-amber-700/30 dark:bg-amber-900/30 dark:text-amber-300">
									{
										TECH_OPTIONS.runtime.find((t) => t.id === stack.runtime)
											?.icon
									}{" "}
									{
										TECH_OPTIONS.runtime.find((t) => t.id === stack.runtime)
											?.name
									}
								</span>

								<span className="inline-flex items-center rounded border border-blue-300 bg-blue-100 px-1.5 py-0.5 text-blue-800 text-xs dark:border-blue-700/30 dark:bg-blue-900/30 dark:text-blue-300">
									{
										TECH_OPTIONS.backendFramework.find(
											(t) => t.id === stack.backendFramework,
										)?.icon
									}{" "}
									{
										TECH_OPTIONS.backendFramework.find(
											(t) => t.id === stack.backendFramework,
										)?.name
									}
								</span>

								<span className="inline-flex items-center rounded border border-indigo-300 bg-indigo-100 px-1.5 py-0.5 text-indigo-800 text-xs dark:border-indigo-700/30 dark:bg-indigo-900/30 dark:text-indigo-300">
									{
										TECH_OPTIONS.database.find((t) => t.id === stack.database)
											?.icon
									}{" "}
									{
										TECH_OPTIONS.database.find((t) => t.id === stack.database)
											?.name
									}
								</span>

								{stack.orm && stack.database !== "none" && (
									<span className="inline-flex items-center rounded border border-cyan-300 bg-cyan-100 px-1.5 py-0.5 text-cyan-800 text-xs dark:border-cyan-700/30 dark:bg-cyan-900/30 dark:text-cyan-300">
										{TECH_OPTIONS.orm.find((t) => t.id === stack.orm)?.icon}{" "}
										{TECH_OPTIONS.orm.find((t) => t.id === stack.orm)?.name}
									</span>
								)}

								{stack.frontend[0] !== "none" &&
									stack.database !== "none" &&
									stack.auth === "true" && (
										<span className="inline-flex items-center rounded border border-green-300 bg-green-100 px-1.5 py-0.5 text-green-800 text-xs dark:border-green-700/30 dark:bg-green-900/30 dark:text-green-300">
											{TECH_OPTIONS.auth.find((t) => t.id === "true")?.icon}{" "}
											{TECH_OPTIONS.auth.find((t) => t.id === "true")?.name}
										</span>
									)}

								{stack.turso === "true" &&
									stack.database === "sqlite" &&
									stack.orm !== "prisma" && (
										<span className="inline-flex items-center rounded border border-pink-300 bg-pink-100 px-1.5 py-0.5 text-pink-800 text-xs dark:border-pink-700/30 dark:bg-pink-900/30 dark:text-pink-300">
											{
												TECH_OPTIONS.turso.find((t) => t.id === stack.turso)
													?.icon
											}{" "}
											{
												TECH_OPTIONS.turso.find((t) => t.id === stack.turso)
													?.name
											}
										</span>
									)}

								{stack.prismaPostgres === "true" &&
									stack.database === "postgres" &&
									stack.orm === "prisma" && (
										<span className="inline-flex items-center rounded border border-indigo-300 bg-indigo-100 px-1.5 py-0.5 text-indigo-800 text-xs dark:border-indigo-700/30 dark:bg-indigo-900/30 dark:text-indigo-300">
											{
												TECH_OPTIONS.prismaPostgres.find(
													(t) => t.id === stack.prismaPostgres,
												)?.icon
											}{" "}
											{
												TECH_OPTIONS.prismaPostgres.find(
													(t) => t.id === stack.prismaPostgres,
												)?.name
											}
										</span>
									)}

								{stack.addons.map((addonId) => {
									const addon = TECH_OPTIONS.addons.find(
										(a) => a.id === addonId,
									);
									return addon ? (
										<span
											key={addonId}
											className="inline-flex items-center rounded border border-violet-300 bg-violet-100 px-1.5 py-0.5 text-violet-800 text-xs dark:border-violet-700/30 dark:bg-violet-900/30 dark:text-violet-300"
										>
											{addon.icon} {addon.name}
										</span>
									) : null;
								})}

								{stack.examples.length > 0 &&
									stack.examples.map((exampleId) => {
										const example = TECH_OPTIONS.examples.find(
											(e) => e.id === exampleId,
										);
										return example ? (
											<span
												key={exampleId}
												className="inline-flex items-center rounded border border-teal-300 bg-teal-100 px-1.5 py-0.5 text-teal-800 text-xs dark:border-teal-700/30 dark:bg-teal-900/30 dark:text-teal-300"
											>
												{example.icon} {example.name}
											</span>
										) : null;
									})}
							</div>
						</div>
					</div>
				</div>
				<div className="flex overflow-x-auto border-gray-300 border-t bg-gray-200 dark:border-gray-700 dark:bg-gray-900">
					{Object.keys(TECH_OPTIONS).map((category) => (
						<button
							type="button"
							key={category}
							className={`whitespace-nowrap px-4 py-2 font-mono text-xs transition-colors${
								activeTab === category
									? " border-blue-500 border-t-2 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
									: " text-gray-600 hover:bg-gray-300 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
							}
              `}
							onClick={() => setActiveTab(category)}
						>
							{category}
						</button>
					))}
				</div>
			</div>
		</div>
	);
};

export default StackArchitect;
