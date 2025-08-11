'use client';

import { Checkbox, Label } from '@medusajs/ui';

import { useState } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useOpenOrders } from '@/lib/api/use-open-orders';

import { AssetsTab } from './tabs/assets-tab';
import { OpenOrdersTab } from './tabs/open-orders-tab';
import { OrderHistoryTab } from './tabs/order-history-tab';
import { PositionsTab } from './tabs/positions-tab';
import { TradeHistoryTab } from './tabs/trade-history-tab';

/**
 * TableContainer component that displays trading data in tabbed interface
 * Matches the design specifications with 5 tabs: Open Orders, Positions, Order History, Trade History, Assets
 */
export function TableContainer({
  baseCoin,
  quoteCoin,
}: {
  baseCoin: string | null;
  quoteCoin: string | null;
}) {
  const [activeTab, setActiveTab] = useState('open-orders');
  const [showAllMarkets, setShowAllMarkets] = useState(false);

  const { data: openOrdersData } = useOpenOrders(
    showAllMarkets && baseCoin && quoteCoin ? '' : `${baseCoin}${quoteCoin}`
  );
  const openOrdersCount = openOrdersData?.length || 0;

  return (
    <div className="flex-1 bg-background border border-t-0 border-ui-border-base rounded-lg mt-4 overflow-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col gap-0">
        <TabsList className="w-full relative justify-start bg-transparent border-ui-border-base rounded-none h-auto p-0 flex-shrink-0 rounded-t-lg">
          <TabsTrigger
            value="open-orders"
            className="rounded-none border-ui-border-base border data-[state=active]:bg-ui-bg-subtle bg-transparent px-4 py-3 smm-text text-ui-fg-muted data-[state=active]:text-ui-fg-base hover:bg-ui-bg-subtle-hover transition-colors"
          >
            Open Orders ({openOrdersCount})
          </TabsTrigger>
          {/* <TabsTrigger
            value="positions"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-ui-fg-base data-[state=active]:bg-transparent bg-transparent px-4 py-3 smm-text text-ui-fg-muted data-[state=active]:text-ui-fg-base hover:bg-ui-bg-subtle-hover transition-colors"
          >
            Positions (0)
          </TabsTrigger> */}
          <TabsTrigger
            value="order-history"
            className="rounded-none border-ui-border-base border data-[state=active]:bg-ui-bg-subtle bg-transparent px-4 py-3 smm-text text-ui-fg-muted data-[state=active]:text-ui-fg-base hover:bg-ui-bg-subtle-hover transition-colors"
          >
            Order History
          </TabsTrigger>
          <TabsTrigger
            value="trade-history"
            className="rounded-none border-ui-border-base border data-[state=active]:bg-ui-bg-subtle bg-transparent px-4 py-3 smm-text text-ui-fg-muted data-[state=active]:text-ui-fg-base hover:bg-ui-bg-subtle-hover transition-colors"
          >
            Trade History
          </TabsTrigger>
          <TabsTrigger
            value="assets"
            className="rounded-none border-ui-border-base border data-[state=active]:bg-ui-bg-subtle bg-transparent px-4 py-3 smm-text text-ui-fg-muted data-[state=active]:text-ui-fg-base hover:bg-ui-bg-subtle-hover transition-colors"
          >
            Assets
          </TabsTrigger>
          {activeTab !== 'assets' && (
            <div className="w-[200px] absolute top-12 right-6 bg-transparent py-3 smm-text text-ui-fg-muted transition-colors flex items-center justify-end">
              <div className="flex items-center gap-2 justify-end">
                <Checkbox
                  checked={showAllMarkets}
                  onCheckedChange={() => setShowAllMarkets(!showAllMarkets)}
                />
                <Label className="smm-text text-ui-fg-base">All Markets</Label>
              </div>
            </div>
          )}
        </TabsList>

        <TabsContent value="open-orders" className="mt-0 p-0 flex-1 overflow-hidden">
          <OpenOrdersTab
            showAllMarkets={showAllMarkets}
            baseCoin={baseCoin}
            quoteCoin={quoteCoin}
          />
        </TabsContent>

        <TabsContent value="positions" className="mt-0 p-0 flex-1 overflow-hidden">
          <PositionsTab />
        </TabsContent>

        <TabsContent value="order-history" className="mt-0 p-0 flex-1 overflow-hidden">
          <OrderHistoryTab
            showAllMarkets={showAllMarkets}
            baseCoin={baseCoin}
            quoteCoin={quoteCoin}
          />
        </TabsContent>

        <TabsContent value="trade-history" className="mt-0 p-0 flex-1 overflow-hidden">
          <TradeHistoryTab
            showAllMarkets={showAllMarkets}
            baseCoin={baseCoin}
            quoteCoin={quoteCoin}
          />
        </TabsContent>

        <TabsContent value="assets" className="mt-0 p-0 flex-1 overflow-hidden">
          <AssetsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
