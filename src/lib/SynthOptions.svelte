<script lang="ts">
	import { synth, synth_options } from '$db/stores';
	import { fly } from 'svelte/transition';
	import type * as Tone from 'tone';

	export let synth_options_is_open: boolean;

	// TODO: oscillator

	function update(options: Partial<Tone.SynthOptions> | { envelope: Partial<Tone.EnvelopeOptions> }) {
		$synth?.set(options);
	}
</script>

{#if $synth_options}
	<div class="options-container" in:fly={{ x: -20, duration: 200 }} out:fly={{ x: -20, duration: 200 }}>
		<span class="span-2 title">Synth Options</span>
		<button class="close" aria-label="close synth options" on:click={() => (synth_options_is_open = false)}>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
				<path
					d="M13.46,12L19,17.54V19H17.54L12,13.46L6.46,19H5V17.54L10.54,12L5,6.46V5H6.46L12,10.54L17.54,5H19V6.46L13.46,12Z"
				/>
			</svg>
		</button>
		<label>
			Volume
			<input
				type="range"
				min="-20"
				max="6"
				step="0.1"
				bind:value={$synth_options.volume}
				on:change={() => update({ volume: $synth_options.volume })}
			/>
		</label>
		<span class="value">{+$synth_options.volume.toFixed(1)}</span>
		<label>
			Detune
			<input
				type="range"
				min="-10"
				max="10"
				step="0.1"
				bind:value={$synth_options.detune}
				on:change={() => update({ detune: $synth_options.detune })}
			/>
		</label>
		<span class="value">{$synth_options.detune}</span>
		<label>
			Portamento
			<input
				type="range"
				min="0"
				max="1"
				step="0.001"
				bind:value={$synth_options.portamento}
				on:change={() => update({ portamento: $synth_options.portamento })}
			/>
		</label>
		<span class="value">{$synth_options.portamento}</span>
		<span class="span-2 subtitle">Envelope Options</span>
		<label>
			Attack
			<input
				type="range"
				min="0"
				max="2"
				step="0.001"
				bind:value={$synth_options.envelope.attack}
				on:change={() => update({ envelope: { attack: $synth_options.envelope.attack } })}
			/>
		</label>
		<span class="value">{$synth_options.envelope.attack}</span>
		<label class="span-2">
			Attack Curve
			<select
				bind:value={$synth_options.envelope.attackCurve}
				on:change={() => update({ envelope: { attackCurve: $synth_options.envelope.attackCurve } })}
			>
				<option value="linear">linear</option>
				<option value="exponential">exponential</option>
				<option value="sine">sine</option>
				<option value="cosine">cosine</option>
				<option value="bounce">bounce</option>
				<option value="ripple">ripple</option>
				<option value="step">step</option>
			</select>
		</label>
		<label>
			Decay
			<input
				type="range"
				min="0"
				max="2"
				step="0.01"
				bind:value={$synth_options.envelope.decay}
				on:change={() => update({ envelope: { decay: $synth_options.envelope.decay } })}
			/>
		</label>
		<span class="value">{$synth_options.envelope.decay}</span>
		<label class="span-2">
			Decay Curve
			<select
				bind:value={$synth_options.envelope.decayCurve}
				on:change={() => update({ envelope: { decayCurve: $synth_options.envelope.decayCurve } })}
			>
				<option value="linear">linear</option>
				<option value="exponential">exponential</option>
			</select>
		</label>
		<label>
			Sustain
			<input
				type="range"
				min="0"
				max="1"
				step="0.01"
				bind:value={$synth_options.envelope.sustain}
				on:change={() => update({ envelope: { sustain: $synth_options.envelope.sustain } })}
			/>
		</label>
		<span class="value">{$synth_options.envelope.sustain}</span>
		<label>
			Release
			<input
				type="range"
				min="0"
				max="5"
				step="0.1"
				bind:value={$synth_options.envelope.release}
				on:change={() => update({ envelope: { release: $synth_options.envelope.release } })}
			/>
		</label>
		<span class="value">{$synth_options.envelope.release}</span>
		<label class="span-2">
			Release Curve
			<select
				bind:value={$synth_options.envelope.releaseCurve}
				on:change={() => update({ envelope: { releaseCurve: $synth_options.envelope.releaseCurve } })}
			>
				<option value="linear">linear</option>
				<option value="exponential">exponential</option>
				<option value="sine">sine</option>
				<option value="cosine">cosine</option>
				<option value="bounce">bounce</option>
				<option value="ripple">ripple</option>
				<option value="step">step</option>
			</select>
		</label>
	</div>
{/if}

<style lang="scss">
	.options-container {
		position: absolute;
		left: 0;
		top: 50%;
		transform: translateY(-50%);
		z-index: 2;
		display: grid;
		grid-template-columns: 1fr 50px;
		gap: 1rem;
		align-items: center;
		padding: var(--pad-xl);
		padding-left: var(--pad-3xl);
		max-width: 400px;
		background-color: var(--clr-50);
		border: var(--border-width-thick) solid var(--clr-400);
		border-top-right-radius: var(--borderRadius-xl);
		border-bottom-right-radius: var(--borderRadius-xl);
		border-left: none;
		box-shadow: 2px 4px 8px 0px rgb(0 0 0 / 20%);

		fieldset {
			display: grid;
			grid-template-columns: 1fr 50px;
			gap: 1rem;
			border: none;
		}

		.span-2 {
			grid-column: span 2;
		}

		.close {
			position: absolute;
			top: 0;
			right: 0;
			padding: var(--pad-sm);

			svg {
				width: 24px;
			}
		}

		.title {
			font-weight: 800;
			margin-bottom: var(--pad-sm);
			text-transform: uppercase;
			font-size: 0.9rem;
			margin-left: -10px;
		}

		.subtitle {
			font-weight: 700;
			margin-top: var(--pad-md);
			text-transform: uppercase;
			font-size: 0.8rem;
			margin-left: -6px;
		}

		.value {
			font-family: 'Courier New', Courier, monospace;
			font-weight: 600;
			background-color: var(--clr-0);
			font-size: 0.9rem;
			padding: 3px 2px;
			border-radius: var(--borderRadius-sm);
			display: flex;
			align-items: center;
		}

		label {
			width: 100%;
			display: flex;
			align-items: center;
			gap: 1rem;
			font-size: 0.9rem;
			font-weight: 400;
		}

		input[type='range'] {
			width: 100%;

			&::-webkit-slider-runnable-track {
				background: var(--clr-150);
				height: 2px;
			}
			&::-moz-range-track {
				background: var(--clr-150);
				height: 2px;
			}
			&::-webkit-slider-thumb {
				-webkit-appearance: none; /* Override default look */
				appearance: none;
				margin-top: -11px; /* Centers thumb on the track */
				background-color: var(--clr-highlight);
				height: 1.5rem;
				width: 0.65rem;
				cursor: pointer;
			}
			&::-moz-range-thumb {
				border: none; /*Removes extra border that FF applies*/
				border-radius: 0; /*Removes default border-radius that FF applies*/
				background-color: var(--clr-highlight);
				height: 2rem;
				width: 0.65rem;
				cursor: pointer;
			}
		}
	}
</style>
