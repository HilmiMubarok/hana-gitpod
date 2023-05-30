import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AccountService } from 'app/core/auth/account.service';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';

import { PersonService } from '../person/person.service';

import { PositionReportingStructureService } from '../position-reporting-structure/position-reporting-structure.service';
import { IPositionReportingStructure } from '../position-reporting-structure/position-reporting-structure.model';
import { RelationTypeService } from '../relation-type/relation-type.service';

@Component({
  selector: 'jhi-appraisal-role',
  templateUrl: './appraisal-role.component.html',
  styleUrls: ['./appraisal-role.css'],
})
export class AppraisalRoleComponent extends AbstractEntityMaterialComponent<IPositionReportingStructure> implements OnInit {
  public displayColumns: string[] = ['no', 'approval_name', 'position'];

  public selectedRelationType: string;
  public filteringItems: IPositionReportingStructure[];
  public relationTypes = [];
  private LOS_REL = 'LOS_REL';
  @Input() public appraisalId: number;

  get appraisalRoles() {
    return this.items;
  }
  set appraisalRoles(param: IPositionReportingStructure[]) {
    this.items = param;
  }

  constructor(
    protected _snackbar: MatSnackBar,
    protected accountService: AccountService,
    protected personService: PersonService,
    protected positionReportingStructureService: PositionReportingStructureService,
    protected relationTypeService: RelationTypeService
  ) {
    super(_snackbar, positionReportingStructureService);
    this.selectedRelationType = 'APPRAISALAPPROVAL';
  }
  ngOnInit(): void {
    this.getReportingStructureByAppraislId();
    this.loadRelationType();
  }

  private loadRelationType(): void {
    this.relationTypeService
      .queryFilterBy({
        idParent: this.LOS_REL,
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.relationTypes = res.body.filter(o => o.id === 'APPRAISALAPPROVAL');
        if (this.selectedRelationType === 'APPRAISALAPPROVAL') {
          this.getReportingStructureByAppraislId();
        } else {
          this.items = [];
        }
      });
  }

  public selectRelationType(event: any): void {
    event = this.selectedRelationType;
    console.log('evt', event);

    this.getReportingStructureByAppraislId();
  }

  private getReportingStructureByAppraislId(): void {
    this.positionReportingStructureService.findPositionReportingStructure(this.appraisalId).subscribe(res => {
      this.filteringItems = res.body;
    });
  }
}
