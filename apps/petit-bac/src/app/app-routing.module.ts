import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { RoomPageComponent } from './pages/room-page/room-page.component';

const Routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'rooms/:id', component: RoomPageComponent },
  { path: '**', component: NotFoundPageComponent },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(Routes)],
  exports: [RouterModule],
})
export class AppRoutingModuleModule {}
