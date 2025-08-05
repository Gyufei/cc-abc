'use client';

import { useState } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { AssetsTab } from './tabs/assets-tab';
import { OpenOrdersTab } from './tabs/open-orders-tab';
import { OrderHistoryTab } from './tabs/order-history-tab';
import { PositionsTab } from './tabs/positions-tab';
import { TradeHistoryTab } from './tabs/trade-history-tab';

/**
 * TableContainer component that displays trading data in tabbed interface
 * Matches the design specifications with 5 tabs: Open Orders, Positions, Order History, Trade History, Assets
 */
export function TableContainer() {
  const [activeTab, setActiveTab] = useState('open-orders');

  return (
    <div className="flex-1 bg-background border border-ui-border-base rounded-lg mt-4 overflow-hidden">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <TabsList className="w-full justify-start bg-transparent border-b border-ui-border-base rounded-none h-auto p-0 flex-shrink-0">
          <TabsTrigger
            value="open-orders"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-ui-fg-base data-[state=active]:bg-transparent bg-transparent px-4 py-3 smm-text text-ui-fg-muted data-[state=active]:text-ui-fg-base hover:bg-ui-bg-subtle-hover transition-colors"
          >
            Open Orders (0)
          </TabsTrigger>
          <TabsTrigger
            value="positions"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-ui-fg-base data-[state=active]:bg-transparent bg-transparent px-4 py-3 smm-text text-ui-fg-muted data-[state=active]:text-ui-fg-base hover:bg-ui-bg-subtle-hover transition-colors"
          >
            Positions (0)
          </TabsTrigger>
          <TabsTrigger
            value="order-history"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-ui-fg-base data-[state=active]:bg-transparent bg-transparent px-4 py-3 smm-text text-ui-fg-muted data-[state=active]:text-ui-fg-base hover:bg-ui-bg-subtle-hover transition-colors"
          >
            Order History
          </TabsTrigger>
          <TabsTrigger
            value="trade-history"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-ui-fg-base data-[state=active]:bg-transparent bg-transparent px-4 py-3 smm-text text-ui-fg-muted data-[state=active]:text-ui-fg-base hover:bg-ui-bg-subtle-hover transition-colors"
          >
            Trade History
          </TabsTrigger>
          <TabsTrigger
            value="assets"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-ui-fg-base data-[state=active]:bg-transparent bg-transparent px-4 py-3 smm-text text-ui-fg-muted data-[state=active]:text-ui-fg-base hover:bg-ui-bg-subtle-hover transition-colors"
          >
            Assets
          </TabsTrigger>
        </TabsList>

        <TabsContent value="open-orders" className="mt-0 p-0 flex-1 overflow-auto">
          <OpenOrdersTab />
        </TabsContent>

        <TabsContent value="positions" className="mt-0 p-0 flex-1 overflow-auto">
          <PositionsTab />
        </TabsContent>

        <TabsContent value="order-history" className="mt-0 p-0 flex-1 overflow-auto">
          <OrderHistoryTab />
        </TabsContent>

        <TabsContent value="trade-history" className="mt-0 p-0 flex-1 overflow-auto">
          <TradeHistoryTab />
        </TabsContent>

        <TabsContent value="assets" className="mt-0 p-0 flex-1 overflow-auto">
          <AssetsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
