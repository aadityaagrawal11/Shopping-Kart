import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrl: './edit-dialog.component.css'
})
export class EditDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public ref: MatDialogRef<EditDialogComponent>,
  private http : HttpClient,
  private toastr: ToastrService){
  ref.disableClose = true;
}


ngOnInit(): void {
  
  
}


today = new Date();
editForm = new FormGroup({

  fullName: new FormControl(this.data.fullName, [Validators.required]),
  addressLine1: new FormControl(this.data.addressLine1, [Validators.required]),
  phoneNumber: new FormControl(this.data.phoneNumber, [Validators.required]),
  city: new FormControl(this.data.city, [Validators.required]),
  state: new FormControl(this.data.state, [Validators.required]),
  pinCode: new FormControl(this.data.pinCode, [Validators.required]),
});

pincodeURL: string = "https://api.postalpincode.in/pincode/";
getpincode() {
  const pincode = this.editForm.value.pinCode;
  this.http.get<any>(this.pincodeURL + pincode).subscribe((res) => {
    if (res[0].Status === 'Success') {
      //console.log(res);
      // this.addressForm.get('city')?.disable();
      // this.addressForm.get('state')?.disable();
      this.editForm.get('city')?.setValue(res[0].PostOffice[0].District);
      this.editForm.get('state')?.setValue(res[0].PostOffice[0].State);
    }

  })
}
editSubmission() {
  //this.http.patch<any>("http://localhost:3000/registerUser/" + this.data.id, this.editForm.value)
  //console.log(this.editForm.value);

  // this._userService.updateUser(this.data.id, this.editForm.value).subscribe({
  //   next: (res) => {
  //     this.toastr.success(this.editForm.value.fullName + " user modified Successfully !! ", 'Success Message!');
  //     this.editForm.reset();
      this.ref.close({close:true,data:
        this.editForm.value});
  //   },
  //   error: console.log
  // });
}

}

