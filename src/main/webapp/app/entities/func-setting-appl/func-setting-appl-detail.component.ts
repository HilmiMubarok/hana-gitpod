import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFuncSettingAppl } from './func-setting-appl.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-func-setting-appl-detail',
  templateUrl: './func-setting-appl-detail.component.html',
})
export class FuncSettingApplDetailComponent implements OnInit {
  funcSettingAppl: IFuncSettingAppl | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ funcSettingAppl }) => (this.funcSettingAppl = funcSettingAppl));
  }

  previousState(): void {
    window.history.back();
  }
}
