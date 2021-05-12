import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { PlayerInterface } from '@petit-bac/api-interfaces';
import { Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'petit-bac-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnDestroy, OnInit {
  @Output() formChange = new EventEmitter<PlayerInterface>();
  form: FormGroup<PlayerInterface> = new FormGroup<PlayerInterface>({
    username: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(2),
    ]),
  });
  private sub: Subscription = new Subscription();

  ngOnInit(): void {
    this.form.valueChanges.subscribe(() => {
      if (this.form.valid) {
        this.formChange.emit(this.form.value);
      }
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
