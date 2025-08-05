export function AvailableBalance({ balance, tokenName }: { balance: string; tokenName: string }) {
  return (
    <div className="flex justify-between items-center text-ui-fg-base smm-text">
      <span>Available Balance</span>
      <span>
        {balance} {tokenName}
      </span>
    </div>
  );
}
