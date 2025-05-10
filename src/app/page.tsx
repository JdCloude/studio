'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { VectorConfigPanel } from '@/components/vector-config-panel';
import { VectorDisplayPanel } from '@/components/vector-display-panel';
import type { VectorInputFields, Vector3D, DisplayableVector, DotProductInfo, ChallengeData, VectorName } from '@/types/vector';
import { VECTOR_COLORS, OPERATION_COLORS } from '@/types/vector';
import { generateVectorChallenge } from '@/ai/flows/generate-vector-challenge';
import { useToast } from '@/hooks/use-toast';
import * as VectorMath from '@/lib/vector-math';
import { MountainIcon } from 'lucide-react'; // Placeholder for logo

const initialVectorState = (): VectorInputFields => ({ x: '0', y: '0', z: '0' });

export default function VectorViewPage() {
  const { toast } = useToast();

  const [v1Input, setV1Input] = useState<VectorInputFields>({ x: '1', y: '2', z: '1' });
  const [v2Input, setV2Input] = useState<VectorInputFields>({ x: '2', y: '-1', z: '1' });
  const [v3Input, setV3Input] = useState<VectorInputFields>(initialVectorState);

  const [showSum, setShowSum] = useState(false);
  const [showDifference, setShowDifference] = useState(false);
  const [showDotProduct, setShowDotProduct] = useState(false);
  const [showCrossProduct, setShowCrossProduct] = useState(false);

  const [challenge, setChallenge] = useState<ChallengeData | null>(null);
  const [isChallengeLoading, setIsChallengeLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null);
  
  const [targetDotProductScalar, setTargetDotProductScalar] = useState<number | null>(null);

  const v1 = useMemo(() => VectorMath.parseVectorInput(v1Input), [v1Input]);
  const v2 = useMemo(() => VectorMath.parseVectorInput(v2Input), [v2Input]);
  const v3 = useMemo(() => VectorMath.parseVectorInput(v3Input), [v3Input]);

  const handleVectorChange = useCallback((name: VectorName, field: keyof VectorInputFields, value: string) => {
    const setter = { v1: setV1Input, v2: setV2Input, v3: setV3Input }[name];
    setter(prev => ({ ...prev, [field]: value }));
  }, []);

  const displayVectors = useMemo<DisplayableVector[]>(() => {
    const result: DisplayableVector[] = [];
    if (v1) result.push({ name: 'v1', vector: v1, color: VECTOR_COLORS.v1, visible: true });
    if (v2) result.push({ name: 'v2', vector: v2, color: VECTOR_COLORS.v2, visible: true });
    if (v3) result.push({ name: 'v3', vector: v3, color: VECTOR_COLORS.v3, visible: true });
    return result;
  }, [v1, v2, v3]);

  const sumVector = useMemo<DisplayableVector | undefined>(() => {
    if (v1 && v2) {
      return { name: 'Sum (v1+v2)', vector: VectorMath.addVectors(v1, v2), color: OPERATION_COLORS.sum, visible: showSum };
    }
    return undefined;
  }, [v1, v2, showSum]);

  const differenceVector = useMemo<DisplayableVector | undefined>(() => {
    if (v1 && v2) {
      return { name: 'Difference (v1-v2)', vector: VectorMath.subtractVectors(v1, v2), color: OPERATION_COLORS.difference, visible: showDifference };
    }
    return undefined;
  }, [v1, v2, showDifference]);

  const crossProductVector = useMemo<DisplayableVector | undefined>(() => {
    if (v1 && v2) {
      return { name: 'Cross Product (v1xv2)', vector: VectorMath.crossProduct(v1, v2), color: OPERATION_COLORS.crossProduct, visible: showCrossProduct };
    }
    return undefined;
  }, [v1, v2, showCrossProduct]);
  
  const dotProductInfo = useMemo<DotProductInfo | undefined>(() => {
    if (v1 && v2) {
      const scalar = VectorMath.dotProduct(v1, v2);
      let projectionVector: DisplayableVector | undefined = undefined;
      if (showDotProduct) {
         const projOntoV2 = VectorMath.projectVector(v1, v2);
         projectionVector = { name: 'Projection v1 on v2', vector: projOntoV2, color: OPERATION_COLORS.dotProductProjection, visible: true };
      }
      return { scalar, projectionVector };
    }
    return undefined;
  }, [v1, v2, showDotProduct]);


  const handleNewChallenge = useCallback(async () => {
    setIsChallengeLoading(true);
    setFeedbackMessage(null);
    try {
      const newChallenge = await generateVectorChallenge({ numVectors: 2, maxMagnitude: 10 });
      setChallenge(newChallenge);
      // For dot product challenges, pre-calculate the target scalar from AI's initial vectors
      if (newChallenge.operation === 'dotProduct') {
        const initialV1 = newChallenge.vectors[0];
        const initialV2 = newChallenge.vectors[1];
        const targetScalar = VectorMath.dotProduct(initialV1, initialV2);
        setTargetDotProductScalar(targetScalar);
      } else {
        setTargetDotProductScalar(null);
      }
      // Optionally, set v1Input and v2Input to the challenge's initial vectors
      // Or let user start from their current vectors / blank slate
      setV1Input({ x: newChallenge.vectors[0].x.toString(), y: newChallenge.vectors[0].y.toString(), z: newChallenge.vectors[0].z.toString()});
      setV2Input({ x: newChallenge.vectors[1].x.toString(), y: newChallenge.vectors[1].y.toString(), z: newChallenge.vectors[1].z.toString()});

      toast({ title: "New Challenge Generated!", description: `Operation: ${newChallenge.operation}. Adjust v1 and v2.` });
    } catch (error) {
      console.error("Failed to generate challenge:", error);
      toast({ variant: "destructive", title: "Error", description: "Could not generate a new challenge." });
      setFeedbackMessage({ type: 'error', message: 'Failed to load challenge.' });
    } finally {
      setIsChallengeLoading(false);
    }
  }, [toast]);

  const handleCheckAnswer = useCallback(() => {
    if (!challenge || !v1 || !v2) {
      setFeedbackMessage({ type: 'error', message: 'No active challenge or invalid vectors.' });
      return;
    }

    let userResultVector: Vector3D | null = null;
    let userResultScalar: number | null = null;
    let success = false;

    switch (challenge.operation) {
      case 'addition':
        userResultVector = VectorMath.addVectors(v1, v2);
        success = VectorMath.compareVectors(userResultVector, challenge.targetVector);
        break;
      case 'subtraction':
        userResultVector = VectorMath.subtractVectors(v1, v2);
        success = VectorMath.compareVectors(userResultVector, challenge.targetVector);
        break;
      case 'crossProduct':
        userResultVector = VectorMath.crossProduct(v1, v2);
        success = VectorMath.compareVectors(userResultVector, challenge.targetVector);
        break;
      case 'dotProduct':
        userResultScalar = VectorMath.dotProduct(v1, v2);
        if (targetDotProductScalar !== null) {
             success = Math.abs(userResultScalar - targetDotProductScalar) < 0.01;
        } else {
            // Fallback if targetDotProductScalar wasn't set (should not happen with new logic)
            // This case implies the challenge target might be comparing magnitudes or other properties.
            // For now, we stick to comparing with pre-calculated target scalar.
            console.warn("Dot product challenge checked without a targetDotProductScalar.")
            success = false; 
        }
        break;
      default:
        setFeedbackMessage({ type: 'error', message: 'Unknown challenge operation.' });
        return;
    }

    if (success) {
      toast({ title: "Correct!", description: "You matched the target!", className: "bg-accent text-accent-foreground" });
      setFeedbackMessage({ type: 'success', message: 'Challenge Complete! Well done!' });
    } else {
      toast({ variant: "destructive", title: "Incorrect", description: "Try adjusting your vectors." });
      let message = "Almost there! Keep trying.";
      if (challenge.operation !== 'dotProduct' && userResultVector) {
        message += ` Your vector: (${userResultVector.x.toFixed(2)}, ${userResultVector.y.toFixed(2)}, ${userResultVector.z.toFixed(2)}).`;
      } else if (challenge.operation === 'dotProduct' && userResultScalar !== null) {
        message += ` Your dot product: ${userResultScalar.toFixed(2)}. Target: ${targetDotProductScalar?.toFixed(2) ?? 'N/A'}.`;
      }
      setFeedbackMessage({ type: 'error', message });
    }
  }, [challenge, v1, v2, toast, targetDotProductScalar]);
  
  const vectorsProp = {v1: v1Input, v2: v2Input, v3: v3Input};

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <header className="p-4 border-b shadow-sm">
        <div className="container mx-auto flex items-center gap-2">
          <MountainIcon className="h-8 w-8 text-primary" data-ai-hint="logo mountain" />
          <h1 className="text-3xl font-bold text-primary">VectorView</h1>
          <span className="text-sm text-muted-foreground mt-1">3D Vector Playground</span>
        </div>
      </header>
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <div className="w-full md:w-2/5 lg:w-1/3 p-4 border-r overflow-y-auto">
          <VectorConfigPanel
            vectors={vectorsProp}
            onVectorChange={handleVectorChange}
            showSum={showSum}
            setShowSum={setShowSum}
            showDifference={showDifference}
            setShowDifference={setShowDifference}
            showDotProduct={showDotProduct}
            setShowDotProduct={setShowDotProduct}
            showCrossProduct={showCrossProduct}
            setShowCrossProduct={setShowCrossProduct}
            dotProductValue={dotProductInfo?.scalar ?? null}
            challenge={challenge}
            onNewChallenge={handleNewChallenge}
            onCheckAnswer={handleCheckAnswer}
            isChallengeLoading={isChallengeLoading}
            feedbackMessage={feedbackMessage}
          />
        </div>
        <div className="flex-1 p-1 md:p-2 lg:p-4 h-full min-h-[300px] md:min-h-0">
          <VectorDisplayPanel
            vectors={displayVectors}
            sumVector={sumVector}
            differenceVector={differenceVector}
            crossProductVector={crossProductVector}
            dotProductInfo={dotProductInfo}
          />
        </div>
      </main>
    </div>
  );
}
