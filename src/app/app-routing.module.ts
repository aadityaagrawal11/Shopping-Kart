import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddtoCartComponent } from './addto-cart/addto-cart.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ProfileComponent } from './profile/profile.component';
import { OrderDetailsComponent } from './order-details/order-details.component';

const routes: Routes = [
  { path:'',    redirectTo:'dashboard', pathMatch:'full' },  //Default Routing
  { path:'login', component: LoginComponent},
  { path:'register', component: RegisterComponent},
  { path:'profile', component: ProfileComponent},
  // { path:'profile/order', component: OrderDetailsComponent},
  { path:'dashboard', component: DashboardComponent},
  { path:'dashboard/category/:categoryName',    component: DashboardComponent},
  { path:'dashboard/product/:productId', component: ProductDetailsComponent},
  { path:'cart',    component: AddtoCartComponent },
  { path:'checkout',    component: CheckoutComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
