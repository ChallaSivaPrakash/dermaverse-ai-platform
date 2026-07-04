import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Type Interfaces reflecting the skincare data contracts
export interface UserSkinUpdate {
  skin_type?: string;
  skin_concerns?: string[];
  prescription_data?: string;
}

export interface ProductPayload {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image_url?: string;
  active_ingredients?: string[];
  target_skin_types?: string[];
}

export interface ConsultationRequest {
  text_query?: string;
  has_image: boolean;
  lighting_confirmed: boolean;
  prescription_text?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Helper to fetch the local JWT token for headers
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // --- Auth & User Skin Profile Endpoints ---
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials);
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, user);
  }

  updateSkinProfile(skinData: UserSkinUpdate): Observable<any> {
    return this.http.put(`${this.apiUrl}/auth/profile/skin`, skinData, {
      headers: this.getAuthHeaders()
    });
  }

  // --- Skincare Products CRUD Endpoints ---
  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/products`);
  }

  getProduct(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/products/${id}`);
  }

  createProduct(product: ProductPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/products`, product, {
      headers: this.getAuthHeaders()
    });
  }

  updateProduct(id: string, product: Partial<ProductPayload>): Observable<any> {
    return this.http.put(`${this.apiUrl}/products/${id}`, product, {
      headers: this.getAuthHeaders()
    });
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/products/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // --- AI Dermatological Consultation Endpoint ---
  askAI(consultation: ConsultationRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/ai/ask`, consultation, {
      headers: this.getAuthHeaders()
    });
  }
}