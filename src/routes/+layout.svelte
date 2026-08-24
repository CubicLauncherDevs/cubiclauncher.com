<script>
  import '../styles/app.css';
  import Navbar from "$lib/components/global/Navbar.svelte";
  import Footer from "$lib/components/global/Footer.svelte";
  import { browser } from '$app/environment';
  import { currentLocale } from "$lib/i18n";
  import { onNavigate } from '$app/navigation';
  import { themeStore } from "$lib/stores/theme.svelte";

  let { children } = $props();

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

<div class="min-h-screen bg-cl-base text-cl-text selection:bg-cl-text/10 selection:text-cl-text font-sans antialiased text-base flex flex-col">
  <Navbar />
  <main class="pt-[var(--navbar-height)] flex-1 flex flex-col">
    {@render children()}
  </main>
  <Footer />
</div>
