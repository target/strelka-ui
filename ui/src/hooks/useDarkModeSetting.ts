import { useLocalStorage } from './useLocalStorage'

/**
 * Fetches the dark mode setting from local storage.
 *
 * @returns {UseQueryResult<boolean, Error>} The dark mode setting.
 */
export function useDarkModeSetting() {
  const { data, isLoading, mutate } = useLocalStorage('isDarkMode', false)

  const setDarkMode = (state: boolean) => {
    mutate(state)
  }

  return { isDarkMode: Boolean(data), isLoading, setDarkMode }
}
