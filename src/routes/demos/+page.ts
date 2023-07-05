export const load = () => {
	// TODO: add demos
	const demos = [
		{
			title: 'Hey Jude - The Beatles',
			slug: 'heyjude',
		},
		{
			title: '15 Step - Radiohead (drums)',
			slug: '15step',
		},
	];

	return {
		title: 'Demo songs',
		demos,
	};
};
