<template>
  <div class="header-title">{{ $t('ui.trans.log-content.message') }}</div>
  <div class="content-box p-3">
    <div class="device-info-grid">
      <div class="device-status">
        <p>{{ data }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  data: Record<string, any>
}>()
</script>

<style scoped>
.device-info-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 4 columns per row */
  gap: 0; /* Remove gap between grid cells */
  width: 100%;
  border-collapse: collapse; /* Remove access gap of table borders */
}

.device-info-title,
.device-info-value {
  padding: 8px;
  border: 1px solid #ccc;
  word-wrap: break-word;
  word-break: break-all;
  white-space: normal;
}

.device-info-title {
  background-color: var(--cui-primary);
  font-weight: bold; /* Title bold */
}

.device-status {
  grid-column: span 4; /* Span 4 columns */
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #ccc;
}

.device-status h3 {
  margin-top: 0;
}

/* Beautified JSON display */
pre {
  padding: 10px;
  border-radius: 5px;
  font-size: 14px;
  overflow-x: auto;
  white-space: pre-wrap;
}
</style>
