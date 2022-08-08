import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Observable } from 'rxjs';
import { SessionStorageService } from 'ngx-webstorage';
import { IHomePage } from './models/home-page.model';
import { IPositions } from './models/positions-page.model';

@Injectable({ providedIn: 'root' })
export class StrapiService {
  constructor(
    private applicationConfigService: ApplicationConfigService,
    private sessionStorageService: SessionStorageService,
    private http?: HttpClient
  ) {}

  private resourceUrl = this.applicationConfigService.getStrapiEndpointFor() + '/strapi';

  private createRequestOpt(req?: any): HttpParams {
    let options: HttpParams = new HttpParams();
    options = options.set('_locale', this.getLocale());

    if (req) {
      Object.keys(req).forEach(key => {
        options = options.set(key, req[key]);
      });
    }

    return options;
  }

  private getLocale(): string {
    console.log('xxxx', this.sessionStorageService.retrieve('locale'));

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

  public getPositions(req?: any): Observable<HttpResponse<IPositions[]>> {
    const options = this.createRequestOpt(req);
    return this.http.get<IPositions[]>(this.resourceUrl + '/positions', { params: options, observe: 'response' });
  }
}
