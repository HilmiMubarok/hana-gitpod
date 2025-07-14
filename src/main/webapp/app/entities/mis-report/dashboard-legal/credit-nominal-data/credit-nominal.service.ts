import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CreditNominalService {
  endPoint: string;
  constructor(private http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    this.endPoint = applicationConfigService.getEndpointFor(
      MICROSERVICENAME.LOS + '/api/dashboards/credit-proposal/legal/credit-nominal/year'
    );
  }

  getCreditNominalData(year: number, region?: string) {
    let params = new HttpParams().set('year', year.toString());
    if (region === 'R1' || region === 'R2') {
      params = params.set('region', region);
    }
    return this.http.get<any>(this.endPoint, { params }).pipe(map((res: any) => this.processResponseData(res)));
  }

  processResponseData(data: any) {
    return this.finalizeAllMonthsData(this.takeOutPlafondCurrency(data));
  }

  finalizeAllMonthsData(data: any) {
    const finalizedData = JSON.parse(JSON.stringify(data));

    const allMonths = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    finalizedData.forEach(yearData => {
      const existingMonths = {};
      yearData.monthPlafond.forEach(monthData => {
        existingMonths[monthData.month] = monthData;
      });

      const completeMonthPlafond = [];

      allMonths.forEach(month => {
        if (existingMonths[month]) {
          completeMonthPlafond.push(existingMonths[month]);
        } else {
          completeMonthPlafond.push({
            month,
            countTotalIDRPerMonth: 0,
            countTotalUSDPerMonth: 0,
          });
        }
      });

      yearData.monthPlafond = completeMonthPlafond;

      let totalIDR = 0;
      let totalUSD = 0;

      yearData.monthPlafond.forEach(monthData => {
        totalIDR += monthData.countTotalIDRPerMonth || 0;
        totalUSD += monthData.countTotalUSDPerMonth || 0;
      });

      yearData.totalIDR = totalIDR.toLocaleString('id-ID');
      yearData.totalUSD = totalUSD.toLocaleString('id-ID');

      yearData.monthPlafond.forEach(monthData => {
        monthData.formattedIDR = monthData.countTotalIDRPerMonth.toLocaleString('id-ID');
        monthData.formattedUSD = monthData.countTotalUSDPerMonth.toLocaleString('id-ID');
      });

      yearData.monthPlafond.push({
        month: 'Total E.O.Y',
        formattedIDR: yearData.totalIDR,
        formattedUSD: yearData.totalUSD,
      });
    });

    return finalizedData;
  }

  takeOutPlafondCurrency(data: any) {
    const modifiedData = JSON.parse(JSON.stringify(data));

    modifiedData.forEach(yearData => {
      yearData.monthPlafond.forEach(monthData => {
        delete monthData.plafondCurrency;
      });
    });

    return modifiedData;
  }
}
