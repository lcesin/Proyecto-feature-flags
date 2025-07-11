import { FeatureFlagRule } from "./FeatureFlagRule";

export interface FeatureFlag {
  description: string;
  // Puede ser un booleano simple o un objeto con reglas complejas.
  enabled: boolean | FeatureFlagRule;
}