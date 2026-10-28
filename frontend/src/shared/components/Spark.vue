<script setup lang="ts">
import { computed, onMounted, useTemplateRef, watch } from 'vue'
import type { SparkSeries } from '../../contracts/types.ts'
import { T } from '../../design/generated/tokens.ts'
import '../num.css'

defineOptions({ name: 'FaiSpark' })
const props = defineProps<{ series: SparkSeries }>()
const canvas = useTemplateRef<HTMLCanvasElement>('canvas')
const values = computed(() => props.series.points.flatMap(point => point.value === null ? [] : [point.value]))
const width = parseFloat(T.space.grid_gap) * 6
const height = parseFloat(T.space.grid_gap) * 2
const inset = parseFloat(T.radius.base) * 2

onMounted(draw)
watch(() => props.series, draw, { deep: true, flush: 'post' })

function draw() {
  const element = canvas.value!
  const context = element.getContext('2d')
  if (!context) return
  const ratio = window.devicePixelRatio
  element.width = Math.round(width * ratio)
  element.height = Math.round(height * ratio)
  context.setTransform(ratio, 0, 0, ratio, 0, 0)
  context.clearRect(0, 0, width, height)
  if (!values.value.length) return

  const min = Math.min(...values.value)
  const max = Math.max(...values.value)
  const y = (value: number) => max === min ? height / 2 : height - inset - (value - min) / (max - min) * (height - inset * 2)
  context.lineWidth = parseFloat(T.radius.base) / 2
  if (min < 0 && max > 0) {
    context.strokeStyle = T.chart.grid
    context.beginPath()
    context.moveTo(inset, y(0))
    context.lineTo(width - inset, y(0))
    context.stroke()
  }

  context.strokeStyle = T.chart.line_0
  context.fillStyle = T.chart.line_0
  context.beginPath()
  let connected = false
  let last: { x: number; y: number } | undefined
  props.series.points.forEach((point, index, points) => {
    if (point.value === null) {
      connected = false
      return
    }
    const x = points.length === 1 ? width / 2 : inset + index / (points.length - 1) * (width - inset * 2)
    const pointY = y(point.value)
    if (connected) context.lineTo(x, pointY)
    else context.moveTo(x, pointY)
    connected = true
    last = { x, y: pointY }
  })
  context.stroke()
  if (last) {
    context.beginPath()
    context.arc(last.x, last.y, parseFloat(T.radius.base), 0, Math.PI * 2)
    context.fill()
  }
}
</script>

<template>
  <span
    class="spark"
    :data-series-id="series.seriesId"
  >
    <canvas
      v-show="values.length"
      ref="canvas"
      :width="width"
      :height="height"
      role="img"
      :aria-label="`走势 · ${series.unit} · ${series.freq} · 截至 ${series.asOf}`"
    />
    <span
      v-if="!values.length"
      class="num is-neutral"
      aria-label="暂无走势数据"
    >–</span>
  </span>
</template>

<style scoped>
.spark {
  display: block;
  width: calc(var(--fai-space-grid-gap) * 6);
}

.spark canvas {
  display: block;
  width: 100%;
  height: calc(var(--fai-space-grid-gap) * 2);
}
</style>
