import type { ComponentType } from 'react';
import {
  CharacterPrimitive,
  FinishLinePrimitive,
  HurdlePrimitive,
  StartLinePrimitive,
} from '../components/scene-primitives';

const MODEL_REGISTRY: Readonly<Record<string, ComponentType>> = Object.freeze({
  start_line_primitive: StartLinePrimitive,
  hurdle_primitive: HurdlePrimitive,
  character_primitive: CharacterPrimitive,
  finish_line_primitive: FinishLinePrimitive,
});

export function getModelComponent(modelId: string): ComponentType | undefined {
  return MODEL_REGISTRY[modelId];
}

export function getSupportedModelIds(): string[] {
  return Object.keys(MODEL_REGISTRY);
}
