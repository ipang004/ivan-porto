export type MilestoneType = 'education' | 'internship' | 'work';

export interface Milestone {
	type: MilestoneType;
	title: string;
	subtitle: string;
	place: string;
	period: string;
	description: string;
	photo: string;
	backDesc: string;
}

export const journey: Milestone[] = [
	{
		type: 'education',
		title: 'Vocational High School',
		subtitle: 'Software Engineering Major',
		place: 'SMKN 17 Jakarta',
		period: 'July 2023 — June 2026',
		description: 'Completed a three-year vocational program in Software Engineering, with a focus on web development, databases, and software development fundamentals. Actively participated in the Web Technologies category of the Vocational High School Skills Competition (LKS) and various school projects.',
		photo: '/photos/education.jpeg',
		backDesc: 'Ivan Maldini · SMKN 17 Jakarta, Software Engineering'
	},
	{
		type: 'internship',
		title: 'School Internship Program',
		subtitle: 'Web Developer Intern',
		place: 'PT Yapindo Jaya Abadi',
		period: 'December 2025 — May 2026',
		description: 'Completed a web development internship with a focus on frontend development and operational support. Built several internal web applications from scratch, created UI/UX design assets in Figma, and supported system data management to ensure accuracy.',
		photo: '/certificate/PKL.png',
		backDesc: 'Ivan Maldini · Web Developer Intern @ PT Yapindo Jaya Abadi'
	},
	{
		type: 'work',
		title: 'Frontend Developer',
		subtitle: 'Working as a Frontend Developer',
		place: 'PT Yapindo Jaya Abadi',
		period: 'June 2026 — Present',
		description: 'Joined the company as a Frontend Developer after completing the internship. Contributed to building new web applications from scratch, refactoring existing code to improve maintainability and performance, and collaborating with cross-functional teams to develop and maintain production features.',
		photo: '/photos/work.jpeg',
		backDesc: 'Ivan Maldini · Frontend Developer @ PT Yapindo Jaya Abadi'
	}
];

export const colorMap: Record<MilestoneType, { dot: string; badge: string; icon: string }> = {
	education: {
		dot: 'bg-primary shadow-[0_0_12px_3px_var(--color-primary)]',
		badge: 'bg-primary/10 text-primary border-primary/30',
		icon: 'bg-primary/10 border-primary/20'
	},
	internship: {
		dot: 'bg-secondary shadow-[0_0_12px_3px_var(--color-secondary)]',
		badge: 'bg-secondary/10 text-secondary border-secondary/30',
		icon: 'bg-secondary/10 border-secondary/20'
	},
	work: {
		dot: 'bg-accent shadow-[0_0_12px_3px_var(--color-accent)]',
		badge: 'bg-accent/10 text-accent border-accent/30',
		icon: 'bg-accent/10 border-accent/20'
	}
};
