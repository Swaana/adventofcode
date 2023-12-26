const readInput = require('../../utils/readInput');
const {lcm} = require("../../utils/leastCommonMultiplier");

const input = readInput(__dirname, 'input.txt');

const lines = input.split('\n').filter(l => !!l);

const PULSE = {
    LOW: 'LOW',
    HIGH: 'HIGH'
}

const queue = [];

function addToQueue({pulse, module, from}) {
    queue.push({pulse, module, from});
}

// Breadboard: work with clock cycles
class Module {
    static Cycle = 0;
    static LowCount = 0;
    static HighCount = 0;

    constructor(name) {
        this.name = name;
        this.inputs = [];
        this.outputs = [];
    }

    addOutput(module) {
        this.outputs.push(module);
        module.addInput(this);
    }

    addInput(module) {
        this.inputs.push(module);
    }

    processPulse(pulse, from) {
        // console.log(`Processing ${from.name} ${pulse} -> ${this.name}`)
        if (pulse === PULSE.LOW) {
            Module.LowCount++;
        }
        if (pulse === PULSE.HIGH) {
            Module.HighCount++;
        }
    }
}

class BroadCaster extends Module {
    processPulse(pulse, from) {
        super.processPulse(pulse, from);
        this.outputs.forEach(module => addToQueue({pulse, module, from: this}));
    }
}

class FlipFlop extends Module {
    constructor(name) {
        super(name);
        this.isOn = false;
    }

    processPulse(pulse, from) {
        super.processPulse(pulse, from);
        if (pulse === PULSE.LOW) {
            this.isOn = !this.isOn;
            const signal = this.isOn ? PULSE.HIGH : PULSE.LOW;
            this.outputs.forEach(module => addToQueue({pulse: signal, module, from: this}));
        }
    }
}

class Conjunction extends Module {
    constructor(name) {
        super(name);
        this.lastReceivedPulse = [];
        this.shouldCount = false;
        this.firstLow = 0;
    }

    addInput(module) {
        super.addInput(module);
        this.lastReceivedPulse.push(PULSE.LOW);
    }

    processPulse(pulse, from) {
        super.processPulse(pulse, from);
        const index = this.inputs.indexOf(from);
        this.lastReceivedPulse[index] = pulse;
        const signal = this.lastReceivedPulse.includes(PULSE.LOW) ? PULSE.HIGH : PULSE.LOW;
        if (this.shouldCount && this.firstLow === 0 && signal === PULSE.LOW) {
            this.firstLow = Module.Cycle;
        }
        this.outputs.forEach(module => addToQueue({pulse: signal, module, from: this}));
    }
}

let modules = {};

function setModules() {
    modules = {};
    Module.HighCount = 0;
    Module.LowCount = 0;
    lines.map(line => {
        const [name, output] = line.split(' -> ');
        let module;
        if (name === 'broadcaster') {
            module = new BroadCaster(name);
        } else if (name.startsWith('%')) {
            module = new FlipFlop(name.substring(1));
        } else if (name.startsWith('&')) {
            module = new Conjunction(name.substring(1));
        } else {
            throw new Error(`Unknown module: ${name}`)
        }
        modules[module.name] = module;
        return {
            module,
            outputs: output.split(', ')
        };
    }).forEach(({module, outputs}) => {
        outputs.forEach(output => {
            if (!modules[output]) {
                modules[output] = new Module(output);
            }
            module.addOutput(modules[output])
        })
    })
}

function runButtonCycle() {
    modules.broadcaster.processPulse(PULSE.LOW, {name: 'Button'});
    while (queue.length) {
        const {module, pulse, from} = queue.shift();
        module.processPulse(pulse, from);
    }
}

setModules();
let i = 0
while (i < 1000) {
    runButtonCycle();
    i++;
}
const part1 = Module.LowCount * Module.HighCount;
console.log('part1', part1)

if (modules['rx']) {
    setModules(); // reset

    // identify the modules to watch (a lot of assumptions here and actually looking at the input)
    rxInput = modules['rx'].inputs[0];
    // if module is Conjunction and has only one input it is an inverter
    // if module is Conjunction and has only Conjunction inputs then go higher level
    // if module is Conjunction and has inputs other than Conjunctions stop searching, this is the level we will watch
    const modulesToWatch = [];
    if (modules['rx'].inputs.length === 1) {
        // sends LOW if all its inputs are HIGH
        rxInput = modules['rx'].inputs[0];
        rxInput.inputs.forEach((input) => {
            if (input.inputs.length === 1) {
                // inverter, watch its inputs instead
                modulesToWatch.push(input.inputs[0]);
                input.inputs[0].shouldCount = true;
            }
        })

    }
    // find when each of the last pulses was high and then calculate
    Module.Cycle = 0;
    while (modulesToWatch.some(m => m.firstLow === 0)) {
        Module.Cycle++;
        runButtonCycle();
    }
    const part2 = lcm(modulesToWatch.map(m=> m.firstLow));
    console.log('part2', part2)
}