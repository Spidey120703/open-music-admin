<script setup lang="ts">

import { onMounted, ref } from 'vue'

const bgContainer = ref<HTMLElement>()

// 生成随机数工具
const random = (min: number, max: number) =>
  Math.random() * (max - min) + min

// 创建色块元素
const createBlob = () => {
  const blob = document.createElement('div')

  // 随机样式参数
  const width = random(80, 360)
  const height = random(80, 360)
  const translateX = random(-20, window.innerWidth + 20)
  const translateY = random(-20, window.innerHeight + 20)
  const rotate = random(0, 360)
  const hue = random(0, 360)

  // 随机形状
  switch(Math.floor(random(1, 3))) {
    case 1: // 多边形
      const vertexCount = Math.floor(random(5, 9)) // 5-8边形
      const angles = Array.from({ length: vertexCount }, (_, i) =>
        (i * 360)/vertexCount + random(-12, 12)
      ).sort((a, b) => a - b)
      const points =  angles.map(angle => {
        const radius = random(25, 75)
        const radian = (angle * Math.PI)/180
        const x = 25 + radius * Math.cos(radian)
        const y = 25 + radius * Math.sin(radian)
        return `${x.toFixed(1)}% ${y.toFixed(1)}%`
      }).join(', ')
      blob.style.clipPath = `polygon(${points})`
      break
    case 2: // 随机角半径
      const radii = Array.from({length: 2},
        () => Array.from({length: 4},
          () => `${random(0,100)}%`
        ).join(' ')
      ).join(' / ')
      blob.style.borderRadius = radii
      break
  }

  // 动态样式
  Object.assign(blob.style, {
    width: `${width}px`,
    height: `${height}px`,
    background: `hsla(${hue}, 70%, 60%, 0.5)`,
    // background: `hsla(${hue}, 70%, 60%, 0.15)`,
    position: 'absolute',
    transform: `translate(${translateX}px, ${translateY}px) rotate(${rotate}deg)`,
    willChange: 'transform, border-radius'
  })

  blob.animate(
    Array.from({ length: random(3, 16) }, () => ({
      transform: `translate(${random(-200, 200)}px, ${random(-200, 200)}px) rotate(${random(-18, 18)}deg)`
    })), {
      duration: random(30000, 120000),
      easing: 'linear',
      iterations: Infinity,
      fill: 'forwards',
      composite: 'accumulate',
      direction: 'alternate'
    })

  return blob
}

// 动效初始化
const initBackground = () => {
  if (!bgContainer.value) return

  // 生成色块数量（根据屏幕尺寸自适应）
  const count = Math.floor((window.innerWidth * window.innerHeight) / 80000)

  // 批量创建色块
  Array.from({ length: count }).forEach(() => {
    bgContainer.value?.appendChild(createBlob())
  })
}

// 生命周期管理
onMounted(() => {
  initBackground()
})
</script>

<template>
  <div ref="bgContainer" class="absolute inset-0 z-0" style="filter: blur(100px);" />
</template>

<style scoped>

</style>
