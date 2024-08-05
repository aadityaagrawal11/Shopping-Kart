import { Component } from '@angular/core';
import { CategoryService } from '../Services/category.service';
import { ApiService } from '../Services/api.service';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})  
export class CarouselComponent {

  selectedCategory!: string;
  products: any[] = [];
  

  constructor(private _api: ApiService,private categoryService: CategoryService){

      this.categoryService.selectedCategory$.subscribe(category => {
      this.selectedCategory = category.toLowerCase();
     // console.log(this.selectedCategory);
      this.getdata();
    });
  }

  
  getdata() {
    
    if(this.selectedCategory === 'all products'){
      this._api.getApi().subscribe( res => this.products = res )
    }
    else{
      this._api.getProductByCategory(this.selectedCategory).subscribe( res => this.products = res )
    }
    
  }

}
