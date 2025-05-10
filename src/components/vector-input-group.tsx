import type { ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { VectorInputFields } from '@/types/vector';

interface VectorInputGroupProps {
  label: string;
  idPrefix: string;
  value: VectorInputFields;
  onChange: (field: keyof VectorInputFields, inputValue: string) => void;
  colorClass?: string;
}

export function VectorInputGroup({
  label,
  idPrefix,
  value,
  onChange,
  colorClass = 'text-foreground',
}: VectorInputGroupProps) {
  const handleChange = (field: keyof VectorInputFields) => (e: ChangeEvent<HTMLInputElement>) => {
    onChange(field, e.target.value);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={`${idPrefix}-x`} className={`font-semibold ${colorClass}`}>
        {label}
      </Label>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <Label htmlFor={`${idPrefix}-x`} className="text-xs">X</Label>
          <Input
            id={`${idPrefix}-x`}
            type="number"
            value={value.x}
            onChange={handleChange('x')}
            placeholder="x"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor={`${idPrefix}-y`} className="text-xs">Y</Label>
          <Input
            id={`${idPrefix}-y`}
            type="number"
            value={value.y}
            onChange={handleChange('y')}
            placeholder="y"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor={`${idPrefix}-z`} className="text-xs">Z</Label>
          <Input
            id={`${idPrefix}-z`}
            type="number"
            value={value.z}
            onChange={handleChange('z')}
            placeholder="z"
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
}
