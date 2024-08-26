import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../dto/product.dto';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  
  private baseUrl = '/bp/products'; 

  constructor(private http: HttpClient) {}


  getProducts(): Observable<{ data: Product[] }> {
    return this.http.get<{ data: Product[] }>(`${this.baseUrl}`);
  }


  addProduct(product: Product): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, product);
  }

  updateProduct(id: any, product: Product): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/` +  id,product);
  }

  DeleteProduct(id: any): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/` + id);
  }
}
