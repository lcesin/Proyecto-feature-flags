import { featureFlagManager, isFeatureEnabled } from './FeatureFlagManager';
import { FeatureFlagsConfig } from '../types/FeatureFlagConfig';
import { EvaluationContext } from '../types/EvaluationContext';

const testConfig: FeatureFlagsConfig = {
  'simple-on': {
    description: 'Funcion que siempre esta activada.',
    enabled: true,
  },
  'simple-off': {
    description: 'Funcion que siempre esta apagada.',
    enabled: false,
  },
  'env-specific': {
    description: 'Solo para el entorno "test".',
    enabled: {
      environments: ['test'],
    },
  },
  'user-specific': {
    description: 'Solo para el usuario "papitaFrita".',
    enabled: {
      users: ['papitaFrita'],
    },
  },
  'complex-rule': {
    description: 'Activado para "user01" en el entorno "prod", pero no para "user02".',
    enabled: {
      environments: ['prod'],
      users: ['user01'],
      excludedUsers: {
        prod: ['user02'],
      },
    },
  },
};

describe('isFeatureEnabled', () => {
  beforeEach(() => {
    // Load a fresh config before each test
    featureFlagManager.loadConfig(testConfig);
  });

  test('deberia retornar false al ser una funcion que no existe', () => {
    expect(isFeatureEnabled('non-existent-feature')).toBe(false);
  });

  test('deberia retornar true al ser una funcion que siempre esta activada', () => {
    expect(isFeatureEnabled('simple-on')).toBe(true);
  });

  test('deberia retornar false al ser una funcion que siempre esta desactivada', () => {
    expect(isFeatureEnabled('simple-off')).toBe(false);
  });

  describe('Reglas segun el entorno', () => {
    test('deberia retornar true cuando el entorno ("test" en este caso) coincida', () => {
      const context: EvaluationContext = { environment: 'test' };
      expect(isFeatureEnabled('env-specific', context)).toBe(true);
    });

    test('deberia retornar false al ser un entorno que no esta contemplado ("prod")', () => {
      const context: EvaluationContext = { environment: 'prod' };
      expect(isFeatureEnabled('env-specific', context)).toBe(false);
    });

    test('deberia retornar false porque la regla "env-specific" existe, pero no se le esta pasando el contexto necesario', () => {
      expect(isFeatureEnabled('env-specific', {})).toBe(false);
    });
  });

  describe('User-Specific Rules', () => {
    test('deberia devolver true dado que el user (papitaFrita) esta habilitado para la funcion', () => {
      const context: EvaluationContext = { user: { id: 'papitaFrita' } };
      expect(isFeatureEnabled('user-specific', context)).toBe(true);
    });

    test('deberia retornar false dado que ese usuario no esta contemplado en ninguna flag', () => {
      const context: EvaluationContext = { user: { id: 'user000' } };
      expect(isFeatureEnabled('user-specific', context)).toBe(false);
    });
  });

  describe('Complex Rules with Exclusions', () => {
    test('deberia retornar false dado que el usuario (user02) esta excluido', () => {
      const context: EvaluationContext = { environment: 'prod', user: { id: 'user02' } };
      expect(isFeatureEnabled('complex-rule', context)).toBe(false);
    });

    test('deberia retornar false porque el usuario (user01) si esta contemplado en una flag, pero no en ese entorno (test)', () => {
      const context: EvaluationContext = { environment: 'test', user: { id: 'user01' } };
      expect(isFeatureEnabled('complex-rule', context)).toBe(false);
    });
  });
});