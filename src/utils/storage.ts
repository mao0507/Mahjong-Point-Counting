/**
 * 本地儲存工具
 */

/**
 * 儲存資料到 localStorage
 */
export function saveToStorage<T>(key: string, data: T): void {
  try {
    const jsonString = JSON.stringify(data)
    localStorage.setItem(key, jsonString)
  } catch (error) {
    console.error('儲存資料失敗:', error)
  }
}

/**
 * 從 localStorage 讀取資料
 */
export function loadFromStorage<T>(key: string): T | null {
  try {
    const jsonString = localStorage.getItem(key)
    if (jsonString) {
      return JSON.parse(jsonString) as T
    }
    return null
  } catch (error) {
    console.error('讀取資料失敗:', error)
    return null
  }
}

/**
 * 從 localStorage 刪除資料
 */
export function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error('刪除資料失敗:', error)
  }
}

/**
 * 清空 localStorage
 */
export function clearStorage(): void {
  try {
    localStorage.clear()
  } catch (error) {
    console.error('清空資料失敗:', error)
  }
}
