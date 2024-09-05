import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { CreditProposalService } from 'app/entities/credit-proposal/credit-proposal.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoanCommitteeDelegationService {
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService, private cp: CreditProposalService) {}

  public getLoanCommitteeDelegation(params?: any): Observable<any> {
    const options = createRequestOption(params);
    const url = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/cash-credit-proposals/correction-note-data');
    return this.http.get(url, { params: options, observe: 'response' });
  }

  public getLoanCommitteeDelegationById(id: number): Observable<any> {
    return this.cp.find(id);
  }

  public getLoanCommitteeDelegationDetail(id: number): Observable<any> {
    const url = this.applicationConfigService.getEndpointFor(
      MICROSERVICENAME.LOS + `/api/cash-position-reporting-structure/note-data/${id}/find-by-application`
    );
    return this.http.get(url, { observe: 'response' });
  }

  public saveLoanCommitteeDelegation(data: any): Observable<any> {
    const url = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/correction-note-data');

    return this.http.post(url, data, { observe: 'response' });
  }
}
