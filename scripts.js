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

const attackForm = document.querySelector("#attackForm")
attackForm.addEventListener('submit', (e) => e.preventDefault())
document.querySelector("#btnResolveAttack").addEventListener('click', resolveAttack)

for (const checkbox of document.querySelectorAll('input[type=checkbox]')) {
    checkbox.addEventListener('change', function () {
        const targetId = `.${this.getAttribute("id")}Details`
        if (document.querySelector(targetId)) {
            const targetId = `.${this.getAttribute("id")}Details`
            document.querySelector(targetId).classList.toggle('hidden');
        }
    })
}

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

    attackRoll = parseInt(attackForm.elements.attackRoll.value)
    defense = parseInt(attackForm.elements.defense.value)
    effectDC = parseInt(attackForm.elements.effectDC.value)
    resistanceRoll = parseInt(attackForm.elements.resistanceRoll.value)

    isBattering = attackForm.elements.battering.checked
    batteringRank = parseInt(attackForm.elements.batteringRank.value)
    isBrutal = attackForm.elements.brutal.checked
    brutalRank = parseInt(attackForm.elements.brutalRank.value)
    isHampering = attackForm.elements.hampering.checked

    isIndomitable = attackForm.elements.indomitable.checked
    isResilient = attackForm.elements.resilient.checked
    resilientRank = parseInt(attackForm.elements.resilientRank.value)
    nonTradeoffAttackBonus = parseInt(attackForm.elements.nonTradeoffAttackBonus.value)
    isStalwart = attackForm.elements.stalwart.checked
    stalwartRank = parseInt(attackForm.elements.stalwartRank.value)
    isSteady = attackForm.elements.steady.checked
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