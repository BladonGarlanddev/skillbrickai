import { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface Connection {
  from: number;
  to: number;
}

export function ConnectedNodes() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const connectionsRef = useRef<Connection[]>([]);
  const animationFrameRef = useRef<number>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };

    updateCanvasSize();

    const nodeCount = 24;
    const nodes: Node[] = [];
    const canvasWidth = canvas.offsetWidth;
    const canvasHeight = canvas.offsetHeight;

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 3 + 2
      });
    }

    nodesRef.current = nodes;

    const connections: Connection[] = [];
    for (let i = 0; i < nodeCount; i++) {
      const connectionCount = Math.floor(Math.random() * 2) + 1;
      const distances = nodes.map((node, j) => ({
        index: j,
        distance: Math.hypot(nodes[i].x - node.x, nodes[i].y - node.y)
      }));

      distances.sort((a, b) => a.distance - b.distance);

      for (let j = 1; j <= connectionCount && j < distances.length; j++) {
        const targetIndex = distances[j].index;
        if (!connections.some(c =>
          (c.from === i && c.to === targetIndex) ||
          (c.from === targetIndex && c.to === i)
        )) {
          connections.push({ from: i, to: targetIndex });
        }
      }
    }

    connectionsRef.current = connections;

    const animate = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;

      ctx.clearRect(0, 0, width, height);

      nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        node.x = Math.max(0, Math.min(width, node.x));
        node.y = Math.max(0, Math.min(height, node.y));
      });

      ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.lineWidth = 1;
      connections.forEach(({ from, to }) => {
        const nodeFrom = nodes[from];
        const nodeTo = nodes[to];

        ctx.beginPath();
        ctx.moveTo(nodeFrom.x, nodeFrom.y);
        ctx.lineTo(nodeTo.x, nodeTo.y);
        ctx.stroke();
      });

      nodes.forEach(node => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      updateCanvasSize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    />
  );
}
