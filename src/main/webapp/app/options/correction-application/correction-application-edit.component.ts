import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ILoanApplication, LoanApplication } from 'app/entities/loan-application/loan-application.model';
import { LoanApplicationService } from 'app/entities/loan-application/loan-application.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'jhi-correction-application-edit',
  templateUrl: './correction-application-edit.component.html',
  styleUrls: ['./correction-application.scss'],
})
export class CorrectionApplicationEditComponent implements OnInit {
  private idApplication: number;
  public loanApplication: ILoanApplication = new LoanApplication();
  constructor(private loanApplicationService: LoanApplicationService, private route: ActivatedRoute) {
    this.route.paramMap.subscribe(params => {
      this.idApplication = parseInt(params.get('id'), 10);
    });
  }

  ngOnInit(): void {
    this.getById();
  }

  public async getById() {
    this.loanApplication = (await firstValueFrom(this.loanApplicationService.find(this.idApplication))).body;
  }
}
