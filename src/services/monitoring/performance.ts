import { logger } from './logger';

interface PerformanceMetric {
  name: string;
  startTime: number;
  duration?: number;
  data?: any;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, PerformanceMetric> = new Map();
  private thresholds: Map<string, number> = new Map();

  private constructor() {
    // Définir des seuils par défaut (en millisecondes)
    this.thresholds.set('api', 1000); // 1 seconde
    this.thresholds.set('render', 100); // 100ms
    this.thresholds.set('database', 500); // 500ms
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startMeasure(name: string, data?: any) {
    this.metrics.set(name, {
      name,
      startTime: performance.now(),
      data,
    });
  }

  endMeasure(name: string) {
    const metric = this.metrics.get(name);
    if (!metric) {
      logger.warn(`No performance measurement found for: ${name}`);
      return;
    }

    const duration = performance.now() - metric.startTime;
    metric.duration = duration;

    // Vérifier si la durée dépasse le seuil
    const threshold = this.thresholds.get(name) || 1000;
    if (duration > threshold) {
      logger.warn(`Performance threshold exceeded for ${name}`, {
        duration,
        threshold,
        data: metric.data,
      });
    }

    this.metrics.delete(name);
    return duration;
  }

  setThreshold(name: string, threshold: number) {
    this.thresholds.set(name, threshold);
  }

  measure<T>(name: string, fn: () => Promise<T>): Promise<T> {
    this.startMeasure(name);
    return fn().finally(() => {
      this.endMeasure(name);
    });
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance();