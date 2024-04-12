import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddtoCartComponent } from './addto-cart/addto-cart.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductDetailsComponent } from './product-details/product-details.component';

const routes: Routes = [
  { path:'',    redirectTo:'dashboard', pathMatch:'full' },  //Default Routing
  { path:'dashboard', component: DashboardComponent, 

  },
  { path:'dashboard/category/:categoryName',    component: DashboardComponent},
  { path:'dashboard/product/:productId', component: ProductDetailsComponent},
  { path:'cart',    component: AddtoCartComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
