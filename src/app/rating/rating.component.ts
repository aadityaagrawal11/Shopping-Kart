import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.css'
})
export class RatingComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public ref: MatDialogRef<RatingComponent>,
    private http: HttpClient,
    private toastr: ToastrService) {
    ref.disableClose = true;
  }
  rating: number = 1;
  review: string = '';
  reviewTitle: string = '';
  isReviewed: boolean | undefined;
  stars: number[] = [1, 2, 3, 4, 5]; // Number of stars
  

  ngOnInit(): void {
    console.log('Dialog', this.data);
    if (this.data.isReviewed != undefined){
      this.isReviewed = this.data.isReviewed;
      this.review = this.data.userReview;
      this.rating = this.data.userRating;
      this.reviewTitle = this.data.userReviewTitle
      console.log(this.rating);
      
    }   
  }

  setRating(star: number) {
    this.rating = star;
  }



  Submission() {
    //console.log(this.review);
    this.isReviewed = true;
    this.ref.close(
      {
        close: true,
        data: {
          rating: this.rating,
          review: this.review,
          isReviewed: this.isReviewed,
          reviewTitle : this.reviewTitle
        }
      });

  }

}



