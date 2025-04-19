<script lang="ts" setup>
import { SizeType } from '@/types/baseModels'

interface Props {
  showloading: boolean
  loadingsize: SizeType
}

const props = defineProps<Props>()

const loaderSize = computed(() => {
  switch (props.loadingsize) {
    case SizeType.XS:
    case SizeType.SM:
      return 16
    case SizeType.MD:
    case SizeType.LG:
      return 24
    default:
      return 36
  }
})

const widthSize = computed(() => {
  switch (props.loadingsize) {
    case SizeType.XS:
    case SizeType.SM:
      return 1
    case SizeType.MD:
    case SizeType.LG:
      return 3
    default:
      return 5
  }
})
</script>

<template>
  <div v-if="props.showloading" class="mc-loading-overlay">
    <!-- <div class="loading-spinner" /> -->
    <!--
      <div class="loader">
      <svg viewBox="0 0 80 80">
      <rect x="8" y="8" width="64" height="64" />
      </svg>
    -->
    <VProgressCircular
      :size="loaderSize"
      :width="widthSize"
      color="primary"
      indeterminate
    />
  <!-- </div> -->
  </div>
</template>

<style lang="scss">
// .loader {
//     --path: #2F3545;
//     --dot: #5628EE;
//     --duration: 3s;
//     width: 44px;
//     height: 44px;
//     position: relative;
//     &:before {
//         content: '';
//         width: 6px;
//         height: 6px;
//         border-radius: 50%;
//         position: absolute;
//         display: block;
//         background: var(--dot);
//         top: 37px;
//         left: 19px;
//         transform: translate(-18px, -18px);
//         animation: dotRect var(--duration) cubic-bezier(0.785, 0.135, 0.15, 0.86) infinite;
//     }
//     svg {
//         display: block;
//         width: 100%;
//         height: 100%;
//         rect,
//         polygon,
//         circle {
//             fill: none;
//             stroke: var(--path);
//             stroke-width: 10px;
//             stroke-linejoin: round;
//             stroke-linecap: round;
//         }
//         polygon {
//             stroke-dasharray: 145 calc(221 - 145) 145 calc(221 - 145);
//             stroke-dashoffset: 0;
//             animation: pathTriangle var(--duration) cubic-bezier(0.785, 0.135, 0.15, 0.86) infinite;
//         }
//         rect {
//             stroke-dasharray: calc(256 / 4 * 3) calc(256 / 4) calc(256 / 4 * 3) calc(256 / 4);
//             stroke-dashoffset: 0;
//             animation: pathRect 3s cubic-bezier(0.785, 0.135, 0.15, 0.86) infinite;
//         }
//         circle {
//             stroke-dasharray: calc(200 / 4 * 3) calc(200 / 4) calc(200 / 4 * 3) calc(200 / 4);
//             stroke-dashoffset: 75;
//             animation: pathCircle var(--duration) cubic-bezier(0.785, 0.135, 0.15, 0.86) infinite;
//         }
//     }
//     &.triangle {
//         width: 48px;
//         &:before {
//             left: 21px;
//             transform: translate(-10px, -18px);
//             animation: dotTriangle var(--duration) cubic-bezier(0.785, 0.135, 0.15, 0.86) infinite;
//         }
//     }
// }

// @keyframes pathTriangle {
//     33% {
//         stroke-dashoffset: 74;
//     }
//     66% {
//         stroke-dashoffset: 147;
//     }
//     100% {
//         stroke-dashoffset: 221;
//     }
// }

// @keyframes dotTriangle {
//     33% {
//         transform: translate(0, 0);
//     }
//     66% {
//         transform: translate(10px, -18px);
//     }
//     100% {
//         transform: translate(-10px, -18px);
//     }
// }

// @keyframes pathRect {
//     25% {
//         stroke-dashoffset: 64;
//     }
//     50% {
//         stroke-dashoffset: 128;
//     }
//     75% {
//         stroke-dashoffset: 192;
//     }
//     100% {
//         stroke-dashoffset: 256;
//     }
// }

// @keyframes dotRect {
//     25% {
//         transform: translate(0, 0);
//     }
//     50% {
//         transform: translate(18px, -18px);
//     }
//     75% {
//         transform: translate(0, -36px);
//     }
//     100% {
//         transform: translate(-18px, -18px);
//     }
// }

// @keyframes pathCircle {
//     25% {
//         stroke-dashoffset: 125;
//     }
//     50% {
//         stroke-dashoffset: 175;
//     }
//     75% {
//         stroke-dashoffset: 225;
//     }
//     100% {
//         stroke-dashoffset: 275;
//     }
// }

// .loader {
//     display: inline-block;
//     margin: 0 16px;
// }

// .loading-spinner {
//   border: 6px solid rgba(255, 255, 255, 0.2);
//   border-left-color: white;
//   width: 40px;
//   height: 40px;
//   border-radius: 50%;
//   animation: spin 1s linear infinite;
// }

// @keyframes spin {
//   to {
//     transform: rotate(360deg);
//   }
// }
</style>
