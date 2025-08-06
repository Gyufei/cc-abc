import { divide, multiply } from 'safebase';

import { useMemo } from 'react';

import { useTokenBalance } from '@/lib/hooks/use-token-balance';
import { SIDE } from '@/lib/types/trade';
import { truncateNumber } from '@/lib/utils/number';

export function CanAmountDisplay({
  side,
  baseCoin,
  quoteCoin,
  price,
}: {
  side: SIDE;
  baseCoin: string;
  quoteCoin: string;
  price: string;
}) {
  const isBuy = side === 'buy';
  const { data: baseBalance } = useTokenBalance(baseCoin);
  const { data: quoteBalance } = useTokenBalance(quoteCoin);

  const canBuyAmount = useMemo(() => {
    if (!quoteBalance) {
      return '0';
    }

    return truncateNumber(divide(String(quoteBalance), price), 6);
  }, [quoteBalance, price]);

  const canSellAmount = useMemo(() => {
    if (!baseBalance) {
      return '0';
    }

    return truncateNumber(multiply(String(baseBalance), price), 6);
  }, [baseBalance, price]);

  return (
    <div
      className="flex py-[10px] px-3 items-center rounded-lg bg-ui-bg-field gap-3"
      style={{
        boxShadow:
          '0px 0px 0px 1px rgba(0, 0, 0, 0.08),0px 1px 2px -1px rgba(0, 0, 0, 0.08),0px 2px 4px 0px rgba(0, 0, 0, 0.04)',
      }}
    >
      <div className="bg-ui-bg-interactive rounded-full h-[13px] w-1"></div>
      <div className="flex items-center">
        <span className="smm-text text-ui-fg-base">Max.{isBuy ? 'buying' : 'selling'} amount:</span>
        <span className="smm-text text-ui-fg-subtle ">
          {isBuy ? canBuyAmount : canSellAmount} {isBuy ? baseCoin : quoteCoin}
        </span>
      </div>
    </div>
  );
}
