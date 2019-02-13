import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PublicGuard, ProtectedGuard } from 'ngx-auth'

import { PageNotFoundComponent } from '../component/page-not-found/page-not-found.component';
import { PortfolioComponent } from '../component/portfolio/portfolio.component';
import { AdvisorsComponent } from '../component/advisors/advisors.component';
import { HomeComponent } from '../component/home/home.component';
import { DashboardComponent } from '../component/dashboard/dashboard.component';

const routes: Routes = [
  //order matters, put more specific routes above less specific routes
  { path: 'home', component: HomeComponent, canActivate: [PublicGuard]},
  { path: 'dashboard', component: DashboardComponent, canActivate: [ProtectedGuard]},
  { path: 'portfolio', component: PortfolioComponent, canActivate: [ProtectedGuard]},
  { path: 'advisors', component: AdvisorsComponent, canActivate: [ProtectedGuard]},
  { path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: '**', component: PageNotFoundComponent }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule, 
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
