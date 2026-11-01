<script lang="ts">
  import { base } from "$app/paths";

  const src = `${base}/hero/bg.webp`;
</script>

<div class="absolute inset-0 overflow-hidden transform-gpu">
  <img
    {src}
    alt=""
    loading="eager"
    decoding="async"
    fetchpriority="high"
    class="hero-bg-image w-full h-full object-cover transform-gpu"
  />
  <div class="absolute inset-0 bg-cl-base/40"></div>
  <div
    class="absolute inset-0 bg-gradient-to-b from-transparent via-cl-base/10 to-cl-base"
  ></div>
</div>

<style>
  :global(html.light) .hero-bg-image {
    filter: blur(1px) brightness(0.95) saturate(1.05);
  }

  :global(html.dark) .hero-bg-image {
    filter: blur(1px) brightness(0.7) saturate(1.3);
  }
</style>
