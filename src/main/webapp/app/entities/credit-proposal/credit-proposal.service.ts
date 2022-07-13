import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { ICreditProposal } from './credit-proposal.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { MICROSERVICENAME } from 'app/shared/constants/base.constants';

@Injectable({ providedIn: 'root' })
export class CreditProposalService extends AbstractEntityService<ICreditProposal> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/credit-proposals');
    this.resourceSearchUrl = this.applicationConfigService.getEndpointFor(
      MICROSERVICENAME.LOS + 'services/los/api/_search/credit-proposals'
    );
  }

  protected isNew(entity: ICreditProposal): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected convertDateArrayFromServer(res: HttpResponse<ICreditProposal[]>): HttpResponse<ICreditProposal[]> {
    res.body.forEach((creditProposal: ICreditProposal) => {
      //
      if (creditProposal.personProspect) {
        creditProposal.personProspect.dob = creditProposal.personProspect.dob ? new Date(creditProposal.personProspect.dob) : null;
      }
      if (creditProposal.spouse) {
        creditProposal.spouse.dob = creditProposal.spouse.dob ? new Date(creditProposal.spouse.dob) : null;
      }
      if (creditProposal.contact) {
        creditProposal.contact.dob = creditProposal.contact.dob ? new Date(creditProposal.contact.dob) : null;
      }
    });
    return res;
  }

  protected preSave(entity: ICreditProposal) {}
}
