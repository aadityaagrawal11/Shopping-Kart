import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  url: string = "http://localhost:3000/addToCart";

  getItem() {
    return this.http.get<any>(this.url);
  }

  postItem(data: any): Observable<any> {
    return this.http.post<any>(this.url, data);
  }

  deleteItem(id: any): Observable<any> {
    return this.http.delete<any>(`${this.url}/${id}`);
  }

  updateItem(id: any, data: any): Observable<any> {
    return this.http.patch<any>(`${this.url}/${id}`, data);
  }


}
