import { Component, ViewChild, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { IPositionReportingStructure } from 'app/entities/position-reporting-structure/position-reporting-structure.model';
import { PositionReportingStructureService } from 'app/entities/position-reporting-structure/position-reporting-structure.service';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { LoanAnalysService } from '../loan-analys.service';

@Component({
  selector: 'jhi-loan-facility-approve-level',
  templateUrl: './approve-level.component.html',
  styleUrls: ['./approve-level.css'],
})
export class LoanFacilityAproveLevelComponent extends AbstractEntityMaterialComponent<IPositionReportingStructure> implements OnInit {
  public displayColumns: string[] = ['no', 'approval_name', 'position', 'date', 'available_status', 'recomendation'];
  public loading: boolean;
  public itemsPerPage = 10;
  public page = 0;
  public idRelationType: string;
  public items: any;
  public dateCurren: any;
  public idApp: any;

  constructor(
    protected positionReportingStructureService: PositionReportingStructureService,
    protected snackbar: MatSnackBar,
    protected loanAnalysService: LoanAnalysService,
    protected activatedRoute: ActivatedRoute
  ) {
    super(snackbar, positionReportingStructureService);
    this.loading = false;
    this.idApp = this.activatedRoute.snapshot.paramMap.get('id');
  }
  ngOnInit(): void {
    this.setApprovalLevel();
    this.setCurrenDate();
  }

  singleCheck(checkNode: any) {
    if (checkNode.target.classList.contains('checked')) {
      checkNode.target.classList.remove('checked');
    } else {
      checkNode.target.classList.add('checked');
    }
  }

  setCurrenDate() {
    this.items.fromDate = new Date();
  }

  setApprovalLevel() {
    this.loanAnalysService.getAprovalLevel(this.idApp).subscribe(res => {
      this.items = res.body;
    });
  }
}
