import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { IOptionNode } from 'app/shared/model/option-node.model';
import { firstValueFrom } from 'rxjs';
import { IPerson } from '../person/person.model';
import { PersonService } from '../person/person.service';
import { IAppraisalRole } from './appraisal-role.model';
import { AppraisalRoleService } from './appraisal-role.service';
import moment from 'moment';

@Component({
  selector: 'jhi-appraisal-role',
  templateUrl: './appraisal-role.component.html',
})
export class AppraisalRoleComponent extends AbstractEntityMaterialComponent<IAppraisalRole> implements OnChanges {
  public displayColumns: string[] = ['no', 'approval_name', 'position', 'date'];
  public selectedRelationType: string;
  public relTypes: IOptionNode[];
  public whoAmI: IPerson;
  public filteringItems: IAppraisalRole[];

  @Input() public appraisalId: number;

  get appraisalRoles() {
    return this.items;
  }
  set appraisalRoles(param: IAppraisalRole[]) {
    this.items = param;
  }

  constructor(
    protected _snackbar: MatSnackBar,
    protected accountService: AccountService,
    protected personService: PersonService,
    protected appraisalRoleService: AppraisalRoleService
  ) {
    super(_snackbar, appraisalRoleService);
    this.filteringItems = [];
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['appraisalId']) {
      this.getWhoAmI().then(res => {
        this.loadAppraisalRoleByAppraisalId(this.appraisalId);
      });
    }
  }

  private async loadAppraisalRoleByAppraisalId(appraisalId: number): Promise<void> {
    const predicate: object = {
      idAppraisal: appraisalId,
      page: 0,
      size: 9999,
    };
    this.items = (await firstValueFrom(this.appraisalRoleService.queryFilterBy(predicate))).body;
    this.filteringRelType(this.items);
    if (this.relTypes.length > 0) {
      this.selRelType(this.relTypes[0].id);
    }
  }

  private async getWhoAmI(): Promise<void> {
    const account: Account = await firstValueFrom(this.accountService.identity());
    const persons: IPerson[] = (await firstValueFrom(this.personService.queryFilterBy({ page: 0, size: 99, userLogin: account.login })))
      .body;
    if (persons.length > 0) {
      if (persons.length > 1) {
        this._snackBar.open('person with this userlogin more than 1');
      }
      this.whoAmI = persons[0];
    }
  }

  public selRelType(value: string): void {
    if (this.whoAmI) {
      this.selectedRelationType = value;
      this.filteringItems = [];
      for (let i = 0; i < this.items.length; i++) {
        const each: IAppraisalRole = this.items[i];
        if (
          each.relationTypeId &&
          each.relationTypeId.toLowerCase() === value.toLowerCase() &&
          moment().diff(moment(each.thruDate), 'days') <= 0
        ) {
          this.filteringItems.push(each);
        }
      }
    } else {
      this._snackBar.open('This user doesnt have person!', null, {
        horizontalPosition: 'end',
        verticalPosition: 'top',
        duration: 3000,
      });
    }
  }

  private filteringRelType(params: IAppraisalRole[]): void {
    this.relTypes = this.appraisalRoleService.filteringRelationTypes(params);
  }
}
