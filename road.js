class Road {
  constructor(x, width, laneCount = 3) {
    this.x = x;
    this.width = width;
    this.laneCount = laneCount;

    this.left = x - width / 2;
    this.right = x + width / 2;

    const infinity = 1000000; // my error with setLineDash was coming due to this value, which i have taken very large

    this.top = -infinity;
    this.bottom = infinity;

    const topLeft = { x: this.left, y: this.top };
    const bottomLeft = { x: this.left, y: this.bottom };
    const topRight = { x: this.right, y: this.top };
    const bottomRight = { x: this.right, y: this.bottom };
    // to know the borders of the road
    // making an array for like making highway
    this.borders = [
      // things in array will be segments
      [topLeft, bottomLeft],
      [topRight, bottomRight],
    ];
  }

  // method to find the centre of a given lane
  getLaneCenter(laneIndex) {
    const laneWidth = this.width / this.laneCount;
    return (
      this.left +
      laneWidth / 2 +
      Math.min(laneIndex, this.laneCount - 1) * laneWidth
    );
    // this return will provide the centre. check maths here
    // if index provided will make the car go ouside road, we will take laneCount
  }

  draw(ctx) {
    ctx.lineWidth = 5;
    ctx.strokeStyle = "white";

    // drawing lane
    for (let i = 1; i < this.laneCount; i++) {
      // here lerp is linear interpolation function
      const x = lerp(this.left, this.right, i / this.laneCount);

      // adding dashes to the middle lanes
      ctx.setLineDash([20, 20]);

      ctx.beginPath();
      ctx.moveTo(x, this.top);
      ctx.lineTo(x, this.bottom);
      ctx.stroke();
    }

    ctx.setLineDash([]);
    this.borders.forEach((border) => {
      // here border represent each individual line segment
      // border[0] represent first element of each array of borders
      ctx.beginPath();
      ctx.moveTo(border[0].x, border[0].y);
      ctx.lineTo(border[1].x, border[1].y);
      ctx.stroke();
    });
  }
}
