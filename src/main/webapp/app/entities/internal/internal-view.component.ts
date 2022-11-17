import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
// import { PartnerService } from './partner.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ApplicationStateLogService } from '../application-state-log/application-state-log.service';
import { faTimeline } from '@fortawesome/free-solid-svg-icons';
import { map } from 'rxjs';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Form, FormBuilder, FormGroup } from '@angular/forms';
import { AbstractEntityViewPageComponent } from 'app/shared/base/abstract-entity-view-page.component';
import { IInternal, Internal } from './internal.model';
import { InternalService } from './internal.service';
import { IPostalAddress } from '../postal-address/postal-address.model';

@Component({
  selector: 'jhi-internal-view',
  templateUrl: './internal-view.component.html',
  styleUrls: ['./internal.css'],
})
export class InternalViewComponent extends AbstractEntityMaterialComponent<IInternal> implements OnInit {
  public internal: IInternal;
  public postalAddress: IPostalAddress;
  formGroupPartner: FormGroup;
  formGroupPartnerOrganization: FormGroup;
  formGroupPartnerContact: FormGroup;

  public _primaryAddress: IPostalAddress;
  branchtype: any;
  superior: IInternal[];
  superiorTMP: IInternal[];
  public filter: string;
  id: any;

  @Input()
  get primaryAddress() {
    return this._primaryAddress;
  }
  set primaryAddress(item: IPostalAddress) {
    this._primaryAddress = item;
  }

  post: any = '';
  organizationData: any = '';

  constructor(
    private internalService: InternalService,
    private formBuilder: FormBuilder,
    protected _snackBar: MatSnackBar,
    protected router: Router,
    public dialog: MatDialog,
    protected messageService: MessageService,
    private applicationStateLogService: ApplicationStateLogService,
    protected activatedRoute: ActivatedRoute
  ) {
    super(_snackBar, internalService);
  }

  ngOnInit(): void {
    this.internal = new Internal();
    console.log('apa ini', this.internal);
    this.internalService
      .queryCustom({
        page: 0,
        size: 20,
      })
      .subscribe(response => {
        console.log('res branch type', response.body);
        this.branchtype = response.body;
      });

    this.internalService
      .query({
        page: 0,
        size: 999,
      })
      .subscribe(response => {
        console.log('superior', response.body);
        this.superior = response.body;
        this.superiorTMP = response.body;
      });
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.loadDataAll(this.id);
  }

  loadDataAll(id) {
    this.internalService.find(id).subscribe(response => {
      console.log('response detail', response.body);
      this.internal = response.body;
    });
  }

  submit() {
    console.log('filledPartner', this.internal);
    // this.internalService.create(this.internal).subscribe(res => {
    //   this.messageService.add({
    //     severity: 'success',
    //     summary: 'Success',
    //     detail: 'Save Success',
    //   });

    //   console.log('hasil post', res);

    //   if (res.body) {
    //     this.router.navigate(['/branch']);
    //   }
    // });
  }

  previousState(): void {
    window.history.back();
  }
}
