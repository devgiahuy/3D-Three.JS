import {
  SUPPORTED_SCHEMA_VERSION,
  type Position3D,
  type SceneData,
  type SceneObject,
  type SceneValidationIssue,
  type SceneValidationResult,
} from './scene.types';

const MAX_SCENE_OBJECTS = 500;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isPosition3D(value: unknown): value is Position3D {
  return (
    Array.isArray(value) &&
    value.length === 3 &&
    value.every((coordinate) => typeof coordinate === 'number' && Number.isFinite(coordinate))
  );
}

export function validateScene(value: unknown): SceneValidationResult {
  if (!isRecord(value)) {
    return {
      ok: false,
      issues: [{ path: '$', message: 'Scene phải là một JSON object.' }],
    };
  }

  if (value.schemaVersion !== SUPPORTED_SCHEMA_VERSION) {
    return {
      ok: false,
      issues: [
        {
          path: '$.schemaVersion',
          message: `Chỉ hỗ trợ schemaVersion ${SUPPORTED_SCHEMA_VERSION}; nhận được ${String(value.schemaVersion)}.`,
        },
      ],
    };
  }

  if (!Array.isArray(value.objects)) {
    return {
      ok: false,
      issues: [{ path: '$.objects', message: 'objects phải là một mảng.' }],
    };
  }

  if (value.objects.length > MAX_SCENE_OBJECTS) {
    return {
      ok: false,
      issues: [
        {
          path: '$.objects',
          message: `Scene chỉ được chứa tối đa ${MAX_SCENE_OBJECTS} objects.`,
        },
      ],
    };
  }

  const ids = new Set<string>();
  const objects: SceneObject[] = [];
  const issues: SceneValidationIssue[] = [];

  value.objects.forEach((rawObject, index) => {
    const path = `$.objects[${index}]`;

    if (!isRecord(rawObject)) {
      issues.push({ path, message: 'Phần tử phải là một object.' });
      return;
    }

    let objectIsValid = true;

    if (!isNonEmptyString(rawObject.id)) {
      issues.push({
        path: `${path}.id`,
        message: 'id phải là chuỗi không rỗng.',
      });
      objectIsValid = false;
    } else if (ids.has(rawObject.id)) {
      issues.push({
        path: `${path}.id`,
        message: `id "${rawObject.id}" bị trùng.`,
      });
      objectIsValid = false;
    } else {
      ids.add(rawObject.id);
    }

    if (!isNonEmptyString(rawObject.modelId)) {
      issues.push({
        path: `${path}.modelId`,
        message: 'modelId phải là chuỗi không rỗng.',
      });
      objectIsValid = false;
    }

    if (!isPosition3D(rawObject.position)) {
      issues.push({
        path: `${path}.position`,
        message: 'position phải chứa đúng ba số hữu hạn [x, y, z].',
      });
      objectIsValid = false;
    }

    if (
      objectIsValid &&
      isNonEmptyString(rawObject.id) &&
      isNonEmptyString(rawObject.modelId) &&
      isPosition3D(rawObject.position)
    ) {
      objects.push({
        id: rawObject.id,
        modelId: rawObject.modelId,
        position: [...rawObject.position],
      });
    }
  });

  if (issues.length > 0) {
    return { ok: false, issues };
  }

  const data: SceneData = {
    schemaVersion: SUPPORTED_SCHEMA_VERSION,
    activityType: value.activityType,
    mode: value.mode,
    objects,
    steps: value.steps,
  };

  return { ok: true, data };
}

export function formatSceneValidationIssues(issues: SceneValidationIssue[]): string {
  return issues.map((issue) => `${issue.path}: ${issue.message}`).join(' | ');
}
