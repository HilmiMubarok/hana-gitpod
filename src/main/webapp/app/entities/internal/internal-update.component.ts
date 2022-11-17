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
  selector: 'jhi-internal-update',
  templateUrl: './internal-update.component.html',
  styleUrls: ['./internal.css'],
})
export class InternalUpdateComponent extends AbstractEntityMaterialComponent<IInternal> implements OnInit {
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
  setDataAddress: object;
  desc: {
    id: string;
    description: string;
  }[];
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
    this.desc = [
      {
        id: 'ACTIVE',
        description: 'Active',
      },
    ];
    console.log('apa ini', this.internal);
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.internalService.find(this.id).subscribe(response => {
      console.log('response detail', response.body);
      this.internal = response.body;
      this.internal.postalAddress = response.body.postalAddress;
      this.internalService
        .queryCustom({
          page: 0,
          size: 20,
        })
        .subscribe(response1 => {
          console.log('res branch type', response1.body);
          this.branchtype = response1.body;
        });

      this.internalService
        .query({
          page: 0,
          size: 999,
        })
        .subscribe(response2 => {
          console.log('superior', response2.body);
          this.superior = response2.body;
          this.superiorTMP = response2.body;
        });
    });

    // this.loadDataAll(this.id);
  }

  submit() {
    console.log('filledPartner', this.internal);
    this.internalService.update(this.internal).subscribe(res => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Update Success',
      });

      console.log('hasil post', res);

      if (res.body) {
        this.router.navigate(['/branch']);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }
}
