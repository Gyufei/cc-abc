'use client';

import { Input } from '@medusajs/ui';
import { Tabs as RadixTabs } from 'radix-ui';

import { useState } from 'react';

import Check from '@/components/icons/check';
import TriangleDown from '@/components/icons/triangle-down';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { SIDE, TRADE_TYPE } from '@/lib/types/trade';
import { cn } from '@/lib/utils';

import { LimitTrade } from './limit-trade';
import { MarketTrade } from './market-trade';
import { TpSlTrade } from './tp-sl-trade';

const TRADE_SUB_TYPES: TRADE_TYPE[] = [
  'TP/SL',
  'Conditional',
  'OCO',
  'Trailing Stop',
  'Iceberg',
  'TWAP',
  'Scaled Order',
];

export function TradePanel({
  baseCoin,
  quoteCoin,
}: {
  baseCoin: string | null;
  quoteCoin: string | null;
}) {
  const [side, setSide] = useState<SIDE>('buy');
  const [tradeMode, setTradeMode] = useState<TRADE_TYPE>('Limit');

  return (
    <div
      className="w-[320px] border border-ui-border-base rounded-lg h-fit"
      style={{
        boxShadow: 'inset 0px 0px 0px 2px #FFFFFF',
      }}
    >
      <TradeTypeSelector side={side} setSide={setSide} />
      <div className="mt-4 px-4">
        <TradeModeSelector tradeType={tradeMode} setTradeType={setTradeMode} />
      </div>
      <div className="px-4 pt-5 pb-4">
        {tradeMode === 'Limit' && (
          <LimitTrade side={side} baseCoin={baseCoin} quoteCoin={quoteCoin} />
        )}
        {tradeMode === 'Market' && (
          <MarketTrade side={side} baseCoin={baseCoin} quoteCoin={quoteCoin} />
        )}
        {tradeMode === 'TP/SL' && (
          <TpSlTrade side={side} baseCoin={baseCoin} quoteCoin={quoteCoin} />
        )}
      </div>
    </div>
  );
}

function TradeTypeSelector({ side, setSide }: { side: SIDE; setSide: (_s: SIDE) => void }) {
  return (
    <RadixTabs.Root value={side} onValueChange={(value) => setSide(value as SIDE)}>
      <RadixTabs.List className="flex rounded-t-lg border-b border-ui-border-base">
        <RadixTabs.Trigger
          className={cn(
            'w-full text-sm leading-5 transition-fg border-r-ui-border-base text-ui-fg-muted flex justify-center h-[52px] flex-1 items-center gap-x-2 border-r px-4 outline-none rounded-tl-lg',
            'group/trigger overflow-hidden text-ellipsis whitespace-nowrap',
            'hover:bg-ui-bg-subtle-hover text-center',
            'focus-visible:bg-ui-bg-base focus:z-[1]',
            'data-[state=active]:text-ui-fg-on-color data-[state=active]:bg-ui-green'
          )}
          value="buy"
        >
          Buy
        </RadixTabs.Trigger>
        <RadixTabs.Trigger
          className={cn(
            'text-sm leading-5 transition-fg border-r-ui-border-base text-ui-fg-muted flex justify-center h-[52px] flex-1 items-center gap-x-2 border-r px-4 outline-none rounded-tr-lg',
            'group/trigger overflow-hidden text-ellipsis whitespace-nowrap',
            'hover:bg-ui-bg-subtle-hover',
            'focus-visible:bg-ui-bg-base focus:z-[1]',
            'data-[state=active]:text-ui-fg-on-color data-[state=active]:bg-ui-red'
          )}
          value="sell"
        >
          Sell
        </RadixTabs.Trigger>
      </RadixTabs.List>
    </RadixTabs.Root>
  );
}

function TradeModeSelector({
  tradeType,
  setTradeType,
}: {
  tradeType: TRADE_TYPE;
  setTradeType: (_t: TRADE_TYPE) => void;
}) {
  function handleMenuClick(value: TRADE_TYPE) {
    if (value !== 'TP/SL') {
      setTradeType(value);
    } else {
      if (!TRADE_SUB_TYPES.includes(tradeType)) {
        setTradeType('TP/SL');
      }
    }
  }

  return (
    <Tabs value={tradeType} onValueChange={(value) => handleMenuClick(value as TRADE_TYPE)}>
      <TabsList className="w-full">
        <TabsTrigger value="Limit">Limit</TabsTrigger>
        <TabsTrigger value="Market">Market</TabsTrigger>
        <TabsTrigger
          value="TP/SL"
          data-state={TRADE_SUB_TYPES.includes(tradeType) ? 'active' : 'inactive'}
        >
          <TPSLDrop tradeType={tradeType} setTradeType={setTradeType} />
        </TabsTrigger>
      </TabsList>
      <TabsContent value="Limit"></TabsContent>
      <TabsContent value="Market"></TabsContent>
    </Tabs>
  );
}

function TPSLDrop({
  tradeType,
  setTradeType,
}: {
  tradeType: TRADE_TYPE;
  setTradeType: (_t: TRADE_TYPE) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    setIsOpen(!isOpen);
  }

  function handleSubClick(type: TRADE_TYPE) {
    setTradeType(type);
    setIsOpen(false);
  }

  const isSub = TRADE_SUB_TYPES.includes(tradeType);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredTradeSubTypes = TRADE_SUB_TYPES.filter((t) =>
    t.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div onClick={(e) => handleClick(e)} className="flex items-center gap-x-2">
          <span>{isSub ? tradeType : 'TP/SL'}</span>
          <TriangleDown />
        </div>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[280px] p-0">
        <Input
          type="search"
          id="width"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-8 border-none focus-visible:outline-0 focus-visible:shadow-none active:shadow-none"
        />
        <div className="border-t border-ui-border-base p-1 smm-text">
          {filteredTradeSubTypes.length === 0 ? (
            <div className="py-1 px-2 flex justify-center items-center gap-x-2">
              <span>No results found</span>
            </div>
          ) : (
            filteredTradeSubTypes.map((t) => (
              <div
                key={t}
                onClick={() => handleSubClick(t)}
                className="py-1 px-2 flex items-center gap-x-2 hover:bg-ui-bg-subtle-hover cursor-pointer"
              >
                <span>
                  {tradeType === t ? (
                    <Check className="h-[15px] w-[15px]" />
                  ) : (
                    <div className="w-4 h-4" />
                  )}
                </span>
                <span>{t}</span>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
