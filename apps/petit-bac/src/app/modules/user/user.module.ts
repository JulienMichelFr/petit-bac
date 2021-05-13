import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserFormComponent } from './components/user-form/user-form.component';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { UserListComponent } from './components/user-list/user-list.component';

@NgModule({
  declarations: [UserFormComponent, UserListComponent],
  imports: [CommonModule, MatInputModule, ReactiveFormsModule],
  exports: [UserFormComponent, UserListComponent],
})
export class UserModule {}
