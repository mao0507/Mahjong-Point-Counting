/**
 * 格式化工具函數
 */

/**
 * 格式化日期時間
 * @param timestamp 時間戳記
 * @returns 格式化的日期時間字串
 */
export function formatDateTime(timestamp: number): string {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${year}/${month}/${day} ${hours}:${minutes}`
}

/**
 * 格式化日期
 * @param timestamp 時間戳記
 * @returns 格式化的日期字串
 */
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}/${month}/${day}`
}

/**
 * 格式化時間
 * @param timestamp 時間戳記
 * @returns 格式化的時間字串
 */
export function formatTime(timestamp: number): string {
  const date = new Date(timestamp)
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${hours}:${minutes}`
}

/**
 * 格式化數字（加上千分位）
 * @param num 數字
 * @returns 格式化的數字字串
 */
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * 格式化百分比
 * @param value 數值
 * @param decimals 小數位數
 * @returns 格式化的百分比字串
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`
}
