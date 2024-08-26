import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BancoMenuComponent } from './banco-menu/banco-menu.component';
import { AddProductComponent } from './add-product/add-product.component';

const routes: Routes = [
  { path: 'productos', component: BancoMenuComponent },
  { path: 'createProduct', component: AddProductComponent },
  { path: '', redirectTo: '/productos', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
