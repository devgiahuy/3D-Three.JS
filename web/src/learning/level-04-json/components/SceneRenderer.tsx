import { Html } from '@react-three/drei';
import { getModelComponent } from '../helpers/model-registry';
import type { SceneObject } from '../helpers/scene.types';

type SceneRendererProps = {
  objects: SceneObject[];
};

function UnknownModel({ modelId }: { modelId: string }) {
  return (
    <group>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ef4444" wireframe />
      </mesh>

      <Html position={[0, 1.3, 0]} center>
        <span
          style={{
            display: 'block',
            padding: '4px 8px',
            borderRadius: 4,
            color: '#ffffff',
            background: '#991b1b',
            fontSize: 12,
            whiteSpace: 'nowrap',
          }}
        >
          Không hỗ trợ: {modelId}
        </span>
      </Html>
    </group>
  );
}

export function SceneRenderer({ objects }: SceneRendererProps) {
  return (
    <>
      {objects.map((object) => {
        const Model = getModelComponent(object.modelId);

        return (
          <group
            key={object.id}
            position={object.position}
            userData={{
              sceneObjectId: object.id,
              modelId: object.modelId,
            }}
          >
            {Model ? <Model /> : <UnknownModel modelId={object.modelId} />}
          </group>
        );
      })}
    </>
  );
}
