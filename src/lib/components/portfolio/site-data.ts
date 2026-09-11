import type { NavItem, Profile, Project, StackGroup, Credential } from './types';

export const profile: Profile = {
	name: 'Ivan Maldini',
	role: 'Frontend Developer',
	focus: 'SvelteKit & TypeScript',
	location: 'Jakarta, ID',
	status: 'work_in_company'
};

export const projects: Project[] = [
	{
		name: 'BKKBN - Orang Tua Hebat',
		description:
			'An official parenting education platform by BKKBN that helps parents support early childhood development through practical guidance, interactive learning materials, and expert consultation.',
		detail:
			'An official parenting education platform by BKKBN designed to help Indonesian parents support their children’s growth and development while contributing to stunting prevention. The platform provides access to educational articles, instructional videos, expert consultations, and interactive 3D flipbook guides, making trusted parenting resources more accessible in one place.',
		tags: ['php', 'wordpress', 'javascript', 'tailwind'],
		stackIcons: ['php', 'wordpress', 'javascript', 'tailwind'],
		image: '/projects/bkkbn/cover.png',
		images: [
			'/projects/bkkbn/cover.png'
		],
		environment: 'Live Site',
		href: 'https://www.orangtuahebat.id/'
	},
	{
		name: 'Yapscholn',
		description:
			'A national academic collaboration platform connecting lecturers, students, researchers, and professionals to support research, publications, and community engagement.',
		detail:
			'An academic collaboration platform that brings together lecturers, students, researchers, and professionals across Indonesia. It supports collaborative research, scientific publications, community engagement programs, academic memberships, and multilingual content to encourage wider collaboration between institutions.',
		tags: ['php', 'wordpress', 'javascript', 'tailwind'],
		stackIcons: ['php', 'wordpress', 'javascript', 'tailwind'],
		image: '/projects/yapscholn/cover.png',
		images: [
			'/projects/yapscholn/cover.png'
		],
		environment: 'Live Site',
		href: 'https://yapscholn.com/'
	},
	{
		name: 'Cipta Digital Edukasi',
		description:
			'An academic publishing platform that helps readers discover books while supporting authors in publishing their work through an official publisher.',
		detail:
			'An academic publishing platform under Cipta Digital Edukasi that allows readers to explore book collections, read summaries, verify ISBN and intellectual property information, and connect directly with the publisher through WhatsApp for publishing consultations.',
		tags: ['SvelteKit', 'TypeScript', 'Tailwind'],
		stackIcons: ['svelte', 'typescript', 'tailwind'],
		image: '/projects/cideka/cover.webp',
		images: [
			'/projects/cideka/cover.webp'
		],
		environment: 'Refactored (Live)',
		href: 'https://cideka.com/'
	},
	{
		name: 'Repository - Multi Brands',
		description:
			'A centralized digital repository for accessing and distributing academic publications across multiple publishing brands under PT Bukuloka Literasi Bangsa.',
		detail:
			'A centralized digital repository that brings together academic publications from multiple publishing brands under PT Bukuloka Literasi Bangsa. It enables lecturers, students, and researchers to search publications, preview PDF documents instantly, and generate citation references automatically for academic use.',
		tags: ['svelte', 'typescript', 'tailwind'],
		stackIcons: ['svelte', 'typescript', 'tailwind'],
		image: '/projects/repository/cover.png',
		images: [
			'/projects/repository/cover.png'
		],
		environment: 'Live Site',
		href: 'https://books.bukuloka.com/'
	}
];

export const stack: StackGroup[] = [
	{
		group: 'core',
		items: [
			{ name: 'Svelte', note: 'Component & reactivity model' },
			{ name: 'SvelteKit', note: 'Routing, SSR, data loading' },
			{ name: 'TypeScript', note: 'Type safety di seluruh proyek' }
		]
	},
	{
		group: 'styling',
		items: [
			{ name: 'Tailwind CSS', note: 'Utility-first styling' },
			{ name: 'shadcn-svelte', note: 'Komponen UI yang bisa di-custom penuh' }
		]
	},
	{
		group: 'tooling',
		items: [
			{ name: 'Vite', note: 'Dev server & bundler' },
			{ name: 'Git', note: 'Version control' },
			{ name: 'Express', note: 'Proxy server untuk kasus khusus' }
		]
	}
];

export const credentials: Credential[] = [
	{
		title: '4th Place — Vocational High School Skills Competition (LKS), Web Technologies',
		issuer: 'West Jakarta Region II',
		date: '2025',
		image: '/certificate/LKS.jpeg',
		category: 'award',
		description: "Received the First Honorable Mention (4th Place) at the West Jakarta City-Level Vocational High School Skills Competition (LKS) in the Web Technologies category. The competition evaluated participants' skills in UI/UX design, frontend web development, and responsive backend integration."
	},
	{
		title: 'Internship - Web Developer',
		issuer: 'PT Yapindo Jaya Abadi',
		date: '2026',
		image: '/certificate/PKL.png',
		category: 'pkl',
		description: 'Completed a web development internship at PT Yapindo Jaya Abadi. Contributed to the development of web applications by fixing UI issues, implementing frontend features, creating interface designs in Figma, and supporting content and data management. Collaborated with the development team while following industry-standard development practices.'
	}
];

export const navItems: NavItem[] = [
	{ id: 'about', label: 'about.tsx' },
	{ id: 'projects', label: 'projects.tsx' },
	{ id: 'credentials', label: 'credentials.json' },
	{ id: 'journey', label: 'journey.ts' },
	{ id: 'contact', label: 'contact.ts' }
];
