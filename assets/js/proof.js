(() => {
 const modal=document.getElementById('proof-lightbox');if(!modal)return;
 const image=modal.querySelector('img');const close=modal.querySelector('.proof-lightbox-close');
 let opener=null;
 const dismiss=()=>{
  if(modal.hidden)return;
  modal.hidden=true;image.removeAttribute('src');document.documentElement.style.overflow='';
  opener?.focus({preventScroll:true});
 };
 document.querySelectorAll('[data-proof-full]').forEach(btn=>btn.addEventListener('click',()=>{
  opener=btn;image.src=btn.dataset.proofFull;modal.hidden=false;document.documentElement.style.overflow='hidden';close?.focus();
 }));
 close?.addEventListener('click',dismiss);
 modal.addEventListener('click',e=>{if(e.target===modal)dismiss()});
 document.addEventListener('keydown',e=>{if(!modal.hidden&&e.key==='Escape')dismiss()});
})();
