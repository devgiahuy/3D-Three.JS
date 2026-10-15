export const SUPPORTED_SCHEMA_VERSION = '1.0' as const;

export type Position3D = [number, number, number];

export type SceneObject = {
  id: string;
  modelId: string;
  position: Position3D;
};

export type SceneData = {
  schemaVersion: typeof SUPPORTED_SCHEMA_VERSION;
  activityType?: unknown;
  mode?: unknown;
  objects: SceneObject[];
  steps?: unknown;
};

export type SceneOption = {
  id: string;
  label: string;
  data: SceneData;
};

export type SceneValidationIssue = {
  path: string;
  message: string;
};

export type SceneValidationResult =
  | {
      ok: true;
      data: SceneData;
    }
  | {
      ok: false;
      issues: SceneValidationIssue[];
    };
