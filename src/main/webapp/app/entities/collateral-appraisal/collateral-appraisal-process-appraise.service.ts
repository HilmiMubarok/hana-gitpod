import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { Observable } from 'rxjs';
import { ICollateral } from '../collateral/collateral.model';

@Injectable({ providedIn: 'root' })
export class CollateralAppraisalsAppraiseService {
  private resourceUrl: string;
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/survey-appraisals/check-active');
  }

  public validateAppraise(collateral: ICollateral[]): Observable<HttpResponse<object>> {
    return this.http.post<object>(`${this.resourceUrl}`, collateral, { observe: 'response' });
  }
}
