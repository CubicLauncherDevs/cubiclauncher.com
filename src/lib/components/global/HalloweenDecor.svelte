<script lang="ts">
  // Decoración temporal — Halloween 2026. Eliminar junto con el resto de la temática.
  const SPOKES = 7;
  const RINGS = 6;
  const R0 = 15;
  const DR = 15.5;
  const MAXA = 90;

  function pt(r: number, deg: number): [number, number] {
    const a = (deg * Math.PI) / 180;
    return [r * Math.cos(a), r * Math.sin(a)];
  }

  const spokes: string[] = [];
  for (let i = 0; i < SPOKES; i++) {
    const [x, y] = pt(100, (MAXA * i) / (SPOKES - 1));
    spokes.push(`M0 0 L${x.toFixed(2)} ${y.toFixed(2)}`);
  }

  const rings: string[] = [];
  for (let j = 0; j < RINGS; j++) {
    const r = R0 + j * DR;
    let d = '';
    for (let i = 0; i < SPOKES - 1; i++) {
      const a0 = (MAXA * i) / (SPOKES - 1);
      const a1 = (MAXA * (i + 1)) / (SPOKES - 1);
      const [x0, y0] = pt(r, a0);
      const [x1, y1] = pt(r, a1);
      const [cx, cy] = pt(r * 0.84, (a0 + a1) / 2);
      d += `${i === 0 ? `M${x0.toFixed(2)} ${y0.toFixed(2)}` : ''} Q${cx.toFixed(2)} ${cy.toFixed(2)} ${x1.toFixed(2)} ${y1.toFixed(2)}`;
    }
    rings.push(d);
  }

  const legs = [
    'M3 -3 C8 -7 10 -11 11 -15',
    'M4 0 C9 -1 13 -3 16 -4',
    'M4 3 C9 4 13 6 16 8',
    'M3 5 C7 9 8 13 8 17'
  ];

  const threads = [
    { left: '15%', height: '130px', delay: '0s' },
    { left: '37%', height: '95px', delay: '-2.2s' },
    { left: '66%', height: '150px', delay: '-4.4s' }
  ];
</script>

<div
  class="halloween-decor pointer-events-none fixed inset-0 z-30 overflow-hidden"
  aria-hidden="true"
>
  <svg
    class="halloween-web halloween-web--left"
    viewBox="0 0 100 100"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
  >
    <g stroke-width="0.7">
      {#each spokes as d}
        <path {d} />
      {/each}
    </g>
    <g stroke-width="0.5">
      {#each rings as d}
        <path {d} />
      {/each}
    </g>
  </svg>

  <svg
    class="halloween-web halloween-web--right"
    viewBox="0 0 100 100"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
  >
    <g stroke-width="0.7">
      {#each spokes as d}
        <path {d} />
      {/each}
    </g>
    <g stroke-width="0.5">
      {#each rings as d}
        <path {d} />
      {/each}
    </g>
  </svg>

  <div class="halloween-spider halloween-spider--left">
    <svg viewBox="-20 -42 40 62" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round">
      <path d="M0 -42 L0 -6" stroke-width="0.9" />
      <g>
        {#each legs as d}
          <path {d} />
        {/each}
        <g transform="scale(-1,1)">
          {#each legs as d}
            <path {d} />
          {/each}
        </g>
      </g>
      <ellipse cx="0" cy="3" rx="4" ry="5.2" fill="currentColor" stroke="none" />
      <circle cx="0" cy="-4" r="2.6" fill="currentColor" stroke="none" />
    </svg>
  </div>

  <div class="halloween-spider halloween-spider--right">
    <svg viewBox="-20 -42 40 62" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round">
      <path d="M0 -42 L0 -6" stroke-width="0.9" />
      <g>
        {#each legs as d}
          <path {d} />
        {/each}
        <g transform="scale(-1,1)">
          {#each legs as d}
            <path {d} />
          {/each}
        </g>
      </g>
      <ellipse cx="0" cy="3" rx="4" ry="5.2" fill="currentColor" stroke="none" />
      <circle cx="0" cy="-4" r="2.6" fill="currentColor" stroke="none" />
    </svg>
  </div>

  {#each threads as thread}
    <div
      class="halloween-thread"
      style="left: {thread.left}; height: {thread.height}; animation-delay: {thread.delay};"
    >
      <span class="halloween-drop"></span>
    </div>
  {/each}
</div>

<style>
  .halloween-decor {
    color: var(--cl-text);
  }

  .halloween-web {
    position: absolute;
    top: var(--navbar-height);
    width: 148px;
    height: 148px;
    opacity: 0.11;
    display: none;
  }

  .halloween-web--left {
    left: 0;
  }

  .halloween-web--right {
    right: 0;
    transform: scaleX(-1);
  }

  .halloween-spider {
    position: absolute;
    height: 78px;
    width: 50px;
    opacity: 0.5;
    display: none;
    transform-origin: top center;
    animation: halloween-sway 8s ease-in-out infinite;
  }

  .halloween-spider--left {
    top: calc(var(--navbar-height) + 38px);
    left: 62px;
    height: 66px;
  }

  .halloween-spider--right {
    top: calc(var(--navbar-height) + 74px);
    right: 54px;
    height: 54px;
    width: 36px;
    opacity: 0.4;
    animation-duration: 10s;
    animation-delay: -3s;
  }

  .halloween-thread {
    position: absolute;
    top: var(--navbar-height);
    width: 1px;
    background: linear-gradient(to bottom, currentColor, transparent);
    opacity: 0.16;
    display: none;
  }

  .halloween-drop {
    position: absolute;
    left: 50%;
    bottom: 0;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: currentColor;
    transform: translateX(-50%);
    animation: halloween-drip 7s ease-in infinite;
  }

  @keyframes halloween-sway {
    0%,
    100% {
      transform: rotate(-3.5deg);
    }
    50% {
      transform: rotate(3.5deg);
    }
  }

  @keyframes halloween-drip {
    0% {
      transform: translate(-50%, 0);
      opacity: 0;
    }
    15% {
      opacity: 0.75;
    }
    85% {
      opacity: 0.5;
    }
    100% {
      transform: translate(-50%, 38px);
      opacity: 0;
    }
  }

  @media (min-width: 768px) {
    .halloween-web,
    .halloween-spider,
    .halloween-thread {
      display: block;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .halloween-spider,
    .halloween-drop {
      animation: none;
    }
  }
</style>
