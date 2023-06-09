import { db, type Song } from '$db/db';
import { synth_options_default } from '$db/stores.js';
import { redirect } from '@sveltejs/kit';

// TODO: set up demos

// hey jude - https://www.youtube.com/watch?v=NgYDdg9hZk0
const melody_heyjude = [
	// verse 1 - 1:1:1
	['C4'],
	[],
	[],
	[],
	['F3', 'F4', 'A4', 'C5'],
	[],
	[],
	[],
	['F4', 'A4', 'C5'],
	[],
	[],
	[],
	['F4', 'A4', 'C5'],
	[],
	['A4'],
	[],
	['F4', 'A4', 'C5'],
	[],
	['D5'],
	[],
	['C3', 'E4', 'C5', 'G4'],
	[],
	[],
	[],
	['E4', 'G4', 'C5'],
	[],
	[],
	[],
	['E4', 'G4', 'C5'],
	[],
	[],
	[],
	['E4', 'G4', 'C5'],
	[],
	['A4'],
	[],
	['C3', 'E4', 'G4', 'A#4', 'C5'],
	[],
	[],
	[],
	['E4', 'G4', 'A#4', 'C5', 'F5'],
	[],
	[],
	[],
	['E4', 'G4', 'A#4', 'C5'],
	[],
	['F5'],
	[],
	['E4', 'G4', 'A#4', 'C5', 'E5'],
	[],
	['C5'],
	[],
	['F3', 'F4', 'A4', 'C5', 'D5'],
	[],
	['C5'],
	['A#4'],
	['F4', 'A4', 'C5'],
	[],
	[],
	[],
	['F4', 'A4', 'C5'],
	[],
	[],
	[],
	['F4', 'A4', 'C5'],
	[],
	['C5'],
	[],
	['A#3', 'F4', 'A#4', 'D5'],
	['D5'],
	[],
	[],
	['F4', 'A#4', 'D5'],
	[],
	['D5'],
	[],
	['F4', 'A#4', 'D5', 'G5'],
	['F5'],
	[],
	['E5'],
	['F4', 'A#4', 'D5'],
	['F5'],
	['D5'],
	[],
	['F3', 'F4', 'A4', 'C5'],
	[],
	[],
	[],
	['F4', 'A4', 'C5'],
	[],
	[],
	[],
	['F4', 'A4', 'C5'],
	[],
	['A4'],
	[],
	['F4', 'A4', 'C5'],
	[],
	['D5'],
	[],
	['C3', 'E4', 'G4', 'C5'],
	[],
	[],
	[],
	['E4', 'G4', 'C5'],
	[],
	['C5'],
	[],
	['C3', 'E4', 'G4', 'A#4', 'C5'],
	[],
	['A4'],
	[],
	['E4', 'C5', 'G4'],
	[],
	['E4'],
	[],
	['F3', 'F4', 'A4', 'C5'],
	[],
	['F4'],
	[],
	['F4', 'A4', 'C5'],
	[],
	[],
	[],
	['F4', 'A4', 'C5'],
	[],
	[],
	[],
	// verse 2 - 9:2:1
	['F4', 'A4', 'C5'],
	[],
	[],
	[],
	['F3', 'F4', 'A4', 'C5'],
	[],
	[],
	[],
	['F4', 'A4', 'C5'],
	[],
	[],
	[],
	['F4', 'A4', 'C5'],
	[],
	['A4'],
	[],
	['F4', 'A4', 'C5'],
	[],
	['D5'],
	[],
	['C3', 'E4', 'C5', 'G4'],
	[],
	[],
	[],
	['E4', 'G4', 'C5'],
	[],
	[],
	[],
	['E4', 'G4', 'C5'],
	[],
	[],
	[],
	['E4', 'G4', 'C5'],
	[],
	['A4'],
	[],
	['C3', 'E4', 'G4', 'A#4', 'C5'],
	[],
	[],
	[],
	['E4', 'G4', 'A#4', 'C5', 'F5'],
	[],
	[],
	[],
	['E4', 'G4', 'A#4', 'C5'],
	[],
	['F5'],
	[],
	['E4', 'G4', 'A#4', 'C5', 'E5'],
	[],
	['C5'],
	[],
	['F3', 'F4', 'A4', 'C5', 'D5'],
	[],
	['C5'],
	['A#4'],
	['F4', 'A4', 'C5'],
	[],
	[],
	[],
	['F4', 'A4', 'C5'],
	[],
	[],
	[],
	['F4', 'A4', 'C5'],
	[],
	['C5'],
	[],
	['A#3', 'F4', 'A#4', 'D5'],
	['D5'],
	[],
	[],
	['F4', 'A#4', 'D5'],
	[],
	['D5'],
	[],
	['F4', 'A#4', 'D5', 'G5'],
	['F5'],
	[],
	['E5'],
	['F4', 'A#4', 'D5'],
	['F5'],
	['D5'],
	[],
	['F3', 'F4', 'A4', 'C5'],
	[],
	[],
	[],
	['F4', 'A4', 'C5'],
	[],
	[],
	[],
	['F4', 'A4', 'C5'],
	[],
	['A4'],
	[],
	['F4', 'A4', 'C5'],
	[],
	['D5'],
	[],
	['C3', 'E4', 'G4', 'C5'],
	[],
	[],
	[],
	['E4', 'G4', 'C5'],
	[],
	['C5'],
	[],
	['C3', 'E4', 'G4', 'A#4', 'C5'],
	[],
	['A4'],
	[],
	['E4', 'C5', 'G4'],
	[],
	['E4'],
	[],
	['F3', 'F4', 'A4', 'C5'],
	[],
	['F4'],
	[],
	['F4', 'A4', 'C5'],
	[],
	[],
	[],
	['F4', 'A4', 'C5'],
	[],
	[],
	[],
	['F4', 'A4', 'C5'],
	[],
	[],
	[],
	// bridge 1 - 17:2:1
	['F3', 'F4', 'A4', 'C5', 'D#5'],
	[],
	[],
	[],
	['F4', 'A4', 'C5', 'D#5'],
	[],
	[],
	[],
	['F4', 'A4', 'C5', 'D#5'],
	[],
	[],
	[],
	['F4', 'A4', 'C5', 'D#5'],
	[],
	[],
	[],
	['A#3', 'F4', 'A#4', 'D5'],
	[],
	[],
	[],
	['F4', 'A#4', 'D5'],
	[],
	[],
	[],
	['A3', 'F4', 'A4', 'D5'],
	[],
	[],
	[],
	['F4', 'A4', 'D5'],
	[],
	[],
	[],
	['G3', 'G4', 'A#4', 'D5'],
	[],
	[],
	[],
	['G4', 'A#4', 'D5'],
	[],
	[],
	[],
	['F3', 'F4', 'A#4', 'D5'],
	[],
	[],
	[],
	['F4', 'A#4', 'D5'],
	[],
	[],
	[],
	['C3', 'E4', 'G4', 'A#4', 'C5'],
	[],
	[],
	[],
	['E4', 'G4', 'A#4', 'C5'],
	[],
	[],
	[],
	['E4', 'G4', 'A#4', 'C5'],
	[],
	[],
	[],
	['E4', 'G4', 'A#4', 'C5'],
	[],
	[],
	[],
	['F3', 'F4', 'A4', 'C5'],
	[],
	[],
	[],
	['F4', 'A4', 'C5'],
	[],
	[],
	[],
	['F4', 'A4', 'C5'],
	[],
	[],
	[],
	['F4', 'A4', 'C5'],
	[],
	[],
	[],
	// // transition, cut out
	// ['F3', 'F4', 'A4', 'C5'],
	// [],
	// [],
	// [],
	// ['F4', 'A4', 'C5'],
	// [],
	// [],
	// [],
	// ['C3', 'E4', 'G4', 'C5'],
	// [],
	// [],
	// [],
	// ['E4', 'G4', 'C5'],
	// [],
	// [],
	// [],
	// ['E4', 'G4', 'C5'],
	// [],
	// [],
	// [],
	// ['E4', 'G4', 'C5'],
	// [],
	// [],
	// [],
	// ['E4', 'G4'],
	// [],
	// ['F4', 'A4'],
	// [],
	// ['G4', 'A#4'],
	// [],
	// [],
	// [],
	// ['G4', 'A#4'],
	// [],
	// [],
	// [],
];
const drums_heyjude = [
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	['OH'],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	['OH'],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	['OH'],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	['OH'],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	['OH'],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	['OH'],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	['OH'],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	['OH'],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	['OH'],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	['OH'],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	['OH'],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	['OH'],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	['OH'],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	['OH'],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	['OH'],
	[],
	['BD'],
	['HT'],
	['HT'],
	[],
	['MT', 'LT'],
	[],
	['MT', 'LT'],
	['MT'],
	['LT', 'BD'],
	[],
	['BD', 'OH', 'CY'],
	[],
	['OH'],
	[],
	['OH', 'SD', 'CH'],
	[],
	['OH'],
	[],
	['OH', 'BD'],
	[],
	['OH'],
	[],
	['OH', 'SD', 'CH'],
	[],
	['OH'],
	[],
	['OH', 'BD'],
	[],
	['OH'],
	[],
	['OH', 'SD', 'CH'],
	[],
	['OH'],
	[],
	['OH', 'BD'],
	[],
	['OH'],
	[],
	['OH', 'SD', 'CH'],
	[],
	['OH'],
	[],
	['OH', 'BD'],
	[],
	['OH'],
	[],
	['OH', 'SD', 'CH'],
	[],
	['OH'],
	[],
	['OH', 'BD'],
	[],
	['OH'],
	[],
	['OH', 'SD', 'CH'],
	[],
	['OH'],
	[],
	['OH', 'BD'],
	[],
	['OH'],
	[],
	['OH', 'SD', 'CH'],
	[],
	['OH'],
	[],
	['OH', 'BD'],
	[],
	['OH'],
	[],
	['OH', 'SD', 'CH'],
	[],
	['OH'],
	[],
	['OH', 'BD'],
	[],
	['OH'],
	[],
	['OH', 'SD', 'CH'],
	[],
	['OH'],
	[],
	['OH', 'BD'],
	[],
	['MT', 'LT'],
	[],
	['MT', 'LT'],
	['MT'],
	['LT', 'BD'],
	[],
	// [],
	// [],
	// [],
	// [],
	// [],
	// [],
	// [],
	// [],
	// [],
	// [],
	// [],
	// [],
	// [],
	// [],
	// [],
	// [],
	// [],
	// [],
	// [],
	// [],
	// [],
	// [],
	// [],
	// [],
	// [],
	// [],
	// [],
	// [],
	// [],
	// [],
	// [],
	// [],
	// [],
	// [],
	// [],
	// [],
];

