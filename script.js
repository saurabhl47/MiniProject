let selectedSymptoms = [];
let selectedSymptoms2 = [];
let allSymptoms = [];
let diseases = [];
let diseaseData = `
    Hypertensive disease - pain chest, shortness of breath, dizziness, asthenia, fall, syncope, vertigo, sweating increased, palpitation, nausea, angina pectoris, pressure chest
    Diabetes - polyuria, polydypsia, shortness of breath, chest pain, asthenia, nausea, orthopnea, rale, sweating increased, unresponsiveness, mental status changes, vertigo, vomiting, labored breathing
    Depression mental/depressive disorder - feeling suicidal, suicidal, hallucinations auditory, feeling hopeless, weepiness, sleeplessness, motor retardation, irritable mood, blackout, mood depressed, hallucinations visual, worry, agitation, tremor, intoxication, verbal auditory hallucinations, energy increased, difficulty, nightmare, unable to concentrate, homelessness
    Coronary arteriosclerosis - pain chest, angina pectoris, shortness of breath, hypokinesia, sweating increased, pressure chest, dyspnea on exertion, orthopnea, chest tightness
    Asthama -  cough,breathing problem, chest tightness,	non-productive cough,	productive cough
	Dehydration - fever, diarrhea, vomiting,hypotension, nausea, lightheadedness,unwell
	Dengue - high fever, vomiting, rash, severe headache, feeling weak, cold skin
	Eye flue - suddenfever, cough, runny nose, muscle&joint pain, sore throat
	Jaundice - yellow skin, mouth color yellow, itching
	Malaria - mosquito bites, fever&sweating, fatigue, breathing problem
	Covid/CORONA - fever, chills, sore eyes, difficulty in sleeping, low oxygen level in body
	
`.trim();

parseData(diseaseData);

function parseData(data) {
    let diseaseLines = data.split('\n');
    for (let i = 0; i < diseaseLines.length; i++) {
        let [disease, symptomsString] = diseaseLines[i].split(' - ');
        let symptomsArray = symptomsString.split(',').map(symptom => symptom.trim());
        diseases.push({ name: disease, symptoms: symptomsArray });
        allSymptoms = [...new Set([...allSymptoms, ...symptomsArray])];
    }
}

function getSuggestions(input, suggestionsListId) {
    let suggestionsList = $(`#${suggestionsListId}`);
    suggestionsList.empty();
    if (input.trim() === '') return;
    for (let i = 0; i < allSymptoms.length; i++) {
        if (allSymptoms[i].toLowerCase().startsWith(input.toLowerCase())) {
            let listItem = $('<li></li>').text(allSymptoms[i]);
            listItem.click(function () {
                const inputBox = $(`#${suggestionsListId.replace('suggestionsList', 'symptomInput')}`);
                inputBox.val(allSymptoms[i]);
                addSymptom(allSymptoms[i], inputBox.attr('id'));
                suggestionsList.empty();
            });
            suggestionsList.append(listItem);
        }
    }
}

function addSymptom(symptom, inputId) {
    const selectedSymptomsArray = inputId === 'symptomInput' ? selectedSymptoms : selectedSymptoms2;
    if (!selectedSymptomsArray.some(selectedSymptom => selectedSymptom.toLowerCase() === symptom.toLowerCase())) {
        selectedSymptomsArray.push(symptom);
        updateSelectedSymptoms(inputId);
    } else {
        alert('This symptom is already selected.');
    }
}

function updateSelectedSymptoms(inputId) {
    const selectedSymptomsArray = inputId === 'symptomInput' ? selectedSymptoms : selectedSymptoms2;
    const selectedSymptomsDiv = $(`#selectedSymptoms${inputId === 'symptomInput' ? '' : '2'}`);
    selectedSymptomsDiv.empty();
    selectedSymptomsDiv.append(`<p>Selected Symptoms${inputId === 'symptomInput' ? '' : ' 2'}:</p>`);
    if (selectedSymptomsArray.length > 0) {
        selectedSymptomsDiv.append('<ul>' + selectedSymptomsArray.map((symptom, index) => `<li>${symptom} <span class="delete" onclick="deleteSymptom(${index}, '${inputId}')">X</span></li>`).join('') + '</ul>');
    } else {
        selectedSymptomsDiv.append('<p>No symptoms selected</p>');
    }
}

function deleteSymptom(index, inputId) {
    const selectedSymptomsArray = inputId === 'symptomInput' ? selectedSymptoms : selectedSymptoms2;
    selectedSymptomsArray.splice(index, 1);
    updateSelectedSymptoms(inputId);
}

function checkDisease() {
    let resultDiv = $('#result');
    resultDiv.empty();
    const selectedSymptomsCombined = [...selectedSymptoms, ...selectedSymptoms2];
    let foundDisease = false;

    for (let i = 0; i < diseases.length; i++) {
        let matchingSymptoms = diseases[i].symptoms.filter(symptom => selectedSymptomsCombined.includes(symptom));

        if (matchingSymptoms.length >= 2) {
            resultDiv.text('Possible Disease: ' + diseases[i].name);
            foundDisease = true;
            break;
        }
    }

    if (!foundDisease) {
        resultDiv.text('No matching disease found ! PLEASE CONSULT DOCTOR');
    }
}

function handleKeyPress(e) {
    const inputBox = $(e.target);
    const inputId = inputBox.attr('id');
    if (e.which === 13) {
        addSymptom(inputBox.val(), inputId);
        inputBox.val('');
        e.preventDefault();
    }
}

function handleBlur(e) {
    const inputBox = $(e.target);
    const inputId = inputBox.attr('id');
    if (inputBox.val().trim() !== '') {
        addSymptom(inputBox.val(), inputId);
        inputBox.val('');
    }
}

$('#symptomInput, #symptomInput2').on('input', function (e) {
    const inputBox = $(e.target);
    const suggestionsListId = inputBox.attr('id') === 'symptomInput' ? 'suggestionsList' : 'suggestionsList2';
    getSuggestions(inputBox.val(), suggestionsListId);
});

$('#symptomInput, #symptomInput2').on('keypress', handleKeyPress);
$('#symptomInput, #symptomInput2').on('blur', handleBlur);
$('#checkButton').on('click', checkDisease);
