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
  <div class="hero-scrim absolute inset-0"></div>
  <div class="hero-fade absolute inset-0"></div>
</div>

<style>
  .hero-scrim {
    background: color-mix(in srgb, var(--cl-base) 40%, transparent);
  }

  :global(html.light) .hero-scrim {
    background: linear-gradient(
      90deg,
      color-mix(in srgb, var(--cl-base) 82%, transparent) 0%,
      color-mix(in srgb, var(--cl-base) 55%, transparent) 40%,
      transparent 70%
    );
  }

  .hero-fade {
    background: linear-gradient(
      to bottom,
      transparent,
      color-mix(in srgb, var(--cl-base) 10%, transparent),
      var(--cl-base)
    );
  }

  :global(html.light) .hero-fade {
    background: linear-gradient(
      to bottom,
      transparent 0%,
      transparent 60%,
      color-mix(in srgb, var(--cl-base) 30%, transparent) 82%,
      var(--cl-base) 100%
    );
  }

  :global(html.light) .hero-bg-image {
    filter: blur(0.5px) brightness(1) saturate(1.02);
  }

  :global(html.dark) .hero-bg-image {
    filter: blur(1px) brightness(0.7) saturate(1.3);
  }

  @media (max-width: 640px) {
    :global(html.light) .hero-scrim {
      background: linear-gradient(
        to bottom,
        color-mix(in srgb, var(--cl-base) 78%, transparent) 0%,
        color-mix(in srgb, var(--cl-base) 68%, transparent) 55%,
        color-mix(in srgb, var(--cl-base) 35%, transparent) 100%
      );
    }
  }
</style>
