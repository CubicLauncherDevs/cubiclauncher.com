<script lang="ts">
  export let title: string;
  export let description: string;
  export let index: number;
</script>

<div class="group py-20 px-12 border border-white/5 hover:border-white/20 transition-all duration-700 rounded-[4rem] hover:bg-white/[0.02]">
  <div class="flex flex-col gap-10 items-start">
    <div class="w-12 h-12 bg-neutral-900 rounded-full flex items-center justify-center text-[10px] font-bold text-neutral-500 border border-white/5 group-hover:scale-110 transition-transform duration-700">
      0{index + 1}
    </div>
    
    <div>
      <h3 class="text-4xl md:text-5xl font-bold tracking-tighter mb-8 group-hover:translate-x-2 transition-transform duration-700">
        {title}
      </h3>
      <p class="max-w-md text-neutral-500 leading-relaxed group-hover:text-neutral-300 transition-colors duration-700">
        {description}
      </p>
    </div>

    <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-700 pt-4">
      <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-2xl shadow-white/20">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
      </div>
    </div>
  </div>
</div>
