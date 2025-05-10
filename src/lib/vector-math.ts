import type { Vector3D } from '@/types/vector';
import * as THREE from 'three';

export function addVectors(v1: Vector3D, v2: Vector3D): Vector3D {
  return { x: v1.x + v2.x, y: v1.y + v2.y, z: v1.z + v2.z };
}

export function subtractVectors(v1: Vector3D, v2: Vector3D): Vector3D {
  return { x: v1.x - v2.x, y: v1.y - v2.y, z: v1.z - v2.z };
}

export function dotProduct(v1: Vector3D, v2: Vector3D): number {
  return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
}

export function crossProduct(v1: Vector3D, v2: Vector3D): Vector3D {
  return {
    x: v1.y * v2.z - v1.z * v2.y,
    y: v1.z * v2.x - v1.x * v2.z,
    z: v1.x * v2.y - v1.y * v2.x,
  };
}

export function magnitude(v: Vector3D): number {
  return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
}

export function normalize(v: Vector3D): Vector3D {
  const mag = magnitude(v);
  if (mag === 0) return { x: 0, y: 0, z: 0 };
  return { x: v.x / mag, y: v.y / mag, z: v.z / mag };
}

export function projectVector(v1: Vector3D, v2: Vector3D): Vector3D {
  const v2MagnitudeSq = magnitude(v2) ** 2;
  if (v2MagnitudeSq === 0) return { x: 0, y: 0, z: 0 };
  const scale = dotProduct(v1, v2) / v2MagnitudeSq;
  return { x: v2.x * scale, y: v2.y * scale, z: v2.z * scale };
}

export function parseVectorInput(input: { x: string; y: string; z: string }): Vector3D | null {
  const x = parseFloat(input.x);
  const y = parseFloat(input.y);
  const z = parseFloat(input.z);

  if (isNaN(x) || isNaN(y) || isNaN(z)) {
    return null;
  }
  return { x, y, z };
}

export function threeVectorToVector3D(tv: THREE.Vector3): Vector3D {
  return { x: tv.x, y: tv.y, z: tv.z };
}

export function vector3DToThreeVector(v: Vector3D): THREE.Vector3 {
  return new THREE.Vector3(v.x, v.y, v.z);
}

export function compareVectors(vA: Vector3D, vB: Vector3D, tolerance: number = 0.01): boolean {
  const magA = magnitude(vA);
  const magB = magnitude(vB);

  if (Math.abs(magA - magB) > tolerance) {
    return false;
  }

  // If both are near zero vectors, they are considered same
  if (magA < tolerance && magB < tolerance) {
    return true;
  }
  
  // If one is zero and other is not (and magnitudes are different - handled above)
  // or if magnitudes are similar but one is zero vector, means directions are different
  if (magA < tolerance || magB < tolerance) return false;


  const dot = dotProduct(normalize(vA), normalize(vB));
  return Math.abs(dot - 1.0) < tolerance; // Cosine of angle should be close to 1
}
