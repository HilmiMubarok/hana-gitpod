import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApplicationConfigService } from "app/core/config/application-config.service";
import { MICROSERVICENAME } from "app/shared/constants/config.constants";

@Injectable({
  providedIn: 'root'
})
export class MisDashboardService {
  endPoint: string;

  constructor(private http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    this.endPoint = applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/dashboards/credit-proposal/credit-admin')
  }

  getBarChartData(date: string) {
    const params = new HttpParams().set('date', date);
    return this.http.get<any>(this.endPoint, { params });
  }

  getStatisticLoanOps(positionId) {
    const params = new HttpParams().set('idPosition', positionId);
    return this.http.get<any>(this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/dashboards/credit-proposal/by-status'), { params });
  }

}