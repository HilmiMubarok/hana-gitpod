import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { map, Observable, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MisDashboardService {
  endPoint: string;
  endPointUserInsurance: string;
  public resourceUrlInsurance: any;
  public resourceSlaStandart: any;

  constructor(private http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    this.endPoint = applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/dashboards/credit-proposal/insurance');
    this.endPointUserInsurance = applicationConfigService.getEndpointFor(
      MICROSERVICENAME.LOS + '/api/dashboards/credit-proposal/by-insurance'
    );
    this.resourceSlaStandart = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/application-options');
  }

  getBarChartData(date: string) {
    const params = new HttpParams().set('date', date);
    return this.http.get<any>(this.endPoint, { params });
  }

  getBarChartDataUserInsurance(date: string) {
    const params = new HttpParams().set('date', date);
    return this.http.get<any>(this.endPointUserInsurance, { params });
  }

  getStatisticLoanOps(positionId) {
    const params = new HttpParams().set('idPosition', positionId);
    return this.http.get<any>(
      this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/dashboards/credit-proposal/by-status'),
      { params }
    );
  }

  getSlaStandart() {
    const params = new HttpParams().set('size', 99999);
    return this.http.get<any>(this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/application-options'), { params });
  }
}
