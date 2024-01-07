import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatCardModule} from '@angular/material/card';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTableModule} from '@angular/material/table';
import { MatMenuModule} from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import {MatSliderModule} from '@angular/material/slider';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { AccueilComponent } from './pages/accueil/accueil.component';
import { DetailsHebergementComponent } from './pages/details-hebergement/details-hebergement.component';
import { NosLogementsComponent } from './pages/nos-logements/nos-logements.component';
import { NosServicesComponent } from './pages/nos-services/nos-services.component';
import { ThankYouComponent } from './pages/thank-you/thank-you.component';
import { FailPageComponent } from './pages/failPage/fail-page.component';
import { FooterComponent } from './shared_pages/footer/footer.component';
import { DefaultHomeComponent } from './shared_pages/default-home/default-home.component';

import { LightgalleryModule } from 'lightgallery/angular';

import { AgmCoreModule } from '@agm/core';
import { AuthentificationComponent } from './pages/authentification/authentification.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { SearchbarComponent } from './shared_pages/searchbar/searchbar.component';
import { SearchbarService } from './services/search_bar.service';
import { authInterceptorProviders } from './helpers/auth.interceptor';
import { AuthService } from './services/auth.service';
import { TokenStorageService } from './services/token_storage.service';
import { UserService } from './services/user.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { OAuthModule } from 'angular-oauth2-oidc';
import { GoogleApiService } from './services/google-api.service';
import { LogementsService } from './services/logements.service';
import { CategoriesService } from './services/categories.service';
import {MatSelectModule} from '@angular/material/select';
import {NgxPaginationModule} from 'ngx-pagination';
import { PlyrModule } from 'ngx-plyr';
import { ContactsService } from './services/contact.service';
import { ReservationsService } from './services/reservation.service';
import { ReservationComponent } from './pages/reservation/reservation.component';
import { EquipementsService } from './services/equipements.service';
import { NotificationService } from './services/notificaton.service';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import {TranslateModule,TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxSpinnerModule } from "ngx-spinner";
import { DatePipe } from '@angular/common';
import { AvisService } from './services/avis.service';
import { StarRatingModule } from 'angular-star-rating';
import { MatNativeDateModule } from '@angular/material/core';
import { CurrencyService } from './services/currency-convertor.service';
import {MatExpansionModule} from '@angular/material/expansion';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}


const UI_Modules = [
  MatButtonModule,
  MatSidenavModule,
  MatIconModule,
  MatToolbarModule,
  MatCardModule,
  MatInputModule,
  MatTabsModule,
  MatDatepickerModule,
  MatTableModule,
  MatMenuModule,
  MatCheckboxModule,
  MatRadioModule,
  MatSelectModule,
  MatSliderModule,
  MatFormFieldModule,
  MatNativeDateModule,
  MatExpansionModule
]

@NgModule({
  declarations: [
    AppComponent,
    AccueilComponent,
    DetailsHebergementComponent,
    NosLogementsComponent,
    NosServicesComponent,
    ThankYouComponent,
    FailPageComponent,
    FooterComponent,
    DefaultHomeComponent,
    AuthentificationComponent,
    SearchbarComponent,
    ReservationComponent
  ],
  imports: [
    HttpClientModule,
    NgxIntlTelInputModule,
    LightgalleryModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    AgmCoreModule.forRoot({
			apiKey: 'AIzaSyCBidDJjV6XdJK7_7xJvR-YL2iG5XSKhOs',
			region: 'MA',
      libraries: ['places','geometry']
		}),
    OAuthModule.forRoot(),
    UI_Modules,
    NgxPaginationModule,
    PlyrModule,
    ShareButtonsModule.withConfig({
      debug: true,
    }),
    ShareIconsModule,
    TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        },
        defaultLanguage: 'fr'
      }
    ),
    NgxSpinnerModule,
    StarRatingModule.forRoot()
  ],
  providers: [
    DatePipe,
    SearchbarService,
    authInterceptorProviders,
    AuthService,
    TokenStorageService,
    LogementsService,
    UserService,
    CategoriesService,
    GoogleApiService,
    ContactsService,
    AvisService,
    CurrencyService,
    ReservationsService,
    EquipementsService,
    NotificationService,
    MatDatepickerModule
  ],
  bootstrap: [AppComponent],
  schemas:  [ CUSTOM_ELEMENTS_SCHEMA ]

})
export class AppModule { }
