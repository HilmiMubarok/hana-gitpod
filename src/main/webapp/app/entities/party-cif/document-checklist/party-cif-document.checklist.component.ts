import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AbstractEntityViewPageComponent } from 'app/shared/base/abstract-entity-view-page.component';

@Component({
  selector: 'jhi-party-cif-document-checklist',
  templateUrl: './party-cif-document-checklist.component.html',
  styleUrls: ['../party-cif.style.scss'],
})
export class PartyCifDocumentChecklistComponent extends AbstractEntityViewPageComponent<{}> {
  constructor() {
    super();
  }
}
