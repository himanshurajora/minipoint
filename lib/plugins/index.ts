// Purpose: Exports all plugins.
/**
 * @author @himanshurajora
 * Reason for keeping line, circle and other objects in plugins is that they are not core to the engine.
 * I only want to support point but still if someone wants to use line, circle or other objects they can use it.
 * But they will never be a part of core minipoint engine, these objects are useful for props and visualization improvements in the experiments.
 */

export * from './line';
