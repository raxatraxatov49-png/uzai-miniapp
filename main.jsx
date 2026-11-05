import React, {useEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import './style.css';

function App(){
 const [messages,setMessages]=useState(()=>{try{return JSON.parse(localStorage.getItem('uzai-history')||'[]')}catch{return[]}});
 const [text,setText]=useState('');
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState('');
 const end=useRef(null);
 useEffect(()=>{localStorage.setItem('uzai-history',JSON.stringify(messages));end.current?.scrollIntoView({behavior:'smooth'});},[messages]);
 const send=async(value=text)=>{
  const q=value.trim(); if(!q||busy)return;
  const next=[...messages,{role:'user',content:q}]; setMessages(next);setText('');setError('');setBusy(true);
  try{
   const r=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:next})});
   const d=await r.json(); if(!r.ok)throw new Error(d.error||'Xatolik');
   setMessages([...next,{role:'assistant',content:d.reply}]);
  }catch(e){setError(e.message||'Internet bilan bog‘lanishda xatolik');}
  finally{setBusy(false);}
 };
 const clear=()=>{if(confirm('Barcha suhbat tarixini o‘chirasizmi?'))setMessages([])};
 return <div className="app">
  <header><div className="logo">✦</div><div><b>UzAI</b><small>Sun’iy intellekt yordamchingiz</small></div><button className="clear" onClick={clear} aria-label="Yangi chat">＋</button></header>
  <main>
   {messages.length===0?<section className="welcome"><div className="orb">✦</div><h1>Salom! Men UzAI</h1><p>Sizga qanday yordam bera olaman?</p><div className="suggestions">{['Menga biznes g‘oya ber','Ingliz tilini o‘rgat','Python kod yozib ber','Biror matnni tarjima qil'].map(s=><button onClick={()=>send(s)}>{s} <span>↗</span></button>)}</div></section>:messages.map((m,i)=><div className={'msg '+m.role} key={i}><div className="avatar">{m.role==='user'?'S':'✦'}</div><div className="bubble">{m.content}</div></div>)}
   {busy&&<div className="typing"><span></span><span></span><span></span></div>}
   {error&&<div className="error">{error}</div>}<div ref={end}/>
  </main>
  <footer><form onSubmit={e=>{e.preventDefault();send()}}><textarea value={text} onChange={e=>setText(e.target.value)} placeholder="UzAI ga xabar yozing..." rows="1" onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send()}}}/><button disabled={!text.trim()||busy} aria-label="Yuborish">↑</button></form><small>UzAI xato qilishi mumkin. Muhim ma’lumotlarni tekshiring.</small></footer>
 </div>
}
createRoot(document.getElementById('root')).render(<App/>);
