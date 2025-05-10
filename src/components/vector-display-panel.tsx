'use client';

import type { MutableRefObject } from 'react';
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { Vector3D, DisplayableVector, DotProductInfo } from '@/types/vector';
import { vector3DToThreeVector } from '@/lib/vector-math';

interface VectorDisplayPanelProps {
  vectors: DisplayableVector[]; // v1, v2, v3
  sumVector?: DisplayableVector;
  differenceVector?: DisplayableVector;
  crossProductVector?: DisplayableVector;
  dotProductInfo?: DotProductInfo;
}

// Helper to create an ArrowHelper more easily
const createArrow = (
  dir: THREE.Vector3,
  origin: THREE.Vector3,
  length: number,
  hexColor: number,
  name: string
): THREE.ArrowHelper => {
  const arrow = new THREE.ArrowHelper(dir.clone().normalize(), origin, length, hexColor, Math.max(0.2, length * 0.1), Math.max(0.1, length * 0.05));
  arrow.name = name;
  return arrow;
};

export function VectorDisplayPanel({
  vectors,
  sumVector,
  differenceVector,
  crossProductVector,
  dotProductInfo,
}: VectorDisplayPanelProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;
    setCanvasSize({ width: currentMount.clientWidth, height: currentMount.clientHeight });

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5); // Light grey background
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;

    // Grid Helper
    const gridHelper = new THREE.GridHelper(20, 20, 0xcccccc, 0xdddddd);
    scene.add(gridHelper);

    // Axes Helper
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);


    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (mountRef.current && cameraRef.current && rendererRef.current) {
        const newWidth = mountRef.current.clientWidth;
        const newHeight = mountRef.current.clientHeight;
        setCanvasSize({ width: newWidth, height: newHeight });
        cameraRef.current.aspect = newWidth / newHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(newWidth, newHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (rendererRef.current && currentMount.contains(rendererRef.current.domElement)) {
         currentMount.removeChild(rendererRef.current.domElement);
      }
      rendererRef.current?.dispose();
      controlsRef.current?.dispose();
      // Dispose geometries and materials if necessary
      sceneRef.current?.traverse(object => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.ArrowHelper) {
          if ((object as THREE.Mesh).geometry) {
            (object as THREE.Mesh).geometry.dispose();
          }
          if ((object as THREE.Mesh).material) {
            if (Array.isArray((object as THREE.Mesh).material)) {
              ((object as THREE.Mesh).material as THREE.Material[]).forEach(material => material.dispose());
            } else {
              ((object as THREE.Mesh).material as THREE.Material).dispose();
            }
          }
        }
      });
    };
  }, []);

  useEffect(() => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;

    // Clear previous vectors (except helpers)
    const objectsToRemove = scene.children.filter(
      obj => obj instanceof THREE.ArrowHelper || obj.name === 'dotProductProjectionLine'
    );
    objectsToRemove.forEach(obj => scene.remove(obj));

    const origin = new THREE.Vector3(0, 0, 0);

    // Draw base vectors
    vectors.forEach(v => {
      if (v.visible) {
        const threeVec = vector3DToThreeVector(v.vector);
        const length = threeVec.length();
        if (length > 0.001) { // Avoid issues with zero-length vectors
          scene.add(createArrow(threeVec, origin, length, v.color, v.name));
        }
      }
    });

    // Draw sum vector
    if (sumVector?.visible) {
      const threeVec = vector3DToThreeVector(sumVector.vector);
      const length = threeVec.length();
      if (length > 0.001) {
        scene.add(createArrow(threeVec, origin, length, sumVector.color, sumVector.name));
      }
    }
    
    // Draw difference vector
    if (differenceVector?.visible) {
      const threeVec = vector3DToThreeVector(differenceVector.vector);
      const length = threeVec.length();
      if (length > 0.001) {
        scene.add(createArrow(threeVec, origin, length, differenceVector.color, differenceVector.name));
      }
    }

    // Draw cross product vector
    if (crossProductVector?.visible) {
      const threeVec = vector3DToThreeVector(crossProductVector.vector);
      const length = threeVec.length();
      if (length > 0.001) {
        scene.add(createArrow(threeVec, origin, length, crossProductVector.color, crossProductVector.name));
      }
    }
    
    // Draw dot product projection
    if (dotProductInfo?.projectionVector?.visible) {
        const projVec = dotProductInfo.projectionVector;
        const threeVec = vector3DToThreeVector(projVec.vector);
        const length = threeVec.length();
        if (length > 0.001) {
          const projectionArrow = createArrow(threeVec, origin, length, projVec.color, projVec.name);
          // Make projection line dashed or thinner
          if (projectionArrow.line.material instanceof THREE.LineBasicMaterial) {
             // Note: ArrowHelper line is not directly dashed. Creating a custom dashed line might be better.
             // For simplicity, we'll just use a slightly different appearance or rely on color.
             // projectionArrow.line.material.dashed = true; // This won't work out of box for ArrowHelper.
             // As a simple visual distinction, we can make its cone smaller or line thinner if API allows.
             // Or, just rely on color and context.
          }
          projectionArrow.name = 'dotProductProjectionLine'; // Special name for specific handling if needed
          scene.add(projectionArrow);
        }
    }

  }, [vectors, sumVector, differenceVector, crossProductVector, dotProductInfo, canvasSize]);


  return <div ref={mountRef} className="w-full h-full rounded-lg shadow-inner bg-gray-200" data-ai-hint="3d space" />;
}
