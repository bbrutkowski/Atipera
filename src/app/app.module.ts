import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ElementTableComponent } from "./element-table/element-table/element-table.component";
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { EditElementDialogComponent } from "./edit-element-dialog/edit-element-dialog/edit-element-dialog.component";
import { ElementService } from "./services/element.service";
import { RouterModule, Routes } from "@angular/router";
import { routes } from "./app.routes";
import { MatFormFieldModule } from "@angular/material/form-field";

@NgModule({
  declarations: [
    AppComponent,
    ElementTableComponent,
    EditElementDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatInputModule,
    MatDialogModule,
    MatFormFieldModule,
    FormsModule
  ],
  providers: [ElementService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }