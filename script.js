(function(){
  const cfg = window.__CONFIG__ || {};
  const target = new Date('2025-12-13T13:00:00+01:00');
  const pad = n => String(n).padStart(2,'0');
  function tick(){
    const s = Math.max(0, Math.floor((target - new Date())/1000));
    const d = Math.floor(s/86400), h = Math.floor((s%86400)/3600), m = Math.floor((s%3600)/60), ss = s%60;
    document.getElementById('cd-d').textContent = pad(d);
    document.getElementById('cd-h').textContent = pad(h);
    document.getElementById('cd-m').textContent = pad(m);
    document.getElementById('cd-s').textContent = pad(ss);
  }
  setInterval(tick, 1000); tick();

  const copy = id => navigator.clipboard.writeText(document.getElementById(id).textContent.trim()).then(()=>alert('Copiado'));
  document.getElementById('copy-iban')?.addEventListener('click', ()=>copy('iban-text'));
  document.getElementById('copy-bizum')?.addEventListener('click', ()=>copy('bizum-text'));

  document.getElementById('btn-ics')?.addEventListener('click', ()=>{
    const ics = [
      'BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Boda Carla y Alejandro//ES',
      'BEGIN:VEVENT','UID:cya-ceremonia-20251213','DTSTAMP:20251102T120000Z',
      'DTSTART:20251213T120000Z','DTEND:20251213T130000Z',
      'SUMMARY:Ceremonia · Carla y Alejandro',
      'LOCATION:Saló de Cent, Ajuntament de Barcelona, Plaça de Sant Jaume, 1, 08002 Barcelona',
      'DESCRIPTION:Ceremonia civil de Carla y Alejandro en el Saló de Cent.',
      'END:VEVENT','END:VCALENDAR'
    ].join('\r\n');
    const blob = new Blob([ics],{type:'text/calendar;charset=utf-8'});
    const url = URL.createObjectURL(blob); const a = document.createElement('a');
    a.href = url; a.download = 'Carla-Alejandro-ceremonia.ics'; a.click();
    setTimeout(()=>URL.revokeObjectURL(url), 1500);
  });

  const form = document.getElementById('rsvp-form');
  const status = document.getElementById('form-status');
  if(form){
    form.addEventListener('submit', async (e)=>{
      e.preventDefault();
      status.textContent = 'Enviando…';
      const fd = new FormData(form);
      if(!fd.get('consent')){ status.textContent='Debes aceptar el RGPD.'; return; }
      try{
        await fetch(cfg.RSVP_ENDPOINT, {
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body: JSON.stringify({
            name: fd.get('name')?.trim(),
            email: fd.get('email')?.trim()?.toLowerCase(),
            companions: Number(fd.get('companions')||0),
            diet: (fd.get('diet')||'').trim()
          })
        });
        status.textContent = '¡Gracias! Te hemos enviado un email de confirmación.';
        form.reset();
      }catch(err){
        status.textContent = 'Ha habido un problema. Inténtalo de nuevo en unos minutos.';
      }
    });
  }
})();