// ProfilePage.js
import React, { useState, useEffect } from 'react';
import Graph3D from './Graph3D';
import axios from 'axios';

const ProfilePage = ({ userId }) => {
  const [activities, setActivities] = useState([]);
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });

  useEffect(() => {
    axios.get(`/api/activities?user_id=${userId}`)
      .then(res => {
        setActivities(res.data);
        const nodes = res.data.map((activity) => ({
          id: activity.id,
          name: activity.name,
          // For demonstration, generate random positions.
          position: [
            Math.random() * 10 - 5,
            Math.random() * 10 - 5,
            Math.random() * 10 - 5,
          ],
          color: getColorByCategory(activity.category)
        }));

        // Example: Connect nodes sequentially. In production, use recommendation data.
        const edges = [];
        for (let i = 0; i < nodes.length - 1; i++) {
          edges.push({
            start: nodes[i].position,
            end: nodes[i + 1].position,
            color: '#ffffff'
          });
        }
        setGraphData({ nodes, edges });
      })
      .catch(err => console.error(err));
  }, [userId]);

  const getColorByCategory = (category) => {
    switch (category.toLowerCase()) {
      case 'indoor': return '#ff5733';
      case 'outdoor': return '#33ff57';
      case 'creative': return '#3357ff';
      case 'lively': return '#f1c40f';
      default: return '#ffffff';
    }
  };

  const handleNodeClick = (node) => {
    axios.get(`/api/recommend?user_id=${userId}&activity_id=${node.id}`)
      .then(res => {
        // Here you could display a modal with detailed recommendations.
        alert(`Recommendations for ${node.name}:\n` + JSON.stringify(res.data, null, 2));
      })
      .catch(err => console.error(err));
  };

  return (
    <div>
      <h2>Your Date Ideas</h2>
      <Graph3D nodes={graphData.nodes} edges={graphData.edges} onNodeClick={handleNodeClick} />
    </div>
  );
};

export default ProfilePage;
