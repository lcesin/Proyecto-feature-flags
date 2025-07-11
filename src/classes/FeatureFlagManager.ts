// src/manager.ts
import { FeatureFlagsConfig } from "../types/FeatureFlagConfig";
import { EvaluationContext } from "../types/EvaluationContext";
import { FeatureFlagRule } from "../types/FeatureFlagRule";

class FeatureFlagManager {
  private static instance: FeatureFlagManager;
  private config: FeatureFlagsConfig = {};

  private constructor() {}

  public static getInstance(): FeatureFlagManager {
    if (!FeatureFlagManager.instance) {
      FeatureFlagManager.instance = new FeatureFlagManager();
    }
    return FeatureFlagManager.instance;
  }

  public loadConfig(config: FeatureFlagsConfig): void {
    this.config = config;
  }

  public getFlag(name: string) {
    return this.config[name];
  }
}

export const featureFlagManager = FeatureFlagManager.getInstance();

export function isFeatureEnabled(name: string, context: EvaluationContext = {}): boolean {
  const flag = featureFlagManager.getFlag(name);

  if (!flag) {
    return false;
  }

  // Caso 1: Booleano simple
  if (typeof flag.enabled === 'boolean') {
    return flag.enabled;
  }

  // Caso 2: Reglas complejas
  const rules = flag.enabled as FeatureFlagRule;
  const { environment, user } = context;

  // Regla de exclusión: ¿El usuario está explícitamente bloqueado en este entorno?
  if (environment && user && rules.excludedUsers?.[environment]?.includes(user.id)) {
    return false;
  }

  // Regla de entorno: Si se definen entornos, ¿estamos en uno de ellos?
  if (rules.environments && rules.environments.length > 0) {
    if (!environment || !rules.environments.includes(environment)) {
      return false;
    }
  }

  if (rules.users && rules.users.length > 0) {
    if (!user || !rules.users.includes(user.id)) {
      return false;
    }
  }

  return true;
}