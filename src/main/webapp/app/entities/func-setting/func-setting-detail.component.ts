import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFuncSetting } from './func-setting.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-func-setting-detail',
  templateUrl: './func-setting-detail.component.html',
})
export class FuncSettingDetailComponent implements OnInit {
  funcSetting: IFuncSetting | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ funcSetting }) => (this.funcSetting = funcSetting));
  }

  previousState(): void {
    window.history.back();
  }
}
