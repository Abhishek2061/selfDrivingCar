class NeuralNetwork {
  constructor(neuronCounts) {
    this.levels = [];
    for (let i = 0; i < neuronCounts.length - 1; i++) {
      // for example if layers of neuron is 3, 2 is the level count and i will be 0 and 1
      this.levels.push(new Level(neuronCounts[i], neuronCounts[i + 1]));
    }
  }
  static feedForward(givenInputs, network) {
    let outputs = Level.feedForward(givenInputs, network.levels[0]);
    for (let i = 1; i < network.levels.length; i++) {
      outputs = Level.feedForward(outputs, network.levels[i]);
    }
    return outputs;
  }
  static mutate(network, amount = 1) {
    network.levels.forEach((level) => {
      for (let i = 0; i < level.biases.length; i++) {
        level.biases[i] = lerp(level.biases[i], Math.random() * 2 - 1, amount);
      }
      for (let i = 0; i < level.weights.length; i++) {
        for (let j = 0; j < level.weights[i].length; j++) {
          level.weights[i][j] = lerp(
            level.weights[i][j],
            Math.random() * 2 - 1,
            amount
          );
        }
      }
    });
  }
  // here we are calling Level.feedforward and calling the function to make a result for our new layers
}

class Level {
  constructor(inputcount, outputCount) {
    this.inputs = new Array(inputcount);
    this.outputs = new Array(outputCount);
    this.biases = new Array(outputCount); // each output neuron has a bias above which it will fire

    this.weights = []; // in coding we have to connect each input neuron to the output neuron
    for (let i = 0; i < inputcount; i++) {
      this.weights[i] = new Array(outputCount);
    }

    // well we don't have these biases and weights, so first randomise it
    Level.#randomize(this);
  }
  // In JavaScript, a static method is a method that belongs to the class itself, rather than to instances of the class.
  static #randomize(level) {
    // here we assign weights a random value ranging from -1 to 1
    for (let i = 0; i < level.inputs.length; i++) {
      for (let j = 0; j < level.outputs.length; j++) {
        level.weights[i][j] = Math.random() * 2 - 1;
      }
    }
    for (let i = 0; i < level.biases.length; i++) {
      level.biases[i] = Math.random() * 2 - 1;
    }
  }

  // computing the output values
  static feedForward(givenInputs, level) {
    // level is the individual layers of neurons within neuralNetwork
    for (let i = 0; i < level.inputs.length; i++) {
      level.inputs[i] = givenInputs[i];
    }
    for (let i = 0; i < level.outputs.length; i++) {
      let sum = 0;
      for (let j = 0; j < level.inputs.length; j++) {
        sum += level.inputs[j] * level.weights[j][i];
      }
      if (sum > level.biases[i]) {
        level.outputs[i] = 1;
      } else {
        level.outputs[i] = 0;
      }
    }
    return level.outputs;
  }
}
