<script lang="ts">
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
    { title: "括号", symbols: parens, cols: 4 },
    { title: "希腊字母", symbols: xila, cols: 4 },
    { title: "运算符", symbols: operators, cols: 4 },
    { title: "关系符号", symbols: rela, cols: 4 },
    { title: "逻辑符号", symbols: logic, cols: 4 },
    { title: "杂项", symbols: others, cols: 4 },
    { title: "数学函数", symbols: mathFn, cols: 4 },
    { title: "箭头", symbols: arrows, cols: 4 },
    { title: "字体", symbols: fonts, cols: 4 },
    { title: "注音符号", symbols: subp, cols: 4 },
    { title: "上下叠合", symbols: updown, cols: 2 },
  ];
</script>

<main>
  <h1>Asciimath</h1>
  <CardList {am} />
  <h2>使用样例</h2>
  <ExampleTable {am} />
  <h2>符号对照手册</h2>
  {#each display as item}
    <h3>{item.title}</h3>
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
