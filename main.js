const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);
const car = new Car(road.getLAneCenter(1), 50, 30, 50, "AI"); // this 'keys' and 'dummy' is for focusing which car we have to move and which not to
// creating traffic
const traffic = [new Car(road.getLAneCenter(1), -100, 30, 50, "DUMMY", 2)];

animate();

function animate() {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }

  car.update(road.borders, traffic);
  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  carCtx.save();
  // translate is a method used to move the origin point of the coordinate system to a different location.
  carCtx.translate(0, -car.y + carCanvas.height * 0.7);

  road.draw(carCtx);
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, "red");
  }

  car.draw(carCtx, "blue");

  carCtx.restore();

  Visualizer.drawNetwork(networkCtx, car.brain); // visualising the car brain in the network canvas

  requestAnimationFrame(animate);
  // requestAnimationFrame calls animate method again and again many line per second,
  // it gives the movement we want
}
