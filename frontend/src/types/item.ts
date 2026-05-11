export interface Item {
  id: number;
  name: string;
  description: string;
  createdAt: string;
}

export interface ItemRequest {
  name: string;
  description?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
