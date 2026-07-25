export type Profile = {
	name: string;
	role: string;
	focus: string;
	location: string;
	status: string;
};

export type Project = {
	name: string;
	description: string;    // short — shown on card
	detail?: string;        // longer — shown in modal
	tags: string[];
	stackIcons: string[];   // skillicons.dev slugs
	image?: string;         // cover image for card
	images?: string[];      // gallery images for modal
	environment?: string;   // e.g. "Staging Dev", "Live App"
	href: string;
};

export type StackGroup = {
	group: string;
	items: {
		name: string;
		note: string;
	}[];
};

export type NavItem = {
	id: string;
	label: string;
};

export type Credential = {
	title: string;
	issuer: string;
	date: string;
	image: string;
	category: 'award' | 'certificate' | 'pkl';
	description?: string;
};
