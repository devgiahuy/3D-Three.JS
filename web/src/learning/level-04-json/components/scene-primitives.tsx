export function HurdlePrimitive() {
  return (
    <group>
      <mesh position={[-0.8, 0.6, 0]}>
        <boxGeometry args={[0.15, 1.2, 0.15]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>

      <mesh position={[0.8, 0.6, 0]}>
        <boxGeometry args={[0.15, 1.2, 0.15]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>

      <mesh position={[0, 1.1, 0]}>
        <boxGeometry args={[1.75, 0.15, 0.15]} />
        <meshStandardMaterial color="#f97316" />
      </mesh>
    </group>
  );
}

export function StartLinePrimitive() {
  return (
    <mesh position={[0, 0.025, 0]}>
      <boxGeometry args={[3, 0.05, 0.25]} />
      <meshStandardMaterial color="#22c55e" />
    </mesh>
  );
}

export function CharacterPrimitive() {
  return (
    <group>
      <mesh position={[0, 0.65, 0]}>
        <cylinderGeometry args={[0.3, 0.35, 0.9, 16]} />
        <meshStandardMaterial color="#38bdf8" />
      </mesh>

      <mesh position={[0, 1.35, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>
    </group>
  );
}

export function FinishLinePrimitive() {
  return (
    <mesh position={[0, 0.025, 0]}>
      <boxGeometry args={[3, 0.05, 0.25]} />
      <meshStandardMaterial color="#ef4444" />
    </mesh>
  );
}
