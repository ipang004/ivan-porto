<script lang="ts">
	const categories = [
		{
			title: 'Frontend & UI',
			subtitle: '// core development & styling',
			description: 'Building modern, reactive, and responsive interfaces with component-driven architecture.',
			skills: [
				{ name: 'Svelte', slug: 'svelte' },
				{ name: 'TypeScript', slug: 'ts' },
				{ name: 'Tailwind CSS', slug: 'tailwind' },
				{ name: 'JavaScript', slug: 'js' },
				{ name: 'HTML5', slug: 'html' },
				{ name: 'CSS3', slug: 'css' }
			]
		},
		{
			title: 'Backend & Database',
			subtitle: '// server & data persistence',
			description: 'Developing structured APIs, backend logic, and scalable relational databases.',
			skills: [
				{ name: 'PHP', slug: 'php' },
				{ name: 'Laravel', slug: 'laravel' },
				{ name: 'Node.js', slug: 'nodejs' },
				{ name: 'MySQL', slug: 'mysql' }
			]
		},
		{
			title: 'Tooling & Workflow',
			subtitle: '// version control & environment',
			description: 'Modern developer workflow, version control, build tools, and deployment pipelines.',
			skills: [
				{ name: 'Git', slug: 'git' },
				{ name: 'GitHub', slug: 'github' },
				{ name: 'Vite', slug: 'vite' },
				{ name: 'pnpm', slug: 'pnpm' },
				{ name: 'VS Code', slug: 'vscode' },
				{ name: 'Postman', slug: 'postman' },
				{ name: 'Vercel', slug: 'vercel' }
			]
		}
	];

	function getSkillIcon(slug: string) {
		return `https://skillicons.dev/icons?i=${slug}&theme=dark`;
	}
</script>

<section id="stack" class="relative z-20 -mt-12 md:-mt-16 bg-[#111113] rounded-t-[44px] md:rounded-t-[60px] px-6 sm:px-10 md:px-16 pt-16 pb-20 text-white shadow-2xl overflow-hidden select-none border-t border-white/10">
	<!-- Ambient Background Glows -->
	<div class="pointer-events-none absolute -left-20 top-20 w-80 h-80 rounded-full bg-[#E87A38]/10 blur-[90px]" aria-hidden="true"></div>
	<div class="pointer-events-none absolute -right-20 bottom-10 w-96 h-96 rounded-full bg-amber-600/10 blur-[100px]" aria-hidden="true"></div>

	<div class="max-w-6xl mx-auto relative z-10">
		<!-- Section Header -->
		<div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
			<div>
				<span class="text-xs font-mono tracking-widest text-[#E87A38] uppercase block mb-2">// core technologies</span>
				<h2 class="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
					Tech <span class="text-[#E87A38]">Stack</span>
				</h2>
			</div>
			<p class="max-w-md text-xs sm:text-sm text-neutral-400 leading-relaxed">
				Languages, frameworks, databases, and developer tooling I use to build scalable web applications.
			</p>
		</div>

		<!-- 3 Cards Grid -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
			{#each categories as category}
				<div class="group relative rounded-3xl bg-white/[0.03] border border-white/10 p-6 sm:p-7 flex flex-col justify-between overflow-hidden hover:border-[#E87A38]/60 hover:bg-white/[0.05] transition-all duration-300 min-h-[380px] md:min-h-[420px] shadow-xl">
					<!-- Card Header -->
					<div>
						<span class="text-[11px] font-mono text-[#E87A38] block mb-1.5">{category.subtitle}</span>
						<h3 class="text-2xl font-bold text-white group-hover:text-[#E87A38] transition-colors mb-2">
							{category.title}
						</h3>
						<p class="text-xs text-neutral-400 leading-relaxed mb-6">
							{category.description}
						</p>

						<!-- Skills Grid List -->
						<div class="flex flex-wrap gap-2">
							{#each category.skills as skill}
								<div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 text-xs font-medium text-neutral-200 group-hover:border-white/20 transition-colors">
									<img src={getSkillIcon(skill.slug)} alt={skill.name} class="w-4 h-4 object-contain" loading="lazy" />
									<span>{skill.name}</span>
								</div>
							{/each}
						</div>
					</div>

					<!-- Bottom Footer with Action Button -->
					<div class="flex items-center justify-between pt-6 mt-6 border-t border-white/[0.08]">
						<span class="text-xs font-mono text-neutral-500 group-hover:text-neutral-300 transition-colors">
							{category.skills.length} Technologies
						</span>

						<!-- Floating Arrow Button -->
						<div class="w-12 h-12 rounded-full bg-[#18181B] border border-white/15 flex items-center justify-center text-white text-base font-bold group-hover:bg-[#E87A38] group-hover:border-[#E87A38] group-hover:scale-105 transition-all duration-300 shadow-xl shrink-0">
							↗
						</div>
					</div>
				</div>
			{/each}
		</div>

		<!-- Pagination Indicator -->
		<div class="flex items-center justify-center gap-2 mt-12" aria-hidden="true">
			<span class="w-8 h-2 rounded-full bg-[#E87A38]"></span>
			<span class="w-2 h-2 rounded-full bg-neutral-600"></span>
			<span class="w-2 h-2 rounded-full bg-neutral-600"></span>
			<span class="w-2 h-2 rounded-full bg-neutral-600"></span>
		</div>
	</div>
</section>
