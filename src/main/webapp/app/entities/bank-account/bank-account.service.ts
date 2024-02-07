import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IPartyCif } from '../party-cif/party-cif.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { Observable } from 'rxjs';
// import { createRequestOption } from 'app/core/request/request-util';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
// import { IDebtorData } from '../debtor-data/debtor-data.model';
// import { map, tap } from 'rxjs/operators';
import { IBankAcountModel } from './bank-account.model';

@Injectable({ providedIn: 'root' })
export class BankAccountService extends AbstractEntityService<IPartyCif> {
  public resourceBankAccount: string;
  private resourceUrlSegregasi: string;
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceBankAccount = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/bank-accounts');
  }

  protected isNew(entity: IPartyCif): boolean {
    return entity.id === undefined || entity.id === null;
  }

  public getBankAccount(partyId: string): Observable<HttpResponse<IBankAcountModel[]>> {
    return this.http.get<IBankAcountModel[]>(`${this.resourceBankAccount}/party/${partyId}`, { observe: 'response' });
  }

  public createBankAccount(data: IBankAcountModel): Observable<IBankAcountModel> {
    return this.http.post<IBankAcountModel>(this.resourceBankAccount, data);
  }

  public updateBankAccount(data: IBankAcountModel): Observable<IBankAcountModel> {
    return this.http.put<IBankAcountModel>(this.resourceBankAccount, data);
  }
}
