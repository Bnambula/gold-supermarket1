import React, { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════
   DESIGN SYSTEM — Black/Gold (matches wireframe exactly)
   Dark charcoal base + vivid gold + white text
   Inspired by hackathon-style premium dark UI
═══════════════════════════════════════════════════════ */
const T = {
  /* Surfaces */
  bg:       "#0D0D0D",
  bgCard:   "#161616",
  bgEl:     "#1E1E1E",
  bgIn:     "#242424",
  bgMid:    "#1A1A1A",
  bdr:      "#2A2A2A",
  bdrGold:  "#C9A84C44",
  /* Brand */
  gold:     "#F5C518",   // vivid yellow-gold (wireframe primary)
  gDark:    "#C9A030",
  gLight:   "#FFD84D",
  gSoft:    "#C9A84C",
  gGlow:    "rgba(245,197,24,0.18)",
  /* Status */
  green:    "#22C55E",
  red:      "#EF4444",
  blue:     "#3B82F6",
  orange:   "#F97316",
  /* Text */
  tp:       "#FFFFFF",
  ts:       "#9CA3AF",
  tm:       "#4B5563",
  tgold:    "#F5C518",
};
const F = "'Sora','Nunito',sans-serif";
const ugx = n => `UGX ${Number(n).toLocaleString()}`;

/* SKU generator */
let _sc={};
const mkSKU=c=>{if(!_sc[c])_sc[c]=0;_sc[c]++;return `PDT${c}${String(_sc[c]).padStart(4,"0")}`;};

/* ─── Staff creds ─── */
const STAFF={
  admin:  [{id:"S1",username:"admin",  password:"gold@admin2025",role:"admin",  name:"Administrator",branch:"All"}],
  manager:[{id:"S2",username:"mgr1",   password:"kitintale@mgr", role:"manager",name:"Kiggundu James",branch:"Kitintale"},
           {id:"S3",username:"mgr2",   password:"mile8@mgr",     role:"manager",name:"Nansubuga Rose", branch:"Mile 8"}],
  rider:  [{id:"R1",username:"rider1", password:"rider@kato",    role:"rider",  name:"Kato Denis",     branch:"Kitintale"},
           {id:"R2",username:"rider2", password:"rider@nakato",  role:"rider",  name:"Nakato Sarah",    branch:"Mile 8"},
           {id:"R3",username:"rider3", password:"rider@mugisha", role:"rider",  name:"Mugisha Brian",   branch:"Kitintale"}],
};
const ALL_STAFF=[...STAFF.admin,...STAFF.manager,...STAFF.rider];

/* ─── Categories ─── */
const INIT_CATS=[
  {id:"FG",name:"Groceries",     icon:"🌾",color:"#F5C518",image:null},
  {id:"BK",name:"Bakery",        icon:"🍞",color:"#F97316",image:null},
  {id:"BV",name:"Beverages",     icon:"🥤",color:"#3B82F6",image:null},
  {id:"FF",name:"Fast Foods",    icon:"🍗",color:"#EF4444",image:null},
  {id:"HC",name:"Household",     icon:"🧴",color:"#22C55E",image:null},
  {id:"PC",name:"Personal",      icon:"👶",color:"#A855F7",image:null},
  {id:"SK",name:"Snacks",        icon:"🍪",color:"#EC4899",image:null},
];

/* ─── Products ─── */
const mkP=(cat,name,variant,price,orig,stock,unit,emoji,express,disc,badge)=>
  ({sku:mkSKU(cat),name,variant,cat,price,origPrice:orig,stock,unit,image:null,emoji,express,discount:disc,badge});

const INIT_PRODUCTS=[
  mkP("FG","SWT MB Long Grain Rice","5KG",      23200,24400,42,"bag",  "🌾",true, 5,"Popular"),
  mkP("FG","Maganjo Maize Flour",   "2KG",       7500, 8000,55,"pack", "🌽",true, 6,"Local"),
  mkP("FG","Numa Flour",            "2KG",       6800, 7200,30,"pack", "🌽",true, 6,null),
  mkP("FG","Indomie Noodles",       "70g×40pcs",32000,35500,20,"carton","🍜",true,10,"Flash"),
  mkP("FG","Kakira Sugar",          "10KG",     35000,36300,30,"bag",  "🍬",false,3,null),
  mkP("FG","Sunseed Sunflower Oil", "3L",       27800,31200,25,"bottle","🛢️",false,11,"Sale"),
  mkP("FG","Royco Mchuzi Mix",      "200g×2",    9700,10700,40,"pack", "🍲",true,10,"Flash"),
  mkP("FG","Iodized Table Salt",    "1KG",       1800, 2000,80,"pack", "🧂",true,10,null),
  mkP("BK","White Bread Loaf",      "Large",     5500, 6000,20,"loaf", "🍞",true, 8,"Fresh"),
  mkP("BK","Soft Buns",             "Pack of 6", 4500, 5000,25,"pack", "🥐",true, 8,"Fresh"),
  mkP("BK","Chocolate Cake Slice",  "1 slice",   6000, 7000,15,"slice","🎂",true, 0,null),
  mkP("BK","Doughnuts",             "Pack of 4", 5000, 5500,18,"pack", "🍩",true, 9,"Fresh"),
  mkP("BK","Birthday Cake",         "Custom",   85000,95000, 5,"cake", "🎂",false,11,"Order"),
  mkP("BK","Graduation Cake",       "Custom",  120000,135000,3,"cake","🎓",false,11,"Order"),
  mkP("BK","Mandazi",               "Pack of 8", 3500, 4000,30,"pack", "🥐",true, 0,"Local"),
  mkP("BK","Chapati",               "Each",      1500, 2000,40,"piece","🫓",true, 0,null),
  mkP("BV","Riham Oner Mango Juice","300ml×12", 14600,16700,28,"carton","🥭",true,13,"Flash"),
  mkP("BV","Riham Oner Apple Juice","300ml×12", 14600,16700,22,"carton","🍎",true,13,"Flash"),
  mkP("BV","Coca-Cola",             "500ml",     2000, 2200,50,"bottle","🥤",true, 9,null),
  mkP("BV","Jesa UHT Milk",         "500ml×12", 22500,25200,20,"carton","🥛",true,11,"Top Offer"),
  mkP("BV","Mineral Water",         "1.5L",      2500, 2800,60,"bottle","💧",true,11,null),
  mkP("BV","Jameson Whiskey",       "750ml",    88900,98000, 8,"bottle","🥃",false,10,null),
  mkP("BV","Rockboom Energy Drink", "320ml×12", 18900,21700,15,"carton","⚡",false,13,"Flash"),
  mkP("FF","Pilau Rice",            "Plate",    12000,14000,15,"plate","🍛",true, 0,"Flash"),
  mkP("FF","Roast Chicken",         "Half",     25000,28000,10,"piece","🍗",true, 0,null),
  mkP("FF","Liver",                 "Plate",     8000,10000,12,"plate","🍖",true, 0,null),
  mkP("FF","Samosas",               "Pack of 4", 4000, 5000,20,"pack", "🥟",true, 0,"Flash"),
  mkP("FF","Beef Shawarma",         "Each",     12000,14000,10,"piece","🌯",true, 0,null),
  mkP("FF","Deep Fried Chicken",    "2 pieces", 18000,20000, 8,"piece","🍗",true, 0,"Flash"),
  mkP("FF","French Fries",          "Large",     8000, 9000,12,"pack", "🍟",true, 0,null),
  mkP("HC","Magic Detergent",       "10KG",     39400,43700,15,"bucket","🧺",false,10,"Flash"),
  mkP("HC","Jik Bleach Twin Pack",  "750ml×2",  21200,23000,22,"pack", "🧽",false, 8,null),
  mkP("HC","Eurotop Toilet Paper",  "10 rolls", 12500,14000,40,"pack", "🧻",false,11,null),
  mkP("HC","Sunlight Dish Soap",    "750ml",     7200, 8000,28,"bottle","🫧",false,10,null),
  mkP("PC","Dettol Soap",           "175g",      4800, 5200,50,"bar",  "🧼",true, 8,null),
  mkP("PC","Pampers Diapers",       "Size S-44",42000,46000,12,"pack", "👶",false, 9,"Flash"),
  mkP("PC","Huggies Diapers",       "Size M-40",45000,50000, 9,"pack", "👶",false,10,null),
  mkP("PC","Nestle Lactogen",       "400g",     38000,42000, 8,"tin",  "🍼",false,10,null),
  mkP("SK","Sumz Rings & Crisps",   "Multi×10",  5000, 5800,35,"pack", "🍟",true,14,"Flash"),
  mkP("SK","Roasted Groundnuts",    "500g",      6500, 7000,20,"pack", "🥜",true, 7,"Local"),
  mkP("SK","Britania Biscuits",     "400g",      7500, 8500,30,"pack", "🍪",false,12,"Flash"),
];

const INIT_RIDERS=[
  {id:"R1",name:"Kato Denis",   phone:"0774123456",bike:"UAX 123G",branch:"Kitintale",status:"available",rating:4.8,deliveries:12,photo:null},
  {id:"R2",name:"Nakato Sarah", phone:"0755987654",bike:"UAB 456H",branch:"Mile 8",   status:"busy",     rating:4.9,deliveries:8, photo:null},
  {id:"R3",name:"Mugisha Brian",phone:"0701456789",bike:"UBG 789K",branch:"Kitintale",status:"available",rating:4.7,deliveries:15,photo:null},
];

const INIT_ORDERS=[
  {id:"OGS250326001",customer:"Aisha Namukasa",  phone:"0772345678",waPhone:"0772345678",items:[{name:"Fresh Milk",qty:2,price:22500},{name:"White Bread",qty:1,price:5500},{name:"Bananas",qty:1,price:4000},{name:"Sugar 10kg",qty:1,price:35000}],total:89500,fee:3000,location:"Ntinda",dist:2.1,branch:"Kitintale",status:"pending",txId:"MOM2345678901",rider:null,ts:"09:14",payMethod:"mtn"},
  {id:"OGS250326002",customer:"Robert Ssempala", phone:"0753678901",waPhone:"0753678901",items:[{name:"Sunseed Oil",qty:1,price:27800},{name:"Kakira Sugar",qty:1,price:35000}],total:66800,fee:4000,location:"Kireka",dist:4.2,branch:"Mile 8",status:"verified",txId:"AIR8765432109",rider:"R3",ts:"09:32",payMethod:"airtel"},
  {id:"OGS250326003",customer:"Grace Akello",    phone:"0700234567",waPhone:"0700234567",items:[{name:"Mineral Water",qty:6,price:2500}],total:19000,fee:4000,location:"Bukoto",dist:3.8,branch:"Kitintale",status:"on_the_way",txId:"VIS•••• 4242",rider:"R1",ts:"08:55",payMethod:"visa"},
  {id:"OGS250326004",customer:"Banura Emmanuel", phone:"0781234567",waPhone:"0781234567",items:[{name:"Pampers S",qty:1,price:42000}],total:48000,fee:6000,location:"Mutungo",dist:6.1,branch:"Kitintale",status:"delivered",txId:"MOM9988776655",rider:"R2",ts:"08:10",payMethod:"mtn"},
];

/* ════════════════════ SHARED PRIMITIVES ════════════════════ */

function useCountdown(){
  const [t,setT]=useState(12*3600+40*60+17);
  useEffect(()=>{const id=setInterval(()=>setT(x=>x>0?x-1:0),1000);return()=>clearInterval(id);},[]);
  return{h:String(Math.floor(t/3600)).padStart(2,"0"),m:String(Math.floor((t%3600)/60)).padStart(2,"0"),s:String(t%60).padStart(2,"0")};
}

/* Gold animated badge */
const Badge=({label,color=T.gold})=>(
  <span style={{background:`${color}22`,color,border:`1px solid ${color}44`,padding:"2px 7px",borderRadius:20,fontSize:9,fontWeight:800,letterSpacing:.3}}>{label}</span>
);

/* Status pill */
function SPill({status}){
  const M={pending:{l:"Pending",c:T.gold},verified:{l:"✓ Verified",c:T.green},on_the_way:{l:"🏍 On Way",c:T.green},delivered:{l:"✅ Done",c:T.ts},cancelled:{l:"Cancelled",c:T.red},available:{l:"● Available",c:T.green},busy:{l:"● Busy",c:T.red},offline:{l:"● Offline",c:T.ts},new:{l:"New",c:T.blue}};
  const s=M[status]||M.pending;
  return <span style={{background:`${s.c}18`,color:s.c,padding:"4px 10px",borderRadius:20,fontSize:10,fontWeight:700,border:`1px solid ${s.c}33`}}>{s.l}</span>;
}

/* Gold button */
const Btn=({children,onClick,style={},sm,outline,danger,full,disabled,icon})=>(
  <button onClick={onClick} disabled={disabled} style={{
    background:disabled?"#222":danger?"#EF444422":outline?"transparent":T.gold,
    color:disabled?"#555":danger?T.red:outline?T.gold:T.bg,
    border:outline?`1.5px solid ${T.gold}`:danger?`1.5px solid ${T.red}33`:"none",
    borderRadius:10,padding:sm?"7px 14px":"13px 22px",
    fontWeight:800,fontSize:sm?11:14,cursor:disabled?"not-allowed":"pointer",
    fontFamily:F,width:full?"100%":undefined,
    boxShadow:(!disabled&&!outline&&!danger)?`0 4px 16px rgba(245,197,24,.25)`:"none",
    display:"inline-flex",alignItems:"center",justifyContent:"center",gap:6,
    opacity:disabled?.5:1,...style
  }}>{icon&&<span>{icon}</span>}{children}</button>
);

/* Input */
const Inp=({label,value,onChange,placeholder,type="text",style={},error,prefix})=>(
  <div style={{marginBottom:12}}>
    {label&&<div style={{fontSize:11,fontWeight:600,color:T.ts,marginBottom:5,letterSpacing:.3}}>{label}</div>}
    <div style={{position:"relative"}}>
      {prefix&&<span style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",color:T.ts,fontSize:14}}>{prefix}</span>}
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        style={{width:"100%",background:T.bgIn,border:`1.5px solid ${error?T.red:T.bdr}`,borderRadius:12,padding:`11px 14px 11px ${prefix?"38px":"14px"}`,color:T.tp,fontSize:13,outline:"none",fontFamily:F,boxSizing:"border-box",transition:"border-color .2s",...style}}
        onFocus={e=>e.target.style.borderColor=T.gold} onBlur={e=>e.target.style.borderColor=error?T.red:T.bdr}/>
    </div>
    {error&&<div style={{fontSize:10,color:T.red,marginTop:3,paddingLeft:4}}>⚠ {error}</div>}
  </div>
);

/* Image upload */
function ImgUp({current,onUpload,size=64,radius=12,label="Upload"}){
  const ref=useRef();
  const h=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>onUpload(ev.target.result);r.readAsDataURL(f);};
  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
      <div onClick={()=>ref.current.click()} style={{width:size,height:size,borderRadius:radius,background:T.bgIn,border:`2px dashed ${T.gold}55`,cursor:"pointer",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",transition:"border-color .2s"}} onMouseEnter={e=>e.currentTarget.style.borderColor=T.gold} onMouseLeave={e=>e.currentTarget.style.borderColor=`${T.gold}55`}>
        {current?<img src={current} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<div style={{textAlign:"center",color:T.ts}}><div style={{fontSize:22}}>📷</div><div style={{fontSize:9,marginTop:2}}>Upload</div></div>}
      </div>
      <input ref={ref} type="file" accept="image/*" style={{display:"none"}} onChange={h}/>
      {label&&<span style={{fontSize:9,color:T.ts,cursor:"pointer"}} onClick={()=>ref.current.click()}>{label}</span>}
    </div>
  );
}

/* Bottom sheet */
function Sheet({open,onClose,title,children,maxH="90vh"}){
  if(!open)return null;
  return(
    <div style={{position:"fixed",inset:0,zIndex:400,display:"flex",flexDirection:"column",justifyContent:"flex-end"}}>
      <div onClick={onClose} style={{position:"absolute",inset:0,background:"rgba(0,0,0,.85)",backdropFilter:"blur(4px)"}}/>
      <div style={{position:"relative",background:T.bgCard,borderRadius:"20px 20px 0 0",maxHeight:maxH,overflowY:"auto",border:`1px solid ${T.bdr}`,borderBottom:"none",animation:"su .22s ease"}}>
        <style>{`@keyframes su{from{transform:translateY(80%);opacity:.5}to{transform:translateY(0);opacity:1}}`}</style>
        <div style={{width:36,height:4,background:T.bdr,borderRadius:2,margin:"12px auto 0"}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 18px 12px",borderBottom:`1px solid ${T.bdr}`}}>
          <span style={{fontWeight:800,fontSize:16,color:T.tp}}>{title}</span>
          <button onClick={onClose} style={{background:T.bgEl,border:`1px solid ${T.bdr}`,color:T.ts,width:28,height:28,borderRadius:"50%",cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>
        <div style={{padding:"16px 18px 32px"}}>{children}</div>
      </div>
    </div>
  );
}

/* Toggle */
const Toggle=({on,onChange})=>(
  <div onClick={()=>onChange(!on)} style={{width:44,height:24,borderRadius:12,background:on?T.gold:T.bgIn,border:`1px solid ${on?T.gold:T.bdr}`,position:"relative",cursor:"pointer",transition:"all .2s",flexShrink:0}}>
    <div style={{position:"absolute",top:2,left:on?22:2,width:20,height:20,borderRadius:"50%",background:on?T.bg:"#555",transition:"left .2s",boxShadow:"0 1px 4px rgba(0,0,0,.5)"}}/>
  </div>
);

/* Skeleton loader shimmer */
const Skeleton=({w="100%",h=16,r=8})=>(
  <div style={{width:w,height:h,borderRadius:r,background:`linear-gradient(90deg,${T.bgEl} 25%,${T.bgIn} 50%,${T.bgEl} 75%)`,backgroundSize:"200%",animation:"shimmer 1.4s infinite"}}/>
);

/* Gold divider */
const GLine=()=><div style={{height:"1px",background:`linear-gradient(90deg,transparent,${T.gold}55,transparent)`,margin:"12px 0"}}/>;

/* Payment method logos */
const MoMo=()=>(
  <div style={{display:"flex",alignItems:"center",gap:6,background:"#003C71",borderRadius:8,padding:"6px 10px"}}>
    <span style={{fontSize:16}}>📱</span>
    <div><div style={{fontWeight:900,fontSize:11,color:"#F5C518",lineHeight:1}}>MoMo</div><div style={{fontSize:8,color:"#F5C518aa"}}>MTN</div></div>
  </div>
);
const Airtel=()=>(
  <div style={{display:"flex",alignItems:"center",gap:6,background:"#fff",borderRadius:8,padding:"6px 10px"}}>
    <span style={{fontSize:16,color:"#E4032D"}}>✈</span>
    <div><div style={{fontWeight:900,fontSize:11,color:"#E4032D",lineHeight:1}}>airtel</div><div style={{fontSize:8,color:"#E4032Daa"}}>money</div></div>
  </div>
);
const Visa=()=>(
  <div style={{background:"#fff",borderRadius:8,padding:"5px 10px",display:"flex",flexDirection:"column",gap:2,minWidth:56}}>
    <div style={{height:4,background:"#1A1F71",borderRadius:"2px 2px 0 0"}}/>
    <div style={{fontWeight:900,fontSize:14,color:"#1A1F71",lineHeight:1,textAlign:"center"}}>VISA</div>
    <div style={{height:4,background:"#F7A823",borderRadius:"0 0 2px 2px"}}/>
  </div>
);

/* ════════════════════ PRODUCT CARD ════════════════════ */
function PCard({p,cart,add,rem,onTap,cats,favs,toggleFav}){
  const qty=cart[p.sku]||0,out=p.stock===0;
  const cat=cats?.find(c=>c.id===p.cat);
  const isFav=favs?.includes(p.sku);
  return(
    <div onClick={()=>!out&&onTap(p)} style={{background:T.bgCard,borderRadius:16,overflow:"hidden",border:`1.5px solid ${qty?T.gold:T.bdr}`,cursor:out?"default":"pointer",display:"flex",flexDirection:"column",transition:"all .15s",boxShadow:qty?`0 0 0 1px ${T.gold}33`:"none"}}>
      {/* Image */}
      <div style={{height:120,background:T.bgEl,position:"relative",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center"}}>
        {p.image?<img src={p.image} alt={p.name} style={{width:"100%",height:"100%",objectFit:"cover",transition:"transform .3s"}}/>:<span style={{fontSize:50}}>{p.emoji}</span>}
        {/* Overlay badges */}
        <div style={{position:"absolute",top:8,left:8,display:"flex",flexDirection:"column",gap:3}}>
          {p.badge==="Flash"&&<Badge label="⚡ FLASH" color={T.gold}/>}
          {p.badge&&p.badge!=="Flash"&&<Badge label={p.badge} color={cat?.color||T.gold}/>}
        </div>
        {p.express&&<div style={{position:"absolute",top:8,right:30,background:"rgba(0,0,0,.75)",borderRadius:6,padding:"2px 6px",fontSize:8,color:T.gold,fontWeight:700}}>⚡30min</div>}
        {p.discount>0&&<div style={{position:"absolute",bottom:8,right:8,background:T.green,color:"#fff",fontSize:9,fontWeight:900,padding:"2px 8px",borderRadius:10}}>-{p.discount}%</div>}
        {out&&<div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.72)",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{color:T.tp,fontWeight:800,fontSize:12,letterSpacing:.5}}>Out of Stock</span></div>}
        {!out&&p.stock>0&&p.stock<=5&&<div style={{position:"absolute",bottom:8,left:8,background:"rgba(249,115,22,.2)",color:T.orange,fontSize:8,fontWeight:700,padding:"2px 6px",borderRadius:6,border:`1px solid ${T.orange}44`}}>Only {p.stock}!</div>}
        {/* Fav */}
        <button onClick={e=>{e.stopPropagation();toggleFav(p.sku);}} style={{position:"absolute",top:6,right:6,background:"rgba(0,0,0,.6)",border:"none",borderRadius:"50%",width:26,height:26,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>{isFav?"❤️":"🤍"}</button>
      </div>
      {/* Info */}
      <div style={{padding:"10px 10px 12px",flex:1,display:"flex",flexDirection:"column"}}>
        <div style={{fontSize:8,color:T.tm,fontFamily:"monospace",marginBottom:2}}>{p.sku}</div>
        <div style={{fontWeight:700,fontSize:12,color:T.tp,lineHeight:1.3,marginBottom:3,flex:1}}>{p.name}</div>
        <div style={{fontSize:10,color:T.ts,marginBottom:6}}>{p.variant}</div>
        <div style={{color:T.gold,fontWeight:900,fontSize:14}}>{ugx(p.price)}</div>
        {p.origPrice>p.price&&<div style={{fontSize:9,color:T.tm,textDecoration:"line-through"}}>{ugx(p.origPrice)}</div>}
        {!out&&(
          <div style={{marginTop:8}}>
            {qty===0
              ?<button onClick={e=>{e.stopPropagation();add(p.sku);}} style={{width:"100%",background:T.gold,border:"none",borderRadius:10,color:"#000",fontWeight:800,fontSize:12,padding:"8px 0",cursor:"pointer",fontFamily:F,boxShadow:`0 3px 10px ${T.gGlow}`}}>+ Add</button>
              :<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:T.bgEl,borderRadius:10,padding:"4px 8px",border:`1px solid ${T.gold}55`}} onClick={e=>e.stopPropagation()}>
                <button onClick={()=>rem(p.sku)} style={{background:"none",border:"none",color:T.gold,fontSize:22,cursor:"pointer",fontWeight:900,padding:"0 4px",lineHeight:1}}>−</button>
                <span style={{fontWeight:900,color:T.tp,fontSize:16,minWidth:20,textAlign:"center"}}>{qty}</span>
                <button onClick={()=>add(p.sku)} style={{background:"none",border:"none",color:T.gold,fontSize:22,cursor:"pointer",fontWeight:900,padding:"0 4px",lineHeight:1}}>+</button>
              </div>}
          </div>
        )}
      </div>
    </div>
  );
}

/* ════════════════════ STAFF LOGIN ════════════════════ */
function StaffLogin({onLogin,onClose,allowed}){
  const [u,setU]=useState("");
  const [p,setP]=useState("");
  const [er,setEr]=useState("");
  const go=()=>{const m=ALL_STAFF.find(s=>s.username===u.trim()&&s.password===p&&(!allowed||allowed.includes(s.role)));if(m)onLogin(m);else setEr("Invalid credentials. Please try again.");};
  return(
    <Sheet open title="🔐 Staff Login" onClose={onClose}>
      <div style={{textAlign:"center",marginBottom:16}}>
        <img src="/logo.png" alt="" style={{height:46}} onError={e=>e.target.style.display="none"}/>
        <div style={{fontSize:12,color:T.ts,marginTop:6}}>Authorized personnel only</div>
      </div>
      <GLine/>
      <Inp label="Username" value={u} onChange={setU} placeholder="Enter username" prefix="👤"/>
      <Inp label="Password" value={p} onChange={setP} placeholder="••••••••" type="password" prefix="🔒"/>
      {er&&<div style={{background:"#EF444418",border:"1px solid #EF444444",borderRadius:10,padding:"10px 13px",fontSize:12,color:T.red,marginBottom:10}}>⚠ {er}</div>}
      <Btn full onClick={go} style={{marginTop:6}}>Login →</Btn>
    </Sheet>
  );
}

/* ════════════════════ PAYMENT SECTION ════════════════════ */
function PaySection({payMethod,setPayMethod,txId,setTxId,waPhone,setWaPhone,cardNum,setCardNum,cardExp,setCardExp,cardCvv,setCardCvv,cardName,setCardName,visaContact,setVisaContact}){
  const [txErr,setTxErr]=useState("");
  const valTx=v=>{setTxId(v);const d=v.replace(/\D/g,"");if(d.length>0&&(d.length<10||d.length>14))setTxErr(`Must be 10–14 digits (${d.length} entered)`);else setTxErr("");};

  const MoMoInst=(
    <div style={{background:T.bgEl,border:`1px solid ${T.gold}22`,borderRadius:12,padding:14,marginBottom:12}}>
      <div style={{fontWeight:700,fontSize:12,color:T.gold,marginBottom:8}}>📲 How to Pay — MTN MoMo</div>
      <div style={{fontSize:11,color:T.ts,lineHeight:1.8}}>
        <b style={{color:T.tp}}>Via Merchant Code (recommended):</b><br/>
        Dial <span style={{color:T.gold,fontFamily:"monospace",fontWeight:700}}>*165*3#</span> → "Pay Merchant" → Enter code <span style={{color:T.gold,fontWeight:700}}>123456</span> → Amount → PIN ✓<br/><br/>
        <b style={{color:T.tp}}>Via Send Money:</b><br/>
        Dial <span style={{color:T.gold,fontFamily:"monospace",fontWeight:700}}>*165#</span> → Send Money → <span style={{color:T.gold,fontWeight:700}}>0774 XXX XXX</span> → Amount → PIN ✓<br/><br/>
        <span style={{color:T.ts,fontSize:10}}>Enter the SMS reference number below after payment.</span>
      </div>
    </div>
  );
  const AirtelInst=(
    <div style={{background:T.bgEl,border:`1px solid ${T.gold}22`,borderRadius:12,padding:14,marginBottom:12}}>
      <div style={{fontWeight:700,fontSize:12,color:T.gold,marginBottom:8}}>📲 How to Pay — Airtel Money</div>
      <div style={{fontSize:11,color:T.ts,lineHeight:1.8}}>
        <b style={{color:T.tp}}>Via Merchant Code (recommended):</b><br/>
        Dial <span style={{color:T.gold,fontFamily:"monospace",fontWeight:700}}>*185*9#</span> → "Pay Merchant" → Enter code <span style={{color:T.gold,fontWeight:700}}>654321</span> → Amount → PIN ✓<br/><br/>
        <b style={{color:T.tp}}>Via Send Money:</b><br/>
        Dial <span style={{color:T.gold,fontFamily:"monospace",fontWeight:700}}>*185#</span> → Send Money → <span style={{color:T.gold,fontWeight:700}}>0755 XXX XXX</span> → Amount → PIN ✓<br/><br/>
        <span style={{color:T.ts,fontSize:10}}>Enter the SMS reference number below after payment.</span>
      </div>
    </div>
  );

  return(
    <div style={{background:T.bgCard,borderRadius:16,padding:16,border:`1px solid ${T.bdr}`}}>
      <div style={{fontWeight:700,fontSize:14,color:T.tp,marginBottom:14}}>Payment Method</div>
      {/* Tabs */}
      <div style={{display:"flex",gap:8,marginBottom:16}}>
        {[["mtn",<MoMo/>],["airtel",<Airtel/>],["visa",<Visa/>]].map(([id,logo])=>(
          <div key={id} onClick={()=>setPayMethod(id)} style={{flex:1,padding:"10px 6px",borderRadius:12,border:`2px solid ${payMethod===id?T.gold:T.bdr}`,cursor:"pointer",background:payMethod===id?`${T.gold}0D`:T.bgIn,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",transition:"all .2s"}}>
            {logo}
            {payMethod===id&&<div style={{position:"absolute",top:4,right:6,fontSize:10,color:T.gold,fontWeight:900}}>✓</div>}
          </div>
        ))}
      </div>
      {payMethod==="mtn"&&<>{MoMoInst}<Inp label="MoMo Reference (10–14 digits)" value={txId} onChange={valTx} placeholder="e.g. 12345678901234" style={{fontFamily:"monospace"}} error={txErr}/><Inp label="Your MoMo Number (WhatsApp receipt)" value={waPhone} onChange={setWaPhone} placeholder="07XXXXXXXXX" prefix="📱"/></>}
      {payMethod==="airtel"&&<>{AirtelInst}<Inp label="Airtel Reference (10–14 digits)" value={txId} onChange={valTx} placeholder="e.g. 98765432109" style={{fontFamily:"monospace"}} error={txErr}/><Inp label="Your Airtel Number (WhatsApp receipt)" value={waPhone} onChange={setWaPhone} placeholder="07XXXXXXXXX" prefix="📲"/></>}
      {payMethod==="visa"&&(
        <div>
          <div style={{background:"#3B82F618",border:"1px solid #3B82F633",borderRadius:12,padding:13,marginBottom:12,fontSize:11,color:T.ts,lineHeight:1.7}}>🔒 <b style={{color:T.tp}}>Secure Visa Payment</b> — Encrypted with 256-bit SSL. We never store your full card number. 3D Secure OTP may be sent by your bank.</div>
          <Inp label="Cardholder Name" value={cardName} onChange={setCardName} placeholder="JOHN SMITH" style={{textTransform:"uppercase"}} prefix="👤"/>
          <Inp label="Card Number" value={cardNum} onChange={v=>setCardNum(v.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim())} placeholder="4242 4242 4242 4242" style={{fontFamily:"monospace",letterSpacing:2}} prefix="💳"/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <Inp label="Expiry (MM/YY)" value={cardExp} onChange={v=>setCardExp(v.replace(/[^0-9/]/g,"").slice(0,5))} placeholder="12/27"/>
            <Inp label="CVV" value={cardCvv} onChange={v=>setCardCvv(v.replace(/\D/g,"").slice(0,4))} placeholder="•••" type="password"/>
          </div>
          <Inp label="WhatsApp Number for Receipt" value={visaContact} onChange={setVisaContact} placeholder="07XXXXXXXXX" prefix="📱"/>
        </div>
      )}
    </div>
  );
}

/* ════════════════════ CUSTOMER APP ════════════════════ */
function CustomerApp({products,categories,onStaffAccess}){
  const [tab,setTab]=useState("home"); // home|search|favourites|orders|profile
  const [screen,setScreen]=useState("home"); // home|cart|checkout|tracking|detail
  const [cat,setCat]=useState("all");
  const [search,setSearch]=useState("");
  const [cart,setCart]=useState({});
  const [favs,setFavs]=useState([]);
  const [txId,setTxId]=useState("");
  const [waPh,setWaPh]=useState("");
  const [visaC,setVisaC]=useState("");
  const [payMethod,setPayMethod]=useState("mtn");
  const [cnV,setCnV]=useState("");
  const [ceV,setCeV]=useState("");
  const [cvV,setCvV]=useState("");
  const [cnmV,setCnmV]=useState("");
  const [placed,setPlaced]=useState(null);
  const [detail,setDetail]=useState(null);
  const [showLogin,setShowLogin]=useState(false);
  const [flashMore,setFlashMore]=useState(false);
  const [notification,setNotif]=useState(null);
  const {h,m,s}=useCountdown();

  const add=sku=>{setCart(c=>({...c,[sku]:(c[sku]||0)+1}));showNotif("Added to cart ✓");};
  const rem=sku=>setCart(c=>{const n={...c};if(n[sku]>1)n[sku]--;else delete n[sku];return n;});
  const toggleFav=sku=>{setFavs(f=>f.includes(sku)?f.filter(x=>x!==sku):[...f,sku]);showNotif(favs.includes(sku)?"Removed from favourites":"Saved to favourites ❤️");};
  const showNotif=msg=>{setNotif(msg);setTimeout(()=>setNotif(null),2000);};
  const cartCount=Object.values(cart).reduce((a,b)=>a+b,0);
  const cartItems=Object.entries(cart).map(([sku,qty])=>({...products.find(p=>p.sku===sku),qty})).filter(i=>i.sku);
  const subtotal=cartItems.reduce((s,i)=>s+i.price*i.qty,0);
  const fee=4000,total=subtotal+fee;
  const flashItems=products.filter(p=>p.badge==="Flash"&&p.stock>0);
  const shownFlash=flashMore?flashItems:flashItems.slice(0,6);
  const favProds=products.filter(p=>favs.includes(p.sku));
  const searchRes=products.filter(p=>search&&(p.name.toLowerCase().includes(search.toLowerCase())||p.sku.toLowerCase().includes(search.toLowerCase())));

  const canPlace=()=>{if(payMethod==="visa")return cnV.replace(/\s/g,"").length===16&&ceV.length===5&&cvV.length>=3&&cnmV.length>2;const d=txId.replace(/\D/g,"");return d.length>=10&&d.length<=14;};

  const placeOrder=()=>{
    if(!canPlace())return;
    const ref=payMethod==="visa"?`VIS•••• ${cnV.replace(/\s/g,"").slice(-4)}`:txId;
    const o={id:`OGS${Date.now().toString().slice(-6)}`,customer:"You",phone:waPh||"07XXXXXXXX",waPhone:waPh,items:cartItems.map(i=>({name:i.name,qty:i.qty,price:i.price})),total,fee,location:"Your Location",dist:3.2,branch:"Kitintale",status:"pending",txId:ref,rider:null,ts:new Date().toLocaleTimeString("en-UG",{hour:"2-digit",minute:"2-digit"}),payMethod};
    setPlaced(o);setCart({});setTxId("");setWaPh("");setVisaC("");setCnV("");setCeV("");setCvV("");setCnmV("");setScreen("tracking");setTab("orders");
  };

  const filtered=cat==="all"?products:products.filter(p=>p.cat===cat);

  const WRAP={fontFamily:F,background:T.bg,minHeight:"100vh",maxWidth:430,margin:"0 auto",color:T.tp,paddingBottom:72,position:"relative"};

  /* Floating toast notification */
  const Toast=()=>notification?(
    <div style={{position:"fixed",top:70,left:"50%",transform:"translateX(-50%)",background:T.gold,color:T.bg,padding:"10px 20px",borderRadius:30,fontWeight:700,fontSize:13,zIndex:500,boxShadow:`0 4px 20px ${T.gGlow}`,whiteSpace:"nowrap",animation:"fadeIn .2s ease"}}>
      {notification}
    </div>
  ):null;

  /* ─── BOTTOM NAV ─── */
  const BottomNav=()=>(
    <nav style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:T.bgCard,borderTop:`1px solid ${T.bdr}`,display:"flex",zIndex:90,backdropFilter:"blur(10px)"}}>
      {[
        {id:"home",  ico:"🏠",lbl:"Home"},
        {id:"search",ico:"🔍",lbl:"Search"},
        {id:"favourites",ico:"❤️",lbl:favs.length>0?`Favs (${favs.length})`:"Favs"},
        {id:"orders",ico:"📦",lbl:"Orders"},
        {id:"profile",ico:"👤",lbl:"Profile"},
      ].map(({id,ico,lbl})=>{
        const active=tab===id;
        return(
          <button key={id} onClick={()=>{setTab(id);if(id==="orders")setScreen("tracking");else if(id!=="search"&&id!=="favourites"&&id!=="profile")setScreen("home");}} style={{flex:1,background:"none",border:"none",padding:"10px 2px 8px",display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer",fontFamily:F,position:"relative"}}>
            {id==="cart"&&cartCount>0&&<span style={{position:"absolute",top:6,right:"calc(50% - 18px)",background:T.red,color:"#fff",borderRadius:"50%",width:16,height:16,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:900}}>{cartCount}</span>}
            <span style={{fontSize:22,filter:active?"none":"grayscale(0.8)",opacity:active?1:.6,transition:"all .2s"}}>{ico}</span>
            <span style={{fontSize:9,fontWeight:active?800:500,color:active?T.gold:T.ts,letterSpacing:.2}}>{lbl}</span>
            {active&&<div style={{width:18,height:2.5,background:T.gold,borderRadius:2,marginTop:1,boxShadow:`0 0 6px ${T.gold}`}}/>}
          </button>
        );
      })}
      {/* Hidden staff dot */}
      <button onClick={()=>setShowLogin(true)} style={{position:"absolute",bottom:4,right:2,background:"none",border:"none",cursor:"pointer",padding:4,opacity:.06}} aria-hidden>●</button>
    </nav>
  );

  /* ─── HEADER ─── */
  const Header=({title,back,backFn,right})=>(
    <>
      <div style={{background:T.bg,padding:"14px 16px 12px",position:"sticky",top:0,zIndex:50,borderBottom:`1px solid ${T.bdr}`}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          {back?<button onClick={backFn||(() =>setScreen("home"))} style={{background:T.bgEl,border:`1px solid ${T.bdr}`,borderRadius:10,width:36,height:36,cursor:"pointer",color:T.tp,fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>←</button>
          :<div style={{display:"flex",alignItems:"center",gap:10}}>
            <img src="/logo.png" alt="" style={{height:36,objectFit:"contain"}} onError={e=>e.target.style.display="none"}/>
            <div><div style={{fontWeight:900,fontSize:14,color:T.gold,letterSpacing:.5}}>GOLD SUPERMARKET</div><div style={{fontSize:9,color:T.ts}}>📍 Kitintale · Mile 8, Gayaza Rd</div></div>
          </div>}
          {title&&!back&&<div/>}
          {title&&back&&<span style={{fontWeight:800,fontSize:16,color:T.tp}}>{title}</span>}
          {right||<button onClick={()=>setScreen("cart")} style={{background:T.gold,border:"none",borderRadius:12,padding:"8px 14px",fontWeight:800,fontSize:12,cursor:"pointer",color:"#000",display:"flex",alignItems:"center",gap:6,boxShadow:`0 2px 12px ${T.gGlow}`}}>
            🛒 {cartCount>0&&<span style={{background:"#000",color:T.gold,borderRadius:"50%",width:18,height:18,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:900}}>{cartCount}</span>}
          </button>}
        </div>
        {/* Location bar */}
        {!back&&<div style={{display:"flex",alignItems:"center",gap:8,marginTop:10,background:T.bgEl,borderRadius:12,padding:"9px 13px",border:`1px solid ${T.bdr}`}}>
          <span style={{color:T.gold,fontSize:14}}>📍</span>
          <span style={{fontSize:12,color:T.tp,flex:1}}>Deliver to <b>Kitintale Rd No.1</b></span>
          <span style={{fontSize:11,color:T.gold,fontWeight:700}}>▼</span>
        </div>}
      </div>
    </>
  );

  /* ─── DETAIL SCREEN ─── */
  if(screen==="detail"&&detail) return(
    <div style={{...WRAP,paddingBottom:90}}>
      <Header back title={detail.name} backFn={()=>{setScreen("home");setDetail(null);}} right={
        <button onClick={()=>toggleFav(detail.sku)} style={{background:T.bgEl,border:`1px solid ${T.bdr}`,borderRadius:"50%",width:36,height:36,cursor:"pointer",fontSize:20,display:"flex",alignItems:"center",justifyContent:"center"}}>{favs.includes(detail.sku)?"❤️":"🤍"}</button>
      }/>
      <Toast/>
      <div style={{height:280,background:T.bgEl,overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
        {detail.image?<img src={detail.image} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:120}}>{detail.emoji}</span>}
        {detail.discount>0&&<div style={{position:"absolute",top:14,right:14,background:T.green,color:"#fff",fontWeight:900,fontSize:13,padding:"5px 12px",borderRadius:30}}>-{detail.discount}%</div>}
        {detail.express&&<div style={{position:"absolute",bottom:14,left:14,background:`${T.gold}EE`,color:"#000",fontWeight:800,fontSize:11,padding:"5px 12px",borderRadius:30}}>⚡ Express 30min</div>}
      </div>
      <div style={{padding:"18px 16px 100px"}}>
        <div style={{fontSize:8,color:T.tm,fontFamily:"monospace",marginBottom:4}}>{detail.sku}</div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
          <h2 style={{fontWeight:900,fontSize:22,color:T.tp,margin:0,lineHeight:1.2}}>{detail.name}</h2>
        </div>
        <div style={{fontSize:12,color:T.ts,marginBottom:14}}>{detail.variant} · per {detail.unit}</div>
        <div style={{display:"flex",alignItems:"baseline",gap:12,marginBottom:16}}>
          <span style={{fontWeight:900,fontSize:28,color:T.gold}}>{ugx(detail.price)}</span>
          {detail.origPrice>detail.price&&<span style={{fontSize:14,color:T.tm,textDecoration:"line-through"}}>{ugx(detail.origPrice)}</span>}
        </div>
        <GLine/>
        <div style={{background:T.bgCard,borderRadius:14,padding:14,marginBottom:14,border:`1px solid ${T.bdr}`}}>
          <div style={{fontWeight:700,fontSize:13,color:T.tp,marginBottom:10}}>Product Details</div>
          {[["SKU",detail.sku],["Category",categories.find(c=>c.id===detail.cat)?.name||detail.cat],["Pack / Unit",detail.unit],["Stock",detail.stock>0?`${detail.stock} available`:"Out of stock"]].map(([k,v])=>(
            <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${T.bdr}`,fontSize:12}}>
              <span style={{color:T.ts}}>{k}</span><span style={{color:T.tp,fontWeight:600}}>{v}</span>
            </div>
          ))}
        </div>
      </div>
      {detail.stock>0&&(
        <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:T.bgCard,borderTop:`1px solid ${T.bdr}`,padding:"14px 16px 20px"}}>
          {(cart[detail.sku]||0)===0
            ?<Btn full onClick={()=>add(detail.sku)} style={{padding:15,fontSize:15,borderRadius:14}}>+ Add to Cart</Btn>
            :<div style={{display:"flex",alignItems:"center",gap:14}}>
              <button onClick={()=>rem(detail.sku)} style={{width:50,height:50,borderRadius:14,background:T.bgEl,border:`1px solid ${T.gold}44`,color:T.gold,fontSize:26,cursor:"pointer",fontWeight:900}}>−</button>
              <span style={{flex:1,textAlign:"center",fontWeight:900,fontSize:22,color:T.tp}}>{cart[detail.sku]}</span>
              <button onClick={()=>add(detail.sku)} style={{width:50,height:50,borderRadius:14,background:T.gold,border:"none",color:"#000",fontSize:26,cursor:"pointer",fontWeight:900}}>+</button>
            </div>}
        </div>
      )}
      <BottomNav/>
    </div>
  );

  /* ─── TRACKING ─── */
  if(screen==="tracking"){
    const order=placed||INIT_ORDERS[2];
    const steps=["Order Placed","Payment Verified","Rider Assigned","On the Way","Delivered"];
    const si=["pending","verified","assigned","on_the_way","delivered"].indexOf(order.status);
    return(
      <div style={WRAP}>
        <Header back title="Delivery Tracker" backFn={()=>{setScreen("home");setTab("home");}} right={
          <div style={{width:34,height:34,borderRadius:"50%",background:T.bgEl,overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",border:`1px solid ${T.bdr}`}}><span style={{fontSize:18}}>👤</span></div>
        }/>
        <Toast/>
        <div style={{padding:14}}>
          {/* Map placeholder */}
          <div style={{height:180,background:`linear-gradient(135deg,${T.bgEl},${T.bgMid})`,borderRadius:18,marginBottom:14,overflow:"hidden",position:"relative",border:`1px solid ${T.bdr}`}}>
            <div style={{position:"absolute",inset:0,backgroundImage:`repeating-linear-gradient(0deg,${T.bdr}22 0,${T.bdr}22 1px,transparent 0,transparent 40px),repeating-linear-gradient(90deg,${T.bdr}22 0,${T.bdr}22 1px,transparent 0,transparent 40px)`}}/>
            <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:8}}>
              <div style={{fontSize:40}}>🗺️</div>
              <div style={{color:T.ts,fontSize:12,fontWeight:600}}>Live Map · {order.location}</div>
              <div style={{background:T.gold,color:"#000",padding:"6px 16px",borderRadius:20,fontWeight:800,fontSize:12}}>📍 Tracking Active</div>
            </div>
            {/* Rider marker */}
            <div style={{position:"absolute",top:"40%",left:"60%",fontSize:28,filter:"drop-shadow(0 2px 4px rgba(0,0,0,.5))"}}>🏍️</div>
            <div style={{position:"absolute",top:"55%",left:"30%",fontSize:22}}>📍</div>
          </div>

          {/* ETA card */}
          <div style={{background:T.bgCard,borderRadius:16,padding:14,marginBottom:12,border:`1px solid ${T.bdr}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div><div style={{fontWeight:800,fontSize:18,color:T.tp}}>Delivery in <span style={{color:T.gold}}>10 min.</span></div><div style={{fontSize:11,color:T.ts,marginTop:2}}>Estimated by GPS tracking</div></div>
            <div style={{background:T.gold,color:"#000",borderRadius:12,padding:"8px 14px",fontWeight:900,fontSize:13}}>ON</div>
          </div>

          {/* Rider info */}
          <div style={{background:T.bgCard,borderRadius:16,padding:0,overflow:"hidden",border:`1px solid ${T.bdr}`,marginBottom:12}}>
            {[{ref:`DLC${order.id.slice(-9)}`,name:INIT_RIDERS[0].name,role:"Delivery Rider",status:"on_the_way",rating:"9/10"},{ref:`DLC${order.id.slice(-9)}`,name:"Gold Supermarket",role:"Suger of Bartallos",status:"verified",pill:"Mail"}].map((r,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",borderBottom:i===0?`1px solid ${T.bdr}`:"none"}}>
                <div style={{width:40,height:40,borderRadius:"50%",background:T.bgEl,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{i===0?"🏍️":"🏪"}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:700,fontSize:12,color:T.tp,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.ref}</div>
                  <div style={{fontSize:11,color:T.ts}}>{r.role}</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  {r.rating&&<Badge label={r.rating} color={T.gold}/>}
                  <SPill status={r.status}/>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div style={{background:T.bgCard,borderRadius:16,padding:14,border:`1px solid ${T.bdr}`,marginBottom:12}}>
            <div style={{fontWeight:700,fontSize:13,color:T.tp,marginBottom:10}}>Order #{order.id}</div>
            {order.items.map((it,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:6,color:T.ts}}>
                <span>{it.name} ×{it.qty}</span><span style={{color:T.tp,fontWeight:600}}>{ugx(it.price*it.qty)}</span>
              </div>
            ))}
            <GLine/>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:T.ts,marginBottom:4}}><span>Delivery Fee</span><span>{ugx(order.fee)}</span></div>
            <div style={{display:"flex",justifyContent:"space-between",fontWeight:900,fontSize:15,color:T.gold}}><span>Total</span><span>{ugx(order.total)}</span></div>
          </div>

          {/* Status steps */}
          <div style={{background:T.bgCard,borderRadius:16,padding:14,border:`1px solid ${T.bdr}`,marginBottom:12}}>
            {steps.map((step,i)=>{
              const done=i<=si;
              return <div key={step} style={{display:"flex",alignItems:"center",gap:12,marginBottom:i<4?16:0}}>
                <div style={{width:28,height:28,borderRadius:"50%",background:done?T.gold:T.bgEl,border:i===si+1?`2px solid ${T.gold}`:"none",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:900,color:done?"#000":T.ts,flexShrink:0}}>{done?"✓":i+1}</div>
                <span style={{fontWeight:done?700:400,color:done?T.tp:T.ts,fontSize:13}}>{step}</span>
                {i===3&&order.status==="on_the_way"&&<span style={{marginLeft:"auto",fontSize:18}}>🏍️</span>}
              </div>;
            })}
          </div>

          {/* Action buttons */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
            <Btn outline style={{padding:13}}>📞 Contact</Btn>
            <Btn style={{padding:13}}>🔔 Confirm</Btn>
          </div>
          <Btn full style={{padding:14,fontSize:15,borderRadius:14}} onClick={()=>{setScreen("home");setTab("home");}}>🛒 Continue Shopping</Btn>
        </div>
        <BottomNav/>
        {showLogin&&<StaffLogin onLogin={s=>{setShowLogin(false);onStaffAccess(s);}} onClose={()=>setShowLogin(false)}/>}
      </div>
    );
  }

  /* ─── CHECKOUT ─── */
  if(screen==="checkout") return(
    <div style={WRAP}>
      <Header back title="Checkout" backFn={()=>setScreen("cart")} right={<div/>}/>
      <Toast/>
      <div style={{padding:14,display:"flex",flexDirection:"column",gap:12}}>
        <div style={{background:T.bgCard,borderRadius:16,padding:14,border:`1px solid ${T.bdr}`}}>
          <div style={{fontWeight:700,fontSize:13,color:T.tp,marginBottom:10}}>📍 Delivery Location</div>
          <div style={{background:T.bgEl,borderRadius:10,padding:10,fontSize:12,color:T.ts}}>📡 Detected: <b style={{color:T.tp}}>Ntinda, 2.1km · Kitintale Branch</b></div>
          <div style={{marginTop:8,padding:"8px 12px",background:"#22C55E12",borderRadius:8,fontSize:11,color:T.green,fontWeight:600,border:`1px solid ${T.green}33`}}>✅ Delivery available · Est. 28 min · Fee: {ugx(fee)}</div>
        </div>
        <div style={{background:T.bgCard,borderRadius:16,padding:14,border:`1px solid ${T.bdr}`}}>
          <div style={{fontWeight:700,fontSize:13,color:T.tp,marginBottom:10}}>Order Summary</div>
          {cartItems.map((i,k)=>(
            <div key={k} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
              <div style={{width:40,height:40,borderRadius:10,background:T.bgEl,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{i.image?<img src={i.image} style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:10}} alt=""/>:i.emoji}</div>
              <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600,color:T.tp}}>{i.name}</div><div style={{fontSize:10,color:T.ts}}>{i.variant} ×{i.qty}</div></div>
              <span style={{fontWeight:700,color:T.tp,fontSize:13}}>{ugx(i.price*i.qty)}</span>
            </div>
          ))}
          <GLine/>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:T.ts,marginBottom:4}}><span>Subtotal</span><span>{ugx(subtotal)}</span></div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:T.ts,marginBottom:4}}><span>Delivery Fee</span><span>{ugx(fee)}</span></div>
          <div style={{display:"flex",justifyContent:"space-between",fontWeight:900,fontSize:16,color:T.gold,marginTop:8}}><span>Total</span><span>{ugx(total)}</span></div>
        </div>
        <PaySection payMethod={payMethod} setPayMethod={setPayMethod} txId={txId} setTxId={setTxId} waPhone={waPh} setWaPhone={setWaPh} cardNum={cnV} setCardNum={setCnV} cardExp={ceV} setCardExp={setCeV} cardCvv={cvV} setCardCvv={setCvV} cardName={cnmV} setCardName={setCnmV} visaContact={visaC} setVisaContact={setVisaC}/>
        <Btn full disabled={!canPlace()} onClick={placeOrder} style={{padding:17,fontSize:16,borderRadius:14,letterSpacing:.3}}>
          {payMethod==="visa"?"🔒 Pay Securely with Visa":"✅ I Have Paid — Place Order"}
        </Btn>
        {!canPlace()&&<div style={{textAlign:"center",fontSize:11,color:T.ts}}>{payMethod==="visa"?"Complete all card fields to continue":"Enter valid 10–14 digit reference"}</div>}
      </div>
      <BottomNav/>
    </div>
  );

  /* ─── CART ─── */
  if(screen==="cart") return(
    <div style={WRAP}>
      <Header back title="Cart" backFn={()=>{setScreen("home");setTab("home");}} right={
        cartItems.length>0?<button onClick={()=>setCart({})} style={{background:"none",border:"none",color:T.red,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:F}}>Clear All</button>:<div/>
      }/>
      <Toast/>
      <div style={{padding:14}}>
        {/* Delivery method toggle */}
        {cartItems.length>0&&<div style={{background:T.bgCard,borderRadius:14,padding:4,marginBottom:14,display:"flex",border:`1px solid ${T.bdr}`}}>
          {["Delivery","Pickup"].map((m,i)=>(
            <div key={m} style={{flex:1,textAlign:"center",padding:"9px 0",borderRadius:11,background:i===0?T.gold:"transparent",color:i===0?"#000":T.ts,fontWeight:i===0?800:500,fontSize:13,cursor:"pointer",transition:"all .2s"}}>{m}</div>
          ))}
        </div>}

        {cartItems.length===0
          ?<div style={{textAlign:"center",padding:"70px 20px",color:T.ts}}>
            <div style={{fontSize:70,marginBottom:14}}>🛒</div>
            <div style={{fontWeight:800,fontSize:18,marginBottom:8,color:T.tp}}>Your cart is empty</div>
            <div style={{fontSize:13,marginBottom:24}}>Add some products to get started</div>
            <Btn onClick={()=>{setScreen("home");setTab("home");}}>Browse Products</Btn>
          </div>
          :<>
            {/* Cart items in list style (matching wireframe) */}
            <div style={{background:T.bgCard,borderRadius:16,overflow:"hidden",border:`1px solid ${T.bdr}`,marginBottom:14}}>
              {cartItems.map((item,idx)=>(
                <div key={item.sku} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",borderBottom:idx<cartItems.length-1?`1px solid ${T.bdr}`:"none"}}>
                  <div style={{width:48,height:48,borderRadius:12,background:T.bgEl,overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    {item.image?<img src={item.image} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:<span style={{fontSize:24}}>{item.emoji}</span>}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:700,fontSize:13,color:T.tp,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.name}</div>
                    <div style={{fontSize:10,color:T.ts,marginBottom:3}}>{item.variant}</div>
                    <div style={{fontWeight:800,color:T.gold,fontSize:14}}>{ugx(item.price)}</div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
                    <button onClick={()=>rem(item.sku)} style={{width:30,height:30,borderRadius:8,background:T.bgEl,border:`1px solid ${T.bdr}`,color:T.gold,fontWeight:900,cursor:"pointer",fontSize:16}}>−</button>
                    <span style={{fontWeight:900,fontSize:15,minWidth:22,textAlign:"center",color:T.tp}}>{item.qty}</span>
                    <button onClick={()=>add(item.sku)} style={{width:30,height:30,borderRadius:8,background:T.gold,border:"none",color:"#000",fontWeight:900,cursor:"pointer",fontSize:16}}>+</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals card */}
            <div style={{background:T.bgCard,borderRadius:16,padding:16,border:`1px solid ${T.bdr}`,marginBottom:14}}>
              <div style={{fontWeight:700,fontSize:13,color:T.tp,marginBottom:10}}>Order Total</div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:13,color:T.ts,marginBottom:6}}><span>Subtotal ({cartCount} items)</span><span>{ugx(subtotal)}</span></div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:13,color:T.ts,marginBottom:6}}><span>Delivery Fee</span><span style={{color:T.gold,fontWeight:700}}>{ugx(fee)}</span></div>
              <GLine/>
              <div style={{display:"flex",justifyContent:"space-between",fontWeight:900,fontSize:17,color:T.gold}}><span>Total</span><span>{ugx(total)}</span></div>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
              <Btn outline style={{padding:13}} onClick={()=>{setScreen("home");setTab("home");}}>← Continue</Btn>
              <Btn style={{padding:13}} onClick={()=>setScreen("checkout")}>Checkout →</Btn>
            </div>
          </>}
      </div>
      <BottomNav/>
    </div>
  );

  /* ─── SEARCH TAB ─── */
  if(tab==="search") return(
    <div style={WRAP}>
      <Header/>
      <Toast/>
      <div style={{padding:"0 14px 14px"}}>
        <Inp value={search} onChange={setSearch} placeholder="Search products, SKU, category…" prefix="🔍" style={{fontSize:14,padding:"13px 14px 13px 40px"}}/>
        {search&&searchRes.length>0&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:4}}>
            {searchRes.map(p=><PCard key={p.sku} p={p} cart={cart} add={add} rem={rem} onTap={p=>{setDetail(p);setScreen("detail");}} cats={categories} favs={favs} toggleFav={toggleFav}/>)}
          </div>
        )}
        {search&&searchRes.length===0&&(
          <div style={{textAlign:"center",padding:"50px 20px",color:T.ts}}>
            <div style={{fontSize:50,marginBottom:10}}>🔍</div>
            <div style={{fontWeight:700,fontSize:15,color:T.tp,marginBottom:6}}>No results for "{search}"</div>
            <div style={{fontSize:12}}>Try different keywords or browse categories</div>
          </div>
        )}
        {!search&&<>
          <div style={{fontWeight:700,fontSize:14,color:T.ts,marginBottom:12}}>Popular Searches</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {["Rice","Bread","Milk","Chicken","Sugar","Coca-Cola","Diapers","Shawarma","Birthday Cake"].map(s=>(
              <button key={s} onClick={()=>setSearch(s)} style={{background:T.bgEl,border:`1px solid ${T.bdr}`,borderRadius:20,padding:"7px 14px",fontSize:12,color:T.ts,cursor:"pointer",fontFamily:F,fontWeight:500,transition:"all .15s"}} onMouseEnter={e=>{e.target.style.borderColor=T.gold;e.target.style.color=T.gold;}} onMouseLeave={e=>{e.target.style.borderColor=T.bdr;e.target.style.color=T.ts;}}>{s}</button>
            ))}
          </div>
        </>}
      </div>
      <BottomNav/>
      {showLogin&&<StaffLogin onLogin={s=>{setShowLogin(false);onStaffAccess(s);}} onClose={()=>setShowLogin(false)}/>}
    </div>
  );

  /* ─── FAVOURITES TAB ─── */
  if(tab==="favourites") return(
    <div style={WRAP}>
      <Header/>
      <Toast/>
      <div style={{padding:"0 14px"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 0 14px"}}>
          <span style={{fontSize:22}}>❤️</span>
          <span style={{fontWeight:800,fontSize:18,color:T.tp}}>Favourites</span>
          {favProds.length>0&&<Badge label={`${favProds.length} saved`}/>}
        </div>
        {favProds.length===0
          ?<div style={{textAlign:"center",padding:"60px 20px",color:T.ts}}>
            <div style={{fontSize:60,marginBottom:12}}>🤍</div>
            <div style={{fontWeight:800,fontSize:17,marginBottom:8,color:T.tp}}>Nothing saved yet</div>
            <div style={{fontSize:13,marginBottom:20}}>Tap 🤍 on any product to save it here</div>
            <Btn onClick={()=>setTab("home")}>Browse Products</Btn>
          </div>
          :<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {favProds.map(p=><PCard key={p.sku} p={p} cart={cart} add={add} rem={rem} onTap={p=>{setDetail(p);setScreen("detail");}} cats={categories} favs={favs} toggleFav={toggleFav}/>)}
          </div>}
      </div>
      <BottomNav/>
      {showLogin&&<StaffLogin onLogin={s=>{setShowLogin(false);onStaffAccess(s);}} onClose={()=>setShowLogin(false)}/>}
    </div>
  );

  /* ─── PROFILE TAB ─── */
  if(tab==="profile") return(
    <div style={WRAP}>
      <Header/>
      <Toast/>
      <div style={{padding:"0 14px"}}>
        <div style={{textAlign:"center",padding:"24px 0 20px"}}>
          <div style={{width:80,height:80,borderRadius:"50%",background:T.bgEl,display:"flex",alignItems:"center",justifyContent:"center",fontSize:40,margin:"0 auto 12px",border:`2px solid ${T.gold}44`}}>👤</div>
          <div style={{fontWeight:800,fontSize:18,color:T.tp,marginBottom:4}}>My Account</div>
          <div style={{fontSize:12,color:T.ts}}>Gold Supermarket Member</div>
        </div>
        <GLine/>
        {[["📦","My Orders",()=>{setTab("orders");setScreen("tracking");}],["❤️","Saved Items",()=>setTab("favourites")],["📍","Delivery Addresses",()=>{}],["🔔","Notifications",()=>{}],["💳","Payment Methods",()=>{}],["🌐","Language & Region",()=>{}]].map(([ico,lbl,fn])=>(
          <div key={lbl} onClick={fn} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 0",borderBottom:`1px solid ${T.bdr}`,cursor:"pointer"}}>
            <span style={{fontSize:20,width:28,textAlign:"center"}}>{ico}</span>
            <span style={{flex:1,fontWeight:600,fontSize:14,color:T.tp}}>{lbl}</span>
            <span style={{color:T.ts,fontSize:16}}>›</span>
          </div>
        ))}
        <div style={{marginTop:20,padding:"14px 0",borderTop:`1px solid ${T.bdr}`,textAlign:"center"}}>
          <button onClick={()=>setShowLogin(true)} style={{background:"none",border:"none",color:T.ts,fontSize:12,cursor:"pointer",fontFamily:F}}>🔑 Staff Access</button>
        </div>
      </div>
      <BottomNav/>
      {showLogin&&<StaffLogin onLogin={s=>{setShowLogin(false);onStaffAccess(s);}} onClose={()=>setShowLogin(false)}/>}
    </div>
  );

  /* ─── HOME ─── */
  return(
    <div style={WRAP}>
      <style>{`
        @keyframes fadeIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
        ::-webkit-scrollbar{display:none}
        *{-ms-overflow-style:none;scrollbar-width:none}
      `}</style>
      <Header/>
      <Toast/>

      {/* Category scroll — image cards like wireframe */}
      <div style={{padding:"12px 14px 4px"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
          <span style={{fontWeight:700,fontSize:13,color:T.ts,letterSpacing:.3}}>THE CATEGORIES</span>
        </div>
        <div style={{display:"flex",gap:10,overflowX:"auto"}}>
          {[{id:"all",name:"All",icon:"🛒",color:T.gold},...categories].map(c=>(
            <div key={c.id} onClick={()=>setCat(c.id)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5,flexShrink:0,cursor:"pointer"}}>
              <div style={{width:64,height:64,borderRadius:16,background:cat===c.id?`${T.gold}22`:T.bgCard,border:`2px solid ${cat===c.id?T.gold:T.bdr}`,overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s",boxShadow:cat===c.id?`0 0 0 3px ${T.gold}33`:"none"}}>
                {c.image?<img src={c.image} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:<span style={{fontSize:28}}>{c.icon}</span>}
              </div>
              <span style={{fontSize:10,fontWeight:cat===c.id?800:500,color:cat===c.id?T.gold:T.ts,whiteSpace:"nowrap"}}>{c.name==="All"?"All":c.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Flash sales */}
      {cat==="all"&&flashItems.length>0&&(
        <div style={{margin:"14px 14px 0"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:6,height:20,background:T.gold,borderRadius:3}}/>
              <span style={{fontWeight:800,fontSize:15,color:T.tp}}>⚡ Flash Sales</span>
            </div>
            <div style={{display:"flex",gap:4,alignItems:"center"}}>
              {[h,m,s].map((t,i)=>(
                <React.Fragment key={i}>
                  <div style={{background:T.bgEl,border:`1px solid ${T.bdr}`,color:T.gold,padding:"4px 8px",borderRadius:8,fontFamily:"monospace",fontWeight:900,fontSize:14}}>{t}</div>
                  {i<2&&<span style={{color:T.ts,fontWeight:900,fontSize:14}}>:</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
            {shownFlash.map(p=>(
              <div key={p.sku} onClick={()=>{setDetail(p);setScreen("detail");}} style={{background:T.bgCard,borderRadius:14,overflow:"hidden",cursor:"pointer",border:`1.5px solid ${cart[p.sku]?T.gold:T.bdr}`,transition:"all .15s"}}>
                <div style={{height:80,background:T.bgEl,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
                  {p.image?<img src={p.image} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:<span style={{fontSize:36}}>{p.emoji}</span>}
                </div>
                <div style={{padding:"8px 8px 10px"}}>
                  <div style={{fontSize:10,fontWeight:700,color:T.tp,lineHeight:1.2,marginBottom:2}}>{p.name}</div>
                  <div style={{fontSize:8,color:T.ts,marginBottom:4}}>{p.variant}</div>
                  <div style={{color:T.gold,fontWeight:900,fontSize:12,marginBottom:4}}>{ugx(p.price)}</div>
                  <button onClick={e=>{e.stopPropagation();add(p.sku);}} style={{width:"100%",background:cart[p.sku]?T.bgEl:T.gold,border:cart[p.sku]?`1px solid ${T.gold}`:"none",borderRadius:8,padding:"5px 0",fontSize:10,fontWeight:800,color:cart[p.sku]?T.gold:"#000",cursor:"pointer",fontFamily:F}}>
                    {cart[p.sku]?`✓ ${cart[p.sku]} in cart`:"+ Add"}
                  </button>
                </div>
              </div>
            ))}
          </div>
          {flashItems.length>6&&(
            <button onClick={()=>setFlashMore(f=>!f)} style={{width:"100%",marginTop:10,background:`${T.gold}12`,border:`1px solid ${T.gold}44`,borderRadius:12,padding:"10px 0",fontWeight:700,fontSize:12,color:T.gold,cursor:"pointer",fontFamily:F}}>
              {flashMore?`▲ Show Less`:`▼ Load More Flash Deals (${flashItems.length-6} more)`}
            </button>
          )}
        </div>
      )}

      {/* Featured / All products */}
      <div style={{padding:"16px 14px 0"}}>
        {cat==="all"?(
          <>
            {/* Fresh Produce section */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:6,height:20,background:T.gold,borderRadius:3}}/>
                <span style={{fontWeight:800,fontSize:15,color:T.tp}}>Fresh Produce</span>
              </div>
              <button style={{background:"none",border:"none",color:T.gold,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:F}}>Bany Poses →</button>
            </div>
            {/* Horizontal scroll — big cards */}
            <div style={{display:"flex",gap:12,overflowX:"auto",marginBottom:20}}>
              {products.filter(p=>["FG","BK"].includes(p.cat)&&p.stock>0).slice(0,6).map(p=>(
                <div key={p.sku} onClick={()=>{setDetail(p);setScreen("detail");}} style={{background:T.bgCard,borderRadius:16,overflow:"hidden",flexShrink:0,width:130,cursor:"pointer",border:`1.5px solid ${cart[p.sku]?T.gold:T.bdr}`}}>
                  <div style={{height:100,background:T.bgEl,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
                    {p.image?<img src={p.image} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:<span style={{fontSize:46}}>{p.emoji}</span>}
                  </div>
                  <div style={{padding:"8px 8px 10px"}}>
                    <div style={{fontSize:11,fontWeight:700,color:T.tp,lineHeight:1.2,marginBottom:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.name}</div>
                    <div style={{color:T.gold,fontWeight:900,fontSize:13}}>{ugx(p.price)}</div>
                    <div style={{display:"flex",alignItems:"center",gap:4,marginTop:2}}><span style={{fontSize:10,color:"#F5C518"}}>★</span><span style={{fontSize:10,color:T.ts}}>{(4+Math.random()).toFixed(1)} • {Math.floor(Math.random()*200+50)}</span></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Featured Products section */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:6,height:20,background:T.gold,borderRadius:3}}/>
                <span style={{fontWeight:800,fontSize:15,color:T.tp}}>Featured Products</span>
              </div>
              <button style={{background:"none",border:"none",color:T.gold,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:F}}>See All →</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
              {products.filter(p=>p.stock>0).slice(0,6).map(p=><PCard key={p.sku} p={p} cart={cart} add={add} rem={rem} onTap={p=>{setDetail(p);setScreen("detail");}} cats={categories} favs={favs} toggleFav={toggleFav}/>)}
            </div>

            {/* Per-category sections */}
            {categories.map(c=>{
              const items=products.filter(p=>p.cat===c.id&&p.stock>0);
              if(!items.length)return null;
              return(
                <div key={c.id} style={{marginBottom:22}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{width:6,height:20,background:c.color||T.gold,borderRadius:3}}/>
                      <span style={{fontWeight:800,fontSize:15,color:T.tp}}>{c.name}</span>
                    </div>
                    <button onClick={()=>setCat(c.id)} style={{background:"none",border:`1px solid ${T.bdr}`,borderRadius:20,padding:"4px 12px",fontSize:11,fontWeight:700,color:T.gold,cursor:"pointer",fontFamily:F}}>See All →</button>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                    {items.slice(0,4).map(p=><PCard key={p.sku} p={p} cart={cart} add={add} rem={rem} onTap={p=>{setDetail(p);setScreen("detail");}} cats={categories} favs={favs} toggleFav={toggleFav}/>)}
                  </div>
                </div>
              );
            })}
          </>
        ):(
          <>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
              <div style={{width:6,height:20,background:T.gold,borderRadius:3}}/>
              <span style={{fontWeight:800,fontSize:16,color:T.tp}}>{categories.find(c=>c.id===cat)?.name||cat}</span>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              {products.filter(p=>p.cat===cat).map(p=><PCard key={p.sku} p={p} cart={cart} add={add} rem={rem} onTap={p=>{setDetail(p);setScreen("detail");}} cats={categories} favs={favs} toggleFav={toggleFav}/>)}
            </div>
          </>
        )}
      </div>

      <BottomNav/>
      {showLogin&&<StaffLogin onLogin={s=>{setShowLogin(false);onStaffAccess(s);}} onClose={()=>setShowLogin(false)}/>}
    </div>
  );
}

/* ════════════════════ DASHBOARD (Admin/Manager) ════════════════════ */
function Dashboard({products,setProducts,categories,setCategories,riders,setRiders,staff,onLogout}){
  const isAdmin=staff.role==="admin";
  const [tab,setTab]=useState("orders");
  const [orders,setOrders]=useState(INIT_ORDERS);
  const [filterStatus,setFilterStatus]=useState("all");
  const [showAssign,setShowAssign]=useState(null);
  const [catFilter,setCatFilter]=useState("all");
  const [showProdModal,setShowProdModal]=useState(false);
  const [editProd,setEditProd]=useState(null);
  const [np,setNp]=useState({name:"",variant:"",cat:"FG",price:"",origPrice:"",stock:"",unit:"pack",emoji:"📦",image:null,express:false,discount:0,badge:""});
  const [showCatModal,setShowCatModal]=useState(false);
  const [editCat,setEditCat]=useState(null);
  const [nc,setNc]=useState({id:"",name:"",icon:"🛒",color:T.gold,image:null});
  const [showRiderModal,setShowRiderModal]=useState(false);
  const [editRider,setEditRider]=useState(null);
  const [rf,setRf]=useState({name:"",phone:"",bike:"",branch:"Kitintale",status:"available",photo:null});
  const [notifs,setNotifs]=useState([{id:1,num:"+256 774 000 001",role:"Kitintale Manager",branch:"Kitintale",active:true},{id:2,num:"+256 755 000 002",role:"Mile 8 Manager",branch:"Mile 8",active:true},{id:3,num:"+256 700 000 003",role:"Supervisor",branch:"All",active:false}]);

  const fO=filterStatus==="all"?orders:orders.filter(o=>o.status===filterStatus);
  const fP=catFilter==="all"?products:products.filter(p=>p.cat===catFilter);
  const verifyPay=id=>setOrders(os=>os.map(o=>o.id===id?{...o,status:"verified"}:o));
  const assignR=(oid,rid)=>{setOrders(os=>os.map(o=>o.id===oid?{...o,status:"on_the_way",rider:rid}:o));setRiders(rs=>rs.map(r=>r.id===rid?{...r,status:"busy"}:r));setShowAssign(null);};
  const markDone=id=>{const o=orders.find(x=>x.id===id);setOrders(os=>os.map(x=>x.id===id?{...x,status:"delivered"}:x));if(o?.rider)setRiders(rs=>rs.map(r=>r.id===o.rider?{...r,status:"available",deliveries:r.deliveries+1}:r));};
  const openEditP=p=>{setEditProd(p);setNp({...p,price:String(p.price),origPrice:String(p.origPrice||""),stock:String(p.stock),discount:String(p.discount||0),badge:p.badge||""});setShowProdModal(true);};
  const openAddP=()=>{setEditProd(null);setNp({name:"",variant:"",cat:"FG",price:"",origPrice:"",stock:"",unit:"pack",emoji:"📦",image:null,express:false,discount:0,badge:""});setShowProdModal(true);};
  const saveP=()=>{if(!np.name||!np.price)return;if(editProd)setProducts(ps=>ps.map(p=>p.sku===editProd.sku?{...np,sku:editProd.sku,price:+np.price,origPrice:+np.origPrice||+np.price,stock:+np.stock,discount:+np.discount}:p));else{const sku=mkSKU(np.cat);setProducts(ps=>[...ps,{...np,sku,price:+np.price,origPrice:+np.origPrice||+np.price,stock:+np.stock,discount:+np.discount}]);}setShowProdModal(false);};
  const saveC=()=>{if(!nc.name||!nc.id)return;if(editCat)setCategories(cs=>cs.map(c=>c.id===editCat.id?{...nc}:c));else setCategories(cs=>[...cs,{...nc}]);setShowCatModal(false);};
  const saveR=()=>{if(!rf.name||!rf.phone)return;if(editRider)setRiders(rs=>rs.map(r=>r.id===editRider.id?{...r,...rf}:r));else setRiders(rs=>[...rs,{...rf,id:`R${Date.now()}`,rating:5,deliveries:0}]);setShowRiderModal(false);};
  const st={total:orders.length,pending:orders.filter(o=>o.status==="pending").length,active:orders.filter(o=>o.status==="on_the_way").length,rev:orders.filter(o=>["verified","on_the_way","delivered"].includes(o.status)).reduce((s,o)=>s+o.total,0),low:products.filter(p=>p.stock>0&&p.stock<=5).length,out:products.filter(p=>p.stock===0).length};
  const availTabs=isAdmin?[["orders","📦 Orders"],["inventory","🛍️ Products"],["categories","🏷️ Categories"],["riders","🏍️ Riders"],["alerts","🔔 Alerts"]]:[["orders","📦 Orders"],["inventory","🛍️ Products"],["riders","🏍️ Riders"]];
  const sel={width:"100%",background:T.bgIn,border:`1px solid ${T.bdr}`,borderRadius:12,padding:"11px 14px",color:T.tp,fontSize:13,fontFamily:F,outline:"none"};

  return(
    <div style={{fontFamily:F,background:T.bg,minHeight:"100vh",color:T.tp}}>
      {/* Header */}
      <div style={{background:T.bgCard,padding:"14px 18px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${T.bdr}`,position:"sticky",top:0,zIndex:50}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <img src="/logo.png" alt="" style={{height:36,objectFit:"contain"}} onError={e=>e.target.style.display="none"}/>
          <div><div style={{fontWeight:900,fontSize:13,color:T.gold}}>GOLD SUPERMARKET</div><div style={{fontSize:9,color:T.ts}}>{isAdmin?"🛡 Admin":"👔 Manager"} · {staff.name}</div></div>
        </div>
        <Btn sm danger onClick={onLogout}>🚪 Logout</Btn>
      </div>
      {/* Role banner */}
      <div style={{background:isAdmin?`${T.gold}12`:"#3B82F612",padding:"6px 18px",borderBottom:`1px solid ${T.bdr}`}}>
        <span style={{fontSize:10,fontWeight:700,color:isAdmin?T.gold:T.blue}}>{isAdmin?"🛡 Admin — Full Access":"👔 Manager — Limited Access (cannot delete or manage alerts/categories)"}</span>
      </div>
      {/* Tabs */}
      <div style={{display:"flex",background:T.bgCard,borderBottom:`1px solid ${T.bdr}`,overflowX:"auto"}}>
        {availTabs.map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k)} style={{padding:"13px 16px",fontSize:11,fontWeight:700,cursor:"pointer",border:"none",background:"none",color:tab===k?T.gold:T.ts,borderBottom:tab===k?`3px solid ${T.gold}`:"3px solid transparent",whiteSpace:"nowrap",fontFamily:F}}>{l}</button>
        ))}
      </div>
      <div style={{padding:16}}>
        {/* Stats */}
        <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
          {[[T.gold,"📦","Orders",st.total],[T.orange,"⏳","Pending",st.pending],[T.green,"🏍","Active",st.active],[T.green,"💰","Revenue",`${Math.round(st.rev/1000)}K`],[T.orange,"⚠️","Low",st.low],[T.red,"❌","Out",st.out]].map(([c,ico,l,v])=>(
            <div key={l} style={{flex:1,minWidth:72,background:T.bgCard,borderRadius:14,padding:"12px 8px",border:`1px solid ${T.bdr}`,textAlign:"center"}}>
              <div style={{fontSize:18}}>{ico}</div><div style={{fontWeight:900,fontSize:17,color:c,marginTop:3}}>{v}</div><div style={{fontSize:9,color:T.ts,marginTop:1}}>{l}</div>
            </div>
          ))}
        </div>

        {/* ORDERS */}
        {tab==="orders"&&<div>
          <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap"}}>
            {[["all","All"],["pending","Pending"],["verified","Verified"],["on_the_way","On Way"],["delivered","Delivered"]].map(([k,l])=>(
              <button key={k} onClick={()=>setFilterStatus(k)} style={{background:filterStatus===k?T.gold:T.bgEl,color:filterStatus===k?"#000":T.ts,border:`1px solid ${filterStatus===k?T.gold:T.bdr}`,borderRadius:20,padding:"6px 14px",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:F}}>{l}</button>
            ))}
          </div>
          {fO.map(order=>(
            <div key={order.id} style={{background:T.bgCard,borderRadius:16,padding:14,border:`1px solid ${T.bdr}`,marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:8}}>
                <div>
                  <div style={{fontWeight:900,fontSize:14,color:T.gold}}>{order.id}</div>
                  <div style={{fontSize:11,color:T.ts,marginTop:2}}>👤 {order.customer} · 📞 {order.phone}</div>
                  {order.waPhone&&<div style={{fontSize:10,color:T.ts}}>📱 WhatsApp: {order.waPhone}</div>}
                  <div style={{fontSize:10,color:T.tm,marginTop:2}}>📍 {order.location} · {order.dist}km · {order.branch} · 🕐 {order.ts}</div>
                  <div style={{marginTop:4,fontSize:11,color:T.ts}}>{order.items.map(i=>`${i.name}×${i.qty}`).join(", ")}</div>
                  <div style={{marginTop:3,fontSize:11}}>Tx: <span style={{fontFamily:"monospace",color:T.gold}}>{order.txId}</span> · <b style={{color:T.gold}}>{ugx(order.total)}</b> · <span style={{fontSize:10,color:order.payMethod==="visa"?T.blue:order.payMethod==="mtn"?"#F5C518":"#E4032D"}}>{order.payMethod==="visa"?"💳 Visa":order.payMethod==="mtn"?"📱 MoMo":"✈ Airtel"}</span></div>
                </div>
                <SPill status={order.status}/>
              </div>
              <div style={{display:"flex",gap:8,marginTop:10,flexWrap:"wrap"}}>
                {order.status==="pending"&&<Btn sm onClick={()=>verifyPay(order.id)}>✅ Verify Payment</Btn>}
                {order.status==="verified"&&<Btn sm onClick={()=>setShowAssign(order.id)}>🏍️ Assign Rider</Btn>}
                {order.status==="on_the_way"&&<><span style={{fontSize:11,color:T.ts,alignSelf:"center"}}>Rider: {riders.find(r=>r.id===order.rider)?.name}</span><Btn sm onClick={()=>markDone(order.id)}>✅ Delivered</Btn></>}
              </div>
              {showAssign===order.id&&<div style={{marginTop:10,background:T.bgEl,borderRadius:12,padding:12}}>
                <div style={{fontSize:11,fontWeight:700,color:T.gold,marginBottom:8}}>Select Rider:</div>
                {riders.map(r=>(
                  <div key={r.id} onClick={()=>r.status==="available"&&assignR(order.id,r.id)} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:12,marginBottom:6,background:T.bgCard,cursor:r.status==="available"?"pointer":"not-allowed",border:`1px solid ${r.status==="available"?`${T.gold}44`:T.bdr}`,opacity:r.status==="available"?1:.5}}>
                    <div style={{width:36,height:36,borderRadius:"50%",background:T.bgIn,overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center"}}>{r.photo?<img src={r.photo} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:<span style={{fontSize:18}}>🏍️</span>}</div>
                    <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13,color:T.tp}}>{r.name}</div><div style={{fontSize:10,color:T.ts}}>{r.bike} · {r.deliveries} today · ⭐{r.rating}</div></div>
                    <SPill status={r.status}/>
                  </div>
                ))}
                <button onClick={()=>setShowAssign(null)} style={{background:"none",border:"none",color:T.ts,fontSize:11,cursor:"pointer",fontFamily:F,marginTop:4}}>Cancel</button>
              </div>}
            </div>
          ))}
        </div>}

        {/* INVENTORY */}
        {tab==="inventory"&&<div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexWrap:"wrap",gap:8}}>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {[{id:"all",name:"All",icon:""},...categories].map(c=>(
                <button key={c.id} onClick={()=>setCatFilter(c.id)} style={{background:catFilter===c.id?T.gold:T.bgEl,color:catFilter===c.id?"#000":T.ts,border:`1px solid ${catFilter===c.id?T.gold:T.bdr}`,borderRadius:20,padding:"5px 12px",fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:F}}>{c.id==="all"?"All":`${c.icon} ${c.name}`}</button>
              ))}
            </div>
            <Btn sm onClick={openAddP} icon="＋">Add Product</Btn>
          </div>
          {(st.low>0||st.out>0)&&<div style={{background:"#EF444412",border:"1px solid #EF444433",borderRadius:12,padding:12,marginBottom:12}}>
            <div style={{fontWeight:700,color:T.red,fontSize:12,marginBottom:6}}>⚠️ Stock Alerts</div>
            {products.filter(p=>p.stock===0).map(p=><div key={p.sku} style={{fontSize:10,color:"#F87171",marginBottom:2}}>❌ {p.name} — OUT OF STOCK</div>)}
            {products.filter(p=>p.stock>0&&p.stock<=5).map(p=><div key={p.sku} style={{fontSize:10,color:T.gold,marginBottom:2}}>⚠️ {p.name} — Only {p.stock} left</div>)}
          </div>}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(155px,1fr))",gap:10}}>
            {fP.map(p=>(
              <div key={p.sku} style={{background:T.bgCard,borderRadius:14,overflow:"hidden",border:`1px solid ${T.bdr}`,opacity:p.stock===0?.6:1}}>
                <div style={{height:90,background:T.bgEl,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",position:"relative"}}>
                  {p.image?<img src={p.image} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:<span style={{fontSize:38}}>{p.emoji}</span>}
                  {p.stock===0&&<div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.6)",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{color:T.tp,fontSize:9,fontWeight:700}}>OUT OF STOCK</span></div>}
                  {p.stock>0&&p.stock<=5&&<div style={{position:"absolute",bottom:4,left:4,background:"#F9731622",color:T.orange,fontSize:8,fontWeight:700,padding:"2px 5px",borderRadius:6}}>LOW:{p.stock}</div>}
                </div>
                <div style={{padding:"8px 10px"}}>
                  <div style={{fontSize:8,color:T.tm,fontFamily:"monospace"}}>{p.sku}</div>
                  <div style={{fontWeight:700,fontSize:11,marginTop:2,color:T.tp,lineHeight:1.3}}>{p.name}</div>
                  <div style={{fontSize:9,color:T.ts}}>{p.variant}</div>
                  <div style={{color:T.gold,fontWeight:900,fontSize:12,marginTop:3}}>{ugx(p.price)}</div>
                  <div style={{display:"flex",gap:5,marginTop:8}}>
                    <Btn sm onClick={()=>openEditP(p)}>✏️</Btn>
                    {isAdmin&&<Btn sm danger onClick={()=>setProducts(ps=>ps.filter(x=>x.sku!==p.sku))}>Del</Btn>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>}

        {/* CATEGORIES */}
        {tab==="categories"&&isAdmin&&<div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <span style={{fontWeight:800,fontSize:15,color:T.tp}}>Categories</span>
            <Btn sm onClick={()=>{setEditCat(null);setNc({id:"",name:"",icon:"🛒",color:T.gold,image:null});setShowCatModal(true);}}>+ New</Btn>
          </div>
          {categories.map(c=>(
            <div key={c.id} style={{background:T.bgCard,borderRadius:14,padding:14,border:`1px solid ${T.bdr}`,marginBottom:10,display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:52,height:52,borderRadius:12,background:T.bgEl,overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center"}}>
                {c.image?<img src={c.image} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:<span style={{fontSize:26}}>{c.icon}</span>}
              </div>
              <div style={{flex:1}}>
                <div style={{fontWeight:800,fontSize:13,color:T.tp}}>{c.name}</div>
                <div style={{fontSize:10,color:T.ts,marginTop:2}}>Code: <span style={{color:T.gold,fontFamily:"monospace"}}>{c.id}</span> · {products.filter(p=>p.cat===c.id).length} products</div>
                <div style={{width:20,height:3,borderRadius:2,background:c.color,marginTop:5}}/>
              </div>
              <div style={{display:"flex",gap:6}}>
                <Btn sm onClick={()=>{setEditCat(c);setNc({...c});setShowCatModal(true);}}>✏️</Btn>
                <Btn sm danger onClick={()=>setCategories(cs=>cs.filter(x=>x.id!==c.id))}>✕</Btn>
              </div>
            </div>
          ))}
        </div>}

        {/* RIDERS */}
        {tab==="riders"&&<div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <span style={{fontWeight:800,fontSize:15,color:T.tp}}>Riders</span>
            <Btn sm onClick={()=>{setEditRider(null);setRf({name:"",phone:"",bike:"",branch:staff.branch==="All"?"Kitintale":staff.branch,status:"available",photo:null});setShowRiderModal(true);}}>+ Add</Btn>
          </div>
          {riders.map(r=>(
            <div key={r.id} style={{background:T.bgCard,borderRadius:14,padding:14,border:`1px solid ${T.bdr}`,marginBottom:10,display:"flex",gap:12,alignItems:"flex-start"}}>
              <div style={{width:50,height:50,borderRadius:"50%",background:T.bgEl,overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center"}}>{r.photo?<img src={r.photo} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:<span style={{fontSize:24}}>🏍️</span>}</div>
              <div style={{flex:1}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div><div style={{fontWeight:700,fontSize:14,color:T.tp}}>{r.name}</div><div style={{fontSize:11,color:T.ts}}>📞 {r.phone} · 🏍️ <span style={{fontFamily:"monospace",color:T.gold}}>{r.bike||"—"}</span></div><div style={{fontSize:11,color:T.ts}}>📍 {r.branch} · ⭐{r.rating} · {r.deliveries} today</div></div>
                  <SPill status={r.status}/>
                </div>
                <div style={{display:"flex",gap:6,marginTop:10}}>
                  <Btn sm onClick={()=>{setEditRider(r);setRf({...r});setShowRiderModal(true);}}>✏️ Edit</Btn>
                  {isAdmin&&<Btn sm danger onClick={()=>setRiders(rs=>rs.filter(x=>x.id!==r.id))}>Remove</Btn>}
                </div>
              </div>
            </div>
          ))}
        </div>}

        {/* ALERTS */}
        {tab==="alerts"&&isAdmin&&<div>
          <div style={{background:`${T.gold}10`,border:`1px solid ${T.gold}33`,borderRadius:12,padding:12,marginBottom:14}}>
            <div style={{fontWeight:700,fontSize:13,color:T.gold,marginBottom:4}}>🔒 Verified Numbers Only</div>
            <div style={{fontSize:11,color:T.ts}}>Only these numbers receive WhatsApp alerts. Unverified numbers are blocked.</div>
          </div>
          {notifs.map(n=>(
            <div key={n.id} style={{background:T.bgCard,borderRadius:14,padding:13,border:`1px solid ${T.bdr}`,marginBottom:10,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
              <div><div style={{fontWeight:700,fontFamily:"monospace",fontSize:13,color:T.tp}}>{n.num}</div><div style={{fontSize:10,color:T.ts,marginTop:2}}>{n.role} · {n.branch}</div></div>
              <div style={{display:"flex",gap:8,alignItems:"center"}}><Toggle on={n.active} onChange={v=>setNotifs(ns=>ns.map(x=>x.id===n.id?{...x,active:v}:x))}/><Btn sm danger onClick={()=>setNotifs(ns=>ns.filter(x=>x.id!==n.id))}>✕</Btn></div>
            </div>
          ))}
          <Btn onClick={()=>{const num=prompt("+256...");const role=prompt("Role:");const branch=prompt("Branch:");if(num&&role)setNotifs(ns=>[...ns,{id:Date.now(),num,role,branch:branch||"All",active:true}]);}}>+ Add Number</Btn>
          <div style={{background:T.bgCard,borderRadius:14,padding:14,border:`1px solid ${T.bdr}`,marginTop:14}}>
            <div style={{fontWeight:700,fontSize:13,color:T.gold,marginBottom:10}}>📱 Alert Routing</div>
            {[["🛒 New order","Nearest branch manager"],["💳 MoMo/Airtel verified","Sent to payment number"],["💳 Visa payment","Sent to provided contact"],["🏍️ Rider assigned","Rider + Customer"],["✅ Delivered","Customer + Supervisor"],["⚠️ Low stock","Branch manager only"]].map(([e,t])=>(
              <div key={e} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${T.bdr}`,fontSize:11}}><span style={{color:T.ts}}>{e}</span><span style={{color:T.tm,maxWidth:"55%",textAlign:"right"}}>{t}</span></div>
            ))}
          </div>
        </div>}
      </div>

      {/* Modals */}
      <Sheet open={showProdModal} onClose={()=>setShowProdModal(false)} title={editProd?"Edit Product":"New Product"}>
        <div style={{display:"flex",gap:14,alignItems:"flex-start",marginBottom:14}}>
          <ImgUp current={np.image} onUpload={img=>setNp(p=>({...p,image:img}))} size={72} label="Product Image"/>
          <div style={{flex:1}}><Inp label="Product Name" value={np.name} onChange={v=>setNp(p=>({...p,name:v}))} placeholder="e.g. Birthday Cake"/><Inp label="Variant / Size" value={np.variant} onChange={v=>setNp(p=>({...p,variant:v}))} placeholder="e.g. Custom"/></div>
        </div>
        {!np.image&&<Inp label="Emoji Fallback" value={np.emoji} onChange={v=>setNp(p=>({...p,emoji:v}))} placeholder="🎂"/>}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <Inp label="Price (UGX)" value={np.price} onChange={v=>setNp(p=>({...p,price:v}))} type="number"/>
          <Inp label="Orig. Price" value={np.origPrice} onChange={v=>setNp(p=>({...p,origPrice:v}))} type="number"/>
          <Inp label="Stock Qty" value={np.stock} onChange={v=>setNp(p=>({...p,stock:v}))} type="number"/>
          <Inp label="Unit" value={np.unit} onChange={v=>setNp(p=>({...p,unit:v}))} placeholder="piece/plate"/>
          <Inp label="Discount %" value={np.discount} onChange={v=>setNp(p=>({...p,discount:v}))} type="number"/>
          <Inp label="Badge" value={np.badge} onChange={v=>setNp(p=>({...p,badge:v}))} placeholder="Flash/Fresh"/>
        </div>
        <div style={{marginBottom:12}}><div style={{fontSize:11,fontWeight:600,color:T.ts,marginBottom:5}}>Category</div><select value={np.cat} onChange={e=>setNp(p=>({...p,cat:e.target.value}))} style={sel}>{categories.map(c=><option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}</select></div>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}><Toggle on={np.express} onChange={v=>setNp(p=>({...p,express:v}))}/><span style={{fontSize:12,color:T.ts}}>Express 30-min delivery</span></div>
        <div style={{display:"flex",gap:10}}><Btn style={{flex:1}} onClick={saveP}>💾 {editProd?"Save Changes":"Add Product"}</Btn><Btn outline onClick={()=>setShowProdModal(false)}>Cancel</Btn></div>
      </Sheet>

      <Sheet open={showCatModal&&isAdmin} onClose={()=>setShowCatModal(false)} title={editCat?"Edit Category":"New Category"}>
        <div style={{display:"flex",gap:14,alignItems:"flex-start",marginBottom:14}}>
          <ImgUp current={nc.image} onUpload={img=>setNc(c=>({...c,image:img}))} size={72}/>
          <div style={{flex:1}}><Inp label="Category Name" value={nc.name} onChange={v=>setNc(c=>({...c,name:v}))} placeholder="e.g. Cakes & Bakery"/><Inp label="Code (2–3 letters)" value={nc.id} onChange={v=>setNc(c=>({...c,id:v.toUpperCase()}))} placeholder="BK"/></div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <Inp label="Emoji" value={nc.icon} onChange={v=>setNc(c=>({...c,icon:v}))} placeholder="🎂"/>
          <Inp label="Color (hex)" value={nc.color} onChange={v=>setNc(c=>({...c,color:v}))} placeholder="#F5C518"/>
        </div>
        <div style={{display:"flex",gap:10,marginTop:4}}><Btn style={{flex:1}} onClick={saveC}>💾 {editCat?"Save":"Add Category"}</Btn><Btn outline onClick={()=>setShowCatModal(false)}>Cancel</Btn></div>
      </Sheet>

      <Sheet open={showRiderModal} onClose={()=>setShowRiderModal(false)} title={editRider?"Edit Rider":"New Rider"}>
        <div style={{display:"flex",gap:14,alignItems:"flex-start",marginBottom:14}}>
          <ImgUp current={rf.photo} onUpload={img=>setRf(r=>({...r,photo:img}))} size={72} radius={36} label="Rider Photo"/>
          <div style={{flex:1}}><Inp label="Full Name" value={rf.name} onChange={v=>setRf(r=>({...r,name:v}))} placeholder="Kato Denis"/><Inp label="Phone" value={rf.phone} onChange={v=>setRf(r=>({...r,phone:v}))} placeholder="07XXXXXXXX"/></div>
        </div>
        <Inp label="Motorcycle Plate" value={rf.bike} onChange={v=>setRf(r=>({...r,bike:v.toUpperCase()}))} placeholder="UAX 123G" style={{fontFamily:"monospace",letterSpacing:1}}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <div><div style={{fontSize:11,fontWeight:600,color:T.ts,marginBottom:5}}>Branch</div><select value={rf.branch} onChange={e=>setRf(r=>({...r,branch:e.target.value}))} style={sel}><option>Kitintale</option><option>Mile 8</option></select></div>
          <div><div style={{fontSize:11,fontWeight:600,color:T.ts,marginBottom:5}}>Status</div><select value={rf.status} onChange={e=>setRf(r=>({...r,status:e.target.value}))} style={sel}><option value="available">Available</option><option value="busy">Busy</option><option value="offline">Offline</option></select></div>
        </div>
        <div style={{display:"flex",gap:10,marginTop:14}}><Btn style={{flex:1}} onClick={saveR}>💾 {editRider?"Save":"Add Rider"}</Btn><Btn outline onClick={()=>setShowRiderModal(false)}>Cancel</Btn></div>
      </Sheet>
    </div>
  );
}

/* ════════════════════ RIDER PORTAL ════════════════════ */
function RiderPortal({riderStaff,riders,onLogout}){
  const me=riders.find(r=>r.name===riderStaff.name)||riders[0];
  const [myOrders,setMyOrders]=useState(INIT_ORDERS.slice(0,2).map(o=>({...o,status:o.status==="on_the_way"?"on_the_way":"new"})));
  const accept=id=>setMyOrders(os=>os.map(o=>o.id===id?{...o,status:"on_the_way"}:o));
  const deliver=id=>setMyOrders(os=>os.map(o=>o.id===id?{...o,status:"delivered"}:o));
  return(
    <div style={{fontFamily:F,background:T.bg,minHeight:"100vh",color:T.tp,maxWidth:430,margin:"0 auto"}}>
      <div style={{background:T.bgCard,padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${T.bdr}`,position:"sticky",top:0,zIndex:50}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:40,height:40,borderRadius:"50%",background:T.bgEl,overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center"}}>{me?.photo?<img src={me.photo} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:<span style={{fontSize:20}}>🏍️</span>}</div>
          <div><div style={{fontWeight:900,fontSize:14,color:T.tp}}>{riderStaff.name}</div><div style={{fontSize:9,color:T.green}}>🏍️ {me?.bike||"—"} · {riderStaff.branch}</div></div>
        </div>
        <Btn sm danger onClick={onLogout}>🚪 Logout</Btn>
      </div>
      <div style={{padding:14}}>
        <div style={{display:"flex",gap:10,marginBottom:14}}>
          {[["📦",me?.deliveries||0,"Today"],["⭐",me?.rating||"5.0","Rating"],["⏱️","28 min","Avg"]].map(([i,v,l])=>(
            <div key={l} style={{flex:1,background:T.bgCard,borderRadius:14,padding:"12px 8px",textAlign:"center",border:`1px solid ${T.bdr}`}}>
              <div style={{fontSize:20}}>{i}</div><div style={{fontWeight:900,fontSize:17,color:T.green,marginTop:3}}>{v}</div><div style={{fontSize:9,color:T.ts}}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{background:T.bgCard,borderRadius:14,padding:14,marginBottom:14,border:`1px solid ${T.bdr}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><div style={{fontWeight:700,fontSize:13,color:T.tp}}>My Status</div><div style={{fontSize:11,color:T.ts}}>📞 {me?.phone}</div></div>
          <SPill status={me?.status||"available"}/>
        </div>
        <div style={{fontWeight:800,fontSize:15,color:T.green,marginBottom:10}}>📦 Deliveries Queue</div>
        {myOrders.map(o=>(
          <div key={o.id} style={{background:T.bgCard,borderRadius:16,padding:14,marginBottom:12,border:`1px solid ${T.bdr}`}}>
            <div style={{fontWeight:800,fontSize:13,color:T.gold,marginBottom:8}}>{o.id}</div>
            <div style={{fontSize:11,color:T.ts,lineHeight:1.8}}>
              📍 Pickup: <b style={{color:T.tp}}>{o.branch} Branch</b><br/>
              🏠 Drop: <b style={{color:T.tp}}>{o.location}</b> ({o.dist}km)<br/>
              👤 {o.customer} · <span style={{color:T.gold}}>{o.phone}</span>
            </div>
            <div style={{fontSize:10,color:T.tm,margin:"6px 0"}}>{o.items.map(i=>`${i.name}×${i.qty}`).join(", ")}</div>
            <div style={{fontWeight:800,color:T.gold,fontSize:14,marginBottom:10}}>{ugx(o.total)}</div>
            <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
              <SPill status={o.status}/>
              {o.status==="new"&&<Btn sm onClick={()=>accept(o.id)}>✅ Accept</Btn>}
              {o.status==="on_the_way"&&<>
                <a href={`https://maps.google.com/?q=${o.location},Kampala`} target="_blank" rel="noreferrer" style={{background:T.blue,color:"#fff",border:"none",borderRadius:10,padding:"7px 14px",fontWeight:800,fontSize:11,textDecoration:"none",fontFamily:F}}>🗺️ Navigate</a>
                <Btn sm onClick={()=>deliver(o.id)}>✅ Delivered</Btn>
              </>}
              {o.status==="delivered"&&<span style={{color:T.green,fontWeight:700,fontSize:12}}>✅ Completed!</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════ ROOT ════════════════════ */
export default function App(){
  const [mode,setMode]=useState("customer");
  const [products,setProducts]=useState(INIT_PRODUCTS);
  const [categories,setCategories]=useState(INIT_CATS);
  const [riders,setRiders]=useState(INIT_RIDERS);
  const [staff,setStaff]=useState(null);
  const [showLogin,setShowLogin]=useState(false);

  const handleAccess=s=>{setStaff(s);setMode(s.role==="rider"?"rider":"dashboard");};
  const handleLogout=()=>{setStaff(null);setMode("customer");};

  const sel={width:"100%",background:T.bgIn,border:`1px solid ${T.bdr}`,borderRadius:12,padding:"11px 14px",color:T.tp,fontSize:13,fontFamily:F,outline:"none"};

  return(
    <div style={{fontFamily:F,background:T.bg,minHeight:"100vh"}}>
      {/* Dev switcher bar */}
      <div style={{background:"#000",display:"flex",justifyContent:"center",alignItems:"center",gap:2,padding:"5px 10px",borderBottom:`1px solid ${T.bdr}`,position:"sticky",top:0,zIndex:500,flexWrap:"wrap"}}>
        {[["customer","🛒 Customer","customer"],["rider","🏍️ Rider","rider"],["dashboard","🧑‍💼 Staff","dashboard"]].map(([m,l])=>(
          <button key={m} onClick={()=>{if(m==="dashboard"&&!staff){setShowLogin(true);}else if(m==="rider"&&(!staff||staff.role!=="rider")){setShowLogin(true);}else setMode(m);}} style={{background:mode===m?T.gold:"transparent",color:mode===m?"#000":T.ts,border:"none",padding:"5px 14px",fontWeight:700,fontSize:10,cursor:"pointer",borderRadius:6,fontFamily:F}}>{l}</button>
        ))}
        {staff&&<span style={{fontSize:9,color:T.ts,marginLeft:8}}>· {staff.name} ({staff.role})</span>}
        {staff&&<button onClick={handleLogout} style={{background:"none",border:"none",color:T.red,fontSize:9,cursor:"pointer",fontFamily:F}}>🚪</button>}
      </div>

      {mode==="customer"&&<CustomerApp products={products} categories={categories} onStaffAccess={handleAccess}/>}
      {mode==="rider"&&staff?.role==="rider"&&<RiderPortal riderStaff={staff} riders={riders} onLogout={handleLogout}/>}
      {mode==="rider"&&!staff&&(
        <div style={{fontFamily:F,background:T.bg,minHeight:"80vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{textAlign:"center",padding:30}}>
            <div style={{fontSize:60,marginBottom:14}}>🏍️</div>
            <div style={{fontWeight:800,fontSize:20,color:T.tp,marginBottom:8}}>Rider Portal</div>
            <div style={{fontSize:13,color:T.ts,marginBottom:24}}>Log in with your rider credentials</div>
            <Btn onClick={()=>setShowLogin(true)}>🔑 Rider Login</Btn>
          </div>
        </div>
      )}
      {mode==="dashboard"&&staff&&(staff.role==="admin"||staff.role==="manager")&&<Dashboard products={products} setProducts={setProducts} categories={categories} setCategories={setCategories} riders={riders} setRiders={setRiders} staff={staff} onLogout={handleLogout}/>}
      {mode==="dashboard"&&!staff&&(
        <div style={{fontFamily:F,background:T.bg,minHeight:"80vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{textAlign:"center",padding:30}}>
            <div style={{fontSize:60,marginBottom:14}}>🔐</div>
            <div style={{fontWeight:800,fontSize:20,color:T.tp,marginBottom:8}}>Staff Access</div>
            <Btn onClick={()=>setShowLogin(true)}>Login →</Btn>
          </div>
        </div>
      )}
      {showLogin&&<StaffLogin onLogin={s=>{setShowLogin(false);handleAccess(s);}} onClose={()=>setShowLogin(false)}/>}
    </div>
  );
}
