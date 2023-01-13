import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IApplicationRole } from './application-role.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { IOptionNode, OptionNode } from 'app/shared/model/option-node.model';
import lodash from 'lodash';

@Injectable({ providedIn: 'root' })
export class ApplicationRoleService extends AbstractEntityService<IApplicationRole> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/application-roles');
  }

  protected isNew(entity: IApplicationRole): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected convertDateFromServer(res: HttpResponse<IApplicationRole>): HttpResponse<IApplicationRole> {
    res.body.fromDate = res.body.fromDate != null ? new Date(res.body.fromDate) : null;
    res.body.thruDate = res.body.thruDate != null ? new Date(res.body.thruDate) : null;
    return res;
  }

  protected convertDateArrayFromServer(res: HttpResponse<IApplicationRole[]>): HttpResponse<IApplicationRole[]> {
    res.body.forEach((applicationRole: IApplicationRole) => {
      applicationRole.fromDate = applicationRole.fromDate != null ? new Date(applicationRole.fromDate) : null;
      applicationRole.thruDate = applicationRole.thruDate != null ? new Date(applicationRole.thruDate) : null;
    });
    return res;
  }

  protected preSave(entity: IApplicationRole) {
    console.log('entity at preSave : ', entity);
  }

  public filteringRelationTypes(params: IApplicationRole[]): IOptionNode[] {
    const result: IOptionNode[] = [];
    if (params.length > 0) {
      for (let i = 0; i < params.length; i++) {
        const each: IApplicationRole = params[i];
        if (
          each.relationTypeId &&
          lodash.find(result, function (o) {
            return o.id === each.relationTypeId;
          }) === undefined
        ) {
          const newOptionNode: IOptionNode = new OptionNode();
          newOptionNode.id = each.relationTypeId;
          newOptionNode.label = each.relationTypeDescription;

          result.push(newOptionNode);
        }
      }
    }
    return result;
  }
  
  public filteringRelationTypesMod(params: IApplicationRole[]): IOptionNode[] {
    const result: IOptionNode[] = [];
    if (params.length > 0) {
      for (let i = 0; i < params.length; i++) {
        const each: IApplicationRole = params[i];
        if (
          each.relationTypeId &&
          lodash.find(result, function (o) {
            return o.id === each.relationTypeId;
          }) === undefined
        ) {
          const newOptionNode: IOptionNode = new OptionNode();
          newOptionNode.id = each.relationTypeId;
          newOptionNode.label = each.partyName;

          result.push(newOptionNode);
        }
      }
    }
    return result;
  }
}
