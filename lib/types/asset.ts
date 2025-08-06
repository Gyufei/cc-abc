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