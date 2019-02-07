import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';

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
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { JwtModule } from '@auth0/angular-jwt';

export function tokenGetter() {
  return localStorage.getItem('access_token');
}

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
    PerformanceComponent,
    RegistrationComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
      JwtModule.forRoot({
        config: {
          tokenGetter: tokenGetter,
          authScheme: 'JWT'
        }
      })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }