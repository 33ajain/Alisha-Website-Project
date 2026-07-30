// Simple quiz implementation with a static mapping from answers to genres and a small book list
const questions = [
  {
    q: "Which pace of story do you prefer?",
    options: [
      {text: "Fast, high-energy", genre: "Thriller"},
      {text: "Slow, character-driven", genre: "Literary"},
      {text: "Imaginative and fantastical", genre: "Fantasy"},
      {text: "Romantic and emotional", genre: "Romance"}
    ]
  },
  {
    q: "What setting appeals most?",
    options: [
      {text: "A bustling modern city", genre: "Thriller"},
      {text: "A richly built new world", genre: "Fantasy"},
      {text: "Everyday life, real emotions", genre: "Literary"},
      {text: "Small towns and relationships", genre: "Romance"}
    ]
  },
  {
    q: "Which hook gets you to open a book?",
    options: [
      {text: "Mystery & danger", genre: "Thriller"},
      {text: "Beautiful sentences", genre: "Literary"},
      {text: "Magic and adventure", genre: "Fantasy"},
      {text: "Love and emotional growth", genre: "Romance"}
    ]
  }
];

const recommendations = {
  "Thriller": {
    list: [
      {title:"The Girl with the Dragon Tattoo — Stieg Larsson"},
      {title:"Gone Girl — Gillian Flynn"},
      {title:"The Silent Patient — Alex Michaelides"}
    ],
    alishaPick: {
      title: "The Silent Patient — Alex Michaelides",
      review: "A gripping psychological thriller that moves from a quiet, unsettling premise to a heart-stopping twist. Alisha loves how the author uses unreliable perspectives and tight pacing to keep you guessing until the last page."
    }
  },
  "Fantasy": {
    list: [
      {title:"The Name of the Wind — Patrick Rothfuss"},
      {title:"The Hobbit — J.R.R. Tolkien"},
      {title:"The Night Circus — Erin Morgenstern"}
    ],
    alishaPick: {
      title: "The Night Circus — Erin Morgenstern",
      review: "A lush, atmospheric fantasy that reads like a dream. Alisha recommends it for readers who enjoy evocative world-building, whimsical magic, and lyrical prose — it's small in scope but enormous in imagination."
    }
  },
  "Literary": {
    list: [
      {title:"Normal People — Sally Rooney"},
      {title:"A Little Life — Hanya Yanagihara"},
      {title:"The Goldfinch — Donna Tartt"}
    ],
    alishaPick: {
      title: "Normal People — Sally Rooney",
      review: "A quiet, intimate novel about connection and the messy ways people grow together and apart. Alisha appreciates the nuance in character dynamics and the precise, conversational prose that lingers after you finish."
    }
  },
  "Romance": {
    list: [
      {title:"The Rosie Project — Graeme Simsion"},
      {title:"Me Before You — Jojo Moyes"},
      {title:"Pride and Prejudice — Jane Austen"}
    ],
    alishaPick: {
      title: "Pride and Prejudice — Jane Austen",
      review: "A timeless romance filled with wit, social insight, and unforgettable characters. Alisha recommends it for first-time romance readers and longtime fans alike — its clever dialogue and moral warmth make it endlessly re-readable."
    }
  }
};

let index=0;
const state = {answers: []};

const el = {
  quizSection: document.getElementById('quiz-section'),
  resultSection: document.getElementById('result-section'),
  questionTitle: document.getElementById('question-title'),
  optionsList: document.getElementById('options'),
  progressBar: document.getElementById('progress-bar'),
  prevBtn: document.getElementById('prev'),
  nextBtn: document.getElementById('next'),
  startButtons: [document.getElementById('start-quiz'), document.getElementById('hero-start')],
  genreName: document.getElementById('genre-name'),
  genreDesc: document.getElementById('genre-desc'),
  bookList: document.getElementById('book-list'),
  retake: document.getElementById('retake'),
  explore: document.getElementById('explore'),
  pickTitle: document.getElementById('pick-title'),
  pickReview: document.getElementById('pick-review')
};

function showQuiz(){
  index=0; state.answers = [];
  el.quizSection.classList.remove('hidden'); el.quizSection.setAttribute('aria-hidden','false');
  el.resultSection.classList.add('hidden'); el.resultSection.setAttribute('aria-hidden','true');
  render();
}

function render(){
  const q = questions[index];
  el.questionTitle.textContent = q.q;
  el.optionsList.innerHTML='';
  q.options.forEach((opt, i) => {
    const li = document.createElement('li');
    li.tabIndex = 0;
    li.className = state.answers[index] === i ? 'selected' : '';
    li.textContent = opt.text;
    li.onclick = () => {
      state.answers[index] = i;
      // highlight and auto-advance a little
      Array.from(el.optionsList.children).forEach((c, idx)=>c.classList.toggle('selected', idx===i));
    };
    li.onkeypress = (e) => { if(e.key === 'Enter') li.click(); };
    el.optionsList.appendChild(li);
  });
  el.progressBar.style.width = `${Math.round((index / (questions.length)) * 100)}%`;
  el.prevBtn.disabled = index === 0;
  el.nextBtn.textContent = index === questions.length - 1 ? 'See Result' : 'Next';
}

el.nextBtn.addEventListener('click', ()=>{
  if (state.answers[index] === undefined) {
    alert('Please choose an option to continue.');
    return;
  }
  if (index < questions.length - 1) {
    index++;
    render();
  } else {
    showResult();
  }
});
el.prevBtn.addEventListener('click', ()=>{
  if (index > 0) { index--; render(); }
});
el.startButtons.forEach(b => b.addEventListener('click', showQuiz));
el.retake.addEventListener('click', showQuiz);
el.explore.addEventListener('click', ()=>window.scrollTo({top:0,behavior:'smooth'}));

function showResult(){
  // Tally genres
  const tally = {};
  state.answers.forEach((ans, i) => {
    const g = questions[i].options[ans].genre;
    tally[g] = (tally[g] || 0) + 1;
  });
  // pick top genre
  const top = Object.keys(tally).sort((a,b)=>tally[b]-tally[a])[0];
  el.genreName.textContent = top;
  const descs = {
    "Thriller":"You like tension, twists, and fast plots.",
    "Fantasy":"You enjoy imaginative worlds and escapism.",
    "Literary":"You enjoy character-driven, thoughtful writing.",
    "Romance":"You prefer emotional journeys and relationships."
  };
  el.genreDesc.textContent = descs[top] || '';
  el.bookList.innerHTML = '';
  (recommendations[top].list || []).forEach(b=>{
    const li = document.createElement('li');
    li.textContent = b.title;
    el.bookList.appendChild(li);
  });

  // Alisha's pick
  if (recommendations[top] && recommendations[top].alishaPick) {
    el.pickTitle.textContent = recommendations[top].alishaPick.title;
    el.pickReview.textContent = recommendations[top].alishaPick.review;
  } else {
    el.pickTitle.textContent = '';
    el.pickReview.textContent = '';
  }

  // show result
  el.quizSection.classList.add('hidden'); el.quizSection.setAttribute('aria-hidden','true');
  el.resultSection.classList.remove('hidden'); el.resultSection.setAttribute('aria-hidden','false');
}
