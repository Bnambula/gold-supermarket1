import React, { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════
   DESIGN TOKENS — dark theme matching wireframe
═══════════════════════════════════════════════════ */
const T = {
  bg:"#111111", bgCard:"#1C1C1C", bgElevated:"#242424", bgInput:"#2A2A2A",
  border:"#2E2E2E",
  gold:"#F5B800", goldDark:"#D49A00", goldLight:"#FFD84D",
  red:"#C0001E", redDark:"#8B0015",
  green:"#22C55E", greenDark:"#16A34A",
  white:"#FFFFFF",
  textPrimary:"#F0F0F0", textSecondary:"#9A9A9A", textMuted:"#484848",
};
const FONT = "'Sora','Nunito',sans-serif";
const mkSKU = (c,u) => `PDT-${c}-${u}`;
const ugx = n => `UGX ${Number(n).toLocaleString()}`;

/* ═══════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════ */
const INIT_CATS = [
  {id:"FG",name:"Food & Groceries",icon:"🌾",color:"#E86A00",image:null},
  {id:"BV",name:"Beverages",       icon:"🥤",color:"#1565C0",image:null},
  {id:"HC",name:"Household",       icon:"🧴",color:"#2E7D32",image:null},
  {id:"PC",name:"Personal & Baby", icon:"👶",color:"#7B1FA2",image:null},
  {id:"SK",name:"Snacks & Spices", icon:"🍪",color:"#C0001E",image:null},
];
const INIT_PRODUCTS = [
  {sku:mkSKU("FG01","SWTR"),name:"SWT MB Long Grain Rice (UG)",variant:"5KG",      cat:"FG",price:23200,origPrice:24400,stock:42,unit:"bag",   image:null,emoji:"🌾",express:true, discount:5, badge:"Popular"},
  {sku:mkSKU("FG01","MGMF"),name:"Maganjo Maize Flour",         variant:"2KG",      cat:"FG",price:7500, origPrice:8000, stock:55,unit:"pack",  image:null,emoji:"🌽",express:true, discount:6, badge:"Local"},
  {sku:mkSKU("FG01","INDO"),name:"Indomie Noodles Chicken",      variant:"70g×40pcs",cat:"FG",price:32000,origPrice:35500,stock:20,unit:"carton",image:null,emoji:"🍜",express:true, discount:10,badge:"Flash"},
  {sku:mkSKU("FG02","KKSG"),name:"Kakira Sugar",                 variant:"10KG",     cat:"FG",price:35000,origPrice:36300,stock:30,unit:"bag",   image:null,emoji:"🍬",express:false,discount:3, badge:null},
  {sku:mkSKU("FG02","SNSD"),name:"Sunseed Sunflower Oil",        variant:"3L",       cat:"FG",price:27800,origPrice:31200,stock:25,unit:"bottle",image:null,emoji:"🛢️",express:false,discount:11,badge:"Sale"},
  {sku:mkSKU("FG02","STRF"),name:"Star Fry Cooking Oil",         variant:"12×1L",    cat:"FG",price:82800,origPrice:92000,stock:6, unit:"carton",image:null,emoji:"🛢️",express:false,discount:10,badge:null},
  {sku:mkSKU("BV01","RHMN"),name:"Riham Oner Mango Juice",       variant:"300ml×12", cat:"BV",price:14600,origPrice:16700,stock:28,unit:"carton",image:null,emoji:"🥭",express:true, discount:13,badge:"Flash"},
  {sku:mkSKU("BV01","RHAP"),name:"Riham Oner Apple Juice",       variant:"300ml×12", cat:"BV",price:14600,origPrice:16700,stock:22,unit:"carton",image:null,emoji:"🍎",express:true, discount:13,badge:"Flash"},
  {sku:mkSKU("BV01","COLA"),name:"Coca-Cola",                    variant:"500ml",    cat:"BV",price:2000, origPrice:2200, stock:50,unit:"bottle",image:null,emoji:"🥤",express:true, discount:9, badge:null},
  {sku:mkSKU("BV03","JESA"),name:"Jesa UHT Low Fat Milk",        variant:"500ml×12", cat:"BV",price:22500,origPrice:25200,stock:20,unit:"carton",image:null,emoji:"🥛",express:true, discount:11,badge:"Top Offer"},
  {sku:mkSKU("BV03","FDST"),name:"Fresh Dairy Strawberry Milk",  variant:"250ml×12", cat:"BV",price:16800,origPrice:18400,stock:14,unit:"carton",image:null,emoji:"🍓",express:true, discount:9, badge:null},
  {sku:mkSKU("BV02","JMWK"),name:"Jameson Irish Whiskey",        variant:"750ml",    cat:"BV",price:88900,origPrice:98000,stock:8, unit:"bottle",image:null,emoji:"🥃",express:false,discount:10,badge:null},
  {sku:mkSKU("HC01","MDET"),name:"Magic Detergent Blue Breeze",  variant:"10KG",     cat:"HC",price:39400,origPrice:43700,stock:15,unit:"bucket",image:null,emoji:"🧺",express:false,discount:10,badge:"Top Offer"},
  {sku:mkSKU("HC02","JIK2"),name:"Jik Bleach Twin Pack",         variant:"750ml×2",  cat:"HC",price:21200,origPrice:23000,stock:22,unit:"pack",  image:null,emoji:"🧽",express:false,discount:8, badge:null},
  {sku:mkSKU("HC03","EUTP"),name:"Eurotop Toilet Paper",         variant:"10 rolls", cat:"HC",price:12500,origPrice:14000,stock:40,unit:"pack",  image:null,emoji:"🧻",express:false,discount:11,badge:null},
  {sku:mkSKU("PC01","DTTL"),name:"Dettol Antibacterial Soap",    variant:"175g",     cat:"PC",price:4800, origPrice:5200, stock:50,unit:"bar",   image:null,emoji:"🧼",express:true, discount:8, badge:null},
  {sku:mkSKU("PC02","PMPS"),name:"Pampers Diapers",              variant:"Size S-44",cat:"PC",price:42000,origPrice:46000,stock:12,unit:"pack",  image:null,emoji:"👶",express:false,discount:9, badge:"Top Offer"},
  {sku:mkSKU("PC02","HGSM"),name:"Huggies Diapers",              variant:"Size M-40",cat:"PC",price:45000,origPrice:50000,stock:9, unit:"pack",  image:null,emoji:"👶",express:false,discount:10,badge:"Top Offer"},
  {sku:mkSKU("SK01","RYCO"),name:"Royco Mchuzi Mix Chicken",     variant:"200g×2",   cat:"SK",price:9700, origPrice:10700,stock:40,unit:"pack",  image:null,emoji:"🍲",express:true, discount:10,badge:"Top Offer"},
  {sku:mkSKU("SK02","SUMZ"),name:"Sumz Rings & Crisps",          variant:"Multi×10", cat:"SK",price:5000, origPrice:5800, stock:35,unit:"pack",  image:null,emoji:"🍟",express:true, discount:14,badge:"Flash"},
  {sku:mkSKU("SK02","GNTS"),name:"Roasted Groundnuts",           variant:"500g",     cat:"SK",price:6500, origPrice:7000, stock:20,unit:"pack",  image:null,emoji:"🥜",express:true, discount:7, badge:"Local"},
];
const INIT_RIDERS = [
  {id:"R1",name:"Kato Denis",   phone:"0774123456",bike:"UAX 123G",branch:"Kitintale",status:"available",rating:4.8,deliveries:12,photo:null},
  {id:"R2",name:"Nakato Sarah", phone:"0755987654",bike:"UAB 456H",branch:"Mile 8",   status:"busy",     rating:4.9,deliveries:8, photo:null},
  {id:"R3",name:"Mugisha Brian",phone:"0701456789",bike:"UBG 789K",branch:"Kitintale",status:"available",rating:4.7,deliveries:15,photo:null},
];
const INIT_ORDERS = [
  {id:"OGS250326001",customer:"Aisha Namukasa",  phone:"0772345678",items:[{name:"SWT MB Rice",qty:2,price:23200},{name:"Royco Mix",qty:1,price:9700}], total:60100,fee:3000,location:"Ntinda", dist:2.1,branch:"Kitintale",status:"pending",   txId:"MOM12345678",rider:null,ts:"09:14",payMethod:"mtn"},
  {id:"OGS250326002",customer:"Robert Ssempala", phone:"0753678901",items:[{name:"Sunseed Oil",qty:1,price:27800},{name:"Kakira Sugar",qty:1,price:35000}],total:66800,fee:4000,location:"Kireka", dist:4.2,branch:"Mile 8",   status:"verified",  txId:"AIR87654321",rider:"R3",ts:"09:32",payMethod:"airtel"},
  {id:"OGS250326003",customer:"Grace Akello",    phone:"0700234567",items:[{name:"Mineral Water",qty:6,price:2500}],                                    total:19000,fee:4000,location:"Bukoto", dist:3.8,branch:"Kitintale",status:"on_the_way",txId:"MOM99887766",rider:"R1",ts:"08:55",payMethod:"mtn"},
  {id:"OGS250326004",customer:"Banura Emmanuel", phone:"0781234567",items:[{name:"Pampers S",qty:1,price:42000},{name:"Baby Wipes",qty:2,price:8500}],  total:63000,fee:6000,location:"Mutungo",dist:6.1,branch:"Kitintale",status:"delivered",  txId:"MOM77665544",rider:"R2",ts:"08:10",payMethod:"mtn"},
];

/* ═══════════════════════════════════════════════════
   SHARED COMPONENTS
═══════════════════════════════════════════════════ */
function ProdImg({image,emoji,size=48,radius=10}) {
  return image
    ? <img src={image} alt="" style={{width:size,height:size,borderRadius:radius,objectFit:"cover",flexShrink:0}}/>
    : <div style={{width:size,height:size,borderRadius:radius,background:T.bgElevated,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.55,flexShrink:0}}>{emoji}</div>;
}

function StatusPill({status}) {
  const M={pending:{label:"⏳ Pending",bg:"#2D2000",c:T.gold},verified:{label:"✓ Verified",bg:"#002D1A",c:T.green},on_the_way:{label:"🏍 On the Way",bg:"#002D1A",c:T.green},delivered:{label:"✅ Delivered",bg:"#1A1A1A",c:"#777"},cancelled:{label:"✕ Cancelled",bg:"#2D0000",c:T.red},available:{label:"● Available",bg:"#002D1A",c:T.green},busy:{label:"● Busy",bg:"#2D0000",c:T.red},offline:{label:"● Offline",bg:"#1A1A1A",c:"#777"},new:{label:"🆕 New",bg:"#001830",c:"#60A5FA"}};
  const s=M[status]||M.pending;
  return <span style={{background:s.bg,color:s.c,padding:"4px 10px",borderRadius:20,fontSize:11,fontWeight:700,whiteSpace:"nowrap"}}>{s.label}</span>;
}

const Btn = ({children,onClick,style={},small,outline,danger,full}) => (
  <button onClick={onClick} style={{background:danger?T.red:outline?"transparent":T.gold,color:danger?"#fff":outline?T.gold:T.bg,border:outline?`1.5px solid ${T.gold}`:danger?`1.5px solid ${T.red}`:"none",borderRadius:10,padding:small?"6px 12px":"11px 20px",fontWeight:800,fontSize:small?11:13,cursor:"pointer",fontFamily:FONT,whiteSpace:"nowrap",width:full?"100%":undefined,...style}}>{children}</button>
);

const Fld = ({label,value,onChange,placeholder,type="text",style={}}) => (
  <div style={{marginBottom:10}}>
    {label&&<div style={{fontSize:10,fontWeight:700,color:T.textSecondary,marginBottom:4,textTransform:"uppercase",letterSpacing:0.5}}>{label}</div>}
    <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{width:"100%",background:T.bgInput,border:`1px solid ${T.border}`,borderRadius:10,padding:"10px 13px",color:T.textPrimary,fontSize:13,outline:"none",fontFamily:FONT,boxSizing:"border-box",...style}}/>
  </div>
);

