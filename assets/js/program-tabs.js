(() => {
  const root=document.querySelector('.program-tabs[role="tablist"]');
  if(!root)return;
  const tabs=[...root.querySelectorAll('[role="tab"]')];
  const panels=[...document.querySelectorAll('.program-detail-panel')];
  const keys=new Set(tabs.map(t=>t.dataset.program));
  function activate(key,{focus=false,hash=false}={}){
    const active=keys.has(key)?key:tabs[0].dataset.program;
    tabs.forEach(tab=>{
      const selected=tab.dataset.program===active;
      tab.setAttribute('aria-selected',String(selected));
      tab.tabIndex=selected?0:-1;
      if(selected&&focus){
        tab.focus({preventScroll:true});
        tab.scrollIntoView({block:'nearest',inline:'nearest',behavior:'instant'});
      }
    });
    panels.forEach(panel=>{panel.hidden=panel.dataset.programPanel!==active});
    if(hash)history.replaceState(null,'','#'+active);
  }
  tabs.forEach((tab,i)=>{
    tab.addEventListener('click',()=>activate(tab.dataset.program,{hash:true}));
    tab.addEventListener('keydown',event=>{
      let next=-1;
      if(event.key==='ArrowRight')next=(i+1)%tabs.length;
      else if(event.key==='ArrowLeft')next=(i+tabs.length-1)%tabs.length;
      else if(event.key==='Home')next=0;
      else if(event.key==='End')next=tabs.length-1;
      if(next<0)return;
      event.preventDefault();activate(tabs[next].dataset.program,{focus:true,hash:true});
    });
  });
  const initial=decodeURIComponent(location.hash.slice(1));
  activate(initial);
  window.addEventListener('hashchange',()=>activate(decodeURIComponent(location.hash.slice(1))));
})();