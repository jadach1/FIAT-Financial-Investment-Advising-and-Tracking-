import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner'

import { AppRoutingModule } from './module/app-routing.module';

import { AppComponent } from './app.component';
import { NavComponent } from './component/nav/nav.component';
import { SidebarComponent } from './component/sidebar/sidebar.component';
import { HomeComponent } from './component/home/home.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { FooterComponent } from './component/footer/footer.component';
import { PageNotFoundComponent } from './component/page-not-found/page-not-found.component';
import { PortfolioComponent } from './component/portfolio/portfolioDashboard/portfolio.component';
import { AdvisorsComponent } from './component/advisors/advisors.component';
import { RegistrationComponent } from './component/registration/registration.component';
import { LoginComponent } from './component/login/login.component';
import { AuthenticationModule } from './module/authentication.module';
import { CurrentPortfolioComponent } from './component/portfolio/current-portfolio/current-portfolio.component';
import { AddAssetComponent } from './component/portfolio/add-asset/add-asset.component';
import { AssetDetailsComponent } from './component/portfolio/asset-details/asset-details.component';
import { UserProfileComponent } from './component/user-profile/user-profile.component';
import { CreateAdvisorComponent } from './component/advisors/create-advisor/create-advisor.component';
import { AdvisorDetailsComponent } from './component/advisors/advisor-details/advisor-details.component';

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
    AdvisorsComponent,
    RegistrationComponent,
    LoginComponent,
    CurrentPortfolioComponent,
    AddAssetComponent,
    AssetDetailsComponent,
    UserProfileComponent,
    CreateAdvisorComponent,
    AdvisorDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AuthenticationModule,
    NgbModule,
    Ng4LoadingSpinnerModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [AddAssetComponent]
})
export class AppModule { }
