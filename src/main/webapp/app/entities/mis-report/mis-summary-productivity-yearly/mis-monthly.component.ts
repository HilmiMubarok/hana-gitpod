import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker/datepicker';
export const MONTH_YEAR_FORMATS = {
  parse: { dateInput: 'MM-YYYY' },
  display: { dateInput: 'MM-YYYY', monthYearLabel: 'MM-YYYY', dateA11yLabel: 'MM-YYYY', monthYearA11yLabel: 'MM-YYYY' },
};

@Component({
  selector: 'jhi-mis-monthly',
  templateUrl: './mis-monthly.component.html',
  styleUrls: ['./mis-summary-productivity-yearly.css'],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MONTH_YEAR_FORMATS }],
})
export class MisMonthlyComponent {
  lovApprovalFasilitas = ['New (NTB)', 'Restructure', 'Additional', 'Decrease', 'Renewal', 'Other'];
  lovCustomerStatus = ['New', 'Existing'];
  @Input() form!: FormGroup;
  allSelectedApprovalFasilitas: boolean;
  onMonthYearStartSelected(event: Date, datepicker: MatDatepicker<Date>) {
    this.form.get('monthYearStart')?.setValue(event);
    datepicker.close();
  }
  toggleSelectApprovalFasilitas(): void {
    this.allSelectedApprovalFasilitas = !this.allSelectedApprovalFasilitas;
    if (this.allSelectedApprovalFasilitas) {
      this.form.get('approvalFasilitas')?.setValue(this.lovApprovalFasilitas.map(item => item));
    } else {
      this.form.get('approvalFasilitas')?.setValue([]);
    }
  }
  onMonthYearEndSelected(event: Date, datepicker: MatDatepicker<Date>) {
    const start = this.form.get('monthYearStart')?.value;
    if (start && event < start) {
      alert('End month tidak boleh lebih kecil dari Start month');
      return;
    }
    this.form.get('monthYearEnd')?.setValue(event);
    datepicker.close();
  }
}
