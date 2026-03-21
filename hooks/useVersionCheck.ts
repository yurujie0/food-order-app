import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { versionApi } from '../services/api';
import { VersionInfo } from '../types';

// 当前应用版本
const CURRENT_VERSION = '1.9.3';
const CURRENT_VERSION_CODE = 12;

export function useVersionCheck() {
  const [updateInfo, setUpdateInfo] = useState<VersionInfo | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [hasUpdate, setHasUpdate] = useState(false);

  useEffect(() => {
    checkForUpdate();
  }, []);

  const checkForUpdate = async () => {
    try {
      setIsChecking(true);
      const latestVersion = await versionApi.checkUpdate();
      
      // 比较版本号
      const needsUpdate = latestVersion.versionCode > CURRENT_VERSION_CODE;
      
      setHasUpdate(needsUpdate);
      setUpdateInfo(latestVersion);
    } catch (error) {
      console.error('检查更新失败:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const dismissUpdate = () => {
    setHasUpdate(false);
  };

  return {
    updateInfo,
    isChecking,
    hasUpdate,
    dismissUpdate,
    checkForUpdate,
  };
}