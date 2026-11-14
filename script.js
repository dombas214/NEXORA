const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

// Подборка реальных роликов YouTube. Видео загружается в плеер прямо на сайте по нажатию.
const videos = [
 ["Как собрать игровой ПК с нуля","pc","Сборка ПК","FJlLtksMGiA","Пошаговый гайд по подбору комплектующих и сборке игрового компьютера."],
 ["Полная сборка ПК своими руками","pc","Сборка ПК","hr-siRhvApM","Подробная сборка компьютера: от установки процессора до Windows и драйверов."],
 ["Как выбрать блок питания","pc","Сборка ПК","mLgZdCF4NvQ","Мощность, разъёмы, форм-фактор и сертификат 80 PLUS."],
 ["Как выбрать ноутбук для дома и игр","laptop","Ноутбуки","wSdqpFl2bzg","Разбираем типы ноутбуков и выбираем устройство под свои задачи."],
 ["Как выбрать игровой ноутбук по характеристикам","laptop","Ноутбуки","ujtXeLNCXaQ","На что смотреть в процессоре, памяти, экране и охлаждении."],
 ["Как выбрать комплектующие для ПК","parts","Комплектующие","McNiJkL1zUQ","Процессор, материнская плата, память, накопитель, охлаждение и видеокарта."],
 ["DDR4 или DDR5: какую память выбрать","parts","Комплектующие","g5YQQIEEY5Y","Сравнение поколений оперативной памяти и объёма ОЗУ."],
 ["SSD или HDD: в чём разница","parts","Комплектующие","61agcZlPpsg","Как устроены накопители и какой вариант выбрать."],
 ["Как выбрать видеокарту","parts","Комплектующие","mWp5HjLGkjY","Короткий видеоматериал о видеопамяти и её влиянии на игры."]
];
function renderVideos(filter="all"){
 const list=videos.filter(v=>filter==="all"||v[1]===filter);
 if(!list.length){$("#videoGrid").innerHTML='<p class="video-empty">В этой категории пока нет видео.</p>';return;}
 $("#videoGrid").innerHTML=list.map((v)=>`<article class="video-card" data-video-id="${v[3]}">
  <div class="video-thumb">
   <button class="video-launch" type="button" aria-label="Смотреть: ${v[0]}">
    <img loading="lazy" src="https://i.ytimg.com/vi/${v[3]}/hqdefault.jpg" alt="Обложка видео: ${v[0]}">
    <span class="play-icon">▶</span>
   </button>
  </div>
  <div class="video-info"><small>${v[2].toUpperCase()}</small><h3>${v[0]}</h3><p>${v[4]}</p><span class="video-action">Смотреть на сайте ▶</span></div>
 </article>`).join("");
}
renderVideos();
$("#videoGrid").addEventListener("click",e=>{
 const launch=e.target.closest(".video-launch");
 if(!launch)return;
 const card=launch.closest(".video-card");
 const id=card.dataset.videoId;
 const thumb=card.querySelector(".video-thumb");
 const title=card.querySelector("h3")?.textContent||"Видео NEXORA";
 const embedUrl = new URL(`https://www.youtube.com/embed/${encodeURIComponent(id)}`);
 embedUrl.searchParams.set("autoplay", "1");
 embedUrl.searchParams.set("rel", "0");
 embedUrl.searchParams.set("playsinline", "1");
 // YouTube Error 153 occurs when the embedded player receives no HTTP Referer.
 embedUrl.searchParams.set("origin", window.location.origin);
 thumb.innerHTML=`<iframe src="${embedUrl.href}" title="${title.replace(/\"/g,"&quot;")}" loading="eager" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="origin" allowfullscreen></iframe><button class="video-close" type="button" aria-label="Закрыть видео">✕</button>`;
});
$("#videoGrid").addEventListener("click",e=>{
 const close=e.target.closest(".video-close");
 if(!close)return;
 const card=close.closest(".video-card");
 const id=card.dataset.videoId;
 const title=card.querySelector("h3")?.textContent||"Видео";
 const thumb=card.querySelector(".video-thumb");
 thumb.innerHTML=`<button class="video-launch" type="button" aria-label="Смотреть: ${title}"><img loading="lazy" src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" alt="Обложка видео: ${title}"><span class="play-icon">▶</span></button>`;
});
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
