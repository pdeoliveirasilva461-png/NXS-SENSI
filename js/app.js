// ===== Parâmetros do algoritmo (configuráveis) =====
var ALGO={version:"1.1.0",min:0,max:200,
 base:{rush:[184,176,156,124,90,140],suporte:[164,160,144,120,96,124],sniper:[140,144,136,132,116,110],equilibrado:[160,156,140,120,100,124]},
 exp:{iniciante:-16,intermediario:0,avancado:10},
 fps:{"30":-12,"60":-4,"90":2,"120":6,"?":0},
 ram:function(g){return g<=3?-6:g<=6?-2:g>=12?4:0}};
var KEYS=["Geral","Ponto vermelho","Mira 2x","Mira 4x","Mira AWM","Olhadinha"];
var STYLES={rush:["Rush","Confrontos próximos e movimentação agressiva."],suporte:["Suporte","Equilíbrio, cobertura e auxílio ao time."],sniper:["Sniper","Miras de longa distância."],equilibrado:["Equilibrado","Diferentes estilos de combate."]};
var EXPS={iniciante:"Iniciante",intermediario:"Intermediário",avancado:"Avançado"};
var BRANDS=["Samsung","Xiaomi","Redmi","Motorola","Apple","Realme","Oppo","Vivo","Asus","Infinix","Tecno","Huawei","Outras"];
function hash(s){var h=7;for(var i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))>>>0;return h}
function generate(f,n){
 var b=ALGO.base[f.style].slice(),adj=ALGO.exp[f.exp]+ALGO.fps[f.fps]+ALGO.ram(+f.ram||8);
 var h=hash((f.brand+f.model).toLowerCase()+f.style+n);
 var v=b.map(function(x,i){var j=((h>>(i*3))%9)-4;return Math.max(ALGO.min,Math.min(ALGO.max,Math.round(x+adj+j)))});
 for(var i=1;i<=4;i++)if(v[i]>v[i-1])v[i]=v[i-1]; // coerência: mira maior => sensibilidade menor ou igual
 return v}
function hud(f){return f.style==="sniper"?"Médio (45–60%)":f.style==="rush"?"Grande (60–75%)":"Médio-grande (50–65%)"}
// ===== Storage seguro =====
function load(){try{return JSON.parse(localStorage.getItem("nsg_hist")||"[]")}catch(e){return[]}}
function save(a){try{localStorage.setItem("nsg_hist",JSON.stringify(a));return true}catch(e){return false}}
var form={step:0,brand:"",model:"",os:"Android",ram:"8",fps:"60",style:"",exp:""},cur=null,gen=0;
var app=document.getElementById("app");
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function toast(t){var e=document.getElementById("toast");e.textContent=t;e.className="toast on";setTimeout(function(){e.className="toast"},1800)}
function text(r){return "NEXUS SENSI GENERATOR\n"+r.brand+" "+r.model+" | "+r.fps+" FPS | "+STYLES[r.style][0]+"\nEscala: 0–200\n"+KEYS.map(function(k,i){return k+": "+r.v[i]}).join("\n")+"\nBotão de disparo: "+r.hud}
function copy(t){if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(function(){toast("Configuração copiada")},fb)}else fb();
 function fb(){var a=document.createElement("textarea");a.value=t;document.body.appendChild(a);a.select();try{document.execCommand("copy");toast("Configuração copiada")}catch(e){toast("Não foi possível copiar")}a.remove()}}
function share(r){var t=text(r);if(navigator.share){navigator.share({title:"Minha sensibilidade",text:t}).catch(function(){})}else copy(t)}
// ===== Views =====
function home(){var h=load();return '<section class="hero"><h1>ENCONTRE SUA <span>SENSI IDEAL.</span></h1><p>Gere uma sensibilidade personalizada para seu aparelho e encontre uma configuração adequada ao seu estilo de gameplay.</p><div class="row"><a class="btn" href="#gerar">GERAR MINHA SENSIBILIDADE</a></div></section>'+
 '<h2>Como funciona</h2><div class="grid"><div class="card"><b>1. Aparelho</b><p>Marca, modelo, sistema e RAM.</p></div><div class="card"><b>2. Desempenho</b><p>FPS e taxa de atualização que você usa.</p></div><div class="card"><b>3. Estilo e experiência</b><p>Rush, suporte, sniper ou equilibrado.</p></div><div class="card"><b>4. Resultado</b><p>Seis sensibilidades, mais sugestão de HUD.</p></div></div>'+
 '<h2>Uso neste navegador</h2><div class="card"><b style="font-size:28px;color:#2388FF">'+h.length+'</b><p>configurações salvas neste aparelho. Estatísticas globais de uso dependem do banco de dados online, que ainda não está conectado.</p></div>'}
