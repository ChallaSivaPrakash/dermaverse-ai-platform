import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
  id: string;
  email: string;
  role: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  category: string | null;
  image_url: string | null;
  owner_id: string;
}

export interface Order {
  id: string;
  user_id: string;
  status: string;
  total: number;
  items: { product_id: string; quantity: number; price: number; name: string }[];
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwt_token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // ---- Auth ----
  login(email: string, password: string): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${this.base}/auth/login`, { email, password });
  }

  register(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.base}/auth/register`, { email, password });
  }

  // ---- Products ----
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.base}/products`);
  }

  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.base}/products/${id}`);
  }

  createProduct(data: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(`${this.base}/products`, data, { headers: this.authHeaders() });
  }

  updateProduct(id: string, data: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.base}/products/${id}`, data, { headers: this.authHeaders() });
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/products/${id}`, { headers: this.authHeaders() });
  }

  // ---- Orders ----
  createOrder(items: Order['items'], total: number): Observable<Order> {
    return this.http.post<Order>(`${this.base}/orders`, { items, total }, { headers: this.authHeaders() });
  }

  getMyOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.base}/orders/me`, { headers: this.authHeaders() });
  }

  // ---- AI ----
  aiAsk(message: string): Observable<{ response: string }> {
    return this.http.post<{ response: string }>(`${this.base}/ai/ask`, { message }, { headers: this.authHeaders() });
  }
}
