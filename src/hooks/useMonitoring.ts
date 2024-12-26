import { useEffect } from 'react';
import { logger } from '@/services/monitoring/logger';
import { performanceMonitor } from '@/services/monitoring/performance';

export const useMonitoring = (componentName: string) => {
  useEffect(() => {
    const startTime = performance.now();
    logger.debug(`${componentName} mounted`);

    return () => {
      const duration = performance.now() - startTime;
      logger.debug(`${componentName} unmounted after ${duration}ms`);
    };
  }, [componentName]);

  const trackAction = async <T>(
    actionName: string,
    action: () => Promise<T>
  ): Promise<T> => {
    const fullActionName = `${componentName}.${actionName}`;
    try {
      return await performanceMonitor.measure(fullActionName, action);
    } catch (error) {
      logger.error(`Error in ${fullActionName}:`, error);
      throw error;
    }
  };

  return {
    trackAction,
    logInfo: (message: string, data?: any) => logger.info(`[${componentName}] ${message}`, data),
    logError: (message: string, error?: any) => logger.error(`[${componentName}] ${message}`, error),
    logWarning: (message: string, data?: any) => logger.warn(`[${componentName}] ${message}`, data),
    logDebug: (message: string, data?: any) => logger.debug(`[${componentName}] ${message}`, data),
  };
};