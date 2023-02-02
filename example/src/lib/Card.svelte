<script lang="ts">
  import type { AsciiMath } from "../../../packages/core/src";
  import katex from "katex";

  export let am: AsciiMath;
  let amStr = "";
  let kHtml = "";
  let tex = "";

  function renderKatex() {
    tex = am.toTex(amStr);
    kHtml = katex.renderToString(tex, {
      displayMode: true,
      throwOnError: false,
    });
  }

  function throttle(fn: (...arg: any[]) => any, delay: number) {
    let timer;
    return function () {
      const _this = this;
      const args = arguments;
      if (timer) return;
      timer = setTimeout(() => {
        fn.apply(_this, args); // _this.fn(args);
        timer = null;
      }, delay);
    };
  }
</script>

<div class="card">
  <textarea
    bind:value={amStr}
    on:input={throttle(renderKatex, 800)}
    class="input-area"
    placeholder="Please input"
  />
  <div class="tex-code">{tex}</div>
  <div class="display">{@html kHtml}</div>
</div>

<style>
  .card {
    border: 1px solid #7f7f7f33;
    border-radius: 0.25rem;
    flex: 1;
  }
  .display {
    padding: 1rem;
  }
  .input-area {
    width: 100%;
    min-height: 4rem;
    font-family: "Jetbrains Mono", "JetBrains Mono";
    border: none;
    background: transparent;
    overflow: auto;
    word-break: break-all;
    padding: 1rem;
    resize: vertical;
    display: block;
    box-sizing: border-box;
  }
  .tex-code {
    padding: 1rem;
    margin: 0;
    font-family: "Jetbrains Mono", "JetBrains Mono";
    border-top: 1px solid #7f7f7f33;
    border-bottom: 1px solid #7f7f7f33;
  }
</style>
