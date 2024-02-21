import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IApplicationPaymentPreferences } from './application-payment-preference.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApplicationPaymentPreferencesService {
  public resourceUrl: string;

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/application-payment-preferences');
  }

  public getData(idApplication: number): Observable<IApplicationPaymentPreferences[]> {
    return this.http.get<IApplicationPaymentPreferences[]>(this.resourceUrl + '/loan-application/' + idApplication);
  }

  public createData(data: IApplicationPaymentPreferences): Observable<IApplicationPaymentPreferences> {
    return this.http.post<IApplicationPaymentPreferences>(this.resourceUrl, data);
  }

  public updateData(id: number, data: IApplicationPaymentPreferences): Observable<IApplicationPaymentPreferences> {
    return this.http.put<IApplicationPaymentPreferences>(this.resourceUrl + '/' + id, data);
  }

  public deleteData(id: number): Observable<IApplicationPaymentPreferences> {
    return this.http.delete<IApplicationPaymentPreferences>(this.resourceUrl + '/' + id);
  }

  public filterData(id: number, paymentType: string): Observable<IApplicationPaymentPreferences[]> {
    return this.http.get<IApplicationPaymentPreferences[]>(this.resourceUrl + '/payment-type/' + paymentType + '/loan-application/' + id);
  }
}
