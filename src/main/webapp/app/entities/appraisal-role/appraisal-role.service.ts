import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { IAppraisalRole } from './appraisal-role.model';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { IOptionNode, OptionNode } from 'app/shared/model/option-node.model';
import lodash from 'lodash';
import { Observable } from 'rxjs';
import { IPosition } from '@syncfusion/ej2-angular-grids';
import { createRequestOption } from 'app/core/request/request-util';

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

  public getPositionBaseOnInternalApplication(
    idPositionType: String,
    idApplication: number,
    req: any
  ): Observable<HttpResponse<IPosition[]>> {
    const options = createRequestOption(req);
    return this.http.get<IPosition[]>(`${this.resourceUrl}/position-type/${idPositionType}/application/${idApplication}`, {
      params: options,
      observe: 'response',
    });
  }

  public filteringRelationTypes(params: IAppraisalRole[]): IOptionNode[] {
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
