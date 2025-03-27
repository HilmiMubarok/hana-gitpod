import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MisDashboardService {
  endPoint: string;
  public resourceUrlInsurance: any;
  public resourceSlaStandart: any;
  endPointCredam: string;

  constructor(private http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    this.endPoint = applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/dashboards/credit-proposal/insurance');
    this.endPointCredam = applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/dashboards/credit-proposal/credit-admin');
    this.resourceSlaStandart = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/application-options');
  }

  getCredamData(date: string) {
    const params = new HttpParams().set('date', date);
    return this.http.get<any>(this.endPointCredam, { params });
  }
  getBarChartData(date: string) {
    const params = new HttpParams().set('date', date);
    return this.http.get<any>(this.endPoint, { params });
  }

  getStatisticLoanOps(positionId) {
    const params = new HttpParams().set('idPosition', positionId);
    return this.http.get<any>(
      this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/dashboards/credit-proposal/by-status'),
      { params }
    );
  }

  getSlaStandart() {
    const params = new HttpParams().set('page', 0).set('size', 99999).set('sort', 'id,desc');
    return this.http.get<any>(this.resourceSlaStandart, { params });
  }
}
