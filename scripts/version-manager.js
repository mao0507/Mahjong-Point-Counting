#!/usr/bin/env node

/**
 * 自動版本管理和Git tag腳本 (Node.js版本)
 * 使用方法: node scripts/version-manager.js [major|minor|patch|custom] [custom-version]
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// 顏色定義
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  purple: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function execCommand(command, options = {}) {
  try {
    return execSync(command, { encoding: 'utf8', stdio: options.silent ? 'pipe' : 'inherit', ...options });
  } catch (error) {
    if (!options.silent) {
      throw error;
    }
    return null;
  }
}

function getCurrentVersion() {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  return packageJson.version;
}

function updatePackageVersion(newVersion) {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  packageJson.version = newVersion;
  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2) + '\n');
}

function parseVersion(version) {
  return version.split('.').map(num => parseInt(num, 10));
}

function incrementVersion(currentVersion, type) {
  const [major, minor, patch] = parseVersion(currentVersion);

  switch (type) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
    default:
      throw new Error(`無效的版本類型: ${type}`);
  }
}

function validateVersion(version) {
  const versionRegex = /^\d+\.\d+\.\d+$/;
  return versionRegex.test(version);
}

function hasUncommittedChanges() {
  try {
    const result = execCommand('git status --porcelain', { silent: true });
    return result && result.trim().length > 0;
  } catch {
    return false;
  }
}

function tagExists(tag) {
  try {
    execCommand(`git show-ref --verify --quiet refs/tags/${tag}`, { silent: true });
    return true;
  } catch {
    return false;
  }
}

function deleteTag(tag) {
  try {
    execCommand(`git tag -d ${tag}`, { silent: true });
    return true;
  } catch {
    return false;
  }
}

function main() {
  const args = process.argv.slice(2);
  const versionType = args[0] || 'patch';
  const customVersion = args[1] || '';

  log('🚀 自動版本管理腳本', 'blue');
  log('', 'reset');

  // 獲取當前版本
  const currentVersion = getCurrentVersion();
  log(`🔍 當前版本: ${currentVersion}`, 'cyan');

  let newVersion;

  // 計算新版本號
  if (versionType === 'custom') {
    if (!customVersion) {
      log('❌ 錯誤: 使用custom模式時必須提供自定義版本號', 'red');
      log('使用方法: node scripts/version-manager.js custom 2.1.5', 'yellow');
      process.exit(1);
    }
    newVersion = customVersion;
    log(`📈 自定義版本: ${currentVersion} → ${newVersion}`, 'yellow');
  } else {
    try {
      newVersion = incrementVersion(currentVersion, versionType);
      const [major, minor, patch] = parseVersion(currentVersion);
      const [newMajor, newMinor, newPatch] = parseVersion(newVersion);

      let changeType = '';
      if (newMajor > major) changeType = '主要版本';
      else if (newMinor > minor) changeType = '次要版本';
      else if (newPatch > patch) changeType = '修補版本';

      log(`📈 ${changeType}更新: ${currentVersion} → ${newVersion}`, 'yellow');
    } catch (error) {
      log(`❌ 錯誤: ${error.message}`, 'red');
      log('支援的類型: major, minor, patch, custom', 'yellow');
      process.exit(1);
    }
  }

  // 驗證版本號格式
  if (!validateVersion(newVersion)) {
    log(`❌ 錯誤: 無效的版本號格式 '${newVersion}'`, 'red');
    log('版本號必須符合格式: x.y.z (例如: 1.2.3)', 'yellow');
    process.exit(1);
  }

  log(`✅ 新版本號: ${newVersion}`, 'green');
  log('', 'reset');

  // 檢查未提交的更改
  if (hasUncommittedChanges()) {
    log('⚠️  檢測到未提交的更改', 'yellow');
    log('建議先提交所有更改再更新版本', 'yellow');
    log('', 'reset');

    // 在Node.js環境中，我們無法直接讀取用戶輸入，所以直接繼續
    log('繼續執行版本更新...', 'blue');
  }

  // 檢查tag是否已存在
  const tagName = `v${newVersion}`;
  if (tagExists(tagName)) {
    log(`⚠️  tag ${tagName} 已經存在`, 'yellow');
    log('嘗試刪除現有tag...', 'blue');
    deleteTag(tagName);
  }

  // 更新package.json版本
  log('📝 更新package.json版本...', 'blue');
  updatePackageVersion(newVersion);

  // 驗證版本更新
  const updatedVersion = getCurrentVersion();
  if (updatedVersion !== newVersion) {
    log('❌ 錯誤: package.json版本更新失敗', 'red');
    process.exit(1);
  }

  log(`✅ package.json已更新: ${currentVersion} → ${newVersion}`, 'green');

  // 創建提交
  log('📝 創建版本更新提交...', 'blue');
  execCommand('git add package.json');
  execCommand(`git commit -m "chore: bump version to ${newVersion}

- 自動版本更新
- 版本類型: ${versionType}
- 更新時間: ${new Date().toLocaleString('zh-TW')}"`);

  // 創建tag
  log(`🏷️  創建Git tag: ${tagName}`, 'blue');
  execCommand(`git tag -a "${tagName}" -m "Release version ${newVersion}

## 版本信息
- 版本號: ${newVersion}
- 更新類型: ${versionType}
- 發布時間: ${new Date().toLocaleString('zh-TW')}

## 變更摘要
- 版本號從 ${currentVersion} 更新至 ${newVersion}
- 準備發布新版本

## 自動化部署
此tag將觸發GitHub Actions自動構建和部署流程。"`);

  log(`✅ Git tag已創建: ${tagName}`, 'green');

  // 顯示下一步操作
  log('', 'reset');
  log('🎉 版本更新完成！', 'purple');
  log('', 'reset');
  log('📋 下一步操作:', 'blue');
  log('1. 推送提交和tag到GitHub:', 'blue');
  log(`   git push origin main`, 'yellow');
  log(`   git push origin ${tagName}`, 'yellow');
  log('', 'reset');
  log('2. 或者一次性推送所有內容:', 'blue');
  log(`   git push origin main --tags`, 'yellow');
  log('', 'reset');
  log('3. 查看GitHub Actions執行狀態:', 'blue');
  log('   https://github.com/[您的用戶名]/[您的倉庫名]/actions', 'yellow');
  log('', 'reset');

  log('🎉 腳本執行完成！', 'green');
}

// 錯誤處理
process.on('uncaughtException', (error) => {
  log(`❌ 未預期的錯誤: ${error.message}`, 'red');
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  log(`❌ 未處理的Promise拒絕: ${reason}`, 'red');
  process.exit(1);
});

// 執行主函數
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main };
