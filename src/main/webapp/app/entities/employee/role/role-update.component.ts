import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { IEmployee, Employee } from '../employee.model';
import { IEmployee as IEmployeeStrapi, Employee as EmployeeStrapi } from '../../../shared/integration/models/employees-page.model';
import { EmployeeService } from '../employee.service';
import { IRoleType, RoleType } from 'app/entities/role-type/role-type.model';
import { RoleTypeService } from 'app/entities/role-type/role-type.service';
import { IPerson, Person } from 'app/entities/person/person.model';
import { PersonService } from 'app/entities/person/person.service';
import { IInternal, Internal } from 'app/entities/internal/internal.model';
import { InternalService } from 'app/entities/internal/internal.service';
import { IEmploymentType, EmploymentType } from 'app/entities/employment-type/employment-type.model';
import { EmploymentTypeService } from 'app/entities/employment-type/employment-type.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';
import { ReportUtilService } from 'app/shared/base/report-util.service';
import { StrapiService } from 'app/shared/integration/strapi.service';
import { IButton } from 'app/shared/integration/models/button.model';
import { MatTableDataSource } from '@angular/material/table';
import { DocumentUploadDialogSurveyBatchComponent } from 'app/entities/survey-batch/document-upload-dialog-survey-batch.component';
import { PopupPositionComponent } from './popup-position.component';
import { MatDialog } from '@angular/material/dialog';

type SelectableEntity = IRoleType | IPerson | IInternal | IEmploymentType;

@Component({
  selector: 'jhi-role-update',
  templateUrl: './role-update.component.html',
  styleUrls: ['./role.css'],
})
export class RoleUpdateComponent extends AbstractEntityUpdateComponent<IEmployee> {
  public label: IEmployeeStrapi;
  public button: IButton;
  public itemsPartner: any;
  public loading: boolean;
  public arrayName = [] as any;
  thruDateTMP?: Date;
  roletypes: IRoleType[] = [];

  people: IPerson[] = [];

  internals: IInternal[] = [];

  public displayedColumnsP: string[] = ['no', 'positionTypeId', 'internalName', 'statusDescription', 'action'];
  public displayedColumnsExpandP = [...this.displayedColumnsP];

  employmenttypes: IEmploymentType[] = [];
  roleId: string;
  personId: string;
  internalId: string;
  employmentTypeId: string;
  segmentModel?: string;
  branchtype: any;
  desc: {
    id: string;
    description: string;
  }[];
  id: string;
  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected employeeService: EmployeeService,
    protected roleTypeService: RoleTypeService,
    protected personService: PersonService,
    protected internalService: InternalService,
    protected employmentTypeService: EmploymentTypeService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService,
    protected reportUtils: ReportUtilService,
    private strapiService: StrapiService,
    public dialog: MatDialog,
    protected router: Router
  ) {
    super(dataUtils, employeeService, elementRef, confirmationService, toastService, activatedRoute);
    this.label = new EmployeeStrapi();
    this.listChangeEventName = 'employeeListModification';
  }

  protected initialState(): any {
    return { item: new Employee(), tasks: [], id: undefined };
  }

  initialize() {
    console.log('this role update');
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
      .query({
        page: 0,
        size: 999,
      })
      .subscribe(response => {
        this.branchtype = response.body;
        if (this.activatedRoute.snapshot.paramMap.get('id')) {
          console.log('masuk edit');
          this.id = this.activatedRoute.snapshot.paramMap.get('id');
          this.employeeService.find(this.id).subscribe(res => {
            console.log('res detail', res.body);
            if (new Date(res.body.thruDate).getFullYear() !== 9999) {
              this.thruDateTMP = res.body.thruDate;
            }
            const filtered = this.branchtype.filter(function (item) {
              return item.id === res.body.internalId;
            });
            console.log('filtered', filtered);
            this.choosedBranch(filtered[0]);

            this.arrayName = [];
            this.initTable(res.body);
          });
        }
      });
  }

  choosedBranch(data) {
    console.log('data branch', data);
    if (data.parentId !== null) {
      this.getSegment(data.parentId);
    } else {
      this.segmentModel = '';
    }
  }

  getSegment(parentId) {
    console.log('parentId', parentId);
    if (parentId === null) {
      this.segmentModel = '';
    } else {
      this.internalService.find(parentId).subscribe(res => {
        console.log('res parent', res);
        const arr = [];
        arr.push(res.body);
        console.log('arr', arr);
        for (let a = 0; a < arr.length; a++) {
          if (arr[a].parentId !== '10000') {
            this.getSegment(arr[a].parentId);
          } else {
            console.log('stop sudah dapat', arr[a]);
            this.segmentModel = arr[a].parentName;
          }
        }
      });
    }
  }

  submit() {
    this.item.positions = this.arrayName;
    console.log('this submit role', this.item);
    this.employeeService.update(this.item).subscribe(res => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Update Success',
      });

      console.log('hasil post', res);

      if (res.body) {
        this.router.navigate(['/employee/role']);
      }
    });
  }
  // headers: HttpHeaders
  initTable(data: any): void {
    console.log('data', data);
    if (data.positions) {
      console.log('masuk sini');
      for (let i = 0; i < data.positions.length; i++) {
        this.arrayName.push(data.positions[i]);
      }
    }
    console.log('this.arrayName', this.arrayName);
    this.itemsPartner = new MatTableDataSource(this.addIdx(this.arrayName));
    if (!this.itemsPartner) {
      // this.itemsPartner.paginator = this.paginator;
    }
    // this.itemsPartner.sort = this.sort;
    // console.log("headers",headers);
    // this.paginatorLengthP = parseInt(headers.get('X-Total-Count'), 10);
    // this.paginatorPageSizeP = this.paginator.pageSize;
    this.loading = false;
  }

  addIdx(data: Object[]) {
    if (data.length > 0 && data) {
      for (let i = 0; i < data.length; i++) {
        data[i]['idx'] = i;
      }
    }

    return data;
  }

  public openDialog(val): void {
    console.log('data dipilih', val);
    const predicate: object = {
      width: '80vw',
      data: val,
    };

    const dialogRef = this.dialog.open(PopupPositionComponent, predicate);
    dialogRef.afterClosed().subscribe(result => {
      console.log('result', result);
      if (result) {
        if (result.id) {
          console.log('masuk id tidak undefined');
          const filtered = this.arrayName.filter(function (item) {
            return item.id === result.id;
          });

          console.log('filtered', filtered);
          if (filtered.length > 0) {
            this.arrayName = this.arrayName.filter(function (item) {
              if (item.id === result.id) {
                item = result;
              }

              return item;
            });
          } else {
            this.arrayName.push(result);
          }
        } else {
          console.log('masuk id undefined');
          const filtered = this.arrayName.filter(function (item) {
            return item.idx === result.idx;
          });
          console.log('filtered', filtered);
          if (filtered.length > 0) {
            this.arrayName = this.arrayName.filter(function (item) {
              if (item.id === result.id) {
                item = result;
              }

              return item;
            });
          } else {
            this.arrayName.push(result);
          }
        }

        this.initTable(this.arrayName);
      }
    });
  }
}
