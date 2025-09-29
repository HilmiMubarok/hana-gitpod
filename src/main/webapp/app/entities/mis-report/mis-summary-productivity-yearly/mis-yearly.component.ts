import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import moment from 'moment';
import { MAT_DATE_FORMATS } from '@angular/material/core';
export const YEAR_FORMATS = {
  parse: { dateInput: 'YYYY' },
  display: { dateInput: 'YYYY', monthYearLabel: 'YYYY', dateA11yLabel: 'YYYY', monthYearA11yLabel: 'YYYY' },
};

@Component({
  selector: 'jhi-mis-yearly',
  templateUrl: './mis-yearly.component.html',
  styleUrls: ['./mis-summary-productivity-yearly.css'],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: YEAR_FORMATS }],
})
export class MisYearlyComponent {
  @Input() form!: FormGroup;
  lovCustomerStatus = ['New', 'Existing'];
  lovApprovalFasilitas = ['New', 'Restructure', 'Additional', 'Decrease', 'Renewal', 'Other'];
  chosenYearHandler(normalizedYear: moment.Moment, datepicker: any) {
    const ctrlValue = moment();
    ctrlValue.year(normalizedYear.year());
    this.form.get('year')?.setValue(ctrlValue.toDate());
    datepicker.close();
  }

  allSelectedApprovalFasilitas = false;
  allSelectedCustomerStatus = false;
  toggleSelectApprovalFasilitas(): void {
    this.allSelectedApprovalFasilitas = !this.allSelectedApprovalFasilitas;
    if (this.allSelectedApprovalFasilitas) {
      this.form.get('approvalFasilitas')?.setValue(this.lovApprovalFasilitas.map(item => item));
    } else {
      this.form.get('approvalFasilitas')?.setValue([]);
    }
  }
  toggleSelectCustomerStatus(): void {
    this.allSelectedCustomerStatus = !this.allSelectedCustomerStatus;
    if (this.allSelectedCustomerStatus) {
      this.form.get('customerStatus')?.setValue(this.lovCustomerStatus.map(item => item));
    } else {
      this.form.get('customerStatus')?.setValue([]);
    }
  }
}
