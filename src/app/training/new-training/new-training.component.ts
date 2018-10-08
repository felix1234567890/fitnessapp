import { Component, OnInit, Output, EventEmitter, OnDestroy } from "@angular/core";
import { TrainingService } from "../training/training.service";
import { Exercise } from "../training/exercise.model";
import { NgForm } from "@angular/forms";
import { map } from "rxjs/operators";
import { AngularFirestore } from "angularfire2/firestore";
import { Observable, Subscription,  } from "rxjs";

@Component({
  selector: "app-new-training",
  templateUrl: "./new-training.component.html",
  styleUrls: ["./new-training.component.css"]
})
export class NewTrainingComponent implements OnInit {
  @Output()
  trainingStart = new EventEmitter();
  // exercises: Exercise[] = [];
  exercises: Exercise[];
  exerciseSubscription: Subscription;

  constructor(
    private trainingService: TrainingService,
    private db: AngularFirestore
  ) {}

  ngOnInit() {
    // this.exercises = this.trainingService.getAvailableExercises()
   this.exerciseSubscription = this.trainingService.exercisesChanged.subscribe(
    exercises => (this.exercises = exercises)
   );
   
   }
  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }
  ngOnDestroy(): void {
    this.exerciseSubscription.unsubscribe()
  }
  fetchExercise(){
    this.trainingService.getAvailableExercises() 
  }
}
