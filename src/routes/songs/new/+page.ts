import { db, type Drums, type Melody } from '$db/db';
import { synth_options_default } from '$db/stores';
import { redirect } from '@sveltejs/kit';
import type * as Tone from 'tone';

export const load = async () => {
	const initial_length = 16;
	const title = 'New Song';
	const melody: Melody = Array(initial_length).fill([]);
	const drums: Drums = Array(initial_length).fill([]);
	const current_drumkit = 'TR808';
	const bpm: Tone.Unit.BPM = 80;

	const new_id = await db.songs.add({
		title,
		melody,
		drums,
		options: {
			bpm,
			drumkit: current_drumkit,
			synth: synth_options_default,
		},
	});
	await db.songs.update(new_id, { title: `New Song ${new_id}` });
	throw redirect(303, `/songs/${new_id}`);
};

export const ssr = false;
