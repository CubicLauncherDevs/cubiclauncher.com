<script>
  import '../styles/app.css';
  import Navbar from "$lib/components/global/Navbar.svelte";
  import Footer from "$lib/components/global/Footer.svelte";
  import { browser } from '$app/environment';
  import { currentLocale } from "$lib/i18n";
  import { onNavigate } from '$app/navigation';

  let { children } = $props();

  if (browser) {
    document.documentElement.lang = $currentLocale ?? 'es';
  }

  $effect(() => {
    if (browser) {
      document.documentElement.lang = $currentLocale ?? 'es';
    }
  });

  onNavigate((navigation) => {
    if (!browser || !document.startViewTransition) return;

    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
    });
  });
</script>

<div class="min-h-screen bg-neutral-950 text-neutral-50 selection:bg-white/10 selection:text-white font-sans antialiased text-[14px]">
  <Navbar />
  {@render children()}
  <Footer />
</div>
