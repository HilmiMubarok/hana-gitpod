import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IPartyCif } from '../party-cif/party-cif.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { Observable } from 'rxjs';
import { createRequestOption } from 'app/core/request/request-util';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { IDebtorData } from '../debtor-data/debtor-data.model';
import { map, tap } from 'rxjs/operators';
import { ICustomer } from '../customer/customer.model';

@Injectable({ providedIn: 'root' })
export class CashCustomerService extends AbstractEntityService<ICustomer> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/_search/cash-customers');
  }

  protected isNew(entity: ICustomer): boolean {
    return entity.id === undefined || entity.id === null;
  }

  public cashCustomers(req?: any): Observable<HttpResponse<ICustomer[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<any[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<any[]>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<any[]>) => this.preLoadItemArray(res)));
  }
}
