<script lang="ts">
  import { _ } from 'svelte-i18n'
  import type { AsciiMath } from "../../../packages/core/src";
  import { renderTex } from "./renderTex";

  let tb = [
    { label: "example_list.supb", code: "a_1^2 + b_1^2 = c_1^2" },
    { label: "example_list.text", code: '"hello world"' },
    { label: "example_list.frac", code: "a/b, a//b" },
    { label: "example_list.sqrt", code: "sqrt n, root n x, (a^2)/(sqrt b)" },
    { label: "example_list.lim", code: "lim_(n->oo) (1 + 1/n)^n" },
    { label: "example_list.int", code: "int_a^b f(x) dx" },
    { label: "example_list.hidden_paren", code: "sin {: x/2 :}" },
    { label: "example_list.diff", code: 'dy/dx, ("d"r)/("d"theta), f\'\'(x)' },
    { label: "example_list.part", code: "(del f)/(del x), (del^3 f)/(del x del y^2)" },
    { label: "example_list.parte", code: "part f x, part^3 f (x y^2), part {::} x" },
    { label: "example_list.mat", code: "[a, b; c, d], [a, b | c; d, e | f]" },
    { label: "example_list.piec", code: "|x| = { x, if x > 0; -x, otherwise :}" },
  ];
  export let am: AsciiMath;
</script>

<table>
  <thead>
    <tr>
      <td>{$_('themes')}</td>
      <td>{$_('output')}</td>
      <td>{$_('code')}</td>
    </tr>
  </thead>
  <tbody>
    {#each tb as it}
      <tr>
        <td>{$_(it.label)}</td>
        <td>{@html renderTex(am, it.code)}</td>
        <td>{it.code}</td>
      </tr>
    {/each}
  </tbody>
</table>
