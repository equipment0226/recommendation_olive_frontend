// API 응답 타입 (Flask REST API 와 1:1 매핑)

export interface User {
  user_id: string;
  skin_type: string;
  skin_concerns: string[];
  age_group: string;
  stale_cart: number;
}

export type BucketType = "충동" | "해결" | "시즌" | "고민" | "보관";

export interface CartItem {
  cart_id: string;
  product_id: string;
  product_name: string;
  brand: string;
  category_id: string;
  category_name: string;
  price: number;
  days_in_cart: number;
  referrer: string;
  suitable_season: string;
  key_ingredients: string[];
  bucket: string;
  group: "cleansing" | "keep";
  type: BucketType;
  default_checked: boolean;
  reason: string;
  expected_bucket: string;
  match: boolean;
}

export interface Analysis {
  user_id: string;
  total_items: number;
  avg_days: number;
  cleansing_count: number;
  keep_count: number;
  type_count: Record<string, number>;
  cleansing_items: CartItem[];
  keep_items: CartItem[];
  current_season: string;
}

export interface RecProduct {
  product_id: string;
  name: string;
  brand: string;
  price: string;
  category_id?: string;
  tag: string;
}

export interface RecOption {
  id: string;
  algo: string;
  title: string;
  desc: string;
  result_title: string;
  result_sub: string;
  items: RecProduct[];
}

export interface ValidateBucketStat {
  total: number;
  correct: number;
  rate: number;
}

export interface Mismatch {
  user_id: string;
  product_id: string;
  product_name: string;
  expected: string;
  predicted: string;
}

export interface Validation {
  total: number;
  correct: number;
  match_rate: number;
  by_bucket: Record<string, ValidateBucketStat>;
  confusion: Record<string, Record<string, number>>;
  mismatches: Mismatch[];
}
