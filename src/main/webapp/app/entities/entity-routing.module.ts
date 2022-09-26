import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'factures',
        data: { pageTitle: 'ngInvoiceApp.factures.home.title' },
        loadChildren: () => import('./factures/factures.module').then(m => m.FacturesModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
