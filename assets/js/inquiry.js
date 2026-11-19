(() => {
  const heroAsset=(window.SJGOD_ASSETS||[]).find(x=>x.id===1);
  const hero=document.querySelector('[data-home-hero]');
  if(hero && heroAsset) hero.style.backgroundImage='url("'+heroAsset.url+'")';
  document.querySelectorAll('img[data-asset]').forEach(img=>{
    const asset=(window.SJGOD_ASSETS||[]).find(x=>x.id===Number(img.dataset.asset));
    if(asset)img.src=asset.url;
  });

  const form=document.getElementById('inquiry-form');
  if(!form)return;
  const params=new URLSearchParams(window.location.search);
  const radios=[...form.querySelectorAll('input[name="inquiryType"]')];
  const typeNames={lecture:'강연 문의',program:'프로그램 문의',adoption:'제품·서비스 도입 문의'};
  const selectedProgram=params.get('program')||'';
  const explicitType=params.get('type');
  const lectureHint=/강연|특강|연수|섭외/.test(selectedProgram);
  const adoptionHint=/퀘스트스쿨|C-Finder|LifeRoad|AI학과카드|드림텔러|솔루션|교구|교재|제품|Q샵|큐샵/.test(selectedProgram);
  const initialType=(explicitType&&typeNames[explicitType]?explicitType:(lectureHint?'lecture':adoptionHint?'adoption':selectedProgram?'program':null));
  const typeFields=[...form.querySelectorAll('[data-inquiry-types]')];
  const typeOf=()=>radios.find(r=>r.checked)?.value||'';
  function updateType(){
    const type=typeOf();
    typeFields.forEach(field=>{
      const active=field.dataset.inquiryTypes.split(' ').includes(type);
      field.hidden=!active;
      field.querySelectorAll('input,select,textarea').forEach(control=>{control.disabled=!active});
    });
    form.classList.toggle('has-inquiry-type',Boolean(type));
  }
  radios.forEach(radio=>radio.addEventListener('change',updateType));
  if(initialType){
    const radio=radios.find(r=>r.value===initialType);
    if(radio)radio.checked=true;
  }
  if(selectedProgram){
    const field=initialType==='adoption'?form.elements.product:form.elements.program;
    if(field)field.value=selectedProgram;
  }
  updateType();

  form.addEventListener('submit',event=>{
    event.preventDefault();
    if(!form.reportValidity())return;
    const type=typeOf();
    if(!type)return;
    const fields=[
      ['기관명','organization'],['담당자','person'],['연락처','phone'],['이메일','email'],
      ['대상·참여 규모','audience'],['희망 주제·프로그램','program'],
      ['관심 제품·서비스','product'],['희망 일정','date'],['예산 범위','budget'],
      ['구매 방식','purchase'],['문의 내용','message']
    ];
    const body=['문의 유형: '+typeNames[type],...fields.filter(([,name])=>!form.elements[name]?.disabled).map(([label,name])=>label+': '+(form.elements[name].value.trim()||'미기재')),'','※ 본 메일을 직접 발송해야 문의가 접수됩니다.'].join('\n');
    const subject='[사자가온다 '+typeNames[type]+'] '+(form.elements.organization.value.trim()||'기관 문의');
    window.location.href='mailto:info@sjgod.kr?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
  });
})();