import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';
import { PaiementGuard } from './guard/paiement.guard';
import { AuthReversoGuard } from './guard/authreverso.guard';
import { AuthentificationComponent } from './pages/authentification/authentification.component';
import { DefaultHomeComponent } from './shared_pages/default-home/default-home.component';
import { GoogleAuthComponent } from './pages/authentification/google-auth/google-auth.component';

const routes: Routes = [
  {
    path:'',
    component: DefaultHomeComponent,
    children : [
    {
      path: '',
      loadChildren: () => import('./shared_pages/shared.module').then(m => m.SharedModule)
    },
    {
      path: '',
      loadChildren: () => import('./pages/nos-services/nos-services.module').then(m => m.NosServicesModule)
    },
    {
      path: '',
      canActivate:[PaiementGuard],
      loadChildren: () => import('./pages/reservation/reservation.module').then(m => m.ReservationModule)
    },
    {
      path: '',
      loadChildren: () => import('./pages/details-hebergement/details-hebergement.module').then(m => m.DetailsHebergementModule)
    },
    {
      path: '',
      loadChildren: () => import('./pages/nos-logements/nos-logements.module').then(m => m.NosLogementsModule)
    },
    {
      path: '',
      canActivate:[AuthGuard],
      loadChildren: () => import('./pages/thank-you/thank-you.module').then(m => m.ThankYouModule)
    },
    {
      path: '',
      canActivate:[AuthGuard],
      loadChildren: () => import('./pages/failPage/fail-page.module').then(m => m.FailPageModule)
    },

    ]
  },
  {
    path: 'authentification',
    component: AuthentificationComponent,
    canActivate:[AuthReversoGuard],
    loadChildren: () => import('./pages/authentification/authentification.module').then(m => m.AuthentificationModule),
  },
  {
   path: 'google-auth',
   canActivate:[AuthReversoGuard],
   component: GoogleAuthComponent
  },
  { path: '**'              , redirectTo: '' },
  { path: '*'               , redirectTo: ''}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
