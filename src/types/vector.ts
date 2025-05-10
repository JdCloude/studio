import type { GenerateVectorChallengeOutput } from '@/ai/flows/generate-vector-challenge';

export type Vector3D = {
  x: number;
  y: number;
  z: number;
};

export type VectorInputFields = {
  x: string;
  y: string;
  z: string;
};

export type DisplayableVector = {
  name: string;
  vector: Vector3D;
  color: number; // hex color
  visible: boolean;
};

export type DotProductInfo = {
  scalar: number;
  projectionVector?: DisplayableVector; // Vector representing projection of v1 on v2
};

export interface ChallengeData extends GenerateVectorChallengeOutput {}

export type VectorName = 'v1' | 'v2' | 'v3';

export const VECTOR_COLORS: Record<VectorName, number> = {
  v1: 0xff0000, // Red
  v2: 0x0077ff, // Blue
  v3: 0xffff00, // Yellow
};

export const OPERATION_COLORS = {
  sum: 0x9932CC, // Purple (DarkOrchid)
  difference: 0x40E0D0, // Turquoise
  crossProduct: 0x90EE90, // Green (Theme Accent)
  dotProductProjection: 0x29ABE2, // Blue (Theme Primary)
};
