import Dexie, { type Table } from 'dexie';
import type * as Tone from 'tone';

export type Melody = Tone.Unit.Frequency[][];
export type Drums = string[][];
export type Track = Melody | Drums;
export type TrackName = 'melody' | 'drums';
export type Id = number | 'new' | 'demo';
export interface SynthOptions {
	volume: number;
	detune: number;
	portamento: number;
	envelope: {
		attack: Tone.Unit.Time;
		attackCurve: Tone.EnvelopeCurve;
		decay: Tone.Unit.Time;
		decayCurve: 'linear' | 'exponential';
		sustain: number;
		release: Tone.Unit.Time;
		releaseCurve: Tone.EnvelopeCurve;
	};
}
export interface Song {
	id?: Id;
	title: string;
	melody: Melody;
	drums: Drums;
	options: {
		bpm: Tone.Unit.BPM;
		drumkit: string;
		synth: SynthOptions;
	};
}

export class SongDB extends Dexie {
	songs!: Table<Song>;

	constructor() {
		super('SongDB');
		this.version(1).stores({
			songs: '++id, title, melody, drums, options',
		});
	}
}

export const db = new SongDB();
