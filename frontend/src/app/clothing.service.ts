// clothing.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface ClothingItem {
  id: number;
  name: string;
  description: string;
  image_url: string;
  category: {
    id: number;
    name: string;
  };
}
@Injectable({
  providedIn: 'root'
})
export class ClothingService {
  private baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}


getClothingItems(): Observable<ClothingItem[]> {
  const token = localStorage.getItem('auth_token'); 
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  return this.http.get<ClothingItem[]>(`${this.baseUrl}/clothing-items/`, { headers });
}

addClothingItem(name: string, description: string, imageUrl: string, categoryId: number): Observable<any> {
  const userId = localStorage.getItem('user_id'); 
  console.log(localStorage)
  console.log("USER ID : ", userId);
  if (!userId) {
      throw new Error('UserID not found');
  }

  const clothingItem = {
      name,
      description,
      image_url: imageUrl,
      category_id: categoryId,
      user_id: +userId 
  };

  return this.http.post(`${this.baseUrl}/new-clothing/`, clothingItem);
}

getClothingCategories(): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/clothing-categories/`);
}

getClothingItemById(id: number): Observable<ClothingItem> {
  return this.http.get<ClothingItem>(`${this.baseUrl}/clothing-items/${id}`);
}
}
