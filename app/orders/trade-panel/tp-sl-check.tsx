import { Checkbox, Label } from '@medusajs/ui';

export function TPSLCheck({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-5 w-5 flex items-center justify-center">
        <Checkbox checked={value} onCheckedChange={onChange} id="tp-sl" />
      </div>
      <Label htmlFor="tp-sl" className="smm-text text-ui-fg-base">
        TP/SL
      </Label>
    </div>
  );
}
