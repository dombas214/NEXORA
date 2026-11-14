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
 const unlocked=!!window.nexoraSession;
 if(!list.length){$("#videoGrid").innerHTML='<p class="video-empty">В этой категории пока нет видео.</p>';return;}
 $("#videoGrid").innerHTML=list.map((v)=>`<article class="video-card" data-video-id="${v[3]}">
  <div class="video-thumb">${unlocked?`<button class="video-launch" type="button" aria-label="Смотреть: ${v[0]}"><img loading="lazy" src="https://i.ytimg.com/vi/${v[3]}/hqdefault.jpg" alt="Обложка видео: ${v[0]}"><span class="play-icon">▶</span></button>`:`<div class="video-locked"><b>🔒 Видео для участников NEXORA</b><span>Войди или создай аккаунт, чтобы смотреть</span><button type="button" class="video-auth-open">Войти / Регистрация</button></div>`}</div>
  <div class="video-info"><small>${v[2].toUpperCase()}</small><h3>${v[0]}</h3><p>${v[4]}</p><span class="video-action">${unlocked?'Смотреть на сайте ▶':'Доступ после входа 🔒'}</span></div>
 </article>`).join("");
}

renderVideos();
$("#videoGrid").addEventListener("click",e=>{
 if(e.target.closest(".video-auth-open")){window.nexoraOpenAuth?.();return;}
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


// Supabase Auth for NEXORA. The publishable key is intended for browser use; protect data with RLS.
(function initNexoraAuth(){
 const SUPABASE_URL = "https://qsmilwubedkzmewmwmxt.supabase.co";
 const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_x2q0ttoqkC3S3SN24_Z9kQ_TEH3ga9G";
 const overlay=document.getElementById("authOverlay");
 const form=document.getElementById("authForm");
 if(!window.supabase || !overlay || !form){console.error("Supabase client or auth UI did not load");return;}
 const client=window.supabase.createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY);
 let mode="login";
 const status=document.getElementById("authStatus");
 const open=()=>{overlay.hidden=false;status.textContent="";document.getElementById("authEmail").focus();};
 const close=()=>{overlay.hidden=true;};
 window.nexoraOpenAuth=open;
 document.getElementById("authOpen").addEventListener("click",open);
 document.getElementById("authClose").addEventListener("click",close);
 overlay.addEventListener("click",e=>{if(e.target===overlay)close();});
 document.getElementById("authSwitch").addEventListener("click",()=>{
  mode=mode==="login"?"signup":"login";
  document.getElementById("authTitle").textContent=mode==="login"?"Вход в аккаунт":"Создать аккаунт";
  document.getElementById("authSubtitle").textContent=mode==="login"?"Войди, чтобы открыть обучающие видео.":"Зарегистрируйся, чтобы получить доступ к базе знаний NEXORA.";
  document.getElementById("authSubmit").textContent=mode==="login"?"Войти":"Зарегистрироваться";
  document.getElementById("authSwitch").textContent=mode==="login"?"Нет аккаунта? Зарегистрироваться":"Уже есть аккаунт? Войти";
  document.getElementById("authNameLabel").hidden=mode!=="signup";
  document.getElementById("authName").required=mode==="signup";
  document.getElementById("authPassword").autocomplete=mode==="login"?"current-password":"new-password";
  status.textContent="";
 });
 form.addEventListener("submit",async e=>{
  e.preventDefault();const email=document.getElementById("authEmail").value.trim();const password=document.getElementById("authPassword").value;
  const submit=document.getElementById("authSubmit");submit.disabled=true;status.textContent=mode==="login"?"Входим…":"Создаём аккаунт…";
  try{
   let result;
   if(mode==="signup"){
    const fullName=document.getElementById("authName").value.trim();
    result=await client.auth.signUp({email,password,options:{data:{full_name:fullName},emailRedirectTo:window.location.origin}});
    if(result.error)throw result.error;
    if(!result.data.session){status.textContent="Аккаунт создан! Проверь почту и подтверди адрес, затем войди.";status.style.color="#b7ff5c";return;}
   }else{result=await client.auth.signInWithPassword({email,password});if(result.error)throw result.error;}
   await refreshSession();close();
  }catch(err){status.textContent=err.message||"Не удалось выполнить вход. Попробуй ещё раз.";status.style.color="#ffbd78";}
  finally{submit.disabled=false;}
 });
 async function refreshSession(){
  const {data}=await client.auth.getSession();window.nexoraSession=data.session||null;
  const loginBtn=document.getElementById("authOpen"),userBtn=document.getElementById("accountUser");
  if(data.session){loginBtn.hidden=true;userBtn.hidden=false;userBtn.textContent=(data.session.user.user_metadata?.full_name||data.session.user.email)+" · Выйти";}
  else{loginBtn.hidden=false;userBtn.hidden=true;}
  userBtn.onclick=async()=>{if(confirm("Выйти из аккаунта NEXORA?")){await client.auth.signOut();await refreshSession();}};
  const activeFilter=document.querySelector(".filter.active")?.dataset.filter||"all";renderVideos(activeFilter);
 }
 client.auth.onAuthStateChange(()=>{refreshSession();});
 refreshSession();
})();
