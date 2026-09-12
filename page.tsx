"use client";
import { useState } from "react";

type Tool = { icon:string; name:string; description:string; placeholder:string; label:string };
const tools: Tool[] = [
 {icon:"✍️",name:"Criador de Conteúdo",description:"Crie posts, legendas e ideias.",placeholder:"Ex.: conteúdo para uma agência de design",label:"O que você quer criar?"},
 {icon:"🎯",name:"Estratégias",description:"Gere estratégias para vender e crescer.",placeholder:"Ex.: estratégia para vender serviços de design",label:"Qual é seu objetivo?"},
 {icon:"💡",name:"Ideias de Negócios",description:"Encontre oportunidades com IA.",placeholder:"Ex.: tenho R$ 500 e sei trabalhar com design",label:"Conte seus recursos e habilidades"},
 {icon:"🧠",name:"Gerador de Prompts",description:"Transforme objetivos em prompts.",placeholder:"Ex.: criar conteúdo que gera clientes",label:"Qual tarefa você quer transformar em prompt?"},
 {icon:"📚",name:"Biblioteca de Prompts",description:"Modelos por objetivo.",placeholder:"Ex.: marketing para restaurante",label:"Qual assunto você procura?"},
 {icon:"⚙️",name:"Automações",description:"Planeje tarefas automatizadas.",placeholder:"Ex.: automatizar atendimento de clientes",label:"Qual processo você quer automatizar?"}
];

export default function Home(){
 const [active,setActive]=useState<Tool | null>(null);
 const [input,setInput]=useState(""); const [result,setResult]=useState("");
 const [loading,setLoading]=useState(false); const [message,setMessage]=useState("");
 const current=active || tools[1];
 async function generate(){
   const value=input.trim(); if(!value){setMessage("Digite uma ideia ou objetivo para continuar.");return;}
   setLoading(true);setResult("");setMessage("");
   try{
    const res=await fetch("/api/generate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({tool:current.name,input:value})});
    const data=await res.json(); if(!res.ok) throw new Error(data.error||"Erro ao gerar.");
    setResult(data.text); if(data.message) setMessage(data.message);
   }catch(e){setMessage(e instanceof Error?e.message:"Erro inesperado.");}
   finally{setLoading(false);}
 }
 function openTool(tool:Tool){setActive(tool);setInput("");setResult("");setMessage(""); window.scrollTo({top:0,behavior:"smooth"});}
 return <main>
  <aside>
   <button className="logo" onClick={()=>setActive(null)}><b>IA</b> LUCRATIVA</button>
   <nav>{["Início","Ferramentas IA","Prompts","Oportunidades","Guias","Planos","Minha conta"].map(x=><button key={x} onClick={()=>x==="Início"?setActive(null):setMessage(`${x}: módulo em expansão na V1.2.`)}>{x}</button>)}</nav>
   <div className="card"><small>SEU PLANO</small><strong>FREE</strong><p>10 créditos disponíveis</p><button onClick={()=>setMessage("Planos premium poderão ser configurados na próxima etapa.")}>Ver planos →</button></div>
  </aside>
  <section className="content">
   <header><div><label>PLATAFORMA V1.2</label><h1>{active ? <>{active.name} <span>com IA.</span></> : <>Transforme IA em <span>oportunidades.</span></>}</h1><p>{active?active.description:"Ferramentas, prompts e estratégias para criar, vender e crescer usando inteligência artificial."}</p></div><div className="user">IA</div></header>
   <div className="stats">{[["CRÉDITOS","10"],["FERRAMENTAS","06"],["PROMPTS","50+"],["PLANO","FREE"]].map(x=><div key={x[0]}><small>{x[0]}</small><b>{x[1]}</b></div>)}</div>
   <section className="panel laboratory"><label>{active?"FERRAMENTA ATIVA":"PRIMEIRO LABORATÓRIO"}</label><h2>{active?current.label:"Comece uma ideia agora"}</h2><p>Digite um nicho, produto ou objetivo e receba uma resposta personalizada.</p><div className="row"><input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&generate()} placeholder={active?current.placeholder:"Ex.: restaurante, loja, designer..."}/><button className="primary" onClick={generate} disabled={loading}>{loading?"Gerando...":active?"Gerar com IA":"Gerar estratégia"}</button></div>
   {message&&<div className="notice">{message}</div>}{result&&<div className="result"><b>{current.name}</b><p className="answer">{result}</p></div>}
   </section>
   <div className="title"><div><label>CENTRAL DE FERRAMENTAS</label><h2>O que você quer criar?</h2></div>{active&&<button onClick={()=>setActive(null)}>← Voltar ao início</button>}</div>
   <div className="grid">{tools.map(t=><button className={`tool ${active?.name===t.name?"selected":""}`} key={t.name} onClick={()=>openTool(t)}><i>{t.icon}</i><h3>{t.name}</h3><p>{t.description}</p><span>Explorar →</span></button>)}</div>
   <div className="bottom"><section className="panel"><label>DESTAQUE</label><h2>Biblioteca de prompts</h2><p>Modelos prontos para conteúdo, vendas e produtividade.</p><button className="primary" onClick={()=>openTool(tools[4])}>Explorar prompts</button></section><section className="panel"><label>OPORTUNIDADES</label><h2>Encontre uma ideia de negócio</h2><p>Comece com seus recursos e objetivos.</p><button onClick={()=>openTool(tools[2])}>Gerar oportunidade →</button></section></div>
   <footer>© 2026 IA LUCRATIVA · V1.2</footer>
  </section>
 </main>
}
