import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
//import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule),

  },
  {
    path: 'intro',
    loadChildren: () => import('./pages/intro/intro.module').then( m => m.IntroPageModule)
  },
  {
    path: 'calendario',
    loadChildren: () => import('./pages/calendario/calendario.module').then( m => m.CalendarioPageModule),
    //canActivate: [AuthGuard]
  },
  {
    path: 'my-events',
    loadChildren: () => import('./pages/my-events/my-events.module').then( m => m.MyEventsPageModule)
  },
  {
    path: 'cal-modal',
    loadChildren: () => import('./pages/cal-modal/cal-modal.module').then( m => m.CalModalPageModule),
    //canActivate: [AuthGuard]
  },
  {
    path: 'edit-event',
    loadChildren: () => import('./pages/edit-event/edit-event.module').then( m => m.EditEventPageModule)
  }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, relativeLinkResolution: 'legacy' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
