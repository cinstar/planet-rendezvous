// Graph3D.js
import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Vector3 } from 'three';

const Node = ({ position, onClick, color, name }) => {
  const meshRef = useRef();
  return (
    <mesh ref={meshRef} position={position} onClick={onClick}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

const Edge = ({ start, end, color }) => {
  const points = [new Vector3(...start), new Vector3(...end)];
  return (
    <line>
      <bufferGeometry attach="geometry" setFromPoints={points} />
      <lineBasicMaterial attach="material" color={color} linewidth={2} />
    </line>
  );
};

const Graph3D = ({ nodes, edges, onNodeClick }) => (
  <Canvas camera={{ position: [0, 0, 10] }}>
    <ambientLight intensity={0.5} />
    <pointLight position={[10, 10, 10]} />
    <OrbitControls />
    {nodes.map((node) => (
      <Node
        key={node.id}
        position={node.position}
        color={node.color}
        onClick={() => onNodeClick(node)}
        name={node.name}
      />
    ))}
    {edges.map((edge, idx) => (
      <Edge key={idx} start={edge.start} end={edge.end} color={edge.color} />
    ))}
  </Canvas>
);

export default Graph3D;
