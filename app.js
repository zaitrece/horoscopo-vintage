// Signos en español y mapeo a inglés para la API Aztro
const MAP_EN = {
  aries:"aries", tauro:"taurus", geminis:"gemini", cancer:"cancer", leo:"leo",
  virgo:"virgo", libra:"libra", escorpio:"scorpio", sagitario:"sagittarius",
  capricornio:"capricorn", acuario:"aquarius", piscis:"pisces"
};

const sel = document.getElementById("signo");
const btnGuardar = document.getElementById("guardar");
const tabs = document.querySelectorAll(".tabs button");
const cargando = document.getElementById("cargando");
const contenido = document.getElementById("contenido");
document.getElementById("year").textContent = new Date().getFullYear();

// Guardar signo
const saved = localStorage.getItem("hv_sign") || "aries";
sel.value = saved;
btnGuardar.onclick = () => { 
  localStorage.setItem("hv_sign", sel.value); 
  cargarActual(); 
};

// Tabs
tabs.forEach(b => b.onclick = () => { 
  tabs.forEach(x=>x.classList.remove("active")); 
  b.classList.add("active"); 
  cargarActual(); 
});

// Inicio
document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".tabs button.active") || tabs[0].classList.add("active");
  cargarActual();
});

// Función principal
async function cargarActual(){
  const tab = document.querySelector(".tabs button.active").dataset.tab;
  const sign = sel.value;
  cargando.style.display = "block"; 
  contenido.textContent = "";
  try{
    let text = await obtener(sign, tab);
    contenido.textContent = text || "No disponible ahora mismo. Prueba más tarde.";
  }catch(e){
    contenido.textContent = "Error al cargar el horóscopo.";
    console.error(e);
  }finally{
    cargando.style.display = "none";
  }
}

// Obtener texto desde API o plantillas
async function obtener(sign, tab){
  if(tab === "diario" || tab === "finde"){
    const r = await fetch(`https://aztro.sameerkumar.website?sign=${MAP_EN[sign]}&day=today`, { method:"POST" });
    if(!r.ok) throw new Error("Error API Aztro");
    const data = await r.json();
    if(tab === "diario"){
      return `${cap(sign)} — ${data.current_date}\n\n${data.description}\n\nHumor: ${data.mood} · Color: ${data.color} · Compatibilidad: ${data.compatibility}`;
    }else{
      return `Fin de semana para ${cap(sign)}\n\n${data.description}`;
    }
  }
  if(tab === "semanal"){
    return plantilla("semanal", sign);
  }
  if(tab === "mensual"){
    return plantilla("mensual", sign);
  }
  if(tab === "anual"){
    return plantilla("anual", sign);
  }
}

// Plantillas básicas
function plantilla(tipo, sign){
  const base = {
    semanal: `Tendencias de la semana para ${cap(sign)}:\n• Amor: equilibrio.\n• Dinero: foco en lo esencial.\n• Trabajo: paciencia y constancia.\n• Consejo: respira y simplifica.`,
    mensual: `Energía del mes para ${cap(sign)}:\nAmor, dinero y salud avanzan si ordenas prioridades. Cierra pendientes y celebra lo logrado.`,
    anual: `Visión del año para ${cap(sign)}:\nCrecimiento estable. Aprende, ahorra y cuida tus vínculos. Lo que siembres a inicios de año se multiplica al final.`
  };
  return base[tipo];
}
function cap(s){ return s[0].toUpperCase()+s.slice(1); }
