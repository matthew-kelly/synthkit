export interface DrumKit {
	id: number;
	name: string;
	samples: DrumKitSample[];
}

export interface Drumkits {
	[key: string]: DrumKit;
}

export interface DrumKitSample {
	name: string;
	short: string;
	url: string;
}

export interface DrumKitSampleSet {
	[key: string]: string;
}

function reduce_to_samples(drum_kit: DrumKit) {
	return drum_kit.samples.reduce((acc: { [key: string]: string }, cur) => {
		acc[cur.short] = cur.url;
		return acc;
	}, {});
}

const CR78: DrumKit = {
	id: 1,
	name: 'Roland CR-78',
	samples: [
		{
			name: 'hi bongo',
			short: 'HB',
			url: '/audio/CR78/bongo-hi.wav',
		},
		{
			name: 'low bongo',
			short: 'LB',
			url: '/audio/CR78/bongo-low.wav',
		},
		{
			name: 'conga',
			short: 'CO',
			url: '/audio/CR78/conga.wav',
		},
		{
			name: 'cowbell',
			short: 'CB',
			url: '/audio/CR78/cowbell.wav',
		},
		{
			name: 'cymbal',
			short: 'CY',
			url: '/audio/CR78/cymbal.wav',
		},
		{
			name: 'guiro',
			short: 'GU',
			url: '/audio/CR78/guiro-1.wav',
		},
		{
			name: 'hi hat',
			short: 'HH',
			url: '/audio/CR78/hihat.wav',
		},
		{
			name: 'hi hat accent',
			short: 'HA',
			url: '/audio/CR78/hihat-accent.wav',
		},
		{
			name: 'hi hat metal',
			short: 'HM',
			url: '/audio/CR78/hihat-metal.wav',
		},
		{
			name: 'kick drum',
			short: 'KI',
			url: '/audio/CR78/kick.wav',
		},
		{
			name: 'kick drum accent',
			short: 'KA',
			url: '/audio/CR78/kick-accent.wav',
		},
		{
			name: 'rim shot',
			short: 'RS',
			url: '/audio/CR78/rim-shot.wav',
		},
		{
			name: 'snare drum',
			short: 'SD',
			url: '/audio/CR78/snare.wav',
		},
		{
			name: 'snare drum accent',
			short: 'SA',
			url: '/audio/CR78/snare-accent.wav',
		},
		{
			name: 'tamb 1',
			short: 'T1',
			url: '/audio/CR78/tamb-1.wav',
		},
		{
			name: 'tamb 2',
			short: 'T2',
			url: '/audio/CR78/tamb-2.wav',
		},
	],
};
const CR78_samples: DrumKitSampleSet = reduce_to_samples(CR78);

const TR808: DrumKit = {
	id: 2,
	name: 'Roland TR-808',
	samples: [
		{
			name: 'bass drum',
			short: 'BD',
			url: '/audio/TR808/bass-drum.wav',
		},
		{
			name: 'clap',
			short: 'CP',
			url: '/audio/TR808/clap.wav',
		},
		{
			name: 'claves',
			short: 'CL',
			url: '/audio/TR808/claves.wav',
		},
		{
			name: 'hi conga',
			short: 'HC',
			url: '/audio/TR808/conga-hi.wav',
		},
		{
			name: 'mid conga',
			short: 'MC',
			url: '/audio/TR808/conga-mid.wav',
		},
		{
			name: 'low conga',
			short: 'LC',
			url: '/audio/TR808/conga-low.wav',
		},
		{
			name: 'cowbell',
			short: 'CB',
			url: '/audio/TR808/cowbell.wav',
		},
		{
			name: 'cymbal',
			short: 'CY',
			url: '/audio/TR808/cymbal.wav',
		},
		{
			name: 'open hi hat',
			short: 'OH',
			url: '/audio/TR808/hihat-open.wav',
		},
		{
			name: 'closed hi hat',
			short: 'CH',
			url: '/audio/TR808/hihat-closed.wav',
		},
		{
			name: 'maracas',
			short: 'MA',
			url: '/audio/TR808/maracas.wav',
		},
		{
			name: 'rim shot',
			short: 'RS',
			url: '/audio/TR808/rim-shot.wav',
		},
		{
			name: 'snare drum',
			short: 'SD',
			url: '/audio/TR808/snare-drum.wav',
		},
		{
			name: 'hi tom',
			short: 'HT',
			url: '/audio/TR808/tom-hi.wav',
		},
		{
			name: 'mid tom',
			short: 'MT',
			url: '/audio/TR808/tom-mid.wav',
		},
		{
			name: 'low tom',
			short: 'LT',
			url: '/audio/TR808/tom-low.wav',
		},
	],
};
const TR808_samples: DrumKitSampleSet = reduce_to_samples(TR808);

const CR80: DrumKit = {
	id: 3,
	name: 'Roland CR-80',
	samples: [
		{
			name: 'ahh',
			short: 'AH',
			url: '/audio/CR80/ahh.wav',
		},
		{
			name: 'bass drum',
			short: 'BD',
			url: '/audio/CR80/bass-drum.wav',
		},
		{
			name: 'crash',
			short: 'CR',
			url: '/audio/CR80/crash.wav',
		},
		{
			name: 'ha',
			short: 'HA',
			url: '/audio/CR80/ha.wav',
		},
		{
			name: 'hey',
			short: 'HY',
			url: '/audio/CR80/hey.wav',
		},
		{
			name: 'hi hat closed',
			short: 'HC',
			url: '/audio/CR80/hi-hat-closed.wav',
		},
		{
			name: 'hi hat open',
			short: 'HO',
			url: '/audio/CR80/hi-hat-open.wav',
		},
		{
			name: 'ride',
			short: 'RD',
			url: '/audio/CR80/ride.wav',
		},
		{
			name: 'scratch 1',
			short: 'S1',
			url: '/audio/CR80/scratch-1.wav',
		},
		{
			name: 'scratch 2',
			short: 'S2',
			url: '/audio/CR80/scratch-2.wav',
		},
		{
			name: 'snare',
			short: 'SN',
			url: '/audio/CR80/snare.wav',
		},
		{
			name: 'tom',
			short: 'TM',
			url: '/audio/CR80/tom.wav',
		},
		{
			name: 'unh',
			short: 'UN',
			url: '/audio/CR80/unh.wav',
		},
	],
};
const CR80_samples: DrumKitSampleSet = reduce_to_samples(CR80);
const DR110: DrumKit = {
	id: 4,
	name: 'Boss DR-110',
	samples: [
		{
			name: 'clap',
			short: 'CL',
			url: '/audio/DR110/clap.wav',
		},
		{
			name: 'cymbal',
			short: 'CY',
			url: '/audio/DR110/cymbal.wav',
		},
		{
			name: 'hi hat closed',
			short: 'HC',
			url: '/audio/DR110/hi-hat-closed.wav',
		},
		{
			name: 'hi hat open',
			short: 'HO',
			url: '/audio/DR110/hi-hat-open.wav',
		},
		{
			name: 'kick',
			short: 'KI',
			url: '/audio/DR110/kick.wav',
		},
		{
			name: 'snare',
			short: 'SN',
			url: '/audio/DR110/snare.wav',
		},
	],
};
const DR110_samples: DrumKitSampleSet = reduce_to_samples(DR110);

export const drumkits: Drumkits = { TR808, CR78, CR80, DR110 };
export const sample_sets: { [key: string]: DrumKitSampleSet } = {
	CR78: CR78_samples,
	TR808: TR808_samples,
	CR80: CR80_samples,
	DR110: DR110_samples,
};
