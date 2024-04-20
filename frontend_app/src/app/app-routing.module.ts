import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatscreenComponent } from './chatscreen/chatscreen.component';

const routes: Routes = [
  { path: 'chat', component: ChatscreenComponent },

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

