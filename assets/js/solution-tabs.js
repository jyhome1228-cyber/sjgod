(() => {
  const tablist=document.querySelector('.solution-tabs[role="tablist"]');
  if(!tablist)return;
  const tabs=[...tablist.querySelectorAll('[role="tab"]')];
  const panels=[...document.querySelectorAll('.solution-panel[role="tabpanel"]')];
  const known=new Set(tabs.map(tab=>tab.dataset.solution));
  const setTab=(key,{focus=false,updateHash=false}={})=>{
    const active=known.has(key)?key:tabs[0].dataset.solution;
    tabs.forEach(tab=>{
      const selected=tab.dataset.solution===active;
      tab.setAttribute('aria-selected',String(selected));
      tab.tabIndex=selected?0:-1;
      if(selected){
        if(focus){
          tab.focus({preventScroll:true});
          tab.scrollIntoView({inline:'nearest',block:'nearest',behavior:'instant'});
        }
      }
    });
    panels.forEach(panel=>{
      panel.hidden=panel.dataset.solutionPanel!==active;
    });
    if(updateHash){
      history.replaceState(null,'','#'+active);
    }
  };
  tabs.forEach((tab,i)=>{
    tab.addEventListener('click',()=>setTab(tab.dataset.solution,{updateHash:true}));
    tab.addEventListener('keydown',event=>{
      let next;
      if(event.key==='ArrowRight')next=(i+1)%tabs.length;
      else if(event.key==='ArrowLeft')next=(i-1+tabs.length)%tabs.length;
      else if(event.key==='Home')next=0;
      else if(event.key==='End')next=tabs.length-1;
      else return;
      event.preventDefault();
      setTab(tabs[next].dataset.solution,{focus:true,updateHash:true});
    });
  });
  const initial=decodeURIComponent(window.location.hash.slice(1));
  setTab(initial,{updateHash:false});
  window.addEventListener('hashchange',()=>{
    const target=decodeURIComponent(window.location.hash.slice(1));
    if(known.has(target))setTab(target);
  });
})();