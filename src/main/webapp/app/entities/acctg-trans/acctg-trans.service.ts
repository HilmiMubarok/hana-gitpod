import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IAcctgTrans } from './acctg-trans.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { createRequestOption } from 'app/core/request/request-util';

@Injectable({ providedIn: 'root' })
export class AcctgTransService extends AbstractEntityService<IAcctgTrans> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/acctg-trans');
  }

  protected isNew(entity: IAcctgTrans): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected convertDateFromServer(res: HttpResponse<IAcctgTrans>): HttpResponse<IAcctgTrans> {
    res.body.transactionDate = res.body.transactionDate != null ? new Date(res.body.transactionDate) : null;
    res.body.entryDate = res.body.entryDate != null ? new Date(res.body.entryDate) : null;
    return res;
  }

  protected convertDateArrayFromServer(res: HttpResponse<IAcctgTrans[]>): HttpResponse<IAcctgTrans[]> {
    res.body.forEach((acctgTrans: IAcctgTrans) => {
      acctgTrans.transactionDate = acctgTrans.transactionDate != null ? new Date(acctgTrans.transactionDate) : null;
      acctgTrans.entryDate = acctgTrans.entryDate != null ? new Date(acctgTrans.entryDate) : null;
    });
    return res;
  }

  protected preSave(entity: IAcctgTrans) {}
}
