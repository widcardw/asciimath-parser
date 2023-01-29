<script lang="ts">
  import type { AsciiMath } from "../../../src";
  import { renderTex } from "./renderTex";
  export let am: AsciiMath;
  export let symbols: string[];
  export let cols: number = 4;

  let symbolMatrix = (() => {
    let temp: string[] = [];
    let res: string[][] = [];
    for (let i = 0; i < symbols.length; i++) {
      temp.push(symbols[i]);
      if (temp.length === cols) {
        res.push(temp);
        temp = [];
      }
    }
    if (temp.length) res.push(temp);
    return res;
  })();
</script>

<table>
  <tbody>
    {#each symbolMatrix as symbolArray}
      <tr>
        {#each symbolArray as s}
          <td class="tex tc">{@html renderTex(am, s)}</td>
          <td class="tc">{s}</td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>
