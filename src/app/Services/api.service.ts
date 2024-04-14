import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  url: string = "https://fakestoreapi.com/products/";
  productArr :any[] = [];
  getdata() {
    this.http.get<any>(this.url).subscribe({
      next: (res) => {
        this.productArr = res

        this.productArr.forEach((ele)=>{
          ele.quantity = 0;
          ele.amount = 0;
          ele.addedToCart = false;
        })
        this.http.post<any>("http://localhost:3000/productApi",this.productArr).subscribe((res)=>console.log('Data posted')
        );
        console.log(this.productArr);
      },
      error: console.log,

    })
  }

  getApi(){
    return  this.http.get<any>("http://localhost:3000/productApi")
  }
  updateApi(id:any, data:any):Observable<any>{
    return this.http.patch<any>( `http://localhost:3000/productApi/${id}`, data);
   }
}
