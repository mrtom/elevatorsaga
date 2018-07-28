{
    init: function(elevators, floors) {
        elevators.forEach(function(elevator) {
            elevator.on("idle", function() {
                floors.forEach(function(floor) {
                    console.log(floor);
                    elevator.goToFloor(floor.floorNum());
                });
            });
        });
    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}
