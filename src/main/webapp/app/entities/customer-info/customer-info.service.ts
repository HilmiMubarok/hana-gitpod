import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { ICustomerInfo } from './customer-info.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class CustomerInfoService extends AbstractEntityService<ICustomerInfo> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/mastercontrol/api/people');
  }

  protected isNew(entity: ICustomerInfo): boolean {
    return entity.id === undefined || entity.id === null;
  }

  preSave(entity: ICustomerInfo) {
    entity.dob = new DatePipe('en-US').transform(entity.dob, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
    // console.log(entity);
    this.http.post<ICustomerInfo[]>(this.resourceUrl, entity).subscribe(response => alert('success'));
  }
}