// 15 step - https://www.youtube.com/watch?v=YEj4tKq5UTE
const drums_15step = [
	// intro
	['LT', 'BD'],
	[],
	['CP', 'OH'],
	['CH'],
	['CP'],
	['OH'],
	['CP', 'CH'],
	['CH'],
	['CP', 'OH'],
	[],
	['LT', 'BD'],
	[],
	['CP', 'OH'],
	['CH'],
	[],
	['CP', 'OH'],
	['CH'],
	['CH'],
	['CP', 'OH'],
	[],
	['LT', 'BD'],
	[],
	['CP', 'OH'],
	['CH'],
	['CP'],
	['OH'],
	['CP', 'CH'],
	['CH'],
	['CP', 'OH'],
	[],
	['LT', 'BD'],
	[],
	['CP', 'OH'],
	['CH'],
	[],
	['CP', 'OH'],
	['CH'],
	['CH'],
	['CP', 'OH'],
	[],
	['LT', 'BD'],
	[],
	['CP', 'OH'],
	['CH'],
	['CP'],
	['OH'],
	['CP', 'CH'],
	['CH'],
	['CP', 'OH'],
	[],
	['LT', 'BD'],
	[],
	['CP', 'OH'],
	['CH'],
	[],
	['CP', 'OH'],
	['CH'],
	['CH'],
	['CP', 'OH'],
	[],
	['LT', 'BD'],
	[],
	['CP', 'OH'],
	['CH'],
	['CP'],
	['OH'],
	['CP', 'CH'],
	['CH'],
	['CP', 'OH'],
	[],
	['LT', 'BD'],
	[],
	['CP', 'OH'],
	['CH'],
	[],
	['CP', 'OH'],
	['CH'],
	['CH'],
	['CP', 'OH'],
	[],
	// transition
	['LT', 'BD'],
	[],
	['OH', 'SD'],
	['CH'],
	['CH'],
	['SD', 'CH'],
	['BD', 'CH'],
	['BD', 'CH'],
	['SD', 'CH'],
	['CH'],
	['LT', 'BD', 'CH'],
	['CH'],
	['SD', 'CH'],
	['CH'],
	['OH'],
	['SD', 'BD', 'CH'],
	['BD', 'CH'],
	['BD', 'CH'],
	['SD', 'CH'],
	[],
	// Main Rhythm
	['LT', 'BD', 'OH', 'CY'],
	['SD', 'CH'],
	['SD', 'CP', 'OH'],
	['SD', 'CH'],
	['CP', 'OH'],
	['SD', 'CH'],
	['CP', 'LT', 'BD', 'OH'],
	['LT', 'BD', 'CH'],
	['SD', 'CP', 'OH'],
	['CH'],
	['LT', 'BD', 'OH', 'CY'],
	['SD', 'CH'],
	['SD', 'CP', 'OH'],
	['SD', 'CH'],
	['OH'],
	['SD', 'CP', 'CH'],
	['LT', 'BD', 'OH'],
	['LT', 'BD', 'CH'],
	['SD', 'CP', 'OH'],
	[],
	['LT', 'BD', 'OH', 'CY'],
	['SD', 'CH'],
	['SD', 'CP', 'OH'],
	['SD', 'CH'],
	['CP', 'OH'],
	['SD', 'CH'],
	['CP', 'LT', 'BD', 'OH'],
	['LT', 'BD', 'CH'],
	['SD', 'CP', 'OH'],
	['CH'],
	['LT', 'BD', 'OH', 'CY'],
	['SD', 'CH'],
	['SD', 'CP', 'OH'],
	['SD', 'CH'],
	['OH'],
	['SD', 'CP', 'CH'],
	['LT', 'BD', 'OH'],
	['LT', 'BD', 'CH'],
	['SD', 'CP', 'OH'],
	[],
	['LT', 'BD', 'OH', 'CY'],
	['SD', 'CH'],
	['SD', 'CP', 'OH'],
	['SD', 'CH'],
	['CP', 'OH'],
	['SD', 'CH'],
	['CP', 'LT', 'BD', 'OH'],
	['LT', 'BD', 'CH'],
	['SD', 'CP', 'OH'],
	['CH'],
	['LT', 'BD', 'OH', 'CY'],
	['SD', 'CH'],
	['SD', 'CP', 'OH'],
	['SD', 'CH'],
	['OH'],
	['SD', 'CP', 'CH'],
	['LT', 'BD', 'OH'],
	['LT', 'BD', 'CH'],
	['SD', 'CP', 'OH'],
	[],
	['LT', 'BD', 'OH', 'CY'],
	['SD', 'CH'],
	['SD', 'CP', 'OH'],
	['SD', 'CH'],
	['CP', 'OH'],
	['SD', 'CH'],
	['CP', 'LT', 'BD', 'OH'],
	['LT', 'BD', 'CH'],
	['SD', 'CP', 'OH'],
	['CH'],
	['LT', 'BD', 'OH', 'CY'],
	['SD', 'CH'],
	['SD', 'CP', 'OH'],
	['SD', 'CH'],
	['OH'],
	['SD', 'CP', 'CH'],
	['LT', 'BD', 'OH'],
	['LT', 'BD', 'CH'],
	['SD', 'CP', 'OH'],
	[],
];
const melody_15step = Array(drums_15step.length).fill([]);

