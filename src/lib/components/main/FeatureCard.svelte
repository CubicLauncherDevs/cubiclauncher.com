<script lang="ts">
  export let title: string;
  export let description: string;
  export let index: number;
</script>

<div class="group p-6 border border-cl-border hover:border-cl-border-hover hover:bg-cl-elevated/30 transition-all duration-300 rounded-lg">
  <div class="flex flex-col gap-4 items-start">
    <div class="w-8 h-8 bg-cl-surface rounded flex items-center justify-center text-[10px] font-semibold text-cl-muted border border-cl-border">
      0{index + 1}
    </div>

    <div>
      <h3 class="text-lg font-semibold mb-2 text-cl-text group-hover:translate-x-1 transition-transform duration-300">
        {title}
      </h3>
      <p class="max-w-md text-xs text-cl-muted leading-relaxed group-hover:text-cl-muted transition-colors">
        {description}
      </p>
    </div>
  </div>
</div>
