import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})  // private _service: ProductService,
export class CarouselComponent {
  constructor(private http: HttpClient,
   ) { }
 @Input() categoryName:any;
  products: any[] = [];
  categoryImages:any[] = []
  url: string = "https://fakestoreapi.com/products/";
  images = [62, 83, 466, 965, 982, 1043, 738].map((n) => `https://picsum.photos/id/${n}/900/500`);
  
  ngOnInit(): void {
    this.getdata();
    console.log(this.categoryImages);
    console.log(this.categoryName);
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
