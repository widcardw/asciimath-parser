<script lang="ts">
import CardList from "./lib/CardList.svelte";
import { createAsciiMath } from "./lib/createAsciiMath";
import ExampleTable from "./lib/ExampleTable.svelte";
import { arrows, fonts, logic, mathFn, operators, others, parens, rela, subp, updown, xila } from "./lib/symbols";
import SymbolTable from "./lib/SymbolTable.svelte";
const am = createAsciiMath()
</script>

<main>
  <h1>Asciimath</h1>
  <CardList {am} />
  <h2>使用样例</h2>
  <ExampleTable {am} />
  <h2>符号对照手册</h2>
  <h3>括号</h3>
  <SymbolTable {am} symbols={parens} />
  <h3>希腊字母</h3>
  <SymbolTable {am} symbols={xila} />
  <h3>运算符</h3>
  <SymbolTable {am} symbols={operators} />
  <h3>关系符号</h3>
  <SymbolTable {am} symbols={rela} />
  <h3>逻辑符号</h3>
  <SymbolTable {am} symbols={logic} />
  <h3>杂项</h3>
  <SymbolTable {am} symbols={others} />
  <h3>数学函数</h3>
  <SymbolTable {am} symbols={mathFn} />
  <h3>箭头</h3>
  <SymbolTable {am} symbols={arrows} />
  <h3>字体</h3>
  <SymbolTable {am} symbols={fonts} />
  <h3>注音符号</h3>
  <SymbolTable {am} symbols={subp} />
  <h3>上下叠合</h3>
  <SymbolTable {am} symbols={updown} cols={2} />
</main>

<style>
  main {
    max-width: 800px;
    margin: 0 auto;
    padding: 1rem;
  }
</style>