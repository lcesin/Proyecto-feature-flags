# Proyecto Feature-Flags

**Profesor:** Luis Fuentes  
**Estudiantes:** Adrian Pita, Luis Cesin

## Resumen

Esta librería proporciona una solución sencilla y flexible para la gestión de *Feature Flags* (o interruptores de características) en aplicaciones TypeScript/JavaScript. Permite activar o desactivar funcionalidades de forma dinámica sin necesidad de desplegar nuevo código, basándose en un conjunto de reglas configurables.

## Conceptos Principales

La librería se basa en tres componentes fundamentales:

1.  **`FeatureFlagManager`**: Es el núcleo de la librería. Se trata de una clase singleton responsable de cargar y almacenar la configuración de todas las *feature flags*. Al ser un singleton, garantiza que la configuración se cargue una sola vez y sea accesible desde cualquier parte de la aplicación.

2.  **`isFeatureEnabled`**: Es la función principal que se utiliza para consultar el estado de una característica. Devuelve `true` o `false` dependiendo de si la *feature flag* está activa según las reglas y el contexto de evaluación proporcionado.

3.  **Configuración**: La librería se inicializa con un objeto de configuración que define todas las *feature flags* disponibles. Cada *flag* tiene una descripción y un estado de activación, que puede ser un simple booleano o un objeto con reglas complejas.

## ¿Cómo Funciona?

El flujo de trabajo para utilizar la librería es el siguiente:

1.  **Cargar la Configuración**: Al inicio de la aplicación, se debe cargar un objeto de configuración utilizando el método `loadConfig` del `featureFlagManager`. Este objeto contiene la definición de todas las características que se desean controlar.

2.  **Verificar una Característica**: Cuando se necesite saber si una funcionalidad debe estar activa, se llama a la función `isFeatureEnabled`. Esta función recibe dos argumentos: el nombre de la *feature flag* que se quiere consultar y un objeto de `contexto`.

## Lógica de Evaluación

La potencia de la librería reside en su capacidad para evaluar reglas complejas:

*   **Activación Simple**: Una característica puede estar simplemente activada (`true`) o desactivada (`false`) para todos los usuarios y entornos.

*   **Evaluación por Reglas**: Si la activación no es un booleano, se evalúa un objeto de reglas basado en el `contexto` proporcionado. El contexto puede incluir información como el `entorno` actual (ej: 'produccion', 'desarrollo') y el `usuario` que está utilizando la aplicación.

Las reglas disponibles son:

*   **`environments`**: La característica solo estará activa si el entorno actual se encuentra en la lista de entornos permitidos.
*   **`users`**: La característica solo estará activa si el ID del usuario actual se encuentra en la lista de usuarios permitidos.
*   **`excludedUsers`**: Permite bloquear explícitamente a ciertos usuarios en entornos específicos. Esta regla tiene la máxima prioridad; si un usuario está en esta lista para el entorno actual, la característica siempre estará desactivada para él, incluso si cumple otras reglas.

Si se definen varias reglas, todas deben cumplirse para que la característica se considere activa. Si no se define ninguna regla específica (por ejemplo, la lista de `environments` está vacía), esa regla se considera superada.