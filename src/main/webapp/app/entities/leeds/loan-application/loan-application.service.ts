import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { ILoanApplication } from './leeds/loan-application.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class LoanApplicationService extends AbstractEntityService<ILoanApplication> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/leeds/api/loan-applications');
    this.resourceSearchUrl = this.applicationConfigService.getEndpointFor('services/leeds/api/_search/loan-applications');
  }

  protected isNew(entity: ILoanApplication): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected convertDateFromServer(res: HttpResponse<ILoanApplication>): HttpResponse<ILoanApplication> {
    Object.keys(res.body.roles).forEach((key: string) => {
      const value = res.body.roles[key];
      value['fromDate'] != null ? new Date(value['fromDate']) : null;
      value['thruDate'] != null ? new Date(value['thruDate']) : null;
    });
    return res;
  }

  protected convertDateArrayFromServer(res: HttpResponse<ILoanApplication[]>): HttpResponse<ILoanApplication[]> {
    res.body.forEach((loanApplication: ILoanApplication) => {
      const roles = loanApplication.roles;
      Object.keys(roles).forEach((key: string) => {
        const value = roles[key];
        value['fromDate'] != null ? new Date(value['fromDate']) : null;
        value['thruDate'] != null ? new Date(value['thruDate']) : null;
      });
    });
    return res;
  }

  protected preSave(entity: ILoanApplication) {}
}