function ImgUpload({current,onUpload,label="Upload",size=64,radius=10}) {
  const ref=useRef();
  const handle=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>onUpload(ev.target.result);r.readAsDataURL(f);};
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
      <div onClick={()=>ref.current.click()} style={{width:size,height:size,borderRadius:radius,background:T.bgInput,border:`2px dashed ${T.gold}55`,cursor:"pointer",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
        {current?<img src={current} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:size*0.38}}>📷</span>}
      </div>
      <input ref={ref} type="file" accept="image/*" style={{display:"none"}} onChange={handle}/>
      <span style={{fontSize:9,color:T.textSecondary,cursor:"pointer"}} onClick={()=>ref.current.click()}>{label}</span>
    </div>
  );
}

function Sheet({open,onClose,title,children}) {
  if(!open)return null;
  return (
    <div style={{position:"fixed",inset:0,zIndex:300,display:"flex",flexDirection:"column",justifyContent:"flex-end"}}>
      <div onClick={onClose} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.75)"}}/>
      <div style={{position:"relative",background:T.bgCard,borderRadius:"20px 20px 0 0",maxHeight:"92vh",overflowY:"auto",animation:"su .25s ease"}}>
        <style>{`@keyframes su{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 18px 12px",borderBottom:`1px solid ${T.border}`,position:"sticky",top:0,background:T.bgCard,zIndex:1}}>
          <span style={{fontWeight:800,fontSize:16,color:T.textPrimary}}>{title}</span>
          <button onClick={onClose} style={{background:T.bgInput,border:"none",color:T.textSecondary,width:30,height:30,borderRadius:"50%",cursor:"pointer",fontSize:16}}>✕</button>
        </div>
        <div style={{padding:"14px 18px 32px"}}>{children}</div>
      </div>
    </div>
  );
}

function Toggle({on,onChange,label}) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>onChange(!on)}>
      <div style={{width:42,height:24,borderRadius:12,background:on?T.green:T.bgInput,position:"relative",transition:"background .2s",flexShrink:0}}>
        <div style={{position:"absolute",top:3,left:on?21:3,width:18,height:18,borderRadius:"50%",background:"#fff",transition:"left .2s",boxShadow:"0 1px 4px rgba(0,0,0,0.3)"}}/>
      </div>
      {label&&<span style={{fontSize:12,color:T.textSecondary}}>{label}</span>}
    </div>
  );
}

function useCountdown() {
  const [t,setT]=useState(12*3600+40*60+17);
  useEffect(()=>{const id=setInterval(()=>setT(x=>x>0?x-1:0),1000);return()=>clearInterval(id);},[]);
  return {h:String(Math.floor(t/3600)).padStart(2,"0"),m:String(Math.floor((t%3600)/60)).padStart(2,"0"),s:String(t%60).padStart(2,"0")};
}

/* ═══════════════════════════════════════════════════
   PRODUCT CARD
═══════════════════════════════════════════════════ */
function ProdCard({p,cart,add,rem,onTap,cats}) {
  const qty=cart[p.sku]||0, out=p.stock===0;
  const cat=cats?.find(c=>c.id===p.cat);
  return (
    <div onClick={()=>onTap(p)} style={{background:T.bgCard,borderRadius:14,overflow:"hidden",border:`1.5px solid ${qty?T.gold:T.border}`,cursor:"pointer",display:"flex",flexDirection:"column",transition:"border-color .15s"}}>
      <div style={{height:115,background:T.bgElevated,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>
        {p.image?<img src={p.image} alt={p.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:50}}>{p.emoji}</span>}
        {p.badge==="Flash"&&<div style={{position:"absolute",top:7,left:7,background:T.red,color:"#fff",fontSize:8,fontWeight:900,padding:"2px 6px",borderRadius:8}}>⚡FLASH</div>}
        {p.badge&&p.badge!=="Flash"&&<div style={{position:"absolute",top:7,left:7,background:cat?.color||T.gold,color:"#fff",fontSize:8,fontWeight:800,padding:"2px 6px",borderRadius:8}}>{p.badge}</div>}
        {p.express&&<div style={{position:"absolute",top:7,right:7,background:"rgba(0,0,0,0.7)",borderRadius:8,padding:"2px 6px",fontSize:8,color:T.gold,fontWeight:800}}>⚡30min</div>}
        {p.discount>0&&<div style={{position:"absolute",bottom:7,right:7,background:T.green,color:"#fff",fontSize:9,fontWeight:900,padding:"2px 7px",borderRadius:10}}>-{p.discount}%</div>}
        {out&&<div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.65)",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{color:"#fff",fontWeight:800,fontSize:11}}>Out of Stock</span></div>}
        {!out&&p.stock<=5&&<div style={{position:"absolute",bottom:7,left:7,background:"#FF8C00",color:"#fff",fontSize:8,fontWeight:700,padding:"2px 5px",borderRadius:8}}>Only {p.stock}!</div>}
      </div>
      <div style={{padding:"9px 9px 11px",flex:1,display:"flex",flexDirection:"column"}}>
        <div style={{fontSize:8,color:T.textMuted,fontFamily:"monospace",marginBottom:2}}>{p.sku}</div>
        <div style={{fontWeight:700,fontSize:11,color:T.textPrimary,lineHeight:1.3,marginBottom:2,flex:1}}>{p.name}</div>
        <div style={{fontSize:9,color:T.textSecondary,marginBottom:5}}>{p.variant}</div>
        <div style={{color:T.gold,fontWeight:900,fontSize:13}}>{ugx(p.price)}</div>
        {p.origPrice>p.price&&<div style={{fontSize:9,color:T.textMuted,textDecoration:"line-through"}}>{ugx(p.origPrice)}</div>}
        {!out&&(
          <div style={{marginTop:7}}>
            {qty===0
              ?<button onClick={e=>{e.stopPropagation();add(p.sku);}} style={{width:"100%",background:T.gold,border:"none",borderRadius:8,color:T.bg,fontWeight:800,fontSize:12,padding:"7px 0",cursor:"pointer",fontFamily:FONT}}>+ Add</button>
              :<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:T.bgInput,borderRadius:8,padding:"2px 4px"}} onClick={e=>e.stopPropagation()}>
                <button onClick={()=>rem(p.sku)} style={{background:"none",border:"none",color:T.gold,fontSize:20,cursor:"pointer",fontWeight:900,padding:"0 6px",fontFamily:FONT}}>−</button>
                <span style={{fontWeight:900,color:T.textPrimary,fontSize:15}}>{qty}</span>
                <button onClick={()=>add(p.sku)} style={{background:"none",border:"none",color:T.gold,fontSize:20,cursor:"pointer",fontWeight:900,padding:"0 6px",fontFamily:FONT}}>+</button>
              </div>}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   CUSTOMER APP
═══════════════════════════════════════════════════ */
function CustomerApp({products,categories,onAdminUnlock}) {
  const [screen,setScreen]=useState("home");
  const [cat,setCat]=useState("all");
  const [search,setSearch]=useState("");
  const [cart,setCart]=useState({});
  const [txId,setTxId]=useState("");
  const [payMethod,setPayMethod]=useState("mtn");
  const [placedOrder,setPlacedOrder]=useState(null);
  const [detailProd,setDetailProd]=useState(null);
  const [lockTaps,setLockTaps]=useState(0);
  const [focused,setFocused]=useState(false);
  const {h,m,s}=useCountdown();

  const add=sku=>setCart(c=>({...c,[sku]:(c[sku]||0)+1}));
  const rem=sku=>setCart(c=>{const n={...c};if(n[sku]>1)n[sku]--;else delete n[sku];return n;});
  const cartCount=Object.values(cart).reduce((a,b)=>a+b,0);
  const cartItems=Object.entries(cart).map(([sku,qty])=>({...products.find(p=>p.sku===sku),qty})).filter(i=>i.sku);
  const subtotal=cartItems.reduce((s,i)=>s+i.price*i.qty,0);
  const fee=4000,total=subtotal+fee;

  const lockTap=()=>{const n=lockTaps+1;setLockTaps(n);if(n>=5){onAdminUnlock();setLockTaps(0);}};

  const placeOrder=()=>{
    if(!txId.trim())return alert("Enter your transaction ID");
    const o={id:`OGS${Date.now().toString().slice(-6)}`,customer:"You",phone:"07XXXXXXXX",items:cartItems.map(i=>({name:i.name,qty:i.qty,price:i.price})),total,fee,location:"Your Location",dist:3.2,branch:"Kitintale",status:"pending",txId:txId.trim(),rider:null,ts:new Date().toLocaleTimeString("en-UG",{hour:"2-digit",minute:"2-digit"}),payMethod};
    setPlacedOrder(o);setCart({});setTxId("");setScreen("tracking");
  };

  const filtered=products.filter(p=>{
    const inCat=cat==="all"||p.cat===cat;
    const q=search.toLowerCase();
    const inSearch=!search||p.name.toLowerCase().includes(q)||p.sku.toLowerCase().includes(q)||p.variant.toLowerCase().includes(q);
    return inCat&&inSearch;
  });
  const flashItems=products.filter(p=>p.badge==="Flash"&&p.stock>0);

  const Nav=()=>(
    <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:T.bgCard,borderTop:`1px solid ${T.border}`,display:"flex",zIndex:90}}>
      {[["home","🏠","Home"],["cart","🛒",cartCount>0?`Cart (${cartCount})`:"Cart"],["tracking","📦","Orders"],["lock","🔒","Staff"]].map(([id,ico,lbl])=>{
        const active=(screen===id)||(screen==="detail"&&id==="home");
        return <button key={id} onClick={id==="lock"?lockTap:()=>setScreen(id)} style={{flex:1,background:"none",border:"none",padding:"10px 4px 8px",display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer",color:active?T.gold:T.textSecondary,fontFamily:FONT}}>
          <span style={{fontSize:19}}>{ico}</span>
          <span style={{fontSize:9,fontWeight:700}}>{lbl}</span>
        </button>;
      })}
    </div>
  );

  // ── Detail
  if(detailProd) return (
    <div style={{fontFamily:FONT,background:T.bg,minHeight:"100vh",maxWidth:430,margin:"0 auto",color:T.textPrimary}}>
      <div style={{position:"relative"}}>
        <div style={{height:290,background:T.bgElevated,overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center"}}>
          {detailProd.image?<img src={detailProd.image} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:110}}>{detailProd.emoji}</span>}
        </div>
        <button onClick={()=>setDetailProd(null)} style={{position:"absolute",top:14,left:14,background:"rgba(0,0,0,0.65)",border:"none",borderRadius:"50%",width:38,height:38,color:"#fff",fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>←</button>
        {detailProd.discount>0&&<div style={{position:"absolute",top:14,right:14,background:T.green,color:"#fff",fontWeight:900,fontSize:13,padding:"4px 10px",borderRadius:12}}>-{detailProd.discount}%</div>}
      </div>
      <div style={{padding:"16px 16px 110px"}}>
        <div style={{fontSize:9,color:T.textMuted,fontFamily:"monospace",marginBottom:3}}>{detailProd.sku}</div>
        <h2 style={{fontWeight:900,fontSize:20,marginBottom:4,color:T.textPrimary}}>{detailProd.name}</h2>
        <div style={{fontSize:12,color:T.textSecondary,marginBottom:12}}>{detailProd.variant} · per {detailProd.unit}</div>
        <div style={{display:"flex",alignItems:"baseline",gap:10,marginBottom:8}}>
          <span style={{fontWeight:900,fontSize:26,color:T.gold}}>{ugx(detailProd.price)}</span>
          {detailProd.origPrice>detailProd.price&&<span style={{fontSize:14,color:T.textMuted,textDecoration:"line-through"}}>{ugx(detailProd.origPrice)}</span>}
        </div>
        {detailProd.express&&<div style={{display:"inline-flex",alignItems:"center",gap:6,background:"#2D1A00",border:`1px solid ${T.gold}44`,borderRadius:8,padding:"5px 12px",marginBottom:14,fontSize:12,color:T.gold}}>⚡ Express — arrives in 30 min</div>}
        <div style={{background:T.bgCard,borderRadius:12,padding:14,marginBottom:16}}>
          {[["SKU",detailProd.sku],["Category",categories.find(c=>c.id===detailProd.cat)?.name||detailProd.cat],["Unit",detailProd.unit],["Stock",detailProd.stock>0?`${detailProd.stock} available`:"Out of stock"]].map(([k,v])=>(
            <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${T.border}`,fontSize:12}}>
              <span style={{color:T.textSecondary}}>{k}</span><span style={{color:T.textPrimary,fontWeight:600}}>{v}</span>
            </div>
          ))}
        </div>
      </div>
      {detailProd.stock>0&&(
        <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:T.bgCard,borderTop:`1px solid ${T.border}`,padding:"12px 16px 20px"}}>
          {(cart[detailProd.sku]||0)===0
            ?<Btn full style={{padding:14,fontSize:15,borderRadius:12}} onClick={()=>add(detailProd.sku)}>+ Add to Cart</Btn>
            :<div style={{display:"flex",alignItems:"center",gap:12}}>
              <button onClick={()=>rem(detailProd.sku)} style={{width:46,height:46,borderRadius:12,background:T.bgInput,border:`1px solid ${T.border}`,color:T.gold,fontSize:24,cursor:"pointer",fontWeight:900}}>−</button>
              <span style={{flex:1,textAlign:"center",fontWeight:900,fontSize:20,color:T.textPrimary}}>{cart[detailProd.sku]}</span>
              <button onClick={()=>add(detailProd.sku)} style={{width:46,height:46,borderRadius:12,background:T.gold,border:"none",color:T.bg,fontSize:24,cursor:"pointer",fontWeight:900}}>+</button>
            </div>}
        </div>
      )}
    </div>
  );

  // ── Tracking
  if(screen==="tracking"){
    const order=placedOrder||INIT_ORDERS[2];
    const steps=["Order Placed","Payment Verified","Rider Assigned","On the Way","Delivered"];
    const si=["pending","verified","assigned","on_the_way","delivered"].indexOf(order.status);
    return (
      <div style={{fontFamily:FONT,background:T.bg,minHeight:"100vh",maxWidth:430,margin:"0 auto",color:T.textPrimary,paddingBottom:72}}>
        <div style={{background:T.bgCard,padding:"14px 16px",display:"flex",alignItems:"center",gap:12,borderBottom:`1px solid ${T.border}`}}>
          <button onClick={()=>setScreen("home")} style={{background:"none",border:"none",color:T.gold,fontSize:20,cursor:"pointer"}}>←</button>
          <span style={{fontWeight:800,fontSize:16}}>Track Order</span>
        </div>
        <div style={{padding:14}}>
          <div style={{background:`linear-gradient(135deg,${T.gold},${T.goldDark})`,borderRadius:16,padding:18,marginBottom:14}}>
            <div style={{fontSize:10,fontWeight:700,color:"rgba(0,0,0,0.45)",marginBottom:3}}>ORDER ID</div>
            <div style={{fontWeight:900,fontSize:22,color:T.bg}}>{order.id}</div>
            <div style={{marginTop:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <StatusPill status={order.status}/><span style={{fontSize:11,color:"rgba(0,0,0,0.4)"}}>{order.ts}</span>
            </div>
          </div>
          <div style={{background:T.bgCard,borderRadius:14,padding:16,marginBottom:12}}>
            {steps.map((step,i)=>{
              const done=i<=si;
              return <div key={step} style={{display:"flex",alignItems:"center",gap:12,marginBottom:i<steps.length-1?18:0}}>
                <div style={{width:28,height:28,borderRadius:"50%",background:done?T.gold:T.bgInput,border:i===si+1?`2px solid ${T.gold}`:"none",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:900,color:done?T.bg:T.textMuted,flexShrink:0}}>{done?"✓":i+1}</div>
                <span style={{fontWeight:done?700:400,color:done?T.textPrimary:T.textSecondary,fontSize:13}}>{step}</span>
                {i===3&&order.status==="on_the_way"&&<span style={{marginLeft:"auto",fontSize:18}}>🏍️</span>}
              </div>;
            })}
          </div>
          <div style={{background:T.bgCard,borderRadius:14,padding:16,marginBottom:12}}>
            {order.items.map((it,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:5,color:T.textSecondary}}><span>{it.name} ×{it.qty}</span><span style={{color:T.textPrimary,fontWeight:700}}>{ugx(it.price*it.qty)}</span></div>)}
            <div style={{borderTop:`1px dashed ${T.border}`,marginTop:8,paddingTop:8}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:T.textSecondary,marginBottom:4}}><span>Delivery Fee</span><span>{ugx(order.fee)}</span></div>
              <div style={{display:"flex",justifyContent:"space-between",fontWeight:900,fontSize:15,color:T.gold}}><span>TOTAL</span><span>{ugx(order.total)}</span></div>
            </div>
          </div>
          <div style={{background:"#001830",border:`1px solid #1565C044`,borderRadius:12,padding:14,fontSize:12,color:"#60A5FA"}}>
            <b>📱 WhatsApp Updates Active</b><br/>You'll get alerts at each stage of your delivery.
          </div>
        </div>
        <Nav/>
      </div>
    );
  }

  // ── Checkout
  if(screen==="checkout") return (
    <div style={{fontFamily:FONT,background:T.bg,minHeight:"100vh",maxWidth:430,margin:"0 auto",color:T.textPrimary,paddingBottom:20}}>
      <div style={{background:T.bgCard,padding:"14px 16px",display:"flex",alignItems:"center",gap:12,borderBottom:`1px solid ${T.border}`}}>
        <button onClick={()=>setScreen("cart")} style={{background:"none",border:"none",color:T.gold,fontSize:20,cursor:"pointer"}}>←</button>
        <span style={{fontWeight:800,fontSize:16}}>Checkout</span>
      </div>
      <div style={{padding:14,display:"flex",flexDirection:"column",gap:12}}>
        <div style={{background:T.bgCard,borderRadius:14,padding:16,border:`1px solid ${T.border}`}}>
          <div style={{fontWeight:700,fontSize:13,marginBottom:10}}>📍 Delivery Location</div>
          <div style={{background:T.bgInput,borderRadius:10,padding:10,fontSize:12,color:T.textSecondary}}>📡 GPS: <b style={{color:T.textPrimary}}>Ntinda, 2.1km · Kitintale Branch</b></div>
          <div style={{marginTop:8,padding:"8px 12px",background:"#002D1A",borderRadius:8,fontSize:11,color:T.green,fontWeight:700}}>✅ Delivery available · Est. 28 min · Fee: {ugx(fee)}</div>
        </div>
        <div style={{background:T.bgCard,borderRadius:14,padding:16,border:`1px solid ${T.border}`}}>
          <div style={{fontWeight:700,fontSize:13,marginBottom:10}}>Order Summary</div>
          {cartItems.map((i,k)=><div key={k} style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:5,color:T.textSecondary}}><span>{i.name} ×{i.qty}</span><span style={{color:T.textPrimary}}>{ugx(i.price*i.qty)}</span></div>)}
          <div style={{borderTop:`1px solid ${T.border}`,marginTop:8,paddingTop:8}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:T.textSecondary,marginBottom:4}}><span>Subtotal</span><span>{ugx(subtotal)}</span></div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:T.textSecondary,marginBottom:4}}><span>Delivery Fee</span><span>{ugx(fee)}</span></div>
            <div style={{display:"flex",justifyContent:"space-between",fontWeight:900,fontSize:15,color:T.gold,marginTop:6}}><span>TOTAL</span><span>{ugx(total)}</span></div>
          </div>
        </div>
        <div style={{background:T.bgCard,borderRadius:14,padding:16,border:`1px solid ${T.border}`}}>
          <div style={{fontWeight:700,fontSize:13,marginBottom:12}}>💳 Payment Method</div>
          {[["mtn","📱","MTN Mobile Money","Send to: 0774 XXX XXX"],["airtel","📲","Airtel Money","Send to: 0755 XXX XXX"]].map(([id,ico,name,hint])=>(
            <div key={id} onClick={()=>setPayMethod(id)} style={{display:"flex",alignItems:"center",gap:12,padding:12,borderRadius:12,border:`2px solid ${payMethod===id?T.gold:T.border}`,marginBottom:8,cursor:"pointer",background:payMethod===id?"#2D1A00":T.bgInput}}>
              <span style={{fontSize:24}}>{ico}</span>
              <div><div style={{fontWeight:700,fontSize:13,color:T.textPrimary}}>{name}</div><div style={{fontSize:10,color:T.textSecondary}}>{hint}</div></div>
              {payMethod===id&&<span style={{marginLeft:"auto",color:T.gold,fontWeight:900,fontSize:18}}>✓</span>}
            </div>
          ))}
          <Fld label="Transaction ID" value={txId} onChange={setTxId} placeholder="e.g. MOM12345678" style={{fontFamily:"monospace",marginTop:4}}/>
        </div>
        <Btn full style={{padding:16,fontSize:15,borderRadius:14}} onClick={placeOrder}>👉 I HAVE PAID — PLACE ORDER</Btn>
      </div>
    </div>
  );

  // ── Cart
  if(screen==="cart") return (
    <div style={{fontFamily:FONT,background:T.bg,minHeight:"100vh",maxWidth:430,margin:"0 auto",color:T.textPrimary,paddingBottom:72}}>
      <div style={{background:T.bgCard,padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${T.border}`}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <button onClick={()=>setScreen("home")} style={{background:"none",border:"none",color:T.gold,fontSize:20,cursor:"pointer"}}>←</button>
          <span style={{fontWeight:800,fontSize:16}}>🛒 My Cart</span>
        </div>
        {cartItems.length>0&&<button onClick={()=>setCart({})} style={{background:"none",border:"none",color:T.red,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:FONT}}>Clear All</button>}
      </div>
      <div style={{padding:14}}>
        {cartItems.length===0
          ?<div style={{textAlign:"center",padding:"60px 20px",color:T.textSecondary}}>
            <div style={{fontSize:60,marginBottom:12}}>🛒</div>
            <div style={{fontWeight:700,fontSize:16,marginBottom:8,color:T.textPrimary}}>Your cart is empty</div>
            <Btn onClick={()=>setScreen("home")}>Browse Products</Btn>
          </div>
          :<>
            {cartItems.map(item=>(
              <div key={item.sku} style={{background:T.bgCard,borderRadius:14,padding:12,marginBottom:10,display:"flex",alignItems:"center",gap:12,border:`1px solid ${T.border}`}}>
                <ProdImg image={item.image} emoji={item.emoji} size={56} radius={10}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:700,fontSize:12,color:T.textPrimary,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.name}</div>
                  <div style={{fontSize:9,color:T.textSecondary}}>{item.variant}</div>
                  <div style={{color:T.gold,fontWeight:900,fontSize:13}}>{ugx(item.price)}</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <button onClick={()=>rem(item.sku)} style={{width:28,height:28,borderRadius:8,background:T.bgInput,border:`1px solid ${T.border}`,color:T.gold,fontWeight:900,cursor:"pointer",fontSize:14}}>−</button>
                  <span style={{fontWeight:900,fontSize:14,minWidth:20,textAlign:"center",color:T.textPrimary}}>{item.qty}</span>
                  <button onClick={()=>add(item.sku)} style={{width:28,height:28,borderRadius:8,background:T.gold,border:"none",color:T.bg,fontWeight:900,cursor:"pointer",fontSize:14}}>+</button>
                </div>
              </div>
            ))}
            <div style={{background:T.bgCard,borderRadius:14,padding:16,marginTop:8,border:`1px solid ${T.border}`}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:T.textSecondary,marginBottom:5}}><span>Subtotal ({cartCount} items)</span><span>{ugx(subtotal)}</span></div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:T.textSecondary}}><span>Est. Delivery</span><span>{ugx(fee)}</span></div>
              <div style={{display:"flex",justifyContent:"space-between",fontWeight:900,fontSize:16,color:T.gold,marginTop:8,paddingTop:8,borderTop:`1px solid ${T.border}`}}><span>TOTAL</span><span>{ugx(total)}</span></div>
            </div>
            <Btn full style={{padding:15,fontSize:15,borderRadius:14,marginTop:14}} onClick={()=>setScreen("checkout")}>Proceed to Checkout →</Btn>
          </>}
      </div>
      <Nav/>
    </div>
  );

  // ── HOME
  return (
    <div style={{fontFamily:FONT,background:T.bg,minHeight:"100vh",maxWidth:430,margin:"0 auto",color:T.textPrimary,paddingBottom:72}}>
      {/* Header */}
      <div style={{background:T.bgCard,padding:"12px 14px 10px",position:"sticky",top:0,zIndex:50,borderBottom:`1px solid ${T.border}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <img src="/logo.png" alt="Gold Supermarket" style={{height:38,objectFit:"contain"}} onError={e=>{e.target.style.display="none";}}/>
            <div>
              <div style={{fontWeight:900,fontSize:14,color:T.gold,lineHeight:1.1}}>GOLD SUPERMARKET</div>
              <div style={{fontSize:9,color:T.textSecondary}}>📍 Kitintale · Mile 8, Gayaza Rd</div>
            </div>
          </div>
          <button onClick={()=>setScreen("cart")} style={{background:T.gold,border:"none",borderRadius:20,padding:"7px 14px",fontWeight:800,fontSize:12,cursor:"pointer",color:T.bg,display:"flex",alignItems:"center",gap:6,fontFamily:FONT}}>
            🛒 {cartCount>0&&<span style={{background:T.red,color:"#fff",borderRadius:"50%",width:18,height:18,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:10,flexShrink:0}}>{cartCount}</span>}
          </button>
        </div>
        {/* Search */}
        <div style={{display:"flex",alignItems:"center",background:T.bgInput,borderRadius:30,padding:"0 14px",border:`1.5px solid ${focused?T.gold:T.border}`,transition:"border-color .2s"}}>
          <span style={{color:T.textSecondary}}>🔍</span>
          <input style={{border:"none",outline:"none",flex:1,padding:"10px 8px",fontSize:13,background:"transparent",fontFamily:FONT,color:T.textPrimary}} placeholder="Search products, SKU…" value={search} onChange={e=>setSearch(e.target.value)} onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}/>
          {search&&<button onClick={()=>setSearch("")} style={{background:"none",border:"none",cursor:"pointer",color:T.textSecondary,fontSize:16}}>✕</button>}
        </div>
      </div>

      {/* Category chips */}
      <div style={{display:"flex",gap:8,overflowX:"auto",padding:"12px 14px 4px",scrollbarWidth:"none"}}>
        {[{id:"all",name:"All",icon:"🛒",color:T.gold,image:null},...categories].map(c=>(
          <button key={c.id} onClick={()=>setCat(c.id)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,background:cat===c.id?`${T.gold}22`:"transparent",border:`1.5px solid ${cat===c.id?T.gold:T.border}`,borderRadius:12,padding:"8px 12px",cursor:"pointer",flexShrink:0,minWidth:60,transition:"all .15s"}}>
            {c.image?<img src={c.image} style={{width:26,height:26,borderRadius:6,objectFit:"cover"}} alt=""/>:<span style={{fontSize:20}}>{c.icon}</span>}
            <span style={{fontSize:10,fontWeight:700,color:cat===c.id?T.gold:T.textSecondary,whiteSpace:"nowrap"}}>{c.name==="All"?"All":c.name.split(" ")[0]}</span>
          </button>
        ))}
      </div>

      {/* Search results */}
      {search&&<div style={{padding:"8px 14px"}}>
        <div style={{fontSize:12,color:T.textSecondary,marginBottom:10}}>{filtered.length} result{filtered.length!==1?"s":""} for "<b style={{color:T.textPrimary}}>{search}</b>"</div>
        {filtered.length===0
          ?<div style={{textAlign:"center",padding:40,color:T.textSecondary}}><div style={{fontSize:40}}>🔍</div><div style={{marginTop:8}}>No products found</div></div>
          :<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>{filtered.map(p=><ProdCard key={p.sku} p={p} cart={cart} add={add} rem={rem} onTap={setDetailProd} cats={categories}/>)}</div>}
      </div>}

      {!search&&<>
        {/* Hero */}
        {cat==="all"&&<div style={{margin:"12px 14px 0",background:`linear-gradient(135deg,${T.gold},${T.goldDark} 50%,${T.red})`,borderRadius:16,padding:"16px 18px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontWeight:900,fontSize:16,color:T.bg}}>Fresh. Fast. Delivered.</div>
            <div style={{fontSize:11,color:"rgba(0,0,0,0.55)",marginTop:2}}>Order now — arrives in 30 mins 🚀</div>
            <div style={{marginTop:8,background:"rgba(0,0,0,0.12)",borderRadius:8,padding:"4px 10px",display:"inline-block",fontSize:11,color:T.bg,fontWeight:700}}>📍 Kitintale · Mile 8</div>
          </div>
          <span style={{fontSize:52}}>🛵</span>
        </div>}

        {/* Flash sale */}
        {cat==="all"&&flashItems.length>0&&<div style={{margin:"14px 14px 0"}}>
          <div style={{background:`linear-gradient(90deg,${T.redDark},${T.red})`,borderRadius:"14px 14px 0 0",padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{color:"#fff",fontWeight:900,fontSize:14}}>⚡ Flash Sales</span>
            <div style={{display:"flex",gap:4,alignItems:"center"}}>
              {[h,m,s].map((t,i)=>(
                <React.Fragment key={i}>
                  <span style={{background:"rgba(255,255,255,0.2)",color:"#fff",padding:"3px 7px",borderRadius:6,fontFamily:"monospace",fontWeight:900,fontSize:13}}>{t}</span>
                  {i<2&&<span style={{color:"rgba(255,255,255,0.5)",fontWeight:900}}>:</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
          <div style={{display:"flex",gap:10,overflowX:"auto",background:`${T.red}11`,borderRadius:"0 0 14px 14px",padding:"10px 14px 14px",scrollbarWidth:"none",border:`1px solid ${T.red}33`,borderTop:"none"}}>
            {flashItems.map(p=>(
              <div key={p.sku} onClick={()=>setDetailProd(p)} style={{background:T.bgCard,borderRadius:12,minWidth:115,overflow:"hidden",cursor:"pointer",border:`1.5px solid ${cart[p.sku]?T.gold:T.border}`,flexShrink:0}}>
                <div style={{height:80,background:T.bgElevated,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
                  {p.image?<img src={p.image} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:36}}>{p.emoji}</span>}
                </div>
                <div style={{padding:"8px 8px 10px"}}>
                  <div style={{fontSize:10,fontWeight:700,color:T.textPrimary,lineHeight:1.2,marginBottom:1}}>{p.name}</div>
                  <div style={{fontSize:8,color:T.textSecondary}}>{p.variant}</div>
                  <div style={{color:T.gold,fontWeight:900,fontSize:12,marginTop:3}}>{ugx(p.price)}</div>
                  <div onClick={e=>{e.stopPropagation();add(p.sku);}} style={{marginTop:5,background:cart[p.sku]?T.bgInput:T.gold,borderRadius:6,padding:"4px 0",textAlign:"center",fontSize:10,fontWeight:800,color:cart[p.sku]?T.gold:T.bg,cursor:"pointer"}}>
                    {cart[p.sku]?`In cart: ${cart[p.sku]}`:"+ Add"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>}

        {/* Product sections */}
        <div style={{padding:"14px 14px 0"}}>
          {cat==="all"
            ? categories.map(c=>{
                const items=products.filter(p=>p.cat===c.id&&p.stock>0).slice(0,4);
                if(!items.length)return null;
                return <div key={c.id} style={{marginBottom:22}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      {c.image?<img src={c.image} style={{width:24,height:24,borderRadius:6,objectFit:"cover"}} alt=""/>:<span style={{fontSize:20}}>{c.icon}</span>}
                      <span style={{fontWeight:800,fontSize:15,color:T.textPrimary}}>{c.name}</span>
                    </div>
                    <button onClick={()=>setCat(c.id)} style={{background:"none",border:`1px solid ${T.border}`,borderRadius:20,padding:"4px 12px",fontSize:11,fontWeight:700,color:T.gold,cursor:"pointer",fontFamily:FONT}}>See All →</button>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                    {items.map(p=><ProdCard key={p.sku} p={p} cart={cart} add={add} rem={rem} onTap={setDetailProd} cats={categories}/>)}
                  </div>
                </div>;
              })
            : <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                {products.filter(p=>p.cat===cat).map(p=><ProdCard key={p.sku} p={p} cart={cart} add={add} rem={rem} onTap={setDetailProd} cats={categories}/>)}
              </div>}
        </div>
      </>}
      <Nav/>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   ADMIN DASHBOARD
═══════════════════════════════════════════════════ */
function AdminDashboard({products,setProducts,categories,setCategories,riders,setRiders,onBack}) {
  const [tab,setTab]=useState("orders");
  const [orders,setOrders]=useState(INIT_ORDERS);
  const [filterStatus,setFilterStatus]=useState("all");
  const [showAssign,setShowAssign]=useState(null);
  const [catFilter,setCatFilter]=useState("all");
  const [editProd,setEditProd]=useState(null);
  const [showProdModal,setShowProdModal]=useState(false);
  const [np,setNp]=useState({name:"",variant:"",cat:"FG",price:"",origPrice:"",stock:"",unit:"pack",emoji:"📦",image:null,express:false,discount:0,badge:""});
  const [showCatModal,setShowCatModal]=useState(false);
  const [editCat,setEditCat]=useState(null);
  const [nc,setNc]=useState({id:"",name:"",icon:"🛒",color:T.gold,image:null});
  const [editRider,setEditRider]=useState(null);
  const [showRiderModal,setShowRiderModal]=useState(false);
  const [rf,setRf]=useState({name:"",phone:"",bike:"",branch:"Kitintale",status:"available",photo:null});
  const [notifs,setNotifs]=useState(NOTIF_NUMBERS);

  const filtOrders=filterStatus==="all"?orders:orders.filter(o=>o.status===filterStatus);
  const filtProds=catFilter==="all"?products:products.filter(p=>p.cat===catFilter);

  const verifyPay=id=>setOrders(os=>os.map(o=>o.id===id?{...o,status:"verified"}:o));
  const assignRider=(oid,rid)=>{setOrders(os=>os.map(o=>o.id===oid?{...o,status:"on_the_way",rider:rid}:o));setRiders(rs=>rs.map(r=>r.id===rid?{...r,status:"busy"}:r));setShowAssign(null);alert("✅ Rider assigned! WhatsApp alert sent.");};
  const markDone=id=>{const o=orders.find(x=>x.id===id);setOrders(os=>os.map(x=>x.id===id?{...x,status:"delivered"}:x));if(o?.rider)setRiders(rs=>rs.map(r=>r.id===o.rider?{...r,status:"available",deliveries:r.deliveries+1}:r));};

  const openEditProd=p=>{setEditProd(p);setNp({...p,price:String(p.price),origPrice:String(p.origPrice||""),stock:String(p.stock),discount:String(p.discount||0),badge:p.badge||""});setShowProdModal(true);};
  const openAddProd=()=>{setEditProd(null);setNp({name:"",variant:"",cat:"FG",price:"",origPrice:"",stock:"",unit:"pack",emoji:"📦",image:null,express:false,discount:0,badge:""});setShowProdModal(true);};
  const saveProd=()=>{
    if(!np.name||!np.price)return alert("Name and price required");
    if(editProd){setProducts(ps=>ps.map(p=>p.sku===editProd.sku?{...np,sku:editProd.sku,price:+np.price,origPrice:+np.origPrice||+np.price,stock:+np.stock,discount:+np.discount}:p));}
    else{const sku=mkSKU(`${np.cat}99`,np.name.replace(/\s+/g,"").toUpperCase().slice(0,4));setProducts(ps=>[...ps,{...np,sku,price:+np.price,origPrice:+np.origPrice||+np.price,stock:+np.stock,discount:+np.discount}]);}
    setShowProdModal(false);
  };

  const openEditCat=c=>{setEditCat(c);setNc({...c});setShowCatModal(true);};
  const openAddCat=()=>{setEditCat(null);setNc({id:"",name:"",icon:"🛒",color:T.gold,image:null});setShowCatModal(true);};
  const saveCat=()=>{if(!nc.name||!nc.id)return alert("ID and name required");if(editCat)setCategories(cs=>cs.map(c=>c.id===editCat.id?{...nc}:c));else setCategories(cs=>[...cs,{...nc}]);setShowCatModal(false);};

  const openEditRider=r=>{setEditRider(r);setRf({...r});setShowRiderModal(true);};
  const openAddRider=()=>{setEditRider(null);setRf({name:"",phone:"",bike:"",branch:"Kitintale",status:"available",photo:null});setShowRiderModal(true);};
  const saveRider=()=>{if(!rf.name||!rf.phone)return alert("Name and phone required");if(editRider)setRiders(rs=>rs.map(r=>r.id===editRider.id?{...r,...rf}:r));else setRiders(rs=>[...rs,{...rf,id:`R${Date.now()}`,rating:5.0,deliveries:0}]);setShowRiderModal(false);};

  const st={orders:orders.length,pending:orders.filter(o=>o.status==="pending").length,active:orders.filter(o=>o.status==="on_the_way").length,revenue:orders.filter(o=>["verified","on_the_way","delivered"].includes(o.status)).reduce((s,o)=>s+o.total,0),lowStock:products.filter(p=>p.stock>0&&p.stock<=5).length,outStock:products.filter(p=>p.stock===0).length};

  const S={wrap:{fontFamily:FONT,background:T.bg,minHeight:"100vh",color:T.textPrimary},hdr:{background:`linear-gradient(135deg,${T.red},${T.redDark})`,padding:"14px 18px",display:"flex",alignItems:"center",justifyContent:"space-between"},tabs:{display:"flex",background:T.bgCard,borderBottom:`2px solid ${T.border}`,overflowX:"auto",scrollbarWidth:"none"},tab:a=>({padding:"12px 14px",fontSize:11,fontWeight:700,cursor:"pointer",border:"none",background:"none",color:a?T.gold:T.textSecondary,borderBottom:a?`3px solid ${T.gold}`:"3px solid transparent",whiteSpace:"nowrap",fontFamily:FONT}),card:{background:T.bgCard,borderRadius:14,padding:14,border:`1px solid ${T.border}`,marginBottom:12}};

  const sel={width:"100%",background:T.bgInput,border:`1px solid ${T.border}`,borderRadius:10,padding:"10px 12px",color:T.textPrimary,fontSize:13,fontFamily:FONT,outline:"none"};

  return (
    <div style={S.wrap}>
      <div style={S.hdr}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <img src="/logo.png" alt="" style={{height:36,objectFit:"contain"}} onError={e=>{e.target.style.display="none";}}/>
          <div><div style={{fontWeight:900,fontSize:14,color:T.gold}}>GOLD SUPERMARKET</div><div style={{fontSize:9,color:"rgba(255,255,255,0.4)"}}>Admin Dashboard</div></div>
        </div>
        <Btn small onClick={onBack}>← Customer</Btn>
      </div>

      <div style={S.tabs}>
        {[["orders","📦 Orders"],["inventory","🛍️ Inventory"],["categories","🏷️ Categories"],["riders","🏍️ Riders"],["alerts","🔔 Alerts"]].map(([k,l])=>(
          <button key={k} style={S.tab(tab===k)} onClick={()=>setTab(k)}>{l}</button>
        ))}
      </div>

      <div style={{padding:14}}>
        {/* Stats */}
        <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
          {[[T.gold,"📦","Orders",st.orders],["#FF8C00","⏳","Pending",st.pending],[T.green,"🏍️","Active",st.active],[T.green,"💰","Revenue",st.revenue>0?`${(st.revenue/1000).toFixed(0)}K`:"0"],["#FF8C00","⚠️","Low Stock",st.lowStock],[T.red,"❌","Out",st.outStock]].map(([c,ico,l,v])=>(
            <div key={l} style={{background:`${c}18`,borderRadius:14,padding:"12px 8px",border:`1px solid ${c}33`,flex:1,minWidth:75,textAlign:"center"}}>
              <div style={{fontSize:16}}>{ico}</div>
              <div style={{fontWeight:900,fontSize:17,color:c,marginTop:2}}>{v}</div>
              <div style={{fontSize:9,color:T.textSecondary,marginTop:1}}>{l}</div>
            </div>
          ))}
        </div>

        {/* ORDERS */}
        {tab==="orders"&&<div>
          <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap"}}>
            {[["all","All"],["pending","Pending"],["verified","Verified"],["on_the_way","On Way"],["delivered","Delivered"]].map(([k,l])=>(
              <button key={k} onClick={()=>setFilterStatus(k)} style={{background:filterStatus===k?T.gold:T.bgElevated,color:filterStatus===k?T.bg:T.textSecondary,border:`1px solid ${filterStatus===k?T.gold:T.border}`,borderRadius:20,padding:"5px 12px",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:FONT}}>{l}</button>
            ))}
          </div>
          {filtOrders.map(order=>(
            <div key={order.id} style={S.card}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:8}}>
                <div>
                  <div style={{fontWeight:900,fontSize:14,color:T.gold}}>{order.id}</div>
                  <div style={{fontSize:11,color:T.textSecondary,marginTop:2}}>👤 {order.customer} · 📞 {order.phone}</div>
                  <div style={{fontSize:10,color:T.textMuted,marginTop:2}}>📍 {order.location} · {order.dist}km · {order.branch} · 🕐 {order.ts}</div>
                  <div style={{marginTop:4,fontSize:11,color:T.textSecondary}}>{order.items.map(i=>`${i.name}×${i.qty}`).join(", ")}</div>
                  <div style={{marginTop:3,fontSize:11}}>Tx: <span style={{fontFamily:"monospace",color:T.goldLight}}>{order.txId}</span> · <b style={{color:T.gold}}>{ugx(order.total)}</b></div>
                </div>
                <StatusPill status={order.status}/>
              </div>
              <div style={{display:"flex",gap:8,marginTop:10,flexWrap:"wrap"}}>
                {order.status==="pending"&&<Btn small onClick={()=>verifyPay(order.id)}>✅ Verify Payment</Btn>}
                {order.status==="verified"&&<Btn small onClick={()=>setShowAssign(order.id)}>🏍️ Assign Rider</Btn>}
                {order.status==="on_the_way"&&<><span style={{fontSize:11,color:T.textSecondary,alignSelf:"center"}}>Rider: {riders.find(r=>r.id===order.rider)?.name}</span><Btn small onClick={()=>markDone(order.id)}>✅ Delivered</Btn></>}
              </div>
              {showAssign===order.id&&<div style={{marginTop:10,background:T.bgElevated,borderRadius:12,padding:12}}>
                <div style={{fontSize:11,fontWeight:700,color:T.gold,marginBottom:8}}>Select Rider:</div>
                {riders.map(r=>(
                  <div key={r.id} onClick={()=>r.status==="available"&&assignRider(order.id,r.id)} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:10,marginBottom:6,background:T.bgCard,cursor:r.status==="available"?"pointer":"not-allowed",border:`1px solid ${r.status==="available"?T.gold+"33":T.border}`,opacity:r.status==="available"?1:0.5}}>
                    <div style={{width:36,height:36,borderRadius:"50%",background:T.bgInput,overflow:"hidden",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                      {r.photo?<img src={r.photo} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:<span style={{fontSize:18}}>🏍️</span>}
                    </div>
                    <div style={{flex:1}}><div style={{fontWeight:700,fontSize:12,color:T.textPrimary}}>{r.name}</div><div style={{fontSize:10,color:T.textSecondary}}>{r.bike} · {r.deliveries} today · ⭐{r.rating}</div></div>
                    <StatusPill status={r.status}/>
                  </div>
                ))}
                <button onClick={()=>setShowAssign(null)} style={{background:"none",border:"none",color:T.textSecondary,fontSize:11,cursor:"pointer",fontFamily:FONT,marginTop:4}}>Cancel</button>
              </div>}
            </div>
          ))}
        </div>}

        {/* INVENTORY */}
        {tab==="inventory"&&<div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexWrap:"wrap",gap:8}}>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {[{id:"all",name:"All"},...categories].map(c=>(
                <button key={c.id} onClick={()=>setCatFilter(c.id)} style={{background:catFilter===c.id?T.gold:T.bgElevated,color:catFilter===c.id?T.bg:T.textSecondary,border:`1px solid ${catFilter===c.id?T.gold:T.border}`,borderRadius:20,padding:"5px 10px",fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:FONT}}>
                  {c.id==="all"?"All":(c.icon+" "+c.name.split(" ")[0])}
                </button>
              ))}
            </div>
            <Btn small onClick={openAddProd}>+ Add Product</Btn>
          </div>
          {(st.lowStock>0||st.outStock>0)&&<div style={{background:"#2D000A",borderRadius:10,padding:10,marginBottom:12,border:`1px solid ${T.red}33`}}>
            <div style={{fontWeight:800,color:T.red,fontSize:12,marginBottom:6}}>⚠️ Stock Alerts</div>
            {products.filter(p=>p.stock===0).map(p=><div key={p.sku} style={{fontSize:10,color:"#FF8888",marginBottom:2}}>❌ {p.name} — OUT OF STOCK</div>)}
            {products.filter(p=>p.stock>0&&p.stock<=5).map(p=><div key={p.sku} style={{fontSize:10,color:"#FFAA44",marginBottom:2}}>⚠️ {p.name} — Only {p.stock} left</div>)}
          </div>}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(155px,1fr))",gap:10}}>
            {filtProds.map(p=>(
              <div key={p.sku} style={{background:T.bgCard,borderRadius:12,overflow:"hidden",border:`1px solid ${T.border}`,opacity:p.stock===0?0.6:1}}>
                <div style={{height:90,background:T.bgElevated,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",position:"relative"}}>
                  {p.image?<img src={p.image} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:<span style={{fontSize:38}}>{p.emoji}</span>}
                  {p.stock===0&&<div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.55)",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{color:"#fff",fontSize:9,fontWeight:700}}>OUT</span></div>}
                  {p.stock>0&&p.stock<=5&&<div style={{position:"absolute",bottom:4,left:4,background:"#FF8C00",color:"#fff",fontSize:8,fontWeight:700,padding:"1px 5px",borderRadius:6}}>LOW:{p.stock}</div>}
                </div>
                <div style={{padding:"8px 10px"}}>
                  <div style={{fontSize:8,color:T.textMuted,fontFamily:"monospace"}}>{p.sku}</div>
                  <div style={{fontWeight:700,fontSize:11,marginTop:2,color:T.textPrimary,lineHeight:1.3}}>{p.name}</div>
                  <div style={{fontSize:9,color:T.textSecondary}}>{p.variant}</div>
                  <div style={{color:T.gold,fontWeight:900,fontSize:12,marginTop:3}}>{ugx(p.price)}</div>
                  <div style={{display:"flex",gap:5,marginTop:8}}>
                    <Btn small onClick={()=>openEditProd(p)}>✏️ Edit</Btn>
                    <Btn small danger onClick={()=>setProducts(ps=>ps.filter(x=>x.sku!==p.sku))}>Del</Btn>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>}

        {/* CATEGORIES */}
        {tab==="categories"&&<div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <span style={{fontWeight:800,fontSize:15,color:T.textPrimary}}>Product Categories</span>
            <Btn small onClick={openAddCat}>+ New Category</Btn>
          </div>
          {categories.map(c=>(
            <div key={c.id} style={{...S.card,display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:56,height:56,borderRadius:12,background:T.bgElevated,overflow:"hidden",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                {c.image?<img src={c.image} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:<span style={{fontSize:28}}>{c.icon}</span>}
              </div>
              <div style={{flex:1}}>
                <div style={{fontWeight:800,fontSize:14,color:T.textPrimary}}>{c.name}</div>
                <div style={{fontSize:10,color:T.textSecondary,marginTop:2}}>Code: <span style={{fontFamily:"monospace",color:T.gold}}>{c.id}</span> · {products.filter(p=>p.cat===c.id).length} products</div>
                <div style={{width:24,height:4,borderRadius:2,background:c.color,marginTop:5}}/>
              </div>
              <div style={{display:"flex",gap:6}}>
                <Btn small onClick={()=>openEditCat(c)}>✏️</Btn>
                <Btn small danger onClick={()=>setCategories(cs=>cs.filter(x=>x.id!==c.id))}>✕</Btn>
              </div>
            </div>
          ))}
        </div>}

        {/* RIDERS */}
        {tab==="riders"&&<div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <span style={{fontWeight:800,fontSize:15,color:T.textPrimary}}>Rider Management</span>
            <Btn small onClick={openAddRider}>+ Add Rider</Btn>
          </div>
          {riders.map(r=>(
            <div key={r.id} style={{...S.card,display:"flex",gap:12,alignItems:"flex-start"}}>
              <div style={{width:54,height:54,borderRadius:"50%",background:T.bgElevated,overflow:"hidden",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                {r.photo?<img src={r.photo} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:<span style={{fontSize:26}}>🏍️</span>}
              </div>
              <div style={{flex:1}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:6}}>
                  <div>
                    <div style={{fontWeight:800,fontSize:14,color:T.textPrimary}}>{r.name}</div>
                    <div style={{fontSize:11,color:T.textSecondary,marginTop:2}}>📞 {r.phone}</div>
                    <div style={{fontSize:11,color:T.textSecondary}}>🏍️ <span style={{fontFamily:"monospace",color:T.goldLight,fontWeight:700}}>{r.bike||"—"}</span></div>
                    <div style={{fontSize:11,color:T.textSecondary}}>📍 {r.branch} · ⭐{r.rating} · {r.deliveries} deliveries today</div>
                  </div>
                  <StatusPill status={r.status}/>
                </div>
                <div style={{display:"flex",gap:6,marginTop:10}}>
                  <Btn small onClick={()=>openEditRider(r)}>✏️ Edit</Btn>
                  <Btn small danger onClick={()=>setRiders(rs=>rs.filter(x=>x.id!==r.id))}>Remove</Btn>
                </div>
              </div>
            </div>
          ))}
        </div>}

        {/* ALERTS */}
        {tab==="alerts"&&<div>
          <div style={{background:"#1A1A00",border:`1px solid ${T.gold}44`,borderRadius:12,padding:12,marginBottom:14}}>
            <div style={{fontWeight:800,fontSize:13,color:T.gold,marginBottom:4}}>🔒 Verified Numbers Only</div>
            <div style={{fontSize:11,color:T.textSecondary}}>Only numbers verified here receive WhatsApp alerts. All others are blocked.</div>
          </div>
          {notifs.map(n=>(
            <div key={n.id} style={{...S.card,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
              <div>
                <div style={{fontWeight:700,fontFamily:"monospace",fontSize:13,color:T.textPrimary}}>{n.num}</div>
                <div style={{fontSize:10,color:T.textSecondary,marginTop:2}}>{n.role} · {n.branch}</div>
              </div>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <Toggle on={n.active} onChange={v=>setNotifs(ns=>ns.map(x=>x.id===n.id?{...x,active:v}:x))}/>
                <Btn small danger onClick={()=>setNotifs(ns=>ns.filter(x=>x.id!==n.id))}>✕</Btn>
              </div>
            </div>
          ))}
          <Btn onClick={()=>{const num=prompt("+256 7XX XXX XXX");const role=prompt("Role:");const branch=prompt("Branch:");if(num&&role)setNotifs(ns=>[...ns,{id:Date.now(),num,role,branch:branch||"All",active:true}]);}}>+ Add Number</Btn>
          <div style={{...S.card,marginTop:14}}>
            <div style={{fontWeight:800,fontSize:12,color:T.gold,marginBottom:10}}>📱 Smart Alert Routing</div>
            {[["🛒 New order","Nearest branch manager"],["💳 Payment verified","All active admins"],["🏍️ Rider assigned","Rider + Customer"],["✅ Delivered","Customer + Supervisor"],["⚠️ Low stock","Branch manager only"]].map(([ev,tg])=>(
              <div key={ev} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${T.border}`,fontSize:11}}>
                <span style={{color:T.textSecondary}}>{ev}</span><span style={{color:T.textMuted,maxWidth:"55%",textAlign:"right"}}>{tg}</span>
              </div>
            ))}
          </div>
        </div>}
      </div>

      {/* ── Product Sheet */}
      <Sheet open={showProdModal} onClose={()=>setShowProdModal(false)} title={editProd?"Edit Product":"New Product"}>
        <div style={{display:"flex",gap:14,alignItems:"flex-start",marginBottom:14}}>
          <ImgUpload current={np.image} onUpload={img=>setNp(p=>({...p,image:img}))} label="Product Image" size={72}/>
          <div style={{flex:1}}>
            <Fld label="Product Name" value={np.name} onChange={v=>setNp(p=>({...p,name:v}))} placeholder="e.g. Kakira Sugar"/>
            <Fld label="Variant / Size" value={np.variant} onChange={v=>setNp(p=>({...p,variant:v}))} placeholder="e.g. 10KG"/>
          </div>
        </div>
        {!np.image&&<Fld label="Emoji Fallback" value={np.emoji} onChange={v=>setNp(p=>({...p,emoji:v}))} placeholder="🛒"/>}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <Fld label="Price (UGX)" value={np.price} onChange={v=>setNp(p=>({...p,price:v}))} type="number"/>
          <Fld label="Orig. Price" value={np.origPrice} onChange={v=>setNp(p=>({...p,origPrice:v}))} type="number"/>
          <Fld label="Stock Qty" value={np.stock} onChange={v=>setNp(p=>({...p,stock:v}))} type="number"/>
          <Fld label="Unit" value={np.unit} onChange={v=>setNp(p=>({...p,unit:v}))} placeholder="kg/pack"/>
          <Fld label="Discount %" value={np.discount} onChange={v=>setNp(p=>({...p,discount:v}))} type="number"/>
          <Fld label="Badge" value={np.badge} onChange={v=>setNp(p=>({...p,badge:v}))} placeholder="Flash/Sale/Local"/>
        </div>
        <div style={{marginBottom:10}}>
          <div style={{fontSize:10,fontWeight:700,color:T.textSecondary,marginBottom:4,textTransform:"uppercase",letterSpacing:0.5}}>Category</div>
          <select value={np.cat} onChange={e=>setNp(p=>({...p,cat:e.target.value}))} style={{width:"100%",background:T.bgInput,border:`1px solid ${T.border}`,borderRadius:10,padding:"10px 12px",color:T.textPrimary,fontSize:13,fontFamily:FONT,outline:"none"}}>
            {categories.map(c=><option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
          </select>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
          <Toggle on={np.express} onChange={v=>setNp(p=>({...p,express:v}))} label="Express 30-min delivery"/>
        </div>
        <div style={{display:"flex",gap:10}}>
          <Btn style={{flex:1}} onClick={saveProd}>💾 {editProd?"Save Changes":"Add Product"}</Btn>
          <Btn outline onClick={()=>setShowProdModal(false)}>Cancel</Btn>
        </div>
      </Sheet>

      {/* ── Category Sheet */}
      <Sheet open={showCatModal} onClose={()=>setShowCatModal(false)} title={editCat?"Edit Category":"New Category"}>
        <div style={{display:"flex",gap:14,alignItems:"flex-start",marginBottom:14}}>
          <ImgUpload current={nc.image} onUpload={img=>setNc(c=>({...c,image:img}))} label="Category Image" size={72}/>
          <div style={{flex:1}}>
            <Fld label="Category Name" value={nc.name} onChange={v=>setNc(c=>({...c,name:v}))} placeholder="e.g. Fresh Produce"/>
            <Fld label="Category Code (2-3 letters)" value={nc.id} onChange={v=>setNc(c=>({...c,id:v.toUpperCase()}))} placeholder="e.g. FP"/>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <Fld label="Emoji Icon" value={nc.icon} onChange={v=>setNc(c=>({...c,icon:v}))} placeholder="🛒"/>
          <Fld label="Brand Color (hex)" value={nc.color} onChange={v=>setNc(c=>({...c,color:v}))} placeholder="#F5B800"/>
        </div>
        <div style={{display:"flex",gap:10,marginTop:4}}>
          <Btn style={{flex:1}} onClick={saveCat}>💾 {editCat?"Save Changes":"Add Category"}</Btn>
          <Btn outline onClick={()=>setShowCatModal(false)}>Cancel</Btn>
        </div>
      </Sheet>

      {/* ── Rider Sheet */}
      <Sheet open={showRiderModal} onClose={()=>setShowRiderModal(false)} title={editRider?"Edit Rider":"New Rider"}>
        <div style={{display:"flex",gap:14,alignItems:"flex-start",marginBottom:14}}>
          <ImgUpload current={rf.photo} onUpload={img=>setRf(r=>({...r,photo:img}))} label="Rider Photo" size={72} radius={36}/>
          <div style={{flex:1}}>
            <Fld label="Full Name" value={rf.name} onChange={v=>setRf(r=>({...r,name:v}))} placeholder="e.g. Kato Denis"/>
            <Fld label="Phone Number" value={rf.phone} onChange={v=>setRf(r=>({...r,phone:v}))} placeholder="07XXXXXXXX"/>
          </div>
        </div>
        <Fld label="Motorcycle Registration Plate" value={rf.bike} onChange={v=>setRf(r=>({...r,bike:v.toUpperCase()}))} placeholder="e.g. UAX 123G" style={{fontFamily:"monospace",letterSpacing:1}}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <div>
            <div style={{fontSize:10,fontWeight:700,color:T.textSecondary,marginBottom:4,textTransform:"uppercase",letterSpacing:0.5}}>Branch</div>
            <select value={rf.branch} onChange={e=>setRf(r=>({...r,branch:e.target.value}))} style={{width:"100%",background:T.bgInput,border:`1px solid ${T.border}`,borderRadius:10,padding:"10px 12px",color:T.textPrimary,fontSize:13,fontFamily:FONT,outline:"none"}}>
              <option value="Kitintale">Kitintale</option>
              <option value="Mile 8">Mile 8, Gayaza Rd</option>
            </select>
          </div>
          <div>
            <div style={{fontSize:10,fontWeight:700,color:T.textSecondary,marginBottom:4,textTransform:"uppercase",letterSpacing:0.5}}>Status</div>
            <select value={rf.status} onChange={e=>setRf(r=>({...r,status:e.target.value}))} style={{width:"100%",background:T.bgInput,border:`1px solid ${T.border}`,borderRadius:10,padding:"10px 12px",color:T.textPrimary,fontSize:13,fontFamily:FONT,outline:"none"}}>
              <option value="available">Available</option>
              <option value="busy">Busy</option>
              <option value="offline">Offline</option>
            </select>
          </div>
        </div>
        <div style={{display:"flex",gap:10,marginTop:14}}>
          <Btn style={{flex:1}} onClick={saveRider}>💾 {editRider?"Save Changes":"Add Rider"}</Btn>
          <Btn outline onClick={()=>setShowRiderModal(false)}>Cancel</Btn>
        </div>
      </Sheet>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   RIDER APP
═══════════════════════════════════════════════════ */
function RiderApp({riders,onBack}) {
  const rider=riders[0];
  const [myOrders,setMyOrders]=useState(INIT_ORDERS.slice(0,2).map(o=>({...o,status:o.status==="on_the_way"?"on_the_way":"new"})));
  const accept=id=>setMyOrders(os=>os.map(o=>o.id===id?{...o,status:"on_the_way"}:o));
  const deliver=id=>setMyOrders(os=>os.map(o=>o.id===id?{...o,status:"delivered"}:o));
  return (
    <div style={{fontFamily:FONT,background:T.bg,minHeight:"100vh",color:T.textPrimary,maxWidth:430,margin:"0 auto"}}>
      <div style={{background:`linear-gradient(135deg,#16A34A,#14532D)`,padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:42,height:42,borderRadius:"50%",background:"rgba(255,255,255,0.15)",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center"}}>
            {rider?.photo?<img src={rider.photo} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:<span style={{fontSize:22}}>🏍️</span>}
          </div>
          <div>
            <div style={{fontWeight:900,fontSize:15,color:"#fff"}}>{rider?.name||"Rider"}</div>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.55)"}}>🏍️ {rider?.bike||"—"} · 📍 {rider?.branch}</div>
          </div>
        </div>
        <Btn small onClick={onBack}>← Back</Btn>
      </div>
      <div style={{padding:14}}>
        <div style={{display:"flex",gap:10,marginBottom:14}}>
          {[["📦",rider?.deliveries||0,"Today"],["⭐",rider?.rating||"5.0","Rating"],["⏱️","28 min","Avg"]].map(([ico,v,l])=>(
            <div key={l} style={{flex:1,background:T.bgCard,borderRadius:12,padding:"12px 8px",textAlign:"center",border:`1px solid ${T.border}`}}>
              <div style={{fontSize:19}}>{ico}</div>
              <div style={{fontWeight:900,fontSize:16,color:T.green,marginTop:3}}>{v}</div>
              <div style={{fontSize:9,color:T.textSecondary}}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{background:T.bgCard,borderRadius:14,padding:14,marginBottom:14,border:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><div style={{fontWeight:700,fontSize:13}}>My Status</div><div style={{fontSize:11,color:T.textSecondary,marginTop:2}}>📞 {rider?.phone}</div></div>
          <StatusPill status={rider?.status||"available"}/>
        </div>
        <div style={{fontWeight:800,fontSize:15,marginBottom:10,color:T.green}}>📦 My Deliveries</div>
        {myOrders.map(o=>(
          <div key={o.id} style={{background:T.bgCard,borderRadius:14,padding:14,marginBottom:12,border:`1px solid ${T.border}`}}>
            <div style={{fontWeight:900,fontSize:13,color:T.gold}}>{o.id}</div>
            <div style={{fontSize:11,color:T.textSecondary,marginTop:5}}>📍 Pickup: <b style={{color:T.textPrimary}}>{o.branch} Branch</b></div>
            <div style={{fontSize:11,color:T.textSecondary}}>🏠 Drop: <b style={{color:T.textPrimary}}>{o.location}</b> ({o.dist} km)</div>
            <div style={{fontSize:11,color:T.textSecondary}}>👤 {o.customer} · {o.phone}</div>
            <div style={{fontSize:10,color:T.textMuted,marginTop:3}}>{o.items.map(i=>`${i.name}×${i.qty}`).join(", ")}</div>
            <div style={{fontWeight:700,color:T.gold,marginTop:4,fontSize:13}}>{ugx(o.total)}</div>
            <div style={{display:"flex",gap:8,marginTop:10,alignItems:"center",flexWrap:"wrap"}}>
              <StatusPill status={o.status}/>
              {o.status==="new"&&<Btn small onClick={()=>accept(o.id)}>✅ Accept</Btn>}
              {o.status==="on_the_way"&&<>
                <a href={`https://maps.google.com/?q=${o.location},Kampala`} target="_blank" rel="noreferrer" style={{background:"#1565C0",color:"#fff",border:"none",borderRadius:8,padding:"6px 12px",fontWeight:800,fontSize:11,cursor:"pointer",textDecoration:"none",fontFamily:FONT}}>🗺️ Navigate</a>
                <Btn small onClick={()=>deliver(o.id)}>✅ Delivered</Btn>
              </>}
              {o.status==="delivered"&&<span style={{color:T.green,fontWeight:700,fontSize:12}}>✅ Completed</span>}
            </div>
          </div>
        ))}
        <div style={{background:"#001A08",border:`1px solid ${T.green}33`,borderRadius:12,padding:14}}>
          <div style={{fontWeight:800,fontSize:12,color:T.green,marginBottom:4}}>📱 WhatsApp Alerts Active</div>
          <div style={{fontSize:11,color:T.textSecondary}}>New deliveries sent to: <b style={{color:T.textPrimary}}>{rider?.phone}</b></div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   ROOT — shared state flows from here to all views
═══════════════════════════════════════════════════ */
export default function App() {
  const [mode,setMode]=useState("customer");
  const [products,setProducts]=useState(INIT_PRODUCTS);
  const [categories,setCategories]=useState(INIT_CATS);
  const [riders,setRiders]=useState(INIT_RIDERS);
  return (
    <div style={{fontFamily:FONT,background:T.bg}}>
      <div style={{background:"#0A0A0A",display:"flex",justifyContent:"center",padding:"6px 0",borderBottom:`1px solid ${T.border}`,position:"sticky",top:0,zIndex:200}}>
        {[["customer","🛒 Customer"],["admin","🧑‍💼 Admin"],["rider","🏍️ Rider"]].map(([m,l])=>(
          <button key={m} onClick={()=>setMode(m)} style={{background:mode===m?T.gold:"transparent",color:mode===m?T.bg:T.textSecondary,border:"none",padding:"6px 20px",fontWeight:800,fontSize:11,cursor:"pointer",borderRadius:mode===m?8:0,fontFamily:FONT,transition:"all .15s"}}>{l}</button>
        ))}
      </div>
      {mode==="customer"&&<CustomerApp products={products} categories={categories} onAdminUnlock={()=>setMode("admin")}/>}
      {mode==="admin"&&<AdminDashboard products={products} setProducts={setProducts} categories={categories} setCategories={setCategories} riders={riders} setRiders={setRiders} onBack={()=>setMode("customer")}/>}
      {mode==="rider"&&<RiderApp riders={riders} onBack={()=>setMode("customer")}/>}
    </div>
  );
}
