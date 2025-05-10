// src/ai/flows/generate-vector-challenge.ts
'use server';
/**
 * @fileOverview Generates random vector challenges for users to practice vector operations.
 *
 * - generateVectorChallenge - A function that generates a vector challenge.
 * - GenerateVectorChallengeInput - The input type for the generateVectorChallenge function.
 * - GenerateVectorChallengeOutput - The return type for the generateVectorChallenge function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateVectorChallengeInputSchema = z.object({
  numVectors: z
    .number()
    .default(2)
    .describe('The number of vectors to include in the challenge.'),
  maxMagnitude: z
    .number()
    .default(10)
    .describe('The maximum magnitude of the vectors.'),
});
export type GenerateVectorChallengeInput = z.infer<typeof GenerateVectorChallengeInputSchema>;

const VectorSchema = z.object({
  x: z.number().describe('The x component of the vector.'),
  y: z.number().describe('The y component of the vector.'),
  z: z.number().describe('The z component of the vector.'),
});

const GenerateVectorChallengeOutputSchema = z.object({
  vectors: z.array(VectorSchema).describe('The randomly generated vectors.'),
  targetVector: VectorSchema.describe('The target vector to match.'),
  operation: z
    .enum(['addition', 'subtraction', 'crossProduct', 'dotProduct'])
    .describe('The vector operation to perform.'),
});
export type GenerateVectorChallengeOutput = z.infer<typeof GenerateVectorChallengeOutputSchema>;

export async function generateVectorChallenge(input: GenerateVectorChallengeInput): Promise<GenerateVectorChallengeOutput> {
  return generateVectorChallengeFlow(input);
}

const generateVectorChallengePrompt = ai.definePrompt({
  name: 'generateVectorChallengePrompt',
  input: {schema: GenerateVectorChallengeInputSchema},
  output: {schema: GenerateVectorChallengeOutputSchema},
  prompt: `You are a vector challenge generator.  Generate a challenge with {{numVectors}} vectors, where each vector has a maximum magnitude of {{maxMagnitude}}. Also generate a target vector, and choose one of the following operations: addition, subtraction, crossProduct, or dotProduct. Return valid JSON.`,
});

const generateVectorChallengeFlow = ai.defineFlow(
  {
    name: 'generateVectorChallengeFlow',
    inputSchema: GenerateVectorChallengeInputSchema,
    outputSchema: GenerateVectorChallengeOutputSchema,
  },
  async input => {
    const {output} = await generateVectorChallengePrompt(input);
    return output!;
  }
);
