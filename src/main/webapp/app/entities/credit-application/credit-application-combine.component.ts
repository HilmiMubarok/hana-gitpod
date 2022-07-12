import { Component, OnInit } from '@angular/core';
import { ANIMATION } from 'app/shared/constants/base.constants';
import { CreditApplication, ICreditApplication } from './credit-application.model';
import { CreditApplicationService } from './credit-application.service';

@Component({
  selector: 'jhi-credit-application-combine',
  templateUrl: './credit-application-combine.component.html',
})
export class CreditApplicationCombineComponent implements OnInit {
  public creditApplication: ICreditApplication = new CreditApplication();
  public animation: object = ANIMATION;
  constructor(private creditApplicationService: CreditApplicationService) {}

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
}
