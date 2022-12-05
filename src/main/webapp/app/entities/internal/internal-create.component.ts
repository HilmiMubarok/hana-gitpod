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
  selector: 'jhi-internal-create',
  templateUrl: './internal-create.component.html',
  styleUrls: ['./internal.css'],
})
export class InternalCreateComponent extends AbstractEntityMaterialComponent<IInternal> implements OnInit {
  public internal: IInternal;
  formGroupPartner: FormGroup;
  formGroupPartnerOrganization: FormGroup;
  formGroupPartnerContact: FormGroup;

  public _primaryAddress: IPostalAddress;
  branchtype: any;
  superior: IInternal[];
  superiorTMP: IInternal[];
  public filter: string;
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
    private applicationStateLogService: ApplicationStateLogService
  ) {
    super(_snackBar, internalService);
  }

  ngOnInit(): void {
    this.internal = new Internal();
    console.log('apa ini', this.internal);
    this.desc = [
      {
        id: 'ACTIVE',
        description: 'Active',
      },
      {
        id: 'NON_ACTIVE',
        description: 'Non Active',
      },
    ];
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
  }

  // onFocusOutEvent(e){
  //   // console.log("foccus out",e);
  //   if(this.filter === ""){
  //     console.log("masuk pak");
  //     this.superior = this.superiorTMP;
  //     // this.filter = "";
  //   }
  // }

  // clickDropSupper(){
  //   console.log("go in");
  //   this.superior = this.superiorTMP;
  //   this.filter = "";
  // }

  // filterListCareUnit(event,val) {
  //   console.log("val",val);
  //     // this.superior = this.superiorTMP;
  //   this.superior = this.superiorTMP.filter((unit) => unit.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
  //   console.log("this.superior",this.superior);
  // }

  submit() {
    console.log('filledPartner', this.internal);
    this.internalService.create(this.internal).subscribe(res => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Save Success',
      });

      console.log('hasil post', res);

      if (res.body) {
        this.router.navigate(['/internal']);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }
}
