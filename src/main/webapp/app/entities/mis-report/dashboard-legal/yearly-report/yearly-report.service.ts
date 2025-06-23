import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';

@Injectable({
  providedIn: 'root',
})
export class YearlyReportService {
  endPoint: string;
  constructor(private http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    this.endPoint = applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/dashboards/credit-proposal/legal/year');
  }

  getYearlyReport(year: string, region?: string) {
    let params = new HttpParams().set('year', year);
    if (region === "R1" || region === "R2") {
      params = params.set('region', region);
    }
    return this.http.get<any>(this.endPoint, { params });
  }
}
