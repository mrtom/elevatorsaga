{
  init: function(elevators, floors) {
    printStateOfWorld = function() {
      console.log("~~~~~~~~~~~~~~~~~~~");
      for(const elevator of elevators) {
        console.log("++++++++++++++++++++");
        console.log("State of elevator " + elevators.indexOf(elevator) + ":");
        console.log("Current floor: " + elevator.currentFloor());
        console.log("Direction: " + elevator.destinationDirection());
        console.log("Queue: " + elevator.destinationQueue.toString());
        console.log("Pressed floors: " + elevator.getPressedFloors().toString());
      }
      console.log("~~~~~~~~~~~~~~~~~~~");
    }

    selectElevator = function(floorNum, direction) {
      console.log("Selecting elevator for floor " + floorNum + " going " + direction);

      printStateOfWorld();

      // First, check to see if the floor is after any elevator in the direction
      // it's currently moving
      for(const elevator of elevators) {
        if (direction === 'up') {
          if (floorNum >= elevator.currentFloor() && elevator.destinationDirection() === 'up') {
            console.log("Picking elevator " + elevators.indexOf(elevator) + " as currently at " + elevator.currentFloor() + " & going up.");
            return elevator;
          }
        } else if (direction === 'down') {
          if (floorNum <= elevator.currentFloor() && elevator.destinationDirection() === 'down') {
            console.log("Picking elevator " + elevators.indexOf(elevator) + " as currently at " + elevator.currentFloor() + " & going down.");
            return elevator;
          }
        }
      }

      // Next, look for idle elevators
      for(const elevator of elevators) {
        if (elevator.destinationDirection() === 'stopped') {
          console.log("Picking elevator " + elevators.indexOf(elevator) + " as currently stopped.");
          return elevator;
        }
      }

      // Finally, pick the first one for now!
      console.log("Picking first elevator");
      return elevators[0];
    };

    elevators.forEach(function(elevator, index) {
        elevator.on("idle", function() {
          var idleFloor = index % 2 == 0 ? 0 : floors.length;
          elevator.goToFloor(idleFloor)
        });

        elevator.on("floor_button_pressed", function(floorNum) {
          console.log("Floor " + floorNum + " button pressed in elevator " + elevators.indexOf(elevator));
          elevator.destinationQueue.push(floorNum);
          elevator.destinationQueue.sort(function(a,b) {
            if (elevator.direction === 'up') {
              return a - b;
            } else {
              return b - a;
            }
          });
        });
    });

    floors.forEach(function(floor) {
      floor.on("up_button_pressed", function() {
        console.log("Up button pressed on floor " + floor.floorNum());
        var selectedElevator = selectElevator(floor.floorNum(), 'up');
        selectedElevator.goToFloor(floor.floorNum());
      });

      floor.on("down_button_pressed", function() {
        console.log("Down button pressed on floor " + floor.floorNum());
        var selectedElevator = selectElevator(floor.floorNum(), 'down');
        selectedElevator.goToFloor(floor.floorNum());
      });
    });
  },
  update: function(dt, elevators, floors) {
      // We normally don't need to do anything here
  }
}
