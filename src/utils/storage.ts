/**
 * 本地儲存工具
 */

/**
 * 儲存資料到 localStorage
 * @param key - 儲存的鍵名
 * @param data - 要儲存的資料
 * @template T - 資料類型
 * @throws {Error} 當儲存失敗時會記錄錯誤到控制台
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
 * @param key - 要讀取的鍵名
 * @template T - 資料類型
 * @returns 讀取到的資料，如果不存在或解析失敗則返回 null
 * @throws {Error} 當讀取失敗時會記錄錯誤到控制台
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
 * 從 localStorage 刪除指定鍵的資料
 * @param key - 要刪除的鍵名
 * @throws {Error} 當刪除失敗時會記錄錯誤到控制台
 */
export function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error('刪除資料失敗:', error)
  }
}

/**
 * 清空 localStorage 中的所有資料
 * @throws {Error} 當清空失敗時會記錄錯誤到控制台
 */
export function clearStorage(): void {
  try {
    localStorage.clear()
  } catch (error) {
    console.error('清空資料失敗:', error)
  }
}
