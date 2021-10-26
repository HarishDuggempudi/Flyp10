import { NgModule } from '@angular/core';
// import { RoleComponent } from './role-list.component';
// import {RoleEditorComponent} from './role-editor.component';
import { Routes,RouterModule } from '@angular/router';
import { PromocodeComponent } from './promocode';

export const PromocodeRoutes: Routes = [
  {path:'', component: PromocodeComponent, data: {breadcrumb: 'Role Management'},
  }
];

@NgModule({
  imports: [RouterModule.forChild(PromocodeRoutes)],
  exports: [RouterModule],
})

export class RoleRouting{    }