import { NgModule, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import locale from '@angular/common/locales/en';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { NgxWebstorageModule } from 'ngx-webstorage';
import dayjs from 'dayjs/esm';
import { NgbDateAdapter, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import './config/dayjs';
import { SharedModule } from 'app/shared/shared.module';
import { TranslationModule } from 'app/shared/language/translation.module';
import { AppRoutingModule } from './app-routing.module';
import { HomeModule } from './home/home.module';
// jhipster-needle-angular-add-module-import JHipster will add new module here
import { NgbDateDayjsAdapter } from './config/datepicker-adapter';
import { fontAwesomeIcons } from './config/font-awesome-icons';
import { httpInterceptorProviders } from 'app/core/interceptor/index';
import { MainComponent } from './layouts/main/main.component';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { PageRibbonComponent } from './layouts/profiles/page-ribbon.component';
import { ErrorComponent } from './layouts/error/error.component';
import { SharedEntityModule } from './entities/shared-entity.module';
import { ConfirmationService, MessageService } from 'primeng/api';
import { WatermarkComponent } from './layouts/watermark/watermark.component';
import { registerLicense } from '@syncfusion/ej2-base';
import { SidebarComponent } from './layouts/sidebar/sidebar.component';
import { MenuAllModule, SidebarModule, ToolbarAllModule, TreeViewAllModule } from '@syncfusion/ej2-angular-navigations';
import { TemplateComponent } from './layouts/template/template.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { DashboardModule } from './dashboard/dashboard.module';

import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
  imports: [
    // angular material
    ScrollingModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    MatTreeModule,
    MatDividerModule,
    MatListModule,
    MatAutocompleteModule,

    // syncfusion
    MenuAllModule,
    SidebarModule,
    ToolbarAllModule,
    TreeViewAllModule,
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    DashboardModule,
    HomeModule,
    // jhipster-needle-angular-add-module JHipster will add new module here
    SharedEntityModule,
    AppRoutingModule,
    // Set this to true to enable service worker (PWA)
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: true }),
    HttpClientModule,
    NgxWebstorageModule.forRoot({ prefix: 'jhi', separator: '-', caseSensitive: true }),
    TranslationModule,
  ],
  providers: [
    ConfirmationService,
    MessageService,
    Title,
    { provide: LOCALE_ID, useValue: 'en' },
    { provide: NgbDateAdapter, useClass: NgbDateDayjsAdapter },
    httpInterceptorProviders,
  ],
  declarations: [
    MainComponent,
    SidebarComponent,
    TemplateComponent,
    NavbarComponent,
    ErrorComponent,
    PageRibbonComponent,
    FooterComponent,
    WatermarkComponent,
  ],
  bootstrap: [MainComponent],
})
export class AppModule {
  constructor(applicationConfigService: ApplicationConfigService, iconLibrary: FaIconLibrary, dpConfig: NgbDatepickerConfig) {
    applicationConfigService.setEndpointPrefix(SERVER_API_URL);
    applicationConfigService.setEndpointStrapiPrefix(STRAPI_API_URL);
    registerLocaleData(locale);
    // registerLicense('ORg4AjUWIQA/Gnt2VVhhQlFaclhJXGFWfVJpTGpQdk5xdV9DaVZUTWY/P1ZhSXxRdkFhXn5adXNRQ2hZWUU=');
    iconLibrary.addIcons(...fontAwesomeIcons);
    dpConfig.minDate = { year: dayjs().subtract(100, 'year').year(), month: 1, day: 1 };
  }
}
