import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { CategoryService } from '../category.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})  // private _service: ProductService,
export class CarouselComponent {
  selectedCategory: string = 'jewelery';
  subscription: Subscription;
  mensClothingDetails: any[] | undefined;
  constructor(private http: HttpClient, private categoryService: CategoryService) {
    this.subscription = this.categoryService.selectedCategory$.subscribe(category => {
      this.selectedCategory = category.toLowerCase();
     // console.log(this.selectedCategory);
      if(this.selectedCategory == 'jewelery') this.images = this.categoryImages.jewelery;
      else if(this.selectedCategory == 'electronics') this.images = this.categoryImages.electronics;
      else if(this.selectedCategory == `men's clothing`) this.images = this.categoryImages["men's clothing"];
      else if(this.selectedCategory == `women's clothing`) this.images = this.categoryImages["women's clothing"];
      else{ this.images = this.categoryImages.electronics;}
    });
  }
  @Input() categoryName: any;
  products: any[] = [];
  categoryImages: any = []
  url: string = "https://fakestoreapi.com/products/";
  images = [62, 83, 466, 965, 982, 1043, 738].map((n) => `https://picsum.photos/id/${n}/900/500`);

  ngOnInit(): void {
    this.getdata();
    // console.log('images', this.categoryImages.jewelery);
    // console.log('cat', this.selectedCategory);

  }

  getdata() {
    this.http.get<any>(this.url).subscribe({
      next: (res) => {
        this.products = res;
        this.categoryImages = this.products.reduce((acc, item) => {
          const { category, image } = item;
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(image);
          return acc;
        }, {});
      },
      error: console.log,

    })
  }




  paused = false;
  unpauseOnArrow = false;
  pauseOnIndicator = false;
  pauseOnHover = true;
  pauseOnFocus = true;
}
