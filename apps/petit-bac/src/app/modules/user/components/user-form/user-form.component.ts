import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { PlayerInterface } from '@petit-bac/api-interfaces';
import { Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, take } from 'rxjs/operators';
import { AppStateInterface } from '../../../../interfaces/app-state.interface';
import { Store } from '@ngrx/store';
import { selectProfile } from '../../../../store/selectors/profile.selectors';

@Component({
  selector: 'petit-bac-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnDestroy, OnInit {
  @Output() formChange = new EventEmitter<PlayerInterface>();
  form: FormGroup<PlayerInterface> = new FormGroup<PlayerInterface>({
    username: new FormControl<string>('', [Validators.required, Validators.minLength(2)]),
  });
  private sub: Subscription = new Subscription();

  constructor(private store: Store<AppStateInterface>) {}

  ngOnInit(): void {
    this.form.valueChanges.pipe(debounceTime(800)).subscribe(() => {
      if (this.form.valid) {
        this.formChange.emit(this.form.value);
      }
    });
    this.initFormValue();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  private initFormValue() {
    this.store
      .select(selectProfile)
      .pipe(take(1))
      .subscribe((profile) => {
        this.form.patchValue(profile);
      });
  }
}
