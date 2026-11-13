(() => {
  const heroAsset=(window.SJGOD_ASSETS||[]).find(x=>x.id===1);
  const hero=document.querySelector('[data-home-hero]');
  if(hero && heroAsset) hero.style.backgroundImage='url("'+heroAsset.url+'")';
  const form=document.getElementById('inquiry-form');
  if(!form)return;
  const params=new URLSearchParams(location.search);
  const selected=params.get('program');
  if(selected)form.elements.program.value=selected;
  form.addEventListener('submit',event=>{
    event.preventDefault();
    if(!form.reportValidity())return;
    const fields=[['기관명','organization'],['담당자','person'],['연락처','phone'],['대상','audience'],['희망 프로그램','program'],['희망 일정','date'],['예산 범위','budget'],['구매 방식','purchase'],['요청 사항','message']];
    const body=fields.map(([label,name])=>label+': '+(form.elements[name].value.trim()||'미기재')).join('\n')+'\n\n이메일로 문의내용을 작성합니다. 실제 발송 전 이메일 내용을 확인해 주세요.';
    const subject='[사자가온다 도입 문의] '+(form.elements.organization.value.trim()||'기관 문의');
    window.location.href='mailto:info@sjgod.kr?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
  });
})();