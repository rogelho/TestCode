import {FormGroup} from "@angular/forms";

export function NotMustMatchValidator(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors.mustMatch) {
      return;
    }

    if (control.value !== matchingControl.value) {
      matchingControl.setErrors(null);
    } else {
      matchingControl.setErrors({notMustMatch: true});
    }
  }
}