function stepView(){var s=form.step,x='<div class="steps">'+[0,1,2,3,4].map(function(i){return '<i class="'+(i<=s?'on':'')+'"></i>'}).join("")+'</div>';
 if(s==0)x+='<h2>Informações do aparelho</h2><label for="brand">Marca</label><select id="brand"><option value="">Selecione</option>'+BRANDS.map(function(b){return '<option'+(form.brand==b?' selected':'')+'>'+b+'</option>'}).join("")+'</select><label for="model">Modelo exato</label><input id="model" value="'+esc(form.model)+'" placeholder="Ex.: Galaxy A54" autocomplete="off"><label for="os">Sistema operacional</label><select id="os"><option'+(form.os=="Android"?' selected':'')+'>Android</option><option'+(form.os=="iOS"?' selected':'')+'>iOS</option></select><label for="ram">Memória RAM</label><select id="ram">'+[2,3,4,6,8,12,16].map(function(g){return '<option value="'+g+'"'+(form.ram==g?' selected':'')+'>'+g+' GB</option>'}).join("")+'</select>';
 if(s==1)x+='<h2>Desempenho</h2><label>FPS utilizado</label><div class="opts">'+[["30","30 FPS"],["60","60 FPS"],["90","90 FPS"],["120","120 FPS"],["?","Não sei informar"]].map(function(o){return '<button class="opt'+(form.fps==o[0]?' sel':'')+'" data-k="fps" data-v="'+o[0]+'">'+o[1]+'</button>'}).join("")+'</div>';
 if(s==2)x+='<h2>Estilo de gameplay</h2><div class="opts">'+Object.keys(STYLES).map(function(k){return '<button class="opt'+(form.style==k?' sel':'')+'" data-k="style" data-v="'+k+'">'+STYLES[k][0]+'<small>'+STYLES[k][1]+'</small></button>'}).join("")+'</div>';
 if(s==3)x+='<h2>Experiência</h2><div class="opts">'+Object.keys(EXPS).map(function(k){return '<button class="opt'+(form.exp==k?' sel':'')+'" data-k="exp" data-v="'+k+'">'+EXPS[k]+'</button>'}).join("")+'</div>';
 if(s==4)x+='<h2>Confira seus dados</h2><div class="card meta"><div>Aparelho<b>'+esc(form.brand+" "+form.model)+'</b></div><div>Sistema<b>'+form.os+'</b></div><div>RAM<b>'+form.ram+' GB</b></div><div>FPS<b>'+(form.fps=="?"?"Não informado":form.fps)+'</b></div><div>Estilo<b>'+STYLES[form.style][0]+'</b></div><div>Nível<b>'+EXPS[form.exp]+'</b></div></div>';
 x+='<div class="err" id="err" role="alert"></div><div class="row">'+(s>0?'<button class="btn ghost" id="back">Voltar</button>':'')+'<button class="btn" id="next">'+(s==4?'GERAR MINHA SENSIBILIDADE':'Continuar')+'</button></div>';return x}
function result(){var r=cur;if(!r)return '<h2>Nenhum resultado</h2><p>Gere uma sensibilidade para ver o resultado aqui.</p><a class="btn" href="#gerar">Gerar agora</a>';
 return '<h1 style="font-size:clamp(28px,7vw,44px)">SUA SENSIBILIDADE ESTÁ PRONTA!</h1><div class="card meta"><div>Marca<b>'+esc(r.brand)+'</b></div><div>Modelo<b>'+esc(r.model)+'</b></div><div>RAM<b>'+r.ram+' GB</b></div><div>FPS<b>'+(r.fps=="?"?"Não informado":r.fps)+'</b></div><div>Estilo<b>'+STYLES[r.style][0]+'</b></div><div>Nível<b>'+EXPS[r.exp]+'</b></div><div>Data<b>'+new Date(r.date).toLocaleString("pt-BR")+'</b></div></div>'+
 '<div class="card" style="margin-top:12px">'+KEYS.map(function(k,i){return '<div class="sens"><div class="t"><span>'+k.toUpperCase()+'</span><span>'+r.v[i]+'<small style="font-size:12px;color:#9AABC3;font-weight:400"> /200</small></span></div><div class="track"><div style="width:'+(r.v[i]/200*100)+'%"></div></div></div>'}).join("")+'</div>'+
 '<div class="card" style="margin-top:12px"><b>Botão de disparo (HUD)</b><p>Sugestão de tamanho: '+r.hud+'. Independe dos valores de sensibilidade.</p><p>DPI: sem justificativa de compatibilidade para este aparelho, não há recomendação. Não é necessário alterar o DPI.</p></div>'+
 '<div class="note">Não há dados de calibração cadastrados para este modelo. Esta é uma configuração de referência estimada pelo algoritmo v'+ALGO.version+', não um teste feito no seu aparelho. Teste no treino e ajuste aos poucos. O site não altera as configurações do Free Fire: aplique os valores manualmente.</div>'+
 '<div class="row"><button class="btn" id="c">COPIAR CONFIGURAÇÃO</button><button class="btn ghost" id="g">GERAR NOVAMENTE</button><button class="btn ghost" id="s">SALVAR CONFIGURAÇÃO</button><button class="btn ghost" id="sh">COMPARTILHAR</button><a class="btn ghost" href="#inicio">VOLTAR AO INÍCIO</a></div>'}
