'use strict';
const select = (q) => document.querySelector(q);
const selects = (q) => [...document.querySelectorAll(q)];
const menuToggle = select('.menu-toggle');
const mobileMenu = select('#mobile-menu');

function closeMenu(){
    menuToggle.setAttribute('aria-expanded','false');
    menuToggle.setAttribute('aria-label','Åpne meny');mobileMenu.hidden=true;document.body.classList.remove('menu-open')
}

menuToggle.addEventListener('click',()=>{
    const open=menuToggle.getAttribute('aria-expanded')!=='true';menuToggle.setAttribute('aria-expanded',String(open));
    menuToggle.setAttribute('aria-label',open?'Lukk meny':'Åpne meny');
    mobileMenu.hidden=!open;document.body.classList.toggle('menu-open',open)});

selects('.mobile-menu a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});

const countInput=select('#plant-count');
const formatter=new Intl.NumberFormat('nb-NO');
const buttons=selects('[data-plants]');

function setCount(number){
    let count=Number.parseInt(number,10);
    if(!Number.isFinite(count)) count=1;count=Math.max(1,Math.min(999,count));
    countInput.value=String(count);select('#donation-sum').textContent=`${formatter.format(count*250)} kr`;
    buttons.forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.plants)===count)))}

buttons.forEach(button=>button.addEventListener('click',()=>setCount(button.dataset.plants)));
select('#increase').addEventListener('click',()=>setCount(Number(countInput.value)+1));
select('#decrease').addEventListener('click',()=>setCount(Number(countInput.value)-1));

countInput.addEventListener('input',()=>{
    const count=Number.parseInt(countInput.value,10);if(Number.isFinite(count)&&count>=1&&count<=999)setCount(count)
});

countInput.addEventListener('blur',()=>setCount(countInput.value));
select('#donation-button').addEventListener('click',()=>{
    const info=select('#payment-info');
    info.hidden=!info.hidden;
    if(!info.hidden)info.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'nearest'})
});

select('#year').textContent=String(new Date().getFullYear());
const reveals=selects('[data-reveal]');
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add('is-visible');
        observer.unobserve(entry.target)}})},{threshold:.11,rootMargin:'0px 0px -30px 0px'});
        reveals.forEach(el=>observer.observe(el))}else reveals.forEach(el=>el.classList.add('is-visible'));
const progress=select('.page-progress');let ticking=false;
function updateProgress(){
    const total=document.documentElement.scrollHeight-window.innerHeight;progress.style.width=(total>0?Math.min(100,window.scrollY/total*100):0)+'%';ticking=false
}
window.addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(updateProgress);ticking=true}},{passive:true});updateProgress();
