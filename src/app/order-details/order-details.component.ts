import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.css'
})
export class OrderDetailsComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public ref: MatDialogRef<OrderDetailsComponent>,
    private http: HttpClient,
    private route: ActivatedRoute,
    private toastr: ToastrService) {
    ref.disableClose = true;
  }
  Orders: any = this.data.order;
  User: any = this.data;
  id: any;
  ngOnInit() {
    console.log(this.data);
    // this.route.paramMap.subscribe((params) => { this.id = params.get('id') }) 
    // console.log(this.id);
  }


}


