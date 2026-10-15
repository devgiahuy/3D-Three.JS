import styles from '../shared/lab.module.css';
import { SceneExperience } from './components/SceneExperience';
import { formatSceneValidationIssues, validateScene } from './helpers/validate-scene';
import type { SceneOption } from './helpers/scene.types';
import sampleSceneJson from './scene.sample.json';
import secondSceneJson from './scene.second.json';

const SCENE_SOURCES = [
  {
    id: 'sample',
    label: 'Scene mẫu',
    value: sampleSceneJson,
  },
  {
    id: 'second',
    label: 'Scene tái sử dụng',
    value: secondSceneJson,
  },
] as const;

export default function Exercise() {
  const scenes: SceneOption[] = [];
  const errors: string[] = [];

  for (const source of SCENE_SOURCES) {
    const result = validateScene(source.value);

    if (!result.ok) {
      errors.push(`${source.label}: ${formatSceneValidationIssues(result.issues)}`);
      continue;
    }

    scenes.push({
      id: source.id,
      label: source.label,
      data: result.data,
    });
  }

  if (errors.length > 0) {
    return (
      <section className={styles.scene}>
        <div className={styles.error} role="alert">
          <strong>Không thể dựng scene vì JSON không hợp lệ.</strong>
          <ul>
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  return <SceneExperience scenes={scenes} />;
}
