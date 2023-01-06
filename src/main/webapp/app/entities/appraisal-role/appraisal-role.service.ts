import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { IAppraisalRole } from './appraisal-role.model';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { IOptionNode, OptionNode } from 'app/shared/model/option-node.model';
import lodash from 'lodash';

@Injectable({ providedIn: 'root' })
export class AppraisalRoleService extends AbstractEntityService<IAppraisalRole> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/appraisal-role');
  }

  protected isNew(entity: IAppraisalRole): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IAppraisalRole) {}

  public filteringRelationTypes(params: IAppraisalRole[]): IOptionNode[] {
    console.log('params', params);

    const result: IOptionNode[] = [];
    if (params.length > 0) {
      for (let i = 0; i < params.length; i++) {
        const each: IAppraisalRole = params[i];
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
}
