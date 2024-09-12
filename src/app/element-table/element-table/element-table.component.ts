import { Component, OnDestroy, OnInit } from '@angular/core';
import { ElementService } from '../../services/element.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { filter, Subject, Subscription, debounceTime, distinctUntilChanged, switchMap, takeUntil, tap } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PeriodicElement } from '../../model/element';
import { EditElementDialogComponent } from '../../edit-element-dialog/edit-element-dialog/edit-element-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

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
  ]
})

export class ElementTableComponent implements OnInit, OnDestroy {
  public displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'edit'];
  public dataSource: MatTableDataSource<PeriodicElement> = new MatTableDataSource<PeriodicElement>();
  public filter: FormControl = new FormControl('');
  private subscriptions: Subscription = new Subscription();
  private destroy$ = new Subject<void>();
  public isLoading = true;

  constructor(private elementService: ElementService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.elementService.getElements().pipe(
      takeUntil(this.destroy$), 
      tap(elements => {
        setTimeout(() => {
          this.isLoading = false; 
          this.dataSource.data = elements; 
        }, 2000); 
      })
    ).subscribe()

    this.filter.valueChanges.pipe(
      debounceTime(2000),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(value => this.applyFilter(value ?? ''));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public editElement(element: PeriodicElement): void {
    const dialogRef = this.dialog.open(EditElementDialogComponent, {
      width: '250px',
      data: { ...element }
    });
  
    this.subscriptions.add(
      dialogRef.afterClosed().pipe(
        filter(result => !!result), 
        switchMap(result => this.elementService.updateElement(result)) 
      ).subscribe(updatedElements => {
        this.dataSource.data = updatedElements; 
      })
    );
  }
}
