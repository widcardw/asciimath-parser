<script lang="ts">
  import { waitLocale } from "svelte-i18n";
  import "./i18n";
  async function preload() {
    return waitLocale();
  }
  import { _ } from "svelte-i18n";
  import CarbonLogoGithub from "./assets/CarbonLogoGithub.svelte";
  import CardList from "./lib/CardList.svelte";
  import { createAsciiMath } from "./lib/createAsciiMath";
  import ExampleTable from "./lib/ExampleTable.svelte";
  import {
    arrows,
    fonts,
    logic,
    mathFn,
    operators,
    others,
    parens,
    rela,
    subp,
    updown,
    xila,
  } from "./lib/symbols";
  import SymbolTable from "./lib/SymbolTable.svelte";
  const am = createAsciiMath();
  const display = [
    { title: "manual_list.parens", symbols: parens, cols: 4 },
    { title: "manual_list.greek", symbols: xila, cols: 4 },
    { title: "manual_list.operator", symbols: operators, cols: 4 },
    { title: "manual_list.rela", symbols: rela, cols: 4 },
    { title: "manual_list.logic", symbols: logic, cols: 4 },
    { title: "manual_list.other", symbols: others, cols: 4 },
    { title: "manual_list.mathFn", symbols: mathFn, cols: 4 },
    { title: "manual_list.arrow", symbols: arrows, cols: 4 },
    { title: "manual_list.font", symbols: fonts, cols: 4 },
    { title: "manual_list.notation", symbols: subp, cols: 4 },
    { title: "manual_list.superposition", symbols: updown, cols: 2 },
  ];
</script>

{#await preload() then __}
  <main>
    <h1>Asciimath</h1>
    <CardList {am} />
    <h2>{$_("examples")}</h2>
    <ExampleTable {am} />
    <h2>{$_("manual")}</h2>
    {#each display as item}
      <h3>{$_(item.title)}</h3>
      <SymbolTable {am} symbols={item.symbols} cols={item.cols} />
    {/each}
    <div class="fc p-8">
      <a
        href="https://github.com/widcardw/asciimath-parser"
        target="_blank"
        rel="noreferrer"
      >
        <CarbonLogoGithub />
      </a>
    </div>
  </main>
{/await}

<style>
  main {
    max-width: 800px;
    margin: 0 auto;
    padding: 1rem;
  }
  .fc {
    display: flex;
    justify-content: center;
    font-size: 1.5rem;
  }
  .p-8 {
    padding: 2rem;
  }
</style>
