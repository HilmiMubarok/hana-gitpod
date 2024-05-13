import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Observable } from 'rxjs';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { OptionNode } from 'app/shared/model/option-node.model';
import { ICollateral } from '../collateral/collateral.model';

@Injectable({
  providedIn: 'root',
})
export class CashCollateralService {
  private resourceUrl: string;
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/cash-collateral');
  }

  public loadDetailType(): Observable<HttpResponse<object[]>> {
    return this.http.get<object[]>(`${this.resourceUrl}/detail-type`, { observe: 'response' });
  }

  public loadCollateralGradingType(): Observable<HttpResponse<OptionNode[]>> {
    return this.http.get<OptionNode[]>(`${this.resourceUrl}/grading-type`, { observe: 'response' });
  }

  public loadCollateralReadyForAppraise(idParty: String): Observable<HttpResponse<ICollateral[]>> {
    return this.http.get<ICollateral[]>(`${this.resourceUrl}/ready-to-appraise/${idParty}`, { observe: 'response' });
  }
  public loadCollateralInsurance(idCp: number): Observable<HttpResponse<ICollateral[]>> {
    return this.http.get<ICollateral[]>(`${this.resourceUrl}/summary3/${idCp}`, { observe: 'response' });
  }
  public getCollateralProperty(applicationId: number): Observable<HttpResponse<Object[]>> {
    return this.http.get<any>(`${this.resourceUrl}/collateral-debitur/appId/${applicationId}`, { observe: 'response' });
  }
}
