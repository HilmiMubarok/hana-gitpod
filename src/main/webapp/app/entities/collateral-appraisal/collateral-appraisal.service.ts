import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { ICollateralAppraisal } from './collateral-appraisal.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { createRequestOption } from 'app/core/request/request-util';

import { Subject } from 'rxjs';
import { ICollateralProperty, CollateralProperty } from '../collateral-property/collateral-property.model';

@Injectable({ providedIn: 'root' })
export class CollateralAppraisalService extends AbstractEntityService<ICollateralAppraisal> {
  public collateralProperty: ICollateralProperty[];
  public collateralPropertyMod: any;
  public collateralPropertyChange: Subject<ICollateralProperty[]> = new Subject<ICollateralProperty[]>();
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('/services/los/api/collateral-appraisals');
    this.collateralPropertyChange.subscribe(collateralProperty => {
      this.collateralProperty = collateralProperty;
      for (let i = 0; i < this.collateralProperty.length; i++) {
        this.collateralPropertyMod = this.collateralProperty[i];
        this.collateralPropertyMod['indexNum'] = i + 1;
      }
    });
  }

  protected isNew(entity: ICollateralAppraisal): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected convertDateFromServer(res: HttpResponse<ICollateralAppraisal>): HttpResponse<ICollateralAppraisal> {
    res.body.fromDate = res.body.fromDate != null ? new Date(res.body.fromDate) : null;
    res.body.thruDate = res.body.thruDate != null ? new Date(res.body.thruDate) : null;
    return res;
  }

  protected convertDateArrayFromServer(res: HttpResponse<ICollateralAppraisal[]>): HttpResponse<ICollateralAppraisal[]> {
    res.body.forEach((collateralAppraisal: ICollateralAppraisal) => {
      collateralAppraisal.fromDate = collateralAppraisal.fromDate != null ? new Date(collateralAppraisal.fromDate) : null;
      collateralAppraisal.thruDate = collateralAppraisal.thruDate != null ? new Date(collateralAppraisal.thruDate) : null;
    });
    return res;
  }

  protected preSave(entity: ICollateralAppraisal) {}

  public setCollateralProperty(collateralProperty: ICollateralProperty[]): void {
    this.collateralPropertyChange.next(collateralProperty);
  }
}
