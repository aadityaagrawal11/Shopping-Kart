import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { provideHttpClient, withFetch } from "@angular/common/http";
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSort } from '@angular/material/sort';
import { MatBadgeModule } from '@angular/material/badge'
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { provideNativeDateAdapter } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutServerModule } from '@angular/flex-layout/server';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AddtoCartComponent } from './addto-cart/addto-cart.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { ToastrModule } from 'ngx-toastr';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs'
import { MatGridListModule } from '@angular/material/grid-list'
import { NgxSpinnerModule } from 'ngx-spinner';
import { CarouselComponent } from './carousel/carousel.component';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { SearchFilterPipe } from './search-filter.pipe';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ProfileComponent } from './profile/profile.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import {MatChipsModule} from '@angular/material/chips';
@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    AddtoCartComponent,
    ConfirmationDialogComponent,
    CarouselComponent,
    ProductDetailsComponent,
    SearchFilterPipe,
    FooterComponent,
    LoginComponent,
    RegisterComponent,
    CheckoutComponent,
    ProfileComponent,
    OrderDetailsComponent,

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot({
      //positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    NgbCarouselModule,
    AppRoutingModule,
    HttpClientModule,
    FlexLayoutModule,
    FlexLayoutServerModule,
    DragDropModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatTabsModule,
    MatDialogModule,
    MatChipsModule,
    MatDatepickerModule,
    MatButtonModule,
    MatTableModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatPaginatorModule,
    MatSort,
    MatTooltipModule,
    MatBadgeModule,
    MatListModule,
    MatGridListModule,
    NgxSpinnerModule,
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),
    provideNativeDateAdapter()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


