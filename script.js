const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

// 15 тематических материалов. Сейчас карточки ведут на соответствующий поиск YouTube.
// Для встроенного проигрывания замени youtubeSearch на конкретный videoId и используй iframe embed.
const videos = [
 ["Как собрать игровой ПК с нуля","pc","Сборка ПК","сборка игрового пк с нуля пошагово"],
 ["Как правильно выбрать блок питания","pc","Сборка ПК","как выбрать блок питания для компьютера"],
 ["Сборка компьютера: порядок действий","pc","Сборка ПК","сборка компьютера пошаговая инструкция"],
 ["Как выбрать корпус и охлаждение","pc","Сборка ПК","как выбрать корпус и охлаждение пк"],
 ["Как выбрать ноутбук для учёбы","laptop","Ноутбуки","как выбрать ноутбук для учебы"],
 ["Игровой ноутбук: на что смотреть","laptop","Ноутбуки","как выбрать игровой ноутбук характеристики"],
 ["Процессор ноутбука: объяснение","laptop","Ноутбуки","процессоры ноутбуков объяснение"],
 ["Как выбрать экран ноутбука","laptop","Ноутбуки","как выбрать экран ноутбука матрица герцовка"],
 ["Чем отличаются видеокарты RTX","parts","Комплектующие","видеокарты nvidia rtx объяснение"],
 ["Оперативная память: сколько нужно","parts","Комплектующие","сколько оперативной памяти нужно пк"],
 ["SSD или HDD: в чём разница","parts","Комплектующие","ssd или hdd в чем разница"],
 ["Как выбрать материнскую плату","parts","Комплектующие","как выбрать материнскую плату"],
 ["Как правильно чистить компьютер","care","Уход и настройка","как правильно почистить компьютер от пыли"],
 ["Как установить Windows и драйверы","care","Уход и настройка","установка windows драйверов инструкция"],
 ["Как снизить нагрев ноутбука","care","Уход и настройка","как снизить нагрев ноутбука советы"]
];
const thumbs = [
 "photo-1587202372775-e229f172b9d7","photo-1593640408182-31c70c8268f5","photo-1587831990711-23ca6441447b",
 "photo-1591488320449-011701bb6704","photo-1496181133206-80ce9b88a853","photo-1588872657578-7efd1f1555ed"
];
function renderVideos(filter="all"){
 const list=videos.filter(v=>filter==="all"||v[1]===filter);
 $("#videoGrid").innerHTML=list.map((v,i)=>`<article class="video-card"><a href="https://www.youtube.com/results?search_query=${encodeURIComponent(v[3])}" target="_blank" rel="noopener"><div class="video-thumb"><img loading="lazy" src="https://images.unsplash.com/${thumbs[i%thumbs.length]}?auto=format&fit=crop&w=700&q=75" alt=""><span class="play-icon">▶</span></div><div class="video-info"><small>${v[2].toUpperCase()}</small><h3>${v[0]}</h3><span>Найти видео на YouTube ↗</span></div></a></article>`).join("");
}
renderVideos();
$$(".filter").forEach(b=>b.addEventListener("click",()=>{$$(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");renderVideos(b.dataset.filter)}));
$("#menuToggle").addEventListener("click",()=>$("#nav").classList.toggle("open"));
$$(".nav a").forEach(a=>a.addEventListener("click",()=>$("#nav").classList.remove("open")));

let purpose="gaming";
const purposes={
 gaming:["Игровой компьютер","Сбалансированная система для современных игр в высоком качестве."],
 work:["Компьютер для работы","Надёжная и отзывчивая система для учёбы, офиса и программирования."],
 design:["Рабочая станция для творчества","Конфигурация с запасом производительности для монтажа, графики и 3D."],
 universal:["Универсальный компьютер","Практичная система для повседневных задач, развлечений и работы."]
};
$$(".choice").forEach(b=>b.addEventListener("click",()=>{$$(".choice").forEach(x=>x.classList.remove("active"));b.classList.add("active");purpose=b.dataset.purpose;$("#buildTitle").textContent=purposes[purpose][0];$("#buildDesc").textContent=purposes[purpose][1]}));
const budget=$("#budget");
function updateBudget(){const n=Number(budget.value).toLocaleString("ru-RU");$("#budgetValue").textContent=n+" $";$("#summaryBudget").textContent="до "+n+" $"}
budget.addEventListener("input",updateBudget);updateBudget();
$("#buildOrder").addEventListener("click",()=>{ $("#orderProduct").value="Сборка компьютера";$("#orderComment").value=`Сценарий: ${purposes[purpose][0]}. Бюджет: до ${budget.value} $. ${$("#buildNote").value}`;location.hash="#order";});
$$(".tag").forEach(t=>t.addEventListener("click",()=>t.classList.toggle("selected")));
$("#laptopOrder").addEventListener("click",()=>{const tags=$$(".tag.selected").map(x=>x.textContent).join(", ");$("#orderProduct").value="Подбор ноутбука";$("#orderComment").value=`Задачи: ${$("#laptopUse").value}. Экран: ${$("#laptopScreen").value}. Бюджет: ${$("#laptopBudget").value}. Важно: ${tags}.`;location.hash="#order";});

// Опрос из 3 вопросов
const questions=[
 {q:"Что планируешь приобрести?",a:["Настольный компьютер","Ноутбук","Пока выбираю"]},
 {q:"Для каких задач нужна техника?",a:["Игры","Учёба и работа","Дизайн, монтаж или 3D","Для всего понемногу"]},
 {q:"Что важнее всего?",a:["Уложиться в бюджет","Максимальная производительность","Компактность и мобильность","Нужен совет специалиста"]}
];
let qIndex=0,answers=[null,null,null];
function drawQuestion(){
 const q=questions[qIndex];$("#surveyQuestion").textContent=q.q;$("#surveyOptions").innerHTML=q.a.map(a=>`<button class="survey-option ${answers[qIndex]===a?"selected":""}">${a}</button>`).join("");
 $$(".survey-option").forEach(b=>b.addEventListener("click",()=>{answers[qIndex]=b.textContent;drawQuestion()}));
 $("#surveyProgress").style.width=((qIndex+1)/3*100)+"%";$("#surveyStep").textContent=`ВОПРОС ${qIndex+1} ИЗ 3`;
 $("#surveyBack").disabled=qIndex===0;$("#surveyNext").disabled=!answers[qIndex];$("#surveyNext").textContent=qIndex===2?"Передать ответы ↗":"Далее ↗";
}
$("#surveyBack").addEventListener("click",()=>{if(qIndex>0){qIndex--;drawQuestion()}});
$("#surveyNext").addEventListener("click",()=>{if(!answers[qIndex])return;if(qIndex<2){qIndex++;drawQuestion()}else{$("#orderProduct").value=answers[0]==="Ноутбук"?"Подбор ноутбука":answers[0]==="Настольный компьютер"?"Сборка компьютера":"Нужна консультация";const surveyText="Ответы анкеты NEXORA:\n"+questions.map((q,i)=>q.q+"\n"+answers[i]).join("\n\n");const comment=$("#orderComment");comment.value=comment.value?comment.value+"\n\n"+surveyText:surveyText;location.hash="#order";$("#formStatus").textContent="Анкета заполнена. Укажи имя и контакт, затем нажми «Отправить заявку» — ответы придут нам в Telegram.";$("#orderForm [name=name]").focus()}});
drawQuestion();

async function sendPayload(payload){
 const controller = new AbortController();
 const timeout = setTimeout(()=>controller.abort(),15000);
 try {
  const r=await fetch("/api/submit",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload),signal:controller.signal});
  const data=await r.json().catch(()=>({}));
  if(!r.ok||!data.ok) throw new Error(data.error||`Ошибка отправки (${r.status}). Попробуй ещё раз.`);
  return data;
 } catch(err) {
  if(err.name==="AbortError") throw new Error("Сервер долго не отвечает. Проверь интернет и попробуй ещё раз.");
  if(err instanceof TypeError) throw new Error("Не удалось связаться с сервером сайта. Проверь публикацию Cloudflare Pages Functions.");
  throw err;
 } finally { clearTimeout(timeout); }
}

$("#orderForm").addEventListener("submit",async e=>{
 e.preventDefault();
 const form=e.currentTarget;
 const btn=form.querySelector('button[type="submit"]');
 const status=$("#formStatus");
 if(!form.reportValidity()) return;
 const payload=Object.fromEntries(new FormData(form).entries());
 payload.source="Форма сайта";
 btn.disabled=true;btn.textContent="Отправляем…";status.textContent="Отправляем заявку…";status.style.color="#b7ff5c";
 try{
  await sendPayload({type:"Новая заявка NEXORA",...payload});
  status.textContent="Заявка успешно отправлена! Уведомление пришло в Telegram. Мы скоро свяжемся с тобой.";
  status.style.color="#b7ff5c";
  form.reset();
 } catch(err){
  status.textContent=err.message;
  status.style.color="#ffbd78";
 } finally {
  btn.disabled=false;btn.innerHTML='Отправить заявку <b>↗</b>';
 }
});
