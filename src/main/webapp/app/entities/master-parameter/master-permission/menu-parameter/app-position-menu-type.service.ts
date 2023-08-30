import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { IPositionTypePermission } from '../master-permission.model';
import { IPositionType } from 'app/entities/position-type/position-type.model';
@Injectable({
  providedIn: 'root',
})
export class PositionTypePermissionService extends AbstractEntityService<IPositionTypePermission> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/app-menu-position-type');
  }
  public paramTypeId: Subject<any> = new Subject();

  setPrameterType(message: any) {
    this.paramTypeId.next(message);
  }
}