const demos: { [key: string]: Song } = {
	'15step': {
		title: 'DEMO | 15 Step - Radiohead (drums)',
		melody: melody_15step,
		drums: drums_15step,
		options: {
			bpm: 91,
			drumkit: 'TR808',
			// TODO: synth options for demo
			synth: synth_options_default,
		},
	},
	heyjude: {
		title: 'DEMO | Hey Jude - The Beatles',
		melody: melody_heyjude,
		drums: drums_heyjude,
		options: {
			bpm: 74,
			drumkit: 'TR808',
			// TODO: synth options for demo
			synth: {
				volume: -6,
				detune: 0,
				envelope: {
					attack: 0.036,
					attackCurve: 'linear',
					decay: 0.1,
					decayCurve: 'exponential',
					sustain: 0.5,
					release: 2.4,
					releaseCurve: 'exponential',
				},
				portamento: 0,
			},
		},
	},
};

export const load = async ({ params }) => {
	const demo = demos[params.slug];

	if (!demo) {
		throw redirect(307, '/demos');
	}

	const existing = await db.songs.get({ title: demo.title });
	if (existing) {
		throw redirect(303, `/songs/${existing.id}`);
	}

	const new_id = await db.songs.add(demo);
	throw redirect(303, `/songs/${new_id}`);
};

export const ssr = false;
