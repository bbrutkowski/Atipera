import { Component, OnInit } from '@angular/core';
import { ElementService } from '../../services/element.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { filter, debounceTime, distinctUntilChanged, tap } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PeriodicElement } from '../../model/element';
import { EditElementDialogComponent } from '../../edit-element-dialog/edit-element-dialog/edit-element-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { RxState } from '@rx-angular/state';

@Component({
  selector: 'app-element-table',
  templateUrl: './element-table.component.html',
  styleUrls: ['./element-table.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatIconModule,
    MatProgressSpinnerModule 
  ],
  providers: [RxState]
})

export class ElementTableComponent implements OnInit {
  public displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'edit'];
  public dataSource = new MatTableDataSource<PeriodicElement>();
  public filter: FormControl = new FormControl('');
  public isLoading = true;

  constructor(
    private elementService: ElementService,
    private dialog: MatDialog,
    private state: RxState<{ elements: PeriodicElement[]; filter: string }>
  ) {}

  ngOnInit(): void {
    this.state.connect(
      'elements', 
      this.elementService.getElements().pipe(
        tap(elements => {
          this.dataSource.data = elements;
  
          setTimeout(() => {
            this.isLoading = false; 
          }, 2000);
        })
      )
    );
  
    this.state.hold(
      this.filter.valueChanges.pipe(
        debounceTime(2000), distinctUntilChanged()),
      (value) => this.applyFilter(value ?? '')
    );
  }

  public applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public editElement(element: PeriodicElement): void {
    const dialogRef = this.dialog.open(EditElementDialogComponent, {
      width: '250px',
      data: { ...element }
    });
  
    this.state.hold(
      dialogRef.afterClosed().pipe(
        filter(result => !!result) 
      ),
      (newElement: PeriodicElement) => this.elementService.updateElement(newElement)
    );
  }
}
