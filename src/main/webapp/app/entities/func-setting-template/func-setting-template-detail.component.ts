import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFuncSettingTemplate } from './func-setting-template.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-func-setting-template-detail',
  templateUrl: './func-setting-template-detail.component.html',
})
export class FuncSettingTemplateDetailComponent implements OnInit {
  funcSettingTemplate: IFuncSettingTemplate | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ funcSettingTemplate }) => (this.funcSettingTemplate = funcSettingTemplate));
  }

  previousState(): void {
    window.history.back();
  }
}
