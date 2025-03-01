import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public ref: MatDialogRef<EditProfileComponent>) {
    ref.disableClose = true;
  }

  msg: string = '';
  user: any;
  FirstName:string = '';
  LastName:string = '';
  Email:string = '';
  Password:string = '';
  MobileNumber: any; 
  ngOnInit(): void {
    this.msg = this.data.msg;
    this.user = this.data.user;
    this.FirstName = this.user.firstname;
    this.LastName = this.user.lastname;
    this.Email = this.user.email;
    this.Password = this.user.password;
    this.MobileNumber = this.user.address[0].phoneNumber;
    console.log(this.user);

  }


  editSubmission() {
   
    this.ref.close({
      close: true,
      data:this.msg=='Name'?{FirstName:this.FirstName,LastName:this.LastName}:
      this.msg=='Email'?this.Email: this.msg == 'Password'?this.Password :
      this.msg == 'MobileNumber' ? this.MobileNumber:null
      
    });
   
  }

}


