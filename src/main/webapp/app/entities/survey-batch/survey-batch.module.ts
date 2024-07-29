import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { SurveyBatchComponent } from './survey-batch.component';
import { SurveyBatchDetailComponent } from './survey-batch-detail.component';
import { SurveyBatchUpdateComponent } from './survey-batch-update.component';
import { surveyBatchRoute } from './survey-batch.route';
import { SurveyBatchAppraisalComponent } from './survey-batch-appraisal.component';
import { SurveyBatchCreateComponent } from './survey-batch-create.component';
import { OfferingLetterSurveyBatchComponent } from './offering-letter-survey-batch/offering-letter-survey-batch.component';
import { OfferingLetterSurveyBatchNewComponent } from './offering-letter-survey-batch/offering-letter-survey-batch-new.component';
import { OfferingLetterSurveyBatchViewComponent } from './offering-letter-survey-batch/offering-letter-survey-batch-view.component';
import { ReportIndependentComponent } from './report-independent/report-independent.component';
import { SurveyBatchCollateralAppraisalMainComponent } from './survey-batch-collateral-appraisal-main.component';
import { DocumentUploadDialogSurveyBatchComponent } from './document-upload-dialog-survey-batch.component';
import { SurveyBatchCollateralAppraisalInfoComponent } from './info/survey-batch-collateral-appraisal-info.component';
import { SurveyBatchCollateralAppraisalPersonViewComponent } from './person/survey-batch-collateral-appraisal-person-view.component';
import { SurveyBatchCollateralAppraisalPartyGroupViewComponent } from './group/survey-batch-collateral-appraisal-party-group-view.component';
import { SurveyBatchPostalAddressViewComponent } from './address/survey-batch-postal-address-view.component';
import { SurveyBatchCollateralInfoComponent } from './collateral-info/survey-batch-collateral-info.component';
import { CollateralAppraisalMaterialExternalComponent } from './collateral-appraisal-material-external.component';
import { SharedLibsModule } from 'app/shared/shared-libs.module';
import { SurveyBatchEditComponent } from './survey-batch-edit.component';
import { CollateralAppraisalMaterialInternalComponent } from './collateral-appraisal-material-internal.component';
import { CollateralAppraisalMaterialProcessComponent } from './collateral-appraisal-material-process.component';
import { CollateralAppraisalMaterialApprovalComponent } from './collateral-appraisal-material-approval.component';
import { CollateralAppraisalMaterialInquiryComponent } from './collateral-appraisal-material-inquiry.component';
import { SurveyBatchEditInternalComponent } from './survey-batch-edit-internal.component';
import { SurveyBatchEditApprovalComponent } from './survey-batch-edit-approval.component';
import { SurveyBatchEditProcessComponent } from './survey-batch-edit-process.component';
import { SurveyBatchViewComponent } from './survey-batch-view.component';

@NgModule({
  imports: [SharedModule, SharedLibsModule, SharedEntityModule, RouterModule.forChild(surveyBatchRoute)],
  declarations: [
    SurveyBatchEditComponent,
    SurveyBatchComponent,
    SurveyBatchDetailComponent,
    SurveyBatchUpdateComponent,
    SurveyBatchAppraisalComponent,
    SurveyBatchCreateComponent,
    OfferingLetterSurveyBatchComponent,
    OfferingLetterSurveyBatchNewComponent,
    OfferingLetterSurveyBatchViewComponent,
    OfferingLetterSurveyBatchNewComponent,
    SurveyBatchCollateralAppraisalMainComponent,
    ReportIndependentComponent,
    DocumentUploadDialogSurveyBatchComponent,
    SurveyBatchCollateralAppraisalInfoComponent,
    SurveyBatchCollateralAppraisalPersonViewComponent,
    SurveyBatchCollateralAppraisalPartyGroupViewComponent,
    SurveyBatchPostalAddressViewComponent,
    SurveyBatchCollateralInfoComponent,
    CollateralAppraisalMaterialExternalComponent,
    CollateralAppraisalMaterialInternalComponent,
    CollateralAppraisalMaterialProcessComponent,
    CollateralAppraisalMaterialApprovalComponent,
    CollateralAppraisalMaterialInquiryComponent,
    SurveyBatchEditInternalComponent,
    SurveyBatchEditApprovalComponent,
    SurveyBatchEditProcessComponent,
    SurveyBatchViewComponent,
  ],
  entryComponents: [
    SurveyBatchComponent,
    SurveyBatchUpdateComponent,
    ReportIndependentComponent,
    DocumentUploadDialogSurveyBatchComponent,
    SurveyBatchCollateralAppraisalInfoComponent,
    SurveyBatchCollateralAppraisalPersonViewComponent,
    SurveyBatchCollateralAppraisalPartyGroupViewComponent,
    SurveyBatchPostalAddressViewComponent,
    SurveyBatchCollateralInfoComponent,
    CollateralAppraisalMaterialExternalComponent,
    CollateralAppraisalMaterialInternalComponent,
    CollateralAppraisalMaterialProcessComponent,
    CollateralAppraisalMaterialApprovalComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwSurveyBatchModule {}
