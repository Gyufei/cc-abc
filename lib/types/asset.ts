export interface Asset {
  symbol: string;
  total: number;
  available: number;
  frozen: number;
}

export interface AccountAssets {
  account_type: string;
  assets: Asset[];
}

export interface TokenPair {
  symbol: string;
  display_name: string;
  base_asset: string;
  quote_asset: string;
  base_asset_step: string;
  quote_asset_step: string;
  min_order_amount: string;
  max_order_amount: string;
  base_asset_logo_url: string;
  quote_asset_logo_url: string;
}
