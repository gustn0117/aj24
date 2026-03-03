export interface Product {
  id: number;
  name: string;
  original_price: number;
  sale_price: number;
  image: string;
  badges: string[];
  rating: number;
  category: string;
  sort_order: number;
  is_active: boolean;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Banner {
  id: number;
  title: string;
  subtitle: string | null;
  bg_gradient: string;
  link_url: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Member {
  id: number;
  email: string;
  name: string;
  phone: string | null;
  address: string | null;
  status: "active" | "inactive" | "banned";
  memo: string | null;
  password_hash?: string;
  created_at: string;
  updated_at: string;
}

export interface MemberPublic {
  id: number;
  email: string;
  name: string;
  phone: string | null;
  address: string | null;
  status: string;
  created_at: string;
}

export interface Order {
  id: number;
  member_id: number | null;
  member_name: string;
  member_email: string | null;
  status: "pending" | "confirmed" | "shipping" | "delivered" | "cancelled" | "refunded";
  total_amount: number;
  shipping_address: string | null;
  shipping_name: string | null;
  shipping_phone: string | null;
  memo: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number | null;
  product_name: string;
  quantity: number;
  unit_price: number;
  created_at: string;
}

export interface Review {
  id: number;
  product_id: number;
  member_id: number | null;
  author_name: string;
  rating: number;
  content: string;
  is_admin_created: boolean;
  created_at: string;
  updated_at: string;
}

export interface Wishlist {
  id: number;
  member_id: number;
  product_id: number;
  created_at: string;
}

export interface CartItem {
  productId: number;
  name: string;
  sale_price: number;
  original_price: number;
  image: string;
  quantity: number;
}
