<script lang="ts">
  import { base } from "$app/paths";

  const src = `${base}/hero/bg.webp`;
</script>

<div class="absolute inset-0 overflow-hidden">
  <img
    {src}
    alt=""
    loading="eager"
    decoding="async"
    fetchpriority="high"
    class="w-full h-full object-cover"
    style="filter: blur(2px) brightness(0.5) saturate(1.5);"
  />
  <div class="absolute inset-0 bg-cl-base/60"></div>
  <div
    class="absolute inset-0 bg-gradient-to-b from-cl-base/40 via-transparent to-cl-base/80"
  ></div>
</div>
