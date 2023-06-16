import { get, writable, type Writable } from 'svelte/store';
import type * as Tone from 'tone';
import { db, type Id, type SynthOptions } from './db';

export const current_id: Writable<Id> | Writable<null> = writable(null);
export const synth: Writable<Tone.PolySynth> | Writable<null> = writable(null);
export const synth_volume: Writable<Tone.Volume> | Writable<null> = writable(null);
export const players: Writable<Tone.Players> | Writable<null> = writable(null);
export const players_volume: Writable<Tone.Volume> | Writable<null> = writable(null);

export const synth_options_default: SynthOptions = {
	envelope: {
		attack: 0.005,
		attackCurve: 'linear',
		decay: 0.1,
		decayCurve: 'exponential',
		sustain: 0.3,
		release: 1,
		releaseCurve: 'exponential',
	},
	volume: -6,
	portamento: 0,
	detune: 0,
};
function create_synth_options() {
	const { subscribe, update: update_store } = writable<SynthOptions>({
		...synth_options_default,
	});

	function set(new_options: Partial<SynthOptions>) {
		update(new_options);
	}

	async function update(new_options: Partial<SynthOptions>) {
		update_store((store) => ({ ...store, ...new_options }));
		const id = get(current_id);
		if (id !== 'new') {
			await db.songs.update(id, { 'options.synth': { ...new_options } });
		}
	}

	return {
		subscribe,
		set,
		update,
	};
}
export const synth_options = create_synth_options();
