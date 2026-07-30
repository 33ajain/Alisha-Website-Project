/* redesign.js — adaptive unique quiz */
(function(){
  // small, self-contained redesign script
  const QUESTIONS = [
    {id:'start', text:'What kind of opening grabs you?', choices:[
      {id:'a',text:'A mystery that hooks immediately',genre:'Thriller'},
      {id:'b',text:'A gentle scene with rich language',genre:'Literary'},
      {id:'c',text:'A strange, imaginative image',genre:'Fantasy'},
      {id:'d',text:'A warm relationship moment',genre:'Romance'}
    ]},
    // follow-ups are adaptive: keyed by first answer
    {id:'thrill', text:'Do you like twisty plots or fast action?', choices:[
      {id:'t1',text:'Twisty & psychological',genre:'Thriller'},
      {id:'t2',text:'High-octane action',genre:'Thriller'}
    ]},
    {id:'lit', text:'Do you prefer quiet introspection or lyrical prose?', choices:[
      {id:'l1',text:'Quiet & deep',genre:'Literary'},
      {id:'l2',text:'Lyrical & playful',genre:'Literary'}
    ]},
    {id:'fant', text:'Do you want epic worlds or intimate magic?', choices:[
      {id:'f1',text:'Epic quests',genre:'Fantasy'},
      {id:'f2',text:'Intimate, strange magic',genre:'Fantasy'}
    ]},
    {id:'rom', text:'Do you like laugh-out-loud romcoms or heartfelt stories?', choices:[
      {id:'r1',text:'Romcom',genre:'Romance'},
      {id:'r2',text:'Heartfelt',genre:'Romance'}
    ]}
  ];

  const RECS = {
    'Thriller': {list:['The Silent Patient — Alex Michaelides','Gone Girl — Gillian Flynn','The Girl on the Train — Paula Hawkins'],pick:{title:'The Silent Patient','review':'A quiet, twisty masterpiece Alisha adores for its unreliable narrator.'}},
    'Literary': {list:['Normal People — Sally Rooney','The Goldfinch — Donna Tartt','A Little Life — Hanya Yanagihara'],pick:{title:'Normal People','review':'Intimate, precise character work — a modern classic.'}},
    'Fantasy': {list:['The Night Circus — Erin Morgenstern','The Name of the Wind — Patrick Rothfuss','The Hobbit — J.R.R. Tolkien'],pick:{title:'The Night Circus','review':'Dreamlike, inventive magic and atmosphere.'}},
    'Romance': {list:['Pride and Prejudice — Jane Austen','The Rosie Project — Graeme Simsion','Me Before You — Jojo Moyes'],pick:{title:'Pride and Prejudice','review':'Witty, enduring romance with sparkling dialogue.'}}
  };

  // DOM refs
  const openBtn = document.getElementById('open-quiz');
  const demoBtn = document.getElementById('demo');
  const quizShell = document.getElementById('quiz-shell');
  const quiz = document.getElementById('quiz');
  const titleEl = document.getElementById('q-title');
  const subEl = document.getElementById('q-sub');
  const choicesEl = document.getElementById('choices');
  const backBtn = document.getElementById('back');
  const nextBtn = document.getElementById('next');
  const progressRing = document.querySelector('.ring-fg');
  const mapArea = document.getElementById('map-area');
  const resultShell = document.getElementById('result-shell');
  const pickGenre = document.getElementById('pick-genre');
  const pickTitle = document.getElementById('pick-title');
  const pickReview = document.getElementById('pick-review');
  const recList = document.getElementById('rec-list');
  const shareBtn = document.getElementById('share');
  const confettiBtn = document.getElementById('confetti');
  const fxCanvas = document.getElementById('fx-canvas');

  let state = {stack:[],answers:[],index:0};

  function reset(){state={stack:[],answers:[],index:0};}

  function setProgress(p){
    // p 0..1
    const circumference = 94; // matches CSS dasharray
    progressRing.style.strokeDashoffset = String(Math.round(circumference*(1-p)));
  }

  function renderQuestion(q){
    titleEl.textContent = q.text;
    choicesEl.innerHTML = '';
    q.choices.forEach((c, i) => {
      const el = document.createElement('button');
      el.className = 'choice';
      el.type = 'button';
      el.textContent = c.text;
      el.dataset.genre = c.genre;
      el.dataset.choice = c.id;
      el.addEventListener('click', ()=>{
        // mark selection
        Array.from(choicesEl.children).forEach(ch=>ch.classList.remove('selected'));
        el.classList.add('selected');
        state.answers[state.index]=c.id;
        state.selected = c;
        // update map preview
        updateMapPreview(c);
      });
      choicesEl.appendChild(el);
    });
    setProgress(state.index === 0 ? 0.16 : 0.5);
  }

  function updateMapPreview(choice){
    mapArea.innerHTML = '';
    const node = document.createElement('div');
    node.className = 'map-node';
    node.textContent = choice.text;
    mapArea.appendChild(node);
  }

  function start(){
    quizShell.classList.remove('hidden'); quizShell.setAttribute('aria-hidden','false');
    document.getElementById('hero-unique')?.classList.add('dimmed');
    // initial question
    state.stack = [QUESTIONS[0]];
    state.index = 0;
    renderQuestion(state.stack[state.index]);
    backBtn.disabled = true;
  }

  function decideNext(){
    const sel = state.selected;
    if(!sel) return null;
    // branch based on first choice
    if(state.index===0){
      switch(sel.dataset.choice){
        case 'a': state.stack.push(QUESTIONS.find(x=>x.id==='thrill')); break;
        case 'b': state.stack.push(QUESTIONS.find(x=>x.id==='lit')); break;
        case 'c': state.stack.push(QUESTIONS.find(x=>x.id==='fant')); break;
        case 'd': state.stack.push(QUESTIONS.find(x=>x.id==='rom')); break;
      }
    } else {
      // no further branching — results
    }
  }

  nextBtn.addEventListener('click', ()=>{
    if(!state.selected){ alert('Please choose an option.'); return; }
    decideNext();
    if(state.index < state.stack.length-1){
      state.index++;
      renderQuestion(state.stack[state.index]);
      backBtn.disabled = false;
      state.selected = null;
    } else {
      // compute result
      showResult();
    }
  });

  backBtn.addEventListener('click', ()=>{
    if(state.index>0){
      state.index--; renderQuestion(state.stack[state.index]); state.selected=null;
    }
    backBtn.disabled = state.index===0;
  });

  function showResult(){
    // simple tally: look at first answer genre
    const first = state.answers[0] || state.selected && state.selected.id;
    const firstChoice = state.stack[0].choices.find(c=>c.id===state.answers[0]) || state.selected;
    const genre = firstChoice ? firstChoice.genre : 'Literary';
    const rec = RECS[genre];
    pickGenre.textContent = genre;
    pickTitle.textContent = rec.pick.title;
    pickReview.textContent = rec.pick.review;
    recList.innerHTML = '';
    rec.list.forEach(r=>{ const li=document.createElement('li'); li.textContent=r; recList.appendChild(li); });

    quizShell.classList.add('hidden'); quizShell.setAttribute('aria-hidden','true');
    resultShell.classList.remove('hidden'); resultShell.setAttribute('aria-hidden','false');
    // save short encoded result in hash
    const payload = {g:genre,t:rec.pick.title};
    location.hash = encodeURIComponent(btoa(JSON.stringify(payload)));
  }

  shareBtn.addEventListener('click', ()=>{
    const url = location.href;
    navigator.clipboard?.writeText(url).then(()=>alert('Result link copied to clipboard'));
  });

  confettiBtn.addEventListener('click', ()=>{
    // simple canvas confetti
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    runConfetti();
  });

  function runConfetti(){
    const canvas = fxCanvas; const ctx = canvas.getContext('2d');
    canvas.width = innerWidth; canvas.height = innerHeight; canvas.style.display='block';
    const pieces = [];
    for(let i=0;i<80;i++) pieces.push({x:Math.random()*canvas.width,y:-10,vy:2+Math.random()*6, vx:(Math.random()-0.5)*6, size:6+Math.random()*8, color:`hsl(${Math.random()*360} 70% 60%)`});
    let t=0;
    function frame(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      pieces.forEach(p=>{ p.x+=p.vx; p.y+=p.vy; p.vy+=0.15; ctx.fillStyle=p.color; ctx.fillRect(p.x,p.y,p.size,p.size); });
      t++; if(t<140) requestAnimationFrame(frame); else { ctx.clearRect(0,0,canvas.width,canvas.height); canvas.style.display='none'; }
    }
    requestAnimationFrame(frame);
  }

  // decode hash on load to show previous result
  function decodeHash(){
    if(!location.hash) return;
    try{ const payload = JSON.parse(atob(decodeURIComponent(location.hash.slice(1)))); if(payload && payload.g){
      // show result page with payload
      const rec = RECS[payload.g] || RECS['Literary'];
      pickGenre.textContent = payload.g;
      pickTitle.textContent = payload.t || rec.pick.title;
      pickReview.textContent = rec.pick.review;
      recList.innerHTML=''; rec.list.forEach(r=>{const li=document.createElement('li');li.textContent=r;recList.appendChild(li);});
      resultShell.classList.remove('hidden'); resultShell.setAttribute('aria-hidden','false');
    }}catch(e){}
  }

  // basic map preview sample node styling injection
  const sheet = document.createElement('style'); sheet.textContent = '.map-node{padding:10px 12px;border-radius:10px;background:linear-gradient(90deg,#0b1220,#071029);border:1px solid rgba(255,255,255,0.03);color:#ffdcdc;display:inline-block} .dimmed{filter:blur(2px) grayscale(.2) saturate(.8)}'; document.head.appendChild(sheet);

  openBtn.addEventListener('click', start);
  demoBtn.addEventListener('click', ()=>{ openBtn.click(); // preselect first option for demo
    setTimeout(()=>{ const first = document.querySelector('.choice'); if(first) first.click(); },120); });

  // allow keyboard navigation
  document.addEventListener('keydown',(e)=>{ if(e.key==='Escape'){ quizShell.classList.add('hidden'); resultShell.classList.add('hidden'); document.getElementById('hero-unique')?.classList.remove('dimmed'); } });

  // init
  decodeHash();

})();
