import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { PageNotFoundComponent } from '../component/page-not-found/page-not-found.component';
import { PortfolioComponent } from '../component/portfolio/portfolio.component';
import { AdvisorsComponent } from '../component/advisors/advisors.component';
import { PerformanceComponent } from '../component/performance/performance.component';
import { HomeComponent } from '../component/home/home.component';
import { DashboardComponent } from '../component/dashboard/dashboard.component';
import { RegistrationComponent } from '../component/registration/registration.component';
import { LoginComponent } from '../component/login/login.component';
//import { PublicGuard, ProtectedGuard } from 'ngx-auth';

const publicRoutes: Routes = [
  //order matters, put more specific routes above less specific routes
  { path: 'home', component: HomeComponent},
  { path: 'dashboard', component: DashboardComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'portfolio', component: PortfolioComponent },
  { path: 'advisors', component: AdvisorsComponent },
  { path: 'performance', component: PerformanceComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
]

/*const protectedRoutes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'portfolio', component: PortfolioComponent },
  { path: 'watchlist', component: WatchlistComponent },
  { path: 'advisors', component: AdvisorsComponent },
  { path: 'performance', component: PerformanceComponent }
]*/

@NgModule({
  declarations: [],
  imports: [
    CommonModule, RouterModule.forRoot(publicRoutes)//, RouterModule.forRoot(protectedRoutes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
