// ExampleGraph.js
import React, { useRef, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { Vector3 } from 'three';

// -------------------------
// Helper: Generate Random Positions
// -------------------------
function getRandomPosition(scale = 200) {
  return [
    (Math.random() - 0.5) * scale,
    (Math.random() - 0.5) * scale,
    (Math.random() - 0.5) * scale
  ];
}

// -------------------------
// Node Data
// -------------------------
const nodeData = [
  'Farmers Market',
  'Datathon',
  'Cook Breakfast Omelette',
  'Cook Omurice',
  'Cook Quiche',
  'Make BUNNY Tangyuan',
  'Build Flower Lego Set',
  'Beach and Picnic',
  'Watch a musical',
  'Make Boba Milk Tea',
  'Make Ceramics',
  'Art Museum (near Ucen)',
  'Go to a book store (Chaucer) and Buy a Journal',
  'Bakery (Renaud’s)',
  'Shopping for clothes + Sephora!',
  'Photos of flowers on Campus / Favorite Buildings!',
  'Make a Japanese Cheesecake',
  'SB Public Library',
  'Dancing',
  'Stargazing',
  'Hike and camp!',
  'Go to a comedy show',
  'Give Vincent tour of studio',
  'Write Date Balancing Tree ....',
  'Volunteer together (we love kids)',
  'Butterfly grove',
  'Alpaca farm!',
  'Watch all Ghibli Movies',
  'Go to China',
  'Get a Dog and Cat!',
  'Christmas in the park',
  'Cook pasta',
  'Cook Thai curry',
  'Flower Arrange and Paint Vase'
].map((name, index) => ({
  id: index + 1,
  name,
  position: getRandomPosition(30), // Nodes are within a smaller area
  color: `hsl(${Math.random() * 360}, 100%, 50%)`
}));

// -------------------------
// StarField Component (Background Stars Inside 3D Scene)
// -------------------------
// StarField Component - Adds stars inside the 3D scene
function StarField({ count = 3000 }) { // Increase star count
    const stars = useMemo(() => {
      const positions = [];
      for (let i = 0; i < count; i++) {
        positions.push(...getRandomPosition(800)); // Spread out stars over a larger area
      }
      return new Float32Array(positions);
    }, [count]);
  
    return (
      <points>
        <bufferGeometry>
          <bufferAttribute
            attachObject={['attributes', 'position']}
            count={stars.length / 3}
            array={stars}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color="white"
          size={0.5} // Make stars smaller for realism
          sizeAttenuation
          transparent
        />
      </points>
    );
  }
  

// -------------------------
// Node & Edge Components
// -------------------------
const ExampleNode = ({ position, onClick, color, label }) => {
  const meshRef = useRef();

  return (
    <mesh ref={meshRef} position={position} onClick={onClick}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color={color} />
      {/* <Html position={[0, 0.7, 0]}>
        <div style={{
          color: 'white',
          background: 'rgba(0,0,0,0.6)',
          padding: '2px 6px',
          borderRadius: '3px',
          fontSize: '0.8rem'
        }}>
          {label}
        </div>
      </Html> */}
    </mesh>
  );
};

const ExampleEdge = ({ start, end, color }) => {
  const points = [new Vector3(...start), new Vector3(...end)];
  return (
    <line>
      <bufferGeometry attach="geometry" setFromPoints={points} />
      <lineBasicMaterial attach="material" color={color} linewidth={2} />
    </line>
  );
};

// -------------------------
// Main ExampleGraph
// -------------------------
const ExampleGraph = () => {
  // Randomly connect some nodes
  const edges = [];
  const maxEdges = 15;
  for (let i = 0; i < maxEdges; i++) {
    const nodeA = nodeData[Math.floor(Math.random() * nodeData.length)];
    const nodeB = nodeData[Math.floor(Math.random() * nodeData.length)];
    if (nodeA.id !== nodeB.id) {
      edges.push({
        start: nodeA.position,
        end: nodeB.position,
        color: '#ffffff'
      });
    }
  }

  const handleNodeClick = (node) => {
    alert(`You clicked on "${node.name}"!`);
  };

  return (
    <Canvas
      style={{ height: '600px', background: 'black' }}
      camera={{ position: [0, 0, 60] }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls />

      {/* Background stars move with the scene */}
      <StarField />

      {/* Render nodes */}
      {nodeData.map((node) => (
        <ExampleNode
          key={node.id}
          position={node.position}
          color={node.color}
          onClick={() => handleNodeClick(node)}
          // label={node.name}
        />
      ))}

      {/* Render edges */}
      {edges.map((edge, idx) => (
        <ExampleEdge
          key={idx}
          start={edge.start}
          end={edge.end}
          color={edge.color}
        />
      ))}
    </Canvas>
  );
};

export default ExampleGraph;
