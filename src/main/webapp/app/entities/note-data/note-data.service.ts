import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { INotes } from '../notes/notes.model';



@Injectable({ providedIn: 'root' })
export class NoteDataService extends AbstractEntityService<INotes> {
  public statRemarkBusinessActivity;
  public partySliks = []
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.statRemarkBusinessActivity = '';
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.MASTERCONTROL + '/api/note-data');

  }

}
