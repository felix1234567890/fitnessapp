import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Exercise } from '../training/exercise.model';
import { TrainingService } from '../training/training.service';
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-past-trainings',
  templateUrl: './past-trainings.component.html',
  styleUrls: ['./past-trainings.component.css']
})
export class PastTrainingsComponent implements OnInit, AfterViewInit, OnDestroy {

  displayedColumns = [ 'name', 'duration', 'calories', 'state'];
  dataSource = new MatTableDataSource<Exercise>();
  private exChangedSubscription: Subscription;

  @ViewChild(MatSort) sort: MatSort; 
  @ViewChild(MatPaginator) paginator:MatPaginator;

  constructor(private trainingService:TrainingService) { }

  ngOnInit() {
    this.exChangedSubscription = this.trainingService.finishedExercisesChanged.subscribe((exercises: Exercise[])=>{
      this.dataSource.data = exercises;
    })
    this.trainingService.getCompletedOrCanceledExercises()
  }
  ngAfterViewInit(){
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator
  }
  doFilter(filterVal: string){
    this.dataSource.filter = filterVal.trim().toLowerCase();
   
  }
  ngOnDestroy() {
    this.exChangedSubscription.unsubscribe()
  }
}
