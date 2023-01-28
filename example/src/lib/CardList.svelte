<script lang="ts">
import Card from "./Card.svelte";
import type { AsciiMath } from "../../../src";
export let am: AsciiMath
let items: number[] = [0]

function addItem() {
    items[items.length] = Date.now()
}

function removeItem(i: number) {
    if (items.length === 1) return
    items = [...items.slice(0, i), ...items.slice(i + 1)]
}

</script>

<div>
    {#each items as item, i (item)}
        <div class="mb-4 w-full flex">
            <Card {am} />
            <button on:click={() => removeItem(i)} style="font-family: KaTeX_Main">-</button>
        </div>
    {/each}
    <button class="w-full mb-1rem" on:click={addItem} style="font-family: KaTeX_Main">+</button>
</div>

<style>
.flex {
    display: flex;
}
.w-full {
    width: 100%;
}
.mb-4 {
    margin-bottom: 1rem;
}
</style>