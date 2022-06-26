import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Observable } from 'rxjs';
import { SessionStorageService } from 'ngx-webstorage';
import { IHomePage } from './models/home-page.model';

@Injectable({ providedIn: 'root' })
export class StrapiService {
  constructor(
    private applicationConfigService: ApplicationConfigService,
    private sessionStorageService: SessionStorageService,
    private http?: HttpClient
  ) {}

  private resourceUrl = this.applicationConfigService.getStrapiEndpointFor() + '/services/strapi';

  private getLocale(): string {
    if (this.sessionStorageService.retrieve('locale')) {
      return this.convertLocale(this.sessionStorageService.retrieve('locale'));
    }

    return 'en';
  }

  private convertLocale(locale: string): string {
    if (locale === 'in') {
      return 'id';
    }
    return locale;
  }

  public getHomePage(): Observable<HttpResponse<IHomePage>> {
    return this.http.get<IHomePage>(this.resourceUrl + '/home-page?_locale=' + this.getLocale(), { observe: 'response' });
  }
}
