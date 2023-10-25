let questions = [];

function startQuiz() {
    document.getElementById('startPage').style.display = 'none';
    document.getElementById('options').style.display = 'block';
    document.getElementById('checkAnswersBtn').style.display = 'block';

    fetch('https://opentdb.com/api.php?amount=5')
        .then(response => response.json())
        .then(data => {
            questions = data.results.map(q => {
                const incorrectAnswers = q.incorrect_answers;
                const allOptions = incorrectAnswers.concat(q.correct_answer);

                return {
                    question: q.question,
                    options: allOptions,
                    answer: q.correct_answer
                };
            });
            displayQuestions();
        })
        .catch(error => {
            console.error('Error fetching the questions:', error);
        });
}

function displayQuestions() {
    const questionsContainer = document.getElementById('options');
    questionsContainer.innerHTML = '';

    questions.forEach((q, index) => {
        const questionEl = document.createElement('div');
        questionEl.classList.add('question-text-container');  
        questionEl.innerHTML = `<strong>${q.question}</strong>`;

        const optionsContainer = document.createElement('div'); 
        optionsContainer.classList.add('options-container');  

        q.options.forEach(option => {
            const btn = document.createElement('button');
            btn.innerHTML = option;
            btn.addEventListener('click', selectOption);
            optionsContainer.appendChild(btn); 
        });

        questionEl.appendChild(optionsContainer); 
        questionsContainer.appendChild(questionEl);
    });
}

function selectOption(event) {
    const clickedBtn = event.target;

    let siblingOptions = clickedBtn.parentElement.children;

    for (let option of siblingOptions) {
        option.classList.remove('selected');
    }

    clickedBtn.classList.add('selected');
}

function checkAnswers() {
    let correctAnswersCount = 0;

    questions.forEach((q, index) => {
        const buttons = document.querySelectorAll(`#options div:nth-child(${index + 1}) button`);
        const selectedBtn = Array.from(buttons).find(btn => btn.classList.contains('selected'));
        const correctBtn = Array.from(buttons).find(btn => btn.textContent === q.answer);
        if (selectedBtn) {
            selectedBtn.classList.remove('selected');
        }

        if (selectedBtn && selectedBtn.textContent === q.answer) {
            correctAnswersCount++;
            selectedBtn.classList.add('correct');
        } else if (selectedBtn) {
            selectedBtn.classList.add('incorrect');
            correctBtn.classList.add('correct');
        } else {
            correctBtn.classList.add('correct');
        }

        buttons.forEach(button => button.setAttribute('disabled', true));
        const resultEl = document.getElementById('result');
        resultEl.innerHTML = `You scored ${correctAnswersCount}/5 correct answers`;
        resultEl.style.display = 'block';
    
        const playAgainBtn = document.getElementById('playAgain');
        playAgainBtn.style.display = 'inline-block';
        playAgainBtn.removeAttribute('disabled'); 
    
        const checkAnswersBtn = document.getElementById('checkAnswersBtn');
        checkAnswersBtn.style.display = 'none';
    });
}

document.getElementById('startQuizBtn').addEventListener('click', startQuiz);
document.getElementById('checkAnswersBtn').addEventListener('click', checkAnswers);
