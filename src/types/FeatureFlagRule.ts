export interface FeatureFlagRule {
  // Environments y usuarios para los que estara disponible la feature. Si está vacío, aplica a todos.
  environments?: string[];
  users?: string[];
  // Users que no van a tener acceso a la feature
  excludedUsers?: Record<string, string[]>;
}
