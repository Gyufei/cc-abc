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
} 