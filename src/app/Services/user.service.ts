import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }
  
  url:string = "http://localhost:3000/user";

  getAllRegisterUser(){
    return this.http.get<any>(this.url);
  }

  postRegisterUser(data:any):Observable<any>{
    return this.http.post<any>(this.url, data);
  }

  deleteUser(id:any):Observable<any>{
    return this.http.delete<any>( `${this.url}/${id}`);
  } 

 updateUser(id:any, data:any):Observable<any>{
  return this.http.patch<any>( `${this.url}/${id}`, data);
 }
 
}
