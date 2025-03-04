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

  // private formatDate(date = new Date()) {
  //   const year = date.getFullYear();
  //   const month = String(date.getMonth() + 1).padStart(2, '0');
  //   const day = String(date.getDate()).padStart(2, '0');

  //   return `${year}-${month}-${day}`;
  // }

  getBarChartData(date: string) {
    const params = new HttpParams().set('date', date);
    return this.http.get<any>(this.endPoint, { params });
  }

}