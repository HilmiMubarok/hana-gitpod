import { Component, ViewChild, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { IApplicationRole } from 'app/entities/application-role/application-role.model';
import { ApplicationRoleService } from 'app/entities/application-role/application-role.service';
import lodash from 'lodash';
import { PositionReportingStructureService } from 'app/entities/position-reporting-structure/position-reporting-structure.service';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { IOptionNode } from 'app/shared/model/option-node.model';
import { LoanAnalysService } from '../loan-analys.service';

@Component({
  selector: 'jhi-loan-facility-approve-level',
  templateUrl: './approve-level.component.html',
  styleUrls: ['./approve-level.css'],
})
export class LoanFacilityAproveLevelComponent extends AbstractEntityMaterialComponent<IApplicationRole> implements OnInit {
  public displayColumns: string[] = ['no', 'approval_name', 'position', 'date', 'available_status', 'recomendation'];
  public idRelationType: string;
  public dateCurren: any;
  public idApp: any;
  public relType: IOptionNode[];
  public selectedRelationType: string;
  public filteringItems: IApplicationRole[];

  constructor(
    protected positionReportingStructureService: PositionReportingStructureService,
    protected snackbar: MatSnackBar,
    protected loanAnalysService: LoanAnalysService,
    protected activatedRoute: ActivatedRoute,
    protected applicationRoleService: ApplicationRoleService
  ) {
    super(snackbar, positionReportingStructureService);
    this.loading = false;
    this.idApp = this.activatedRoute.snapshot.paramMap.get('id');
    this.relType = [];
    this.selectedRelationType = '';
    this.filteringItems = [];
  }

  ngOnInit(): void {
    this.getApplicationRolesByApplicationId();
    this.setCurrenDate();
  }

  singleCheck(checkNode: any) {
    if (checkNode.target.classList.contains('checked')) {
      checkNode.target.classList.remove('checked');
    } else {
      checkNode.target.classList.add('checked');
    }
  }

  private filteringRelType(params: IApplicationRole[]): void {
    this.relType = this.applicationRoleService.filteringRelationTypes(params);
  }

  setCurrenDate() {
    this.items.fromDate = new Date();
  }

  public selRelType(value: string): void {
    this.selectedRelationType = value;
    if (value !== '') {
      this.filteringItems = lodash.filter(this.items, function (o: IApplicationRole) {
        return o.relationTypeId === value;
      });
      return;
    }

    this.filteringItems = [];
  }

  private getApplicationRolesByApplicationId(): void {
    this.applicationRoleService
      .queryFilterBy({
        idApplication: this.idApp,
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.items = res.body;
        this.filteringRelType(this.items);
        this.selRelType(this.relType[0].id);
      });
  }
}