function history(){var h=load();if(!h.length)return '<h2>Histórico</h2><p>Nada salvo ainda. Gere uma sensibilidade e toque em Salvar configuração.</p><a class="btn" href="#gerar">Gerar sensibilidade</a>';
 return '<h2>Histórico</h2><p>Salvo apenas neste navegador.</p>'+h.map(function(r,i){return '<div class="card" style="margin-bottom:10px"><b>'+esc(r.brand+" "+r.model)+'</b><p>'+STYLES[r.style][0]+' · '+new Date(r.date).toLocaleString("pt-BR")+(r.algo==='1.0.0'?' · salvo na escala antiga (0–100)':'')+'</p><p style="color:#fff">'+KEYS.map(function(k,j){return k+" "+r.v[j]}).join(" · ")+'</p><div class="row"><button class="btn ghost" data-cp="'+i+'">Copiar</button><button class="btn ghost" data-del="'+i+'">Excluir</button></div></div>'}).join("")}
function about(){return '<h2>Sobre o projeto</h2><p>O Nexus Sensi Generator, da Nexus Esports, gera recomendações iniciais de sensibilidade para Free Fire a partir do aparelho, do FPS, do estilo de jogo e da experiência.</p><p>Os valores vêm de regras com limites definidos, e não de números aleatórios. Sem dados de calibração do modelo, o resultado é uma referência que o jogador precisa testar e ajustar.</p><h2>Privacidade</h2><p>Nenhum cadastro é exigido. O histórico fica apenas no armazenamento local do seu navegador e nenhum dado é enviado a servidores nesta versão.</p>'}
function route(){var r=(location.hash||"#inicio").slice(1);if(["inicio","gerar","resultado","historico","sobre"].indexOf(r)<0)r="inicio";
 document.querySelectorAll("#nav a").forEach(function(a){a.className=a.dataset.r==r?"on":""});
 app.innerHTML=r=="inicio"?home():r=="gerar"?stepView():r=="resultado"?result():r=="historico"?history():about();window.scrollTo(0,0);bind(r)}
function validate(){var s=form.step;
 if(s==0){form.brand=document.getElementById("brand").value;form.model=document.getElementById("model").value.trim();form.os=document.getElementById("os").value;form.ram=document.getElementById("ram").value;
  if(!form.brand)return"Selecione a marca.";if(form.model.length<2||form.model.length>60)return"Informe o modelo exato (2 a 60 caracteres)."}
 if(s==2&&!form.style)return"Escolha um estilo de gameplay.";if(s==3&&!form.exp)return"Escolha seu nível de experiência.";return""}
function run(){gen=0;app.innerHTML='<div class="load" id="ld">Analisando seu aparelho...</div>';
 var m=["Verificando as informações...","Personalizando seu perfil...","Preparando sua configuração..."],i=0,t=setInterval(function(){var e=document.getElementById("ld");if(e&&i<m.length)e.textContent=m[i++]},600);
 setTimeout(function(){clearInterval(t);mk();location.hash="resultado"},2400)}
function mk(){cur={brand:form.brand,model:form.model,os:form.os,ram:form.ram,fps:form.fps,style:form.style,exp:form.exp,date:Date.now(),algo:ALGO.version};cur.v=generate(cur,gen);cur.hud=hud(cur)}
function bind(r){var $=function(i){return document.getElementById(i)};
 if(r=="gerar"){app.querySelectorAll(".opt").forEach(function(b){b.onclick=function(){form[b.dataset.k]=b.dataset.v;route()}});
  $("next").onclick=function(){var e=validate();if(e){$("err").textContent=e;return}if(form.step==4)run();else{form.step++;route()}};
  if($("back"))$("back").onclick=function(){form.step--;route()}}
 if(r=="resultado"&&cur){$("c").onclick=function(){copy(text(cur))};$("sh").onclick=function(){share(cur)};
  $("g").onclick=function(){gen++;mk();route();toast("Nova variação gerada")};
  $("s").onclick=function(){var h=load();h.unshift(cur);if(save(h.slice(0,50)))toast("Configuração salva");else toast("Armazenamento indisponível neste navegador")}}
 if(r=="historico"){app.querySelectorAll("[data-cp]").forEach(function(b){b.onclick=function(){copy(text(load()[b.dataset.cp]))}});
  app.querySelectorAll("[data-del]").forEach(function(b){b.onclick=function(){var h=load();h.splice(+b.dataset.del,1);save(h);route();toast("Configuração excluída")}})}}
window.addEventListener("hashchange",route);route();
