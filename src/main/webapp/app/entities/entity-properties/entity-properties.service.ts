import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IEntityProperties } from './entity-properties.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EntitiyPropertiesService {
  public resourceUrl: string;

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/entity-properties/template/application/');
  }

  public getData(idApplication: number, type: string): Observable<IEntityProperties> {
    return this.http.get<IEntityProperties>(this.resourceUrl + idApplication + '/type/' + type);
  }
}
