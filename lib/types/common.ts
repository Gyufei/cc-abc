export interface ApiKey {
  id: string;
  platform: string;
  account_name: string;
  api_key: string;
  description: string;
  created_at: string;
}

export interface User {
  user_id: string;
  username: string;
  token: string;
}

export interface MarketInfo {
  symbol: string;
  price: number;
  change_24h: number;
  volume_24h: number;
  high_24h: number;
  low_24h: number;
}

export interface ErrorRes {
  code: number;
  msg: string;
}
