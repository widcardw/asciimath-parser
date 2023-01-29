<script lang="ts">
  import type { AsciiMath } from "../../../src";
  import { renderTex } from "./renderTex";

  let tb = [
    { label: "上下标", code: "a_1^2 + b_1^2 = c_1^2" },
    { label: "文字", code: '"hello world"' },
    { label: "分式", code: "a/b, a//b" },
    { label: "根号", code: "sqrt n, root n x, (a^2)/(sqrt b)" },
    { label: "极限", code: "lim_(n->oo) (1 + 1/n)^n" },
    { label: "积分", code: "int_a^b f(x) dx" },
    { label: "隐形括号", code: "sin {: x/2 :}" },
    { label: "微分", code: 'dy/dx, ("d"r)/("d"theta), f\'\'(x)' },
    { label: "偏微分", code: "(del f)/(del x), (del^3 f)/(del x del y^2)" },
    { label: "偏微分 (试验)", code: "part f x, part^3 f (x y^2), part {::} x" },
    { label: "矩阵", code: "[a, b; c, d], [a, b | c; d, e | f]" },
    { label: "分段函数", code: "|x| = { x, if x > 0; -x, otherwise :}" },
  ];
  export let am: AsciiMath;
</script>

<table>
  <thead>
    <tr>
      <td>主题</td>
      <td>效果</td>
      <td>源码</td>
    </tr>
  </thead>
  <tbody>
    {#each tb as it}
      <tr>
        <td>{it.label}</td>
        <td>{@html renderTex(am, it.code)}</td>
        <td>{it.code}</td>
      </tr>
    {/each}
  </tbody>
</table>
