import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../Services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private router: Router,
     private _userService:UserService,
    // private _authService: AuthService,
    private toastr: ToastrService) { }
  hide = true;
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    password: new FormControl('', [Validators.required]),
  })

  submit(loginForm : FormGroup) {

      
      this._userService.getAllRegisterUser().subscribe({
        next: res =>{
        const users = res.find((user:any) =>{
          return user.email === this.loginForm.value.email && user.password === this.loginForm.value.password;
        });
        
        if(users){
          //console.log(users)
          localStorage.setItem('currentUser', JSON.stringify(users));
          this.toastr.success(users.firstname + " user login Successfully !! ", 'Success Message!');
          this.loginForm.reset();
          //this._authService.login();
          this.router.navigate(['/dashboard']);

        }
        else{
          //alert("Invalid credientails. Try Again !!")
          this.toastr.error("Invalid credientails. Try Again !!", 'Error Message!');
       
        }
      },
      error:console.log,
    })
  }

}
