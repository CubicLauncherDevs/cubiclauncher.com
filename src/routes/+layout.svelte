<script>
	import '../styles/app.css';
  import Navbar from "$lib/components/global/Navbar.svelte";
  import Footer from "$lib/components/global/Footer.svelte";
	let { children } = $props();
</script>

<div class="min-h-screen bg-neutral-950 text-neutral-50 selection:bg-white/10 selection:text-white font-sans antialiased">
  <Navbar />
  {@render children()}
  <Footer />
</div>
