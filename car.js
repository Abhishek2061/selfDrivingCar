class Car {
  // constructor is the method that gets called when instance of class is created. Used to initialise objects property.
  constructor(x, y, width, height, controlType, maxSpeed = 3) {
    // this keyword refers to the object it belongs to.
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    // so for car to move as physical world we need some attribute
    this.speed = 0;
    this.acceleration = 0.2;
    this.maxSpeed = maxSpeed;
    this.friction = 0.05;

    // So what is happening here right, if car is at maximum speed forward and we press side keys.
    // the speed of the car exceeds its maximum limit due to another component (here sidewards)
    // So now define another term
    this.angle = 0; // this angle works like in unit circle but here the circle has been totate counterclockwise by 90degree

    this.damaged = false; // for checking the collision

    this.useBrain = controlType == "AI";

    if (controlType != "DUMMY") {
      this.sensor = new Sensor(this);
      // 'this' means that I am passing the car into the sensor

      this.brain = new NeuralNetwork(
        [this.sensor.rayCount, 6, 4] // this is specify the array of neuron count
      );
    }

    // now again another class Control is made for controlling car from key change
    this.controls = new Control(controlType);
  }
  // update method to move car
  update(roadBorders, traffic) {
    if (!this.damaged) {
      this.#move();
      this.polygon = this.#createPolygon();
      this.damaged = this.#assessDamage(roadBorders, traffic);
    }
    if (this.sensor) {
      this.sensor.update(roadBorders, traffic);
      // offset was telling, where the intersection are
      const offsets = this.sensor.readings.map((s) =>
        s == null ? 0 : 1 - s.offset
      );
      const outputs = NeuralNetwork.feedForward(offsets, this.brain);
      // console.log(outputs);

      if (this.useBrain) {
        this.controls.forward = outputs[0];
        this.controls.left = outputs[1];
        this.controls.right = outputs[2];
        this.controls.reverse = outputs[3];
      }
    }
  }

  #assessDamage(roadBorders, traffic) {
    for (let i = 0; i < roadBorders.length; i++) {
      if (polyIntersection(this.polygon, roadBorders[i])) {
        return true;
      }
    }
    for (let i = 0; i < traffic.length; i++) {
      if (polyIntersection(this.polygon, traffic[i].polygon)) {
        return true;
      }
    }
    return false;
  }

  // to know the corners of the car
  #createPolygon() {
    const points = [];
    const rad = Math.hypot(this.width, this.height) / 2;
    const alpha = Math.atan2(this.width, this.height);
    points.push({
      x: this.x - Math.sin(this.angle - alpha) * rad,
      y: this.y - Math.cos(this.angle - alpha) * rad,
    });
    points.push({
      x: this.x - Math.sin(this.angle + alpha) * rad,
      y: this.y - Math.cos(this.angle + alpha) * rad,
    });
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad,
    });
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad,
    });
    return points;
  }

  #move() {
    // in the windows the x and y doesn't follow our conventional axes
    if (this.controls.forward) {
      this.speed += this.acceleration;
    }
    if (this.controls.reverse) {
      this.speed -= this.acceleration;
    }

    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed;
    }
    // in reverse we don't want to have much speed
    if (this.speed < -this.maxSpeed) {
      this.speed = -this.maxSpeed / 2;
    }
    if (this.speed > 0) {
      this.speed -= this.friction;
    }
    if (this.speed < 0) {
      this.speed += this.friction;
    }
    // to stop the car if its speed come lower to tha friction
    if (Math.abs(this.speed) < this.friction) {
      this.speed = 0;
    }

    if (this.speed != 0) {
      const flip = this.speed > 0 ? 1 : -1;
      // so that if moving backwards, left key goes to left and right keys go to right

      if (this.controls.left) {
        // this.x -= 2;
        this.angle += 0.03 * flip; // taking rotated unit circle
      }
      if (this.controls.right) {
        // this.x += 2;
        this.angle -= 0.03 * flip;
      }
    }

    // now keeping the rotated unit circle in mind
    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }

  // ctx is an abbreviation commonly used to refer to the drawing context of the HTML5 canvas element
  // draw is the method
  draw(ctx, color) {
    // // now making rotation using canvas context
    // ctx.save();
    // ctx.translate(this.x, this.y);
    // ctx.rotate(-this.angle);

    // ctx.beginPath();
    // // here to make a rectangle shape
    // ctx.rect(
    //   -this.width / 2, // it is this.x-this.width/2
    //   -this.height / 2, // it is this.y-this.height/2
    //   this.width,
    //   this.height
    // );
    // ctx.fill();

    // // to prevent to infinite cycle of translating and rotating
    // ctx.restore();

    if (this.damaged) {
      ctx.fillStyle = "grey";
    } else {
      ctx.fillStyle = color;
    }
    ctx.beginPath();
    ctx.moveTo(this.polygon[3].x, this.polygon[3].y);
    for (let i = 0; i < this.polygon.length; i++) {
      ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
    }
    ctx.fill();

    if (this.sensor) {
      this.sensor.draw(ctx);
    } // to draw the sensor we have to call draw function in the sensor argument
  }
}
