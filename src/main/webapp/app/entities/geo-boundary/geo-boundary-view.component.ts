import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
// import { PartnerService } from './partner.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ApplicationStateLogService } from '../application-state-log/application-state-log.service';

import { Form, FormBuilder, FormGroup } from '@angular/forms';
import { IPostalAddress } from '../postal-address/postal-address.model';
import { GeoBoundary, IGeoBoundary } from './geo-boundary.model';
import { GeoBoundaryService } from './geo-boundary.service';

@Component({
  selector: 'jhi-geo-boundary-view',
  templateUrl: './geo-boundary-view.component.html',
  styleUrls: ['./geo-boundary.css'],
})
export class GeoBoundaryViewComponent extends AbstractEntityMaterialComponent<IGeoBoundary> implements OnInit {
  public model: IGeoBoundary;

  public filter: string;
  id: any;

  post: any = '';
  organizationData: any = '';

  constructor(
    private geoBoundaryService: GeoBoundaryService,
    private formBuilder: FormBuilder,
    protected _snackBar: MatSnackBar,
    protected router: Router,
    public dialog: MatDialog,
    protected messageService: MessageService,
    private applicationStateLogService: ApplicationStateLogService,
    protected activatedRoute: ActivatedRoute
  ) {
    super(_snackBar, geoBoundaryService);
  }

  ngOnInit(): void {
    this.model = new GeoBoundary();

    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.loadDataAll(this.id);
  }

  loadDataAll(id) {
    this.geoBoundaryService.find(id).subscribe(response => {
      console.log('response detail', response.body);
      this.model = response.body;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
