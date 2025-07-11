import { FeatureFlag } from "./FeatureFlag";

export interface FeatureFlagsConfig {
  [featureName: string]: FeatureFlag;
}