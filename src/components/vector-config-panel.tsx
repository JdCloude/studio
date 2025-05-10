'use client';

import type { Dispatch, SetStateAction } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { VectorInputGroup } from './vector-input-group';
import type { VectorInputFields, ChallengeData, VectorName } from '@/types/vector';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckIcon, ChevronRightIcon, HelpCircleIcon, LightbulbIcon, PlusIcon, MinusIcon, ShuffleIcon, TargetIcon, XIcon } from 'lucide-react';
import { OPERATION_COLORS, VECTOR_COLORS } from '@/types/vector';

const getHexColorString = (color: number) => `#${color.toString(16).padStart(6, '0')}`;


interface VectorConfigPanelProps {
  vectors: Record<VectorName, VectorInputFields>;
  onVectorChange: (name: VectorName, field: keyof VectorInputFields, value: string) => void;
  
  showSum: boolean;
  setShowSum: Dispatch<SetStateAction<boolean>>;
  showDifference: boolean;
  setShowDifference: Dispatch<SetStateAction<boolean>>;
  showDotProduct: boolean;
  setShowDotProduct: Dispatch<SetStateAction<boolean>>;
  showCrossProduct: boolean;
  setShowCrossProduct: Dispatch<SetStateAction<boolean>>;
  
  dotProductValue: number | null;
  
  challenge: ChallengeData | null;
  onNewChallenge: () => Promise<void>;
  onCheckAnswer: () => void;
  isChallengeLoading: boolean;
  feedbackMessage: { type: 'success' | 'error' | 'info', message: string } | null;
}

export function VectorConfigPanel({
  vectors,
  onVectorChange,
  showSum,
  setShowSum,
  showDifference,
  setShowDifference,
  showDotProduct,
  setShowDotProduct,
  showCrossProduct,
  setShowCrossProduct,
  dotProductValue,
  challenge,
  onNewChallenge,
  onCheckAnswer,
  isChallengeLoading,
  feedbackMessage,
}: VectorConfigPanelProps) {

  const vectorConfigs: { name: VectorName; label: string; color: string }[] = [
    { name: 'v1', label: 'Vector 1 (v1)', color: getHexColorString(VECTOR_COLORS.v1) },
    { name: 'v2', label: 'Vector 2 (v2)', color: getHexColorString(VECTOR_COLORS.v2) },
    { name: 'v3', label: 'Vector 3 (v3)', color: getHexColorString(VECTOR_COLORS.v3) },
  ];
  
  return (
    <Card className="h-full overflow-y-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">Vector Configuration</CardTitle>
        <CardDescription>Input vectors and select operations to visualize.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Vector Inputs */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold">Input Vectors</h3>
          {vectorConfigs.map(vc => (
            <VectorInputGroup
              key={vc.name}
              label={vc.label}
              idPrefix={vc.name}
              value={vectors[vc.name]}
              onChange={(field, value) => onVectorChange(vc.name, field, value)}
              colorClass={`text-[${vc.color}]`} // Tailwind JIT might not pick this up directly, consider inline style or predefining classes
            />
          ))}
        </section>

        <Separator />

        {/* Operation Toggles */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold">Vector Operations (v1 & v2)</h3>
          <div className="space-y-3">
            {[
              { label: 'Sum (v1 + v2)', icon: <PlusIcon className="w-5 h-5 mr-2" style={{color: getHexColorString(OPERATION_COLORS.sum)}}/>, show: showSum, setShow: setShowSum, color: getHexColorString(OPERATION_COLORS.sum) },
              { label: 'Difference (v1 - v2)', icon: <MinusIcon className="w-5 h-5 mr-2" style={{color: getHexColorString(OPERATION_COLORS.difference)}}/>, show: showDifference, setShow: setShowDifference, color: getHexColorString(OPERATION_COLORS.difference) },
              { label: 'Dot Product (v1 · v2)', icon: <TargetIcon className="w-5 h-5 mr-2" style={{color: getHexColorString(OPERATION_COLORS.dotProductProjection)}}/>, show: showDotProduct, setShow: setShowDotProduct, color: getHexColorString(OPERATION_COLORS.dotProductProjection) },
              { label: 'Cross Product (v1 × v2)', icon: <XIcon className="w-5 h-5 mr-2" style={{color: getHexColorString(OPERATION_COLORS.crossProduct)}}/>, show: showCrossProduct, setShow: setShowCrossProduct, color: getHexColorString(OPERATION_COLORS.crossProduct) },
            ].map(op => (
              <div key={op.label} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                <div className="flex items-center">
                  {op.icon}
                  <Label htmlFor={`toggle-${op.label.toLowerCase().replace(/\s/g, '-')}`} className="cursor-pointer" style={{color: op.color}}>
                    {op.label}
                  </Label>
                </div>
                <Switch
                  id={`toggle-${op.label.toLowerCase().replace(/\s/g, '-')}`}
                  checked={op.show}
                  onCheckedChange={op.setShow}
                />
              </div>
            ))}
            {showDotProduct && dotProductValue !== null && (
              <Alert variant="default" className="mt-2">
                 <TargetIcon className="h-4 w-4" />
                <AlertTitle className="font-semibold" style={{color: getHexColorString(OPERATION_COLORS.dotProductProjection)}}>Dot Product Value</AlertTitle>
                <AlertDescription>
                  v1 · v2 = {dotProductValue.toFixed(2)}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </section>

        <Separator />

        {/* Challenges Section */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold">Challenges</h3>
          <Button onClick={onNewChallenge} disabled={isChallengeLoading} className="w-full">
            <ShuffleIcon className="mr-2 h-4 w-4" />
            {isChallengeLoading ? 'Generating...' : 'New Challenge'}
          </Button>

          {challenge && (
            <Card className="mt-4 bg-secondary/50">
              <CardHeader>
                <CardTitle className="text-md flex items-center"><LightbulbIcon className="mr-2 h-5 w-5 text-primary" />Challenge Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p><strong>Operation:</strong> <span className="font-mono p-1 bg-muted rounded text-primary">{challenge.operation}</span></p>
                <p>
                  <strong>Target {challenge.operation === 'dotProduct' ? 'Dot Product' : 'Vector'}:</strong>
                  {challenge.operation === 'dotProduct' ? (
                     <span className="font-mono p-1 bg-muted rounded text-primary"> Match calculated target scalar value.</span>
                  ) : (
                    <span className="font-mono p-1 bg-muted rounded text-primary">
                      ({challenge.targetVector.x.toFixed(2)}, {challenge.targetVector.y.toFixed(2)}, {challenge.targetVector.z.toFixed(2)})
                    </span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">Adjust v1 and v2 to match the target.</p>
                <Button onClick={onCheckAnswer} className="w-full mt-2" variant="outline">
                  <CheckIcon className="mr-2 h-4 w-4" />
                  Check Answer
                </Button>
              </CardContent>
            </Card>
          )}

          {feedbackMessage && (
            <Alert variant={feedbackMessage.type === 'error' ? 'destructive' : 'default'} className={`mt-4 ${feedbackMessage.type === 'success' ? 'border-accent text-accent-foreground' : ''}`}>
              {feedbackMessage.type === 'success' ? <CheckIcon className="h-4 w-4" /> : <HelpCircleIcon className="h-4 w-4" />}
              <AlertTitle className="font-semibold">{feedbackMessage.type.toUpperCase()}</AlertTitle>
              <AlertDescription>{feedbackMessage.message}</AlertDescription>
            </Alert>
          )}
        </section>
      </CardContent>
    </Card>
  );
}
