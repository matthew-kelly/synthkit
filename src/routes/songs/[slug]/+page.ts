import { redirect } from '@sveltejs/kit';

export const load = ({ params }) => {
	let id: number;
	if (!isNaN(Number(params.slug))) {
		id = Number(params.slug);
	} else {
		throw redirect(307, '/songs');
	}

	return {
		id,
	};
};

export const ssr = false;
