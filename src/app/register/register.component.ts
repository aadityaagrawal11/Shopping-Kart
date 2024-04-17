import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../Services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  constructor(private router: Router, 
    private user:UserService,
    private toastr: ToastrService,
   ) {}
  
  registerForm = new FormGroup({

    firstname: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern('[a-zA-Z ]*')]),
    lastname: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern('[a-zA-Z ]*')]),
    email: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
    address: new FormControl([]),
  }, //{ validators: PasswordValidator }
  )


  submit(registerForm: FormGroup) {
    this.user.postRegisterUser(this.registerForm.value).subscribe({
      next: res =>{
        console.log(res);
        
        this.toastr.success(this.registerForm.value.firstname + " user Added to the portal !! ", 'Success Message!');
        this.registerForm.reset();
        this.router.navigate(['/login']);
        },
      error:console.log,
    } 
    )}
}
