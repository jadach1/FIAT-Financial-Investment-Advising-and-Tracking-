import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FooterComponent } from './footer/footer.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { AdvisorsComponent } from './advisors/advisors.component';
import { PerformanceComponent } from './performance/performance.component';

const appRoutes: Routes = [
  //order matters, put more specific routes above less specific routes
  { path: 'home', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'portfolio', component: PortfolioComponent },
  { path: 'watchlist', component: WatchlistComponent },
  { path: 'advisors', component: AdvisorsComponent },
  { path: 'performance', component: PerformanceComponent },

  { path: '',
    redirectTo: '/home',
    pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
]

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    SidebarComponent,
    HomeComponent,
    DashboardComponent,
    FooterComponent,
    PageNotFoundComponent,
    PortfolioComponent,
    WatchlistComponent,
    AdvisorsComponent,
    PerformanceComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      {enableTracing: true } //for debugging only, outputs routing to the console
    ),

    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
