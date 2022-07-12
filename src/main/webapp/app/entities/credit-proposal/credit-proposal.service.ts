import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { ICreditProposal } from './credit-proposal.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class CreditProposalService extends AbstractEntityService<ICreditProposal> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/credit-proposals');
    this.resourceSearchUrl = this.applicationConfigService.getEndpointFor('services/los/api/_search/credit-proposals');
  }

  protected isNew(entity: ICreditProposal): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected convertDateFromServer(res: HttpResponse<ICreditProposal>): HttpResponse<ICreditProposal> {
    Object.keys(res.body.roles).forEach((key: string) => {
      const value = res.body.roles[key];
      value['fromDate'] != null ? new Date(value['fromDate']) : null;
      value['thruDate'] != null ? new Date(value['thruDate']) : null;
    });
    //
    if (res.body.personProspect) {
      res.body.personProspect.dob = res.body.personProspect.dob ? new Date(res.body.personProspect.dob) : null;
    }
    if (res.body.spouse) {
      res.body.spouse.dob = res.body.spouse.dob ? new Date(res.body.spouse.dob) : null;
    }
    if (res.body.contact) {
      res.body.contact.dob = res.body.contact.dob ? new Date(res.body.contact.dob) : null;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: HttpResponse<ICreditProposal[]>): HttpResponse<ICreditProposal[]> {
    res.body.forEach((creditProposal: ICreditProposal) => {
      const roles = creditProposal.roles;
      Object.keys(roles).forEach((key: string) => {
        const value = roles[key];
        value['fromDate'] != null ? new Date(value['fromDate']) : null;
        value['thruDate'] != null ? new Date(value['thruDate']) : null;
      });
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
