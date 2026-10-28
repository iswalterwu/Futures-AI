<script setup lang="ts">
import { onBeforeUnmount, onMounted, useTemplateRef, watch } from 'vue'
import type { EChartsOption } from 'echarts'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import { init, use, type EChartsType } from 'echarts/core'
import { SVGRenderer } from 'echarts/renderers'
import type { SparkSeries } from '../../contracts/types.ts'
import { T } from '../../design/generated/tokens.ts'
import { FAI_DARK_THEME } from '../../design/theme.ts'
import '../../shared/num.css'

declare global {
  interface Window {
    __FAI_TEST__?: { charts: Record<string, EChartsType> }
  }
}

use([LineChart, GridComponent, TooltipComponent, SVGRenderer])

const props = defineProps<{ chartId: string; series: SparkSeries }>()
const plot = useTemplateRef<HTMLDivElement>('plot')
const isMock = (import.meta.env.VITE_DATA_MODE ?? 'mock') === 'mock'
let chart: EChartsType
let observer: ResizeObserver

onMounted(() => {
  chart = init(plot.value!, FAI_DARK_THEME, { renderer: 'svg', width: 'auto', height: 'auto' })
  render()
  observer = new ResizeObserver(() => chart.resize())
  observer.observe(plot.value!)
  if (isMock) {
    const hooks = window.__FAI_TEST__ ??= { charts: {} }
    hooks.charts[props.chartId] = chart
  }
})

watch(() => props.series, render, { deep: true, flush: 'post' })

onBeforeUnmount(() => {
  observer.disconnect()
  chart.dispose()
  if (isMock) delete window.__FAI_TEST__?.charts[props.chartId]
})

function render() {
  const option: EChartsOption = {
    animation: false,
    grid: {
      left: parseFloat(T.space.grid_gap),
      right: parseFloat(T.space.grid_gap),
      top: parseFloat(T.space.grid_gap),
      bottom: parseFloat(T.space.grid_gap),
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      confine: true,
      axisPointer: { lineStyle: { color: T.chart.axis_line } },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: props.series.points.map(point => point.ts.slice(0, 10)),
      axisLabel: { fontFamily: T.font.mono, formatter: (date: string) => date.slice(5) },
    },
    yAxis: { type: 'value', scale: true },
    series: [{
      id: props.series.seriesId,
      name: '收盘价',
      type: 'line',
      showSymbol: false,
      connectNulls: false,
      lineStyle: { width: parseFloat(T.radius.base) },
      data: props.series.points.map(point => point.value),
    }],
  }
  chart.setOption(option, { notMerge: true })
}
</script>

<template>
  <figure
    class="sample-chart"
    :data-chart-id="chartId"
    :data-series-id="series.seriesId"
  >
    <figcaption>
      <span>近 <span class="num">{{ series.points.length }}</span> 日收盘 · 样例</span>
      <span class="unit">{{ series.unit }}</span>
    </figcaption>
    <div
      ref="plot"
      class="plot"
      role="img"
      :aria-label="`收盘走势（样例） · ${series.unit} · ${series.freq} · 截至 ${series.asOf}`"
    />
  </figure>
</template>

<style scoped>
.sample-chart {
  min-width: 0;
  margin: 0 0 var(--fai-space-grid-gap);
}

figcaption {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--fai-space-grid-gap);
  color: var(--fai-text-secondary);
  font-family: var(--fai-font-sans);
  font-size: var(--fai-type-card-sub);
}

figcaption .num {
  display: inline;
}

.unit {
  font-family: var(--fai-font-mono);
  font-size: var(--fai-type-unit);
  text-align: right;
}

.plot {
  width: 100%;
  height: calc(var(--fai-space-grid-gap) * 16);
}
</style>
