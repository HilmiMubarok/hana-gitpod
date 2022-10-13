import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { ICreditProposal } from './credit-proposal.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { Observable } from 'rxjs';
import { ICollateral } from '../collateral/collateral.model';
import { ICollateralProperty } from '../collateral-property/collateral-property.model';
import { COLLATERAL_TYPE } from 'app/shared/constants/base.constants';
import moment from 'moment';

@Injectable({ providedIn: 'root' })
export class CreditProposalService extends AbstractEntityService<ICreditProposal> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/credit-proposals');
	this.resourceUrlNew = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/credit-proposals/by-status');
    this.resourceSearchUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/_search/credit-proposals');
  }

  protected isNew(entity: ICreditProposal): boolean {
    return entity.id === undefined || entity.id === null;
  }

  public getCertificationDate(collateral: ICollateral, properties: ICollateralProperty[]): string {
    let result: string;
    result = '';

    if (collateral.collateralTypeId === COLLATERAL_TYPE['realestate'] || collateral.collateralTypeId === COLLATERAL_TYPE['property']) {
      if (properties.length > 0) {
        result = result + '<ul>';
        for (let i = 0; i < properties.length; i++) {
          const property: ICollateralProperty = properties[i];
          if (property.dueDate) {
            result = result + '<li>' + moment(property.dueDate).format('DD-MM-YYYY') + '</li>';
          }
        }
        result = result + '</ul>';
      }
    }
    return result;
  }

  protected convertDateArrayFromServer(res: HttpResponse<ICreditProposal[]>): HttpResponse<ICreditProposal[]> {
    res.body.forEach((creditProposal: ICreditProposal) => {
      //
      if (creditProposal.prospectPerson) {
        creditProposal.prospectPerson.dob = creditProposal.prospectPerson.dob ? new Date(creditProposal.prospectPerson.dob) : null;
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

  protected preSave(entity: ICreditProposal) {
    if (entity.prospectPerson) {
      entity.prospectPerson.dob = new Date(entity.prospectPerson.dob);
    }

    if (entity.prospectOrganization) {
      console.log('xxx');
    }
  }

  public findByCif(cif: string): Observable<HttpResponse<ICreditProposal>> {
    return this.http.get<ICreditProposal>(this.resourceUrl + '/cif/' + cif, { observe: 'response' });
  }

  public findPersonTemplate(cif: string): Observable<HttpResponse<ICreditProposal>> {
    return this.http.get<ICreditProposal>(this.resourceUrl + '/cif-person-template/' + cif, { observe: 'response' });
  }

  public findPartyGroupTemplate(cif: string): Observable<HttpResponse<ICreditProposal>> {
    return this.http.get<ICreditProposal>(this.resourceUrl + '/cif-organization-template/' + cif, { observe: 'response' });
  }
}
