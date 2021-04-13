let attackRoll;
let defense;
let effectDC;
let resistanceRoll;
let resistanceFailure;
let resultsTextBox = document.getElementById("results");
let resultsText;
let bruises;

let attackDegrees;

let isBattering;
let batteringRank;
let isBrutal;
let brutalRank;
let isHampering;
let isAbsorbtive;
let isIndomitable;
let isResilient;
let resilientRank;
let nonTradeoffAttackBonus;
let isStalwart;
let stalwartRank;
let isSteady;

function resolveAttack() {
    getInputs();
    attackDegrees = getAttackDegrees();

    if (attackDegrees <= 0) {
        resultsText = `Attack missed.`;
        reportResults();
        return;
    } else {
        resultsText = "Attack Hits.";
    }

    resistanceFailure = getResistanceDegrees();

    calculateBruises();

    resolveHampering();
    resolveIndomitable();
    resolveSteady();

    reportResults();
}

function getInputs() {
    attackRoll = parseInt(document.getElementById("attackRoll").value);
    defense = parseInt(document.getElementById("defense").value);
    effectDC = parseInt(document.getElementById("effectDC").value);
    resistanceRoll = parseInt(document.getElementById("resistanceRoll").value);

    isBattering = document.getElementById("battering").checked;
    batteringRank = parseInt(document.getElementById("batteringRank").value);
    isBrutal = document.getElementById("brutal").checked;
    brutalRank = parseInt(document.getElementById("brutalRank").value);
    isHampering = document.getElementById("hampering").checked;

    isIndomitable = document.getElementById("indomitable").checked;
    isResilient = document.getElementById("resilient").checked;
    resilientRank = parseInt(document.getElementById("resilientRank").value);
    nonTradeoffAttackBonus = parseInt(document.getElementById("nonTradeoffAttackBonus").value);
    isStalwart = document.getElementById("stalwart").checked;
    stalwartRank = parseInt(document.getElementById("stalwartRank").value);
    isSteady = document.getElementById("steady").checked;
}
function getAttackDegrees() {
    return Math.ceil((attackRoll - defense + 1) / 5);
}
function getResistanceDegrees() {
    resolveResilient();
    return Math.ceil((effectDC - resistanceRoll) / 5);
}
function calculateBruises() {
    bruises = 1;

    if (resistanceFailure <= 0) {
        resultsText += " Resisted.";
    }

    resolveBattering();
    resolveBrutal();
    resolveStalwart();

    if (resistanceFailure == 0) {
        resultsText += ` ${reportBruises()}`;
    } else if (resistanceFailure == 1) {
        resultsText += ` ${reportBruises()} Dazed.`;
    } else if (resistanceFailure == 2) {
        resultsText += ` ${reportBruises()} Staggered`;
    } else if (resistanceFailure >= 3) {
        resultsText += ` ${reportBruises()} Incapacitated`;
    }
}
function resolveBattering() {
    if (isBattering && resistanceFailure > 0) {
        bruises += batteringRank;
    }
}
function resolveBrutal() {
    if (isBrutal && resistanceFailure >= -1) {
        if (brutalRank === 1) {
            bruises += (attackDegrees - 1);
        } else if (brutalRank === 2) {
            bruises += (attackDegrees * resistanceFailure) - 1;
        }
    }
}
function resolveHampering() {
    if (isHampering) {
        if (resistanceFailure == 1) {
            resultsText += " Tier 1 Hampering Conditions applied."
        } else if (resistanceFailure >= 2) {
            resultsText += " Tier 2 Hampering Conditions applied."
        }
    }
}
function resolveIndomitable() {
    if (isIndomitable) {
        resultsText += " Conditions delayed until next round.";
    }
}
function resolveResilient() {
    if (isResilient) {
        if (attackDegrees == 1) {
            if (resilientRank == 1) {
                resistanceRoll += 5;
            } else if (resilientRank == 2) {
                resistanceRoll += (5 + (Math.floor(nonTradeoffAttackBonus / 2)));
            }
        }
    }
}
function resolveStalwart() {
    if (isStalwart) {
        if (stalwartRank == 2) {
            bruises--;
        }

        if (resistanceFailure > -2) {
            bruises = Math.ceil(bruises / 2);
        } else {
            bruises = Math.floor(bruises / 2);
        }

        if (bruises < 0) {
            bruises = 0;
        }
    }
}
function resolveSteady() {
    if (isSteady) {
        resultsText += " Resistance check delayed until next turn due to Steady.";
    }
}

// $("#resilient");
// $("#resilient").change(function () {
//     console.log("1");
//     if (this.checked) {
//         console.log("2");
//     }
// });


function reportResults() {
    resultsTextBox.textContent = resultsText;
}
function reportBruises() {
    if (bruises == 1) {
        return `${bruises} Bruise.`;
    } else {
        return `${bruises} Bruises.`;
    }
}