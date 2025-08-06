import { formatNumber } from '@/lib/utils/number';

export function AvailableBalance({
  balance,
  tokenName,
}: {
  balance: string;
  tokenName: string | null;
}) {
  return (
    <div className="flex justify-between items-center text-ui-fg-base smm-text">
      <span>Available Balance</span>
      <span>
        {formatNumber(balance) || '-'} {tokenName || '-'}
      </span>
    </div>
  );
}
