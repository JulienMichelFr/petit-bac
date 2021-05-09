import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { RoomPageComponent } from './pages/room-page/room-page.component';
import { HasProfileGuard } from './guards/has-profile/has-profile.guard';
import { RoomInvitePageComponent } from './pages/room-invite-page/room-invite-page.component';
import { RoomExistGuard } from './guards/room-exist/room-exist.guard';

const Routes: Routes = [
  { path: '', component: HomePageComponent },
  {
    path: 'rooms/:id',
    component: RoomPageComponent,
    canActivate: [RoomExistGuard, HasProfileGuard],
  },
  {
    path: 'rooms/:id/invite',
    component: RoomInvitePageComponent,
    canActivate: [RoomExistGuard],
  },
  { path: '**', component: NotFoundPageComponent },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(Routes)],
  exports: [RouterModule],
})
export class AppRoutingModuleModule {}
