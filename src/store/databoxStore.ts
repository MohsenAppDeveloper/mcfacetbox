export const useDataShelfStateChanged = createGlobalState(
  () => {
    const lastState = ref(false)

    return { lastState }
  },
)
