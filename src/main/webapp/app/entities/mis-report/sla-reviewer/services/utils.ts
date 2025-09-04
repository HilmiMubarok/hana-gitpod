import { FormGroup } from '@angular/forms';

export function setupQueryControlBehavior(form: FormGroup) {
  const queryControl = form.get('query');
  if (!queryControl) {
    return;
  }

  Object.keys(form.controls).forEach(controlName => {
    if (controlName === 'query') {
      return;
    }

    const control = form.get(controlName);
    if (!control) {
      return;
    }

    control.valueChanges.subscribe(() => {
      updateQueryState(form);
    });
  });
}

export function handleFocus(form: FormGroup, controlName: string) {
  const queryControl = form.get('query');
  if (!queryControl) {
    return;
  }

  if (controlName !== 'query') {
    queryControl.disable({ emitEvent: false });
  }
}

export function handleBlur(form: FormGroup) {
  updateQueryState(form);
}

function updateQueryState(form: FormGroup) {
  const queryControl = form.get('query');
  if (!queryControl) {
    return;
  }

  const otherHasValue = Object.keys(form.controls)
    .filter(name => name !== 'query')
    .some(name => !!form.get(name)?.value);

  if (otherHasValue) {
    queryControl.disable({ emitEvent: false });
  } else {
    queryControl.enable({ emitEvent: false });
  }
}
