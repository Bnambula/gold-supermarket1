import React, { useState, useEffect, useRef } from "react";

/* ═══════════════ DESIGN TOKENS ═══════════════ */
const T = {
  bg:"#111111", bgCard:"#1C1C1C", bgEl:"#242424", bgIn:"#2A2A2A",
  bdr:"#2E2E2E", gold:"#F5B800", gDark:"#D49A00", gLight:"#FFD84D",
  red:"#C0001E", rDark:"#8B0015", green:"#22C55E",
  tp:"#F0F0F0", ts:"#9A9A9A", tm:"#484848",
};
const F = "'Sora','Nunito',sans-serif";
const ugx = n=>`UGX ${Number(n).toLocaleString()}`;

/* ═══════════════ SKU: PDT+CAT+0001 series ═══════════════ */
let _skuCounters = {};
const mkSKU = (cat) => {
  if(!_skuCounters[cat]) _skuCounters[cat]=0;
  _skuCounters[cat]++;
  return `PDT${cat}${String(_skuCounters[cat]).padStart(4,"0")}`;
};

/* ═══════════════ STAFF CREDENTIALS ═══════════════
   Admin  : full access
   Manager: cannot delete products, cannot manage staff/alerts
═══════════════════════════════════════════════════ */
const STAFF_CREDS = [
  { id:"S1", username:"admin",   password:"gold@admin2025",  role:"admin",   name:"Admin",         branch:"All" },
  { id:"S2", username:"mgr1",    password:"kitintale@mgr",   role:"manager", name:"Kiggundu James", branch:"Kitintale" },
  { id:"S3", username:"mgr2",    password:"mile8@mgr",       role:"manager", name:"Nansubuga Rose",  branch:"Mile 8" },
];

/* ═══════════════ CATEGORIES ═══════════════ */
const INIT_CATS = [
  {id:"FG", name:"Food & Groceries",  icon:"🌾", color:"#E86A00", image:null},
  {id:"BV", name:"Beverages",         icon:"🥤", color:"#1565C0", image:null},
  {id:"BK", name:"Cakes & Bakery",    icon:"🎂", color:"#D4426A", image:null},
  {id:"FF", name:"Fast Foods",        icon:"🍗", color:"#FF6B00", image:null},
  {id:"HC", name:"Household",         icon:"🧴", color:"#2E7D32", image:null},
  {id:"PC", name:"Personal & Baby",   icon:"👶", color:"#7B1FA2", image:null},
  {id:"SK", name:"Snacks & Spices",   icon:"🍪", color:"#C0001E", image:null},
];

/* ═══════════════ PRODUCTS ═══════════════ */
const mkP = (cat,name,variant,price,orig,stock,unit,emoji,express,disc,badge) =>
  ({sku:mkSKU(cat),name,variant,cat,price,origPrice:orig,stock,unit,image:null,emoji,express,discount:disc,badge});

const INIT_PRODUCTS = [
  // FOOD & GROCERIES
  mkP("FG","SWT MB Long Grain Rice","5KG",      23200,24400,42,"bag",  "🌾",true, 5,"Popular"),
  mkP("FG","Maganjo Maize Flour",   "2KG",       7500, 8000,55,"pack", "🌽",true, 6,"Local"),
  mkP("FG","Numa Flour",            "2KG",       6800, 7200,30,"pack", "🌽",true, 6,null),
  mkP("FG","Indomie Noodles",       "70g×40pcs",32000,35500,20,"carton","🍜",true,10,"Flash"),
  mkP("FG","Kakira Sugar",          "10KG",     35000,36300,30,"bag",  "🍬",false,3,null),
  mkP("FG","Sunseed Sunflower Oil", "3L",       27800,31200,25,"bottle","🛢️",false,11,"Sale"),
  mkP("FG","Star Fry Cooking Oil",  "12×1L",    82800,92000, 6,"carton","🛢️",false,10,null),
  mkP("FG","Iodized Table Salt",    "1KG",       1800, 2000,80,"pack", "🧂",true,10,null),
  mkP("FG","Royco Mchuzi Mix",      "200g×2",    9700,10700,40,"pack", "🍲",true,10,"Top Offer"),
  // BEVERAGES
  mkP("BV","Riham Oner Mango Juice","300ml×12", 14600,16700,28,"carton","🥭",true,13,"Flash"),
  mkP("BV","Riham Oner Apple Juice","300ml×12", 14600,16700,22,"carton","🍎",true,13,"Flash"),
  mkP("BV","Coca-Cola",             "500ml",     2000, 2200,50,"bottle","🥤",true, 9,null),
  mkP("BV","Jesa UHT Low Fat Milk", "500ml×12", 22500,25200,20,"carton","🥛",true,11,"Top Offer"),
  mkP("BV","Fresh Dairy Strawberry","250ml×12", 16800,18400,14,"carton","🍓",true, 9,null),
  mkP("BV","Mineral Water",         "1.5L",      2500, 2800,60,"bottle","💧",true,11,null),
  mkP("BV","Jameson Whiskey",       "750ml",    88900,98000, 8,"bottle","🥃",false,10,null),
  mkP("BV","Four Cousins Sweet Rose","750ml",   29500,32800,12,"bottle","🍷",false,10,null),
  mkP("BV","Rockboom Energy Drink", "320ml×12", 18900,21700,15,"carton","⚡",false,13,"Flash"),
  // CAKES & BAKERY
  mkP("BK","White Bread Loaf",      "Large",     5500, 6000,20,"loaf", "🍞",true, 8,"Fresh"),
  mkP("BK","Soft Buns",             "Pack of 6", 4500, 5000,25,"pack", "🥐",true, 8,"Fresh"),
  mkP("BK","Chocolate Cake Slice",  "1 slice",   6000, 7000,15,"slice","🎂",true, 0,null),
  mkP("BK","Doughnuts",             "Pack of 4", 5000, 5500,18,"pack", "🍩",true, 9,"Fresh"),
  mkP("BK","Birthday Cake",         "Custom",   85000,95000, 5,"cake", "🎂",false,11,"Order"),
  mkP("BK","Graduation Cake",       "Custom",  120000,135000,3,"cake", "🎓",false,11,"Order"),
  mkP("BK","Mandazi",               "Pack of 8", 3500, 4000,30,"pack", "🥐",true, 0,"Local"),
  mkP("BK","Chapati",               "Each",      1500, 2000,40,"piece","🫓",true, 0,null),
  // FAST FOODS
  mkP("FF","Pilau Rice",            "Plate",    12000,14000,15,"plate","🍛",true, 0,null),
  mkP("FF","Roast Chicken",         "Half",     25000,28000,10,"piece","🍗",true, 0,null),
  mkP("FF","Liver",                 "Plate",     8000,10000,12,"plate","🍖",true, 0,null),
  mkP("FF","Samosas",               "Pack of 4", 4000, 5000,20,"pack", "🥟",true, 0,null),
  mkP("FF","Beef Shawarma",         "Each",     12000,14000,10,"piece","🌯",true, 0,null),
  mkP("FF","Deep Fried Chicken",    "2 pieces", 18000,20000, 8,"piece","🍗",true, 0,null),
  mkP("FF","Chapati & Beans",       "Plate",     7000, 8000,15,"plate","🫓",true, 0,null),
  mkP("FF","French Fries",          "Large",     8000, 9000,12,"pack", "🍟",true, 0,null),
  // HOUSEHOLD
  mkP("HC","Magic Detergent",       "10KG",     39400,43700,15,"bucket","🧺",false,10,"Top Offer"),
  mkP("HC","Jik Bleach Twin Pack",  "750ml×2",  21200,23000,22,"pack", "🧽",false, 8,null),
  mkP("HC","Eurotop Toilet Paper",  "10 rolls", 12500,14000,40,"pack", "🧻",false,11,null),
  mkP("HC","Sunlight Dish Soap",    "750ml",     7200, 8000,28,"bottle","🫧",false,10,null),
  // PERSONAL & BABY
  mkP("PC","Dettol Soap",           "175g",      4800, 5200,50,"bar",  "🧼",true, 8,null),
  mkP("PC","Pampers Diapers",       "Size S-44",42000,46000,12,"pack", "👶",false, 9,"Top Offer"),
  mkP("PC","Huggies Diapers",       "Size M-40",45000,50000, 9,"pack", "👶",false,10,"Top Offer"),
  mkP("PC","Nestle Lactogen",       "400g",     38000,42000, 8,"tin",  "🍼",false,10,null),
  // SNACKS
  mkP("SK","Sumz Rings & Crisps",   "Multi×10",  5000, 5800,35,"pack", "🍟",true,14,"Flash"),
  mkP("SK","Roasted Groundnuts",    "500g",      6500, 7000,20,"pack", "🥜",true, 7,"Local"),
  mkP("SK","Britania Biscuits",     "400g",      7500, 8500,30,"pack", "🍪",false,12,null),
];

const INIT_RIDERS = [
  {id:"R1",name:"Kato Denis",   phone:"0774123456",bike:"UAX 123G",branch:"Kitintale",status:"available",rating:4.8,deliveries:12,photo:null},
  {id:"R2",name:"Nakato Sarah", phone:"0755987654",bike:"UAB 456H",branch:"Mile 8",   status:"busy",     rating:4.9,deliveries:8, photo:null},
  {id:"R3",name:"Mugisha Brian",phone:"0701456789",bike:"UBG 789K",branch:"Kitintale",status:"available",rating:4.7,deliveries:15,photo:null},
];

const INIT_ORDERS = [
  {id:"OGS250326001",customer:"Aisha Namukasa",  phone:"0772345678",items:[{name:"SWT MB Rice",qty:2,price:23200},{name:"Royco Mix",qty:1,price:9700}], total:60100,fee:3000,location:"Ntinda", dist:2.1,branch:"Kitintale",status:"pending",   txId:"MOM2345678901",rider:null,ts:"09:14",payMethod:"mtn"},
  {id:"OGS250326002",customer:"Robert Ssempala", phone:"0753678901",items:[{name:"Sunseed Oil",qty:1,price:27800},{name:"Kakira Sugar",qty:1,price:35000}],total:66800,fee:4000,location:"Kireka", dist:4.2,branch:"Mile 8",   status:"verified",  txId:"AIR8765432109",rider:"R3",ts:"09:32",payMethod:"airtel"},
  {id:"OGS250326003",customer:"Grace Akello",    phone:"0700234567",items:[{name:"Mineral Water",qty:6,price:2500}],                                    total:19000,fee:4000,location:"Bukoto", dist:3.8,branch:"Kitintale",status:"on_the_way",txId:"VIS•••• 4242",rider:"R1",ts:"08:55",payMethod:"visa"},
  {id:"OGS250326004",customer:"Banura Emmanuel", phone:"0781234567",items:[{name:"Pampers S",qty:1,price:42000},{name:"Baby Wipes",qty:2,price:8500}],  total:63000,fee:6000,location:"Mutungo",dist:6.1,branch:"Kitintale",status:"delivered",  txId:"MOM9988776655",rider:"R2",ts:"08:10",payMethod:"mtn"},
];

const INIT_NOTIFS = [
  {id:1,num:"+256 774 000 001",role:"Branch Manager – Kitintale",branch:"Kitintale",active:true},
  {id:2,num:"+256 755 000 002",role:"Branch Manager – Mile 8",   branch:"Mile 8",   active:true},
  {id:3,num:"+256 700 000 003",role:"Delivery Supervisor",       branch:"All",      active:false},
];

/* ═══════════════ SHARED MICRO-COMPONENTS ═══════════════ */
function ProdImg({image,emoji,size=48,radius=10}){
  return image
    ?<img src={image} alt="" style={{width:size,height:size,borderRadius:radius,objectFit:"cover",flexShrink:0}}/>
    :<div style={{width:size,height:size,borderRadius:radius,background:T.bgEl,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*.55,flexShrink:0}}>{emoji}</div>;
}

function SPill({status}){
  const M={pending:{l:"⏳ Pending",bg:"#2D2000",c:T.gold},verified:{l:"✓ Verified",bg:"#002D1A",c:T.green},on_the_way:{l:"🏍 On Way",bg:"#002D1A",c:T.green},delivered:{l:"✅ Delivered",bg:"#1a1a1a",c:"#777"},cancelled:{l:"✕ Cancelled",bg:"#2D0000",c:T.red},available:{l:"● Available",bg:"#002D1A",c:T.green},busy:{l:"● Busy",bg:"#2D0000",c:T.red},offline:{l:"● Offline",bg:"#1a1a1a",c:"#777"},new:{l:"🆕 New",bg:"#001830",c:"#60A5FA"}};
  const s=M[status]||M.pending;
  return <span style={{background:s.bg,color:s.c,padding:"4px 10px",borderRadius:20,fontSize:11,fontWeight:700,whiteSpace:"nowrap"}}>{s.l}</span>;
}

const Btn=({children,onClick,style={},sm,outline,danger,full,disabled})=>(
  <button onClick={onClick} disabled={disabled} style={{background:disabled?"#333":danger?T.red:outline?"transparent":T.gold,color:disabled?"#666":danger?"#fff":outline?T.gold:T.bg,border:outline?`1.5px solid ${T.gold}`:danger?`1.5px solid ${T.red}`:"none",borderRadius:10,padding:sm?"6px 12px":"11px 20px",fontWeight:800,fontSize:sm?11:13,cursor:disabled?"not-allowed":"pointer",fontFamily:F,whiteSpace:"nowrap",width:full?"100%":undefined,opacity:disabled?.6:1,...style}}>{children}</button>
);

const Fld=({label,value,onChange,placeholder,type="text",style={},maxLen,error})=>(
  <div style={{marginBottom:10}}>
    {label&&<div style={{fontSize:10,fontWeight:700,color:T.ts,marginBottom:4,textTransform:"uppercase",letterSpacing:.5}}>{label}</div>}
    <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} maxLength={maxLen}
      style={{width:"100%",background:T.bgIn,border:`1px solid ${error?T.red:T.bdr}`,borderRadius:10,padding:"10px 13px",color:T.tp,fontSize:13,outline:"none",fontFamily:F,boxSizing:"border-box",...style}}/>
    {error&&<div style={{fontSize:10,color:T.red,marginTop:3}}>⚠ {error}</div>}
  </div>
);

function ImgUp({current,onUpload,label="Upload",size=64,radius=10}){
  const ref=useRef();
  const h=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>onUpload(ev.target.result);r.readAsDataURL(f);};
  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
      <div onClick={()=>ref.current.click()} style={{width:size,height:size,borderRadius:radius,background:T.bgIn,border:`2px dashed ${T.gold}55`,cursor:"pointer",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center"}}>
        {current?<img src={current} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:size*.38}}>📷</span>}
      </div>
      <input ref={ref} type="file" accept="image/*" style={{display:"none"}} onChange={h}/>
      <span style={{fontSize:9,color:T.ts,cursor:"pointer"}} onClick={()=>ref.current.click()}>{label}</span>
    </div>
  );
}

function Sheet({open,onClose,title,children}){
  if(!open)return null;
  return(
    <div style={{position:"fixed",inset:0,zIndex:300,display:"flex",flexDirection:"column",justifyContent:"flex-end"}}>
      <div onClick={onClose} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.78)"}}/>
      <div style={{position:"relative",background:T.bgCard,borderRadius:"20px 20px 0 0",maxHeight:"92vh",overflowY:"auto",animation:"su .25s ease"}}>
        <style>{`@keyframes su{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 18px 12px",borderBottom:`1px solid ${T.bdr}`,position:"sticky",top:0,background:T.bgCard,zIndex:1}}>
          <span style={{fontWeight:800,fontSize:16,color:T.tp}}>{title}</span>
          <button onClick={onClose} style={{background:T.bgIn,border:"none",color:T.ts,width:30,height:30,borderRadius:"50%",cursor:"pointer",fontSize:16}}>✕</button>
        </div>
        <div style={{padding:"14px 18px 32px"}}>{children}</div>
      </div>
    </div>
  );
}

function Toggle({on,onChange,label}){
  return(
    <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>onChange(!on)}>
      <div style={{width:42,height:24,borderRadius:12,background:on?T.green:T.bgIn,position:"relative",transition:"background .2s",flexShrink:0}}>
        <div style={{position:"absolute",top:3,left:on?21:3,width:18,height:18,borderRadius:"50%",background:"#fff",transition:"left .2s"}}/>
      </div>
      {label&&<span style={{fontSize:12,color:T.ts}}>{label}</span>}
    </div>
  );
}

function useCountdown(){
  const [t,setT]=useState(12*3600+40*60+17);
  useEffect(()=>{const id=setInterval(()=>setT(x=>x>0?x-1:0),1000);return()=>clearInterval(id);},[]);
  return{h:String(Math.floor(t/3600)).padStart(2,"0"),m:String(Math.floor((t%3600)/60)).padStart(2,"0"),s:String(t%60).padStart(2,"0")};
}

/* ═══════════════ PAYMENT LOGOS (inline SVG) ═══════════════ */
const MoMoLogo=()=>(
  <div style={{background:"#003C71",borderRadius:8,padding:"4px 10px",display:"flex",alignItems:"center",gap:5}}>
    <span style={{fontSize:16}}>📱</span>
    <div><div style={{fontWeight:900,fontSize:11,color:"#F5C518",lineHeight:1}}>MoMo</div><div style={{fontSize:8,color:"#F5C518"}}>from MTN</div></div>
  </div>
);
const AirtelLogo=()=>(
  <div style={{background:"#fff",borderRadius:8,padding:"4px 10px",display:"flex",alignItems:"center",gap:5}}>
    <span style={{fontSize:18,color:"#E4032D"}}>✈</span>
    <div><div style={{fontWeight:900,fontSize:11,color:"#E4032D",lineHeight:1}}>airtel</div><div style={{fontSize:8,color:"#E4032D"}}>money</div></div>
  </div>
);
const VisaLogo=()=>(
  <div style={{background:"#fff",borderRadius:8,padding:"5px 12px",display:"flex",alignItems:"center",justifyContent:"center",minWidth:70}}>
    <div style={{display:"flex",flexDirection:"column",alignItems:"stretch",gap:2,width:"100%"}}>
      <div style={{height:5,background:"#1A1F71",borderRadius:"2px 2px 0 0"}}/>
      <div style={{fontWeight:900,fontSize:16,color:"#1A1F71",textAlign:"center",lineHeight:1,padding:"1px 0"}}>VISA</div>
      <div style={{height:5,background:"#F7A823",borderRadius:"0 0 2px 2px"}}/>
    </div>
  </div>
);

/* ═══════════════ PRODUCT CARD ═══════════════ */
function ProdCard({p,cart,add,rem,onTap,cats}){
  const qty=cart[p.sku]||0,out=p.stock===0;
  const cat=cats?.find(c=>c.id===p.cat);
  return(
    <div onClick={()=>onTap(p)} style={{background:T.bgCard,borderRadius:14,overflow:"hidden",border:`1.5px solid ${qty?T.gold:T.bdr}`,cursor:"pointer",display:"flex",flexDirection:"column"}}>
      <div style={{height:110,background:T.bgEl,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>
        {p.image?<img src={p.image} alt={p.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:48}}>{p.emoji}</span>}
        {p.badge==="Flash"&&<div style={{position:"absolute",top:6,left:6,background:T.red,color:"#fff",fontSize:8,fontWeight:900,padding:"2px 6px",borderRadius:8}}>⚡FLASH</div>}
        {p.badge&&p.badge!=="Flash"&&<div style={{position:"absolute",top:6,left:6,background:cat?.color||T.gold,color:"#fff",fontSize:8,fontWeight:800,padding:"2px 6px",borderRadius:8}}>{p.badge}</div>}
        {p.express&&<div style={{position:"absolute",top:6,right:6,background:"rgba(0,0,0,.7)",borderRadius:8,padding:"2px 6px",fontSize:8,color:T.gold,fontWeight:800}}>⚡30min</div>}
        {p.discount>0&&<div style={{position:"absolute",bottom:6,right:6,background:T.green,color:"#fff",fontSize:9,fontWeight:900,padding:"2px 7px",borderRadius:10}}>-{p.discount}%</div>}
        {out&&<div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.65)",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{color:"#fff",fontWeight:800,fontSize:11}}>Out of Stock</span></div>}
        {!out&&p.stock<=5&&<div style={{position:"absolute",bottom:6,left:6,background:"#FF8C00",color:"#fff",fontSize:8,fontWeight:700,padding:"2px 5px",borderRadius:8}}>Only {p.stock}!</div>}
      </div>
      <div style={{padding:"9px 9px 11px",flex:1,display:"flex",flexDirection:"column"}}>
        <div style={{fontSize:8,color:T.tm,fontFamily:"monospace",marginBottom:2}}>{p.sku}</div>
        <div style={{fontWeight:700,fontSize:11,color:T.tp,lineHeight:1.3,marginBottom:2,flex:1}}>{p.name}</div>
        <div style={{fontSize:9,color:T.ts,marginBottom:5}}>{p.variant}</div>
        <div style={{color:T.gold,fontWeight:900,fontSize:13}}>{ugx(p.price)}</div>
        {p.origPrice>p.price&&<div style={{fontSize:9,color:T.tm,textDecoration:"line-through"}}>{ugx(p.origPrice)}</div>}
        {!out&&(
          <div style={{marginTop:7}}>
            {qty===0
              ?<button onClick={e=>{e.stopPropagation();add(p.sku);}} style={{width:"100%",background:T.gold,border:"none",borderRadius:8,color:T.bg,fontWeight:800,fontSize:12,padding:"7px 0",cursor:"pointer",fontFamily:F}}>+ Add</button>
              :<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:T.bgIn,borderRadius:8,padding:"2px 4px"}} onClick={e=>e.stopPropagation()}>
                <button onClick={()=>rem(p.sku)} style={{background:"none",border:"none",color:T.gold,fontSize:20,cursor:"pointer",fontWeight:900,padding:"0 6px"}}>−</button>
                <span style={{fontWeight:900,color:T.tp,fontSize:15}}>{qty}</span>
                <button onClick={()=>add(p.sku)} style={{background:"none",border:"none",color:T.gold,fontSize:20,cursor:"pointer",fontWeight:900,padding:"0 6px"}}>+</button>
              </div>}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════ STAFF LOGIN MODAL ═══════════════ */
function StaffLogin({onLogin,onClose}){
  const [u,setU]=useState("");const [p,setP]=useState("");const [err,setErr]=useState("");
  const attempt=()=>{
    const match=STAFF_CREDS.find(s=>s.username===u.trim()&&s.password===p);
    if(match){onLogin(match);}else{setErr("Invalid username or password");}
  };
  return(
    <Sheet open={true} onClose={onClose} title="🔐 Staff Login">
      <div style={{marginBottom:6,padding:"10px 12px",background:"#1A1A00",borderRadius:10,fontSize:11,color:T.ts,border:`1px solid ${T.gold}33`}}>
        Staff-only area. Customer access is not affected.
      </div>
      <Fld label="Username" value={u} onChange={setU} placeholder="Enter username"/>
      <Fld label="Password" value={p} onChange={setP} placeholder="Enter password" type="password"/>
      {err&&<div style={{color:T.red,fontSize:12,marginBottom:8,padding:"8px 12px",background:"#2D0000",borderRadius:8}}>⚠ {err}</div>}
      <Btn full style={{padding:13,fontSize:14,marginTop:4}} onClick={attempt}>Login →</Btn>
    </Sheet>
  );
}

/* ═══════════════ CHECKOUT — PAYMENT SECTION ═══════════════ */
function PaymentSection({payMethod,setPayMethod,txId,setTxId,cardNum,setCardNum,cardExp,setCardExp,cardCvv,setCardCvv,cardName,setCardName}){
  const [txErr,setTxErr]=useState("");

  const validateTx=v=>{
    setTxId(v);
    const digits=v.replace(/\D/g,"");
    if(digits.length>0&&(digits.length<10||digits.length>14)){
      setTxErr(`Reference must be 10–14 digits (entered: ${digits.length})`);
    }else{setTxErr("");}
  };

  return(
    <div style={{background:T.bgCard,borderRadius:14,padding:16,border:`1px solid ${T.bdr}`}}>
      <div style={{fontWeight:700,fontSize:13,marginBottom:14,color:T.tp}}>💳 Payment Method</div>
      {/* Method selector */}
      <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
        {[["mtn",<MoMoLogo/>],["airtel",<AirtelLogo/>],["visa",<VisaLogo/>]].map(([id,logo])=>(
          <div key={id} onClick={()=>setPayMethod(id)} style={{flex:1,minWidth:80,padding:"10px 8px",borderRadius:12,border:`2px solid ${payMethod===id?T.gold:T.bdr}`,cursor:"pointer",background:payMethod===id?"#2D1A00":T.bgIn,display:"flex",alignItems:"center",justifyContent:"center"}}>
            {logo}
            {payMethod===id&&<span style={{position:"absolute",color:T.gold,fontSize:16,marginLeft:48,marginTop:-28,fontWeight:900}}>✓</span>}
          </div>
        ))}
      </div>

      {/* MTN MoMo */}
      {payMethod==="mtn"&&(
        <div>
          <div style={{padding:"8px 12px",background:"#003C7122",borderRadius:8,fontSize:11,color:"#F5C518",marginBottom:10}}>
            📲 Dial *165# → Send Money → Enter <b>0774 XXX XXX</b>
          </div>
          <Fld label="MoMo Reference Number (10–14 digits)" value={txId} onChange={validateTx} placeholder="e.g. 12345678901234" style={{fontFamily:"monospace"}} error={txErr}/>
          <Fld label="Your MoMo Phone Number (for WhatsApp receipt)" value={""} onChange={()=>{}} placeholder="07XXXXXXXXX"/>
        </div>
      )}

      {/* Airtel Money */}
      {payMethod==="airtel"&&(
        <div>
          <div style={{padding:"8px 12px",background:"#E4032D11",borderRadius:8,fontSize:11,color:"#E4032D",marginBottom:10}}>
            📲 Dial *185# → Send Money → Enter <b>0755 XXX XXX</b>
          </div>
          <Fld label="Airtel Money Reference (10–14 digits)" value={txId} onChange={validateTx} placeholder="e.g. 98765432109" style={{fontFamily:"monospace"}} error={txErr}/>
          <Fld label="Your Airtel Phone Number (for WhatsApp receipt)" value={""} onChange={()=>{}} placeholder="07XXXXXXXXX"/>
        </div>
      )}

      {/* Visa Card */}
      {payMethod==="visa"&&(
        <div>
          <div style={{padding:"10px 12px",background:"#1A1F7122",borderRadius:8,fontSize:11,color:"#60A5FA",marginBottom:12,border:`1px solid #1A1F7144`}}>
            🔒 Secure payment via Visa. Your card details are encrypted and never stored.
          </div>
          <Fld label="Cardholder Name" value={cardName} onChange={setCardName} placeholder="JOHN SMITH" style={{textTransform:"uppercase"}}/>
          <Fld label="Card Number" value={cardNum} onChange={v=>setCardNum(v.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim())} placeholder="4242 4242 4242 4242" style={{fontFamily:"monospace",letterSpacing:2}}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <Fld label="Expiry (MM/YY)" value={cardExp} onChange={v=>setCardExp(v.replace(/[^0-9/]/g,"").slice(0,5))} placeholder="12/27"/>
            <Fld label="CVV" value={cardCvv} onChange={v=>setCardCvv(v.replace(/\D/g,"").slice(0,4))} placeholder="123" type="password"/>
          </div>
          <div style={{fontSize:10,color:T.ts,marginTop:4}}>💬 WhatsApp receipt will be sent to the contact number you provide on this order.</div>
          <div style={{fontSize:10,color:"#60A5FA",marginTop:6,padding:"6px 10px",background:"#001830",borderRadius:8}}>ℹ Visa payments will be processed via your bank's 3D Secure system. You may receive an OTP on your registered number.</div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════ CUSTOMER APP ═══════════════ */
function CustomerApp({products,categories,onStaffAccess}){
  const [screen,setScreen]=useState("home");
  const [cat,setCat]=useState("all");
  const [search,setSearch]=useState("");
  const [cart,setCart]=useState({});
  const [txId,setTxId]=useState("");
  const [payMethod,setPayMethod]=useState("mtn");
  const [cardNum,setCardNum]=useState("");const [cardExp,setCardExp]=useState("");
  const [cardCvv,setCardCvv]=useState("");const [cardName,setCardName]=useState("");
  const [placedOrder,setPlacedOrder]=useState(null);
  const [detailProd,setDetailProd]=useState(null);
  const [showStaffLogin,setShowStaffLogin]=useState(false);
  const [focused,setFocused]=useState(false);
  const {h,m,s}=useCountdown();

  const add=sku=>setCart(c=>({...c,[sku]:(c[sku]||0)+1}));
  const rem=sku=>setCart(c=>{const n={...c};if(n[sku]>1)n[sku]--;else delete n[sku];return n;});
  const cartCount=Object.values(cart).reduce((a,b)=>a+b,0);
  const cartItems=Object.entries(cart).map(([sku,qty])=>({...products.find(p=>p.sku===sku),qty})).filter(i=>i.sku);
  const subtotal=cartItems.reduce((s,i)=>s+i.price*i.qty,0);
  const fee=4000,total=subtotal+fee;
  const flashItems=products.filter(p=>p.badge==="Flash"&&p.stock>0);

  const canPlace=()=>{
    if(payMethod==="visa") return cardNum.replace(/\s/g,"").length===16&&cardExp.length===5&&cardCvv.length>=3&&cardName.length>2;
    const digits=txId.replace(/\D/g,"");
    return digits.length>=10&&digits.length<=14;
  };

  const placeOrder=()=>{
    if(!canPlace()){
      if(payMethod==="visa") return alert("Please complete all card details");
      const d=txId.replace(/\D/g,"").length;
      return alert(`Reference must be 10–14 digits (entered ${d})`);
    }
    const ref=payMethod==="visa"?`VIS•••• ${cardNum.slice(-4)}`:txId;
    const o={id:`OGS${Date.now().toString().slice(-6)}`,customer:"You",phone:"07XXXXXXXX",items:cartItems.map(i=>({name:i.name,qty:i.qty,price:i.price})),total,fee,location:"Your Location",dist:3.2,branch:"Kitintale",status:"pending",txId:ref,rider:null,ts:new Date().toLocaleTimeString("en-UG",{hour:"2-digit",minute:"2-digit"}),payMethod};
    setPlacedOrder(o);setCart({});setTxId("");setCardNum("");setCardExp("");setCardCvv("");setCardName("");setScreen("tracking");
  };

  const filtered=products.filter(p=>{
    const inCat=cat==="all"||p.cat===cat;
    const q=search.toLowerCase();
    const inS=!search||p.name.toLowerCase().includes(q)||p.sku.toLowerCase().includes(q);
    return inCat&&inS;
  });

  /* Bottom Nav — NO staff tab visible to customers */
  const Nav=()=>(
    <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:T.bgCard,borderTop:`1px solid ${T.bdr}`,display:"flex",zIndex:90}}>
      {[["home","🏠","Home"],["cart","🛒",cartCount>0?`Cart(${cartCount})`:"Cart"],["tracking","📦","Orders"]].map(([id,ico,lbl])=>{
        const active=screen===id||(screen==="detail"&&id==="home");
        return <button key={id} onClick={()=>setScreen(id)} style={{flex:1,background:"none",border:"none",padding:"10px 4px 8px",display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer",color:active?T.gold:T.ts,fontFamily:F}}>
          <span style={{fontSize:20}}>{ico}</span>
          <span style={{fontSize:9,fontWeight:700}}>{lbl}</span>
        </button>;
      })}
      {/* Hidden staff access — small discreet button in corner */}
      <button onClick={()=>setShowStaffLogin(true)} style={{position:"absolute",bottom:2,right:4,background:"none",border:"none",cursor:"pointer",padding:4,opacity:.15}} title="Staff">
        <span style={{fontSize:10,color:T.ts}}>🔑</span>
      </button>
    </div>
  );

  // DETAIL SCREEN
  if(detailProd) return(
    <div style={{fontFamily:F,background:T.bg,minHeight:"100vh",maxWidth:430,margin:"0 auto",color:T.tp}}>
      <div style={{height:290,background:T.bgEl,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>
        {detailProd.image?<img src={detailProd.image} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:110}}>{detailProd.emoji}</span>}
        <button onClick={()=>setDetailProd(null)} style={{position:"absolute",top:14,left:14,background:"rgba(0,0,0,.65)",border:"none",borderRadius:"50%",width:38,height:38,color:"#fff",fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>←</button>
        {detailProd.discount>0&&<div style={{position:"absolute",top:14,right:14,background:T.green,color:"#fff",fontWeight:900,fontSize:13,padding:"4px 10px",borderRadius:12}}>-{detailProd.discount}%</div>}
      </div>
      <div style={{padding:"16px 16px 110px"}}>
        <div style={{fontSize:9,color:T.tm,fontFamily:"monospace",marginBottom:3}}>{detailProd.sku}</div>
        <h2 style={{fontWeight:900,fontSize:20,marginBottom:4,color:T.tp}}>{detailProd.name}</h2>
        <div style={{fontSize:12,color:T.ts,marginBottom:12}}>{detailProd.variant} · per {detailProd.unit}</div>
        <div style={{display:"flex",alignItems:"baseline",gap:10,marginBottom:8}}>
          <span style={{fontWeight:900,fontSize:26,color:T.gold}}>{ugx(detailProd.price)}</span>
          {detailProd.origPrice>detailProd.price&&<span style={{fontSize:14,color:T.tm,textDecoration:"line-through"}}>{ugx(detailProd.origPrice)}</span>}
        </div>
        {detailProd.express&&<div style={{display:"inline-flex",alignItems:"center",gap:6,background:"#2D1A00",border:`1px solid ${T.gold}44`,borderRadius:8,padding:"5px 12px",marginBottom:14,fontSize:12,color:T.gold}}>⚡ Express — arrives in 30 min</div>}
        <div style={{background:T.bgCard,borderRadius:12,padding:14}}>
          {[["SKU",detailProd.sku],["Category",categories.find(c=>c.id===detailProd.cat)?.name||detailProd.cat],["Unit",detailProd.unit],["Stock",detailProd.stock>0?`${detailProd.stock} available`:"Out of stock"]].map(([k,v])=>(
            <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${T.bdr}`,fontSize:12}}>
              <span style={{color:T.ts}}>{k}</span><span style={{color:T.tp,fontWeight:600}}>{v}</span>
            </div>
          ))}
        </div>
      </div>
      {detailProd.stock>0&&(
        <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:T.bgCard,borderTop:`1px solid ${T.bdr}`,padding:"12px 16px 20px"}}>
          {(cart[detailProd.sku]||0)===0
            ?<Btn full style={{padding:14,fontSize:15,borderRadius:12}} onClick={()=>add(detailProd.sku)}>+ Add to Cart</Btn>
            :<div style={{display:"flex",alignItems:"center",gap:12}}>
              <button onClick={()=>rem(detailProd.sku)} style={{width:46,height:46,borderRadius:12,background:T.bgIn,border:`1px solid ${T.bdr}`,color:T.gold,fontSize:24,cursor:"pointer",fontWeight:900}}>−</button>
              <span style={{flex:1,textAlign:"center",fontWeight:900,fontSize:20}}>{cart[detailProd.sku]}</span>
              <button onClick={()=>add(detailProd.sku)} style={{width:46,height:46,borderRadius:12,background:T.gold,border:"none",color:T.bg,fontSize:24,cursor:"pointer",fontWeight:900}}>+</button>
            </div>}
        </div>
      )}
      {showStaffLogin&&<StaffLogin onLogin={s=>{setShowStaffLogin(false);onStaffAccess(s);}} onClose={()=>setShowStaffLogin(false)}/>}
    </div>
  );

  // TRACKING
  if(screen==="tracking"){
    const order=placedOrder||INIT_ORDERS[2];
    const steps=["Order Placed","Payment Verified","Rider Assigned","On the Way","Delivered"];
    const si=["pending","verified","assigned","on_the_way","delivered"].indexOf(order.status);
    return(
      <div style={{fontFamily:F,background:T.bg,minHeight:"100vh",maxWidth:430,margin:"0 auto",color:T.tp,paddingBottom:72}}>
        <div style={{background:T.bgCard,padding:"14px 16px",display:"flex",alignItems:"center",gap:12,borderBottom:`1px solid ${T.bdr}`}}>
          <button onClick={()=>setScreen("home")} style={{background:"none",border:"none",color:T.gold,fontSize:20,cursor:"pointer"}}>←</button>
          <span style={{fontWeight:800,fontSize:16}}>Track Order</span>
        </div>
        <div style={{padding:14}}>
          <div style={{background:`linear-gradient(135deg,${T.gold},${T.gDark})`,borderRadius:16,padding:18,marginBottom:14}}>
            <div style={{fontSize:10,fontWeight:700,color:"rgba(0,0,0,.45)",marginBottom:3}}>ORDER ID</div>
            <div style={{fontWeight:900,fontSize:22,color:T.bg}}>{order.id}</div>
            <div style={{marginTop:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <SPill status={order.status}/><span style={{fontSize:11,color:"rgba(0,0,0,.4)"}}>{order.ts}</span>
            </div>
          </div>
          <div style={{background:T.bgCard,borderRadius:14,padding:16,marginBottom:12}}>
            {steps.map((step,i)=>{
              const done=i<=si;
              return <div key={step} style={{display:"flex",alignItems:"center",gap:12,marginBottom:i<steps.length-1?18:0}}>
                <div style={{width:28,height:28,borderRadius:"50%",background:done?T.gold:T.bgIn,border:i===si+1?`2px solid ${T.gold}`:"none",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:900,color:done?T.bg:T.ts,flexShrink:0}}>{done?"✓":i+1}</div>
                <span style={{fontWeight:done?700:400,color:done?T.tp:T.ts,fontSize:13}}>{step}</span>
                {i===3&&order.status==="on_the_way"&&<span style={{marginLeft:"auto",fontSize:18}}>🏍️</span>}
              </div>;
            })}
          </div>
          <div style={{background:T.bgCard,borderRadius:14,padding:16,marginBottom:12}}>
            {order.items.map((it,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:5,color:T.ts}}><span>{it.name} ×{it.qty}</span><span style={{color:T.tp,fontWeight:700}}>{ugx(it.price*it.qty)}</span></div>)}
            <div style={{borderTop:`1px dashed ${T.bdr}`,marginTop:8,paddingTop:8}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:T.ts,marginBottom:4}}><span>Delivery Fee</span><span>{ugx(order.fee)}</span></div>
              <div style={{display:"flex",justifyContent:"space-between",fontWeight:900,fontSize:15,color:T.gold}}><span>TOTAL</span><span>{ugx(order.total)}</span></div>
            </div>
          </div>
          {/* WhatsApp notice — only for mobile money */}
          {order.payMethod!=="visa"&&(
            <div style={{background:"#001830",border:`1px solid #1565C044`,borderRadius:12,padding:14,fontSize:12,color:"#60A5FA"}}>
              <b>📱 WhatsApp Alerts Active</b><br/>
              Updates will be sent to your payment number as your order progresses.
            </div>
          )}
          {order.payMethod==="visa"&&(
            <div style={{background:"#001830",border:`1px solid #1A1F7144`,borderRadius:12,padding:14,fontSize:12,color:"#60A5FA"}}>
              <b>📱 WhatsApp Alerts Active</b><br/>
              Updates will be sent to the contact number you provided at checkout.
            </div>
          )}
        </div>
        <Nav/>
        {showStaffLogin&&<StaffLogin onLogin={s=>{setShowStaffLogin(false);onStaffAccess(s);}} onClose={()=>setShowStaffLogin(false)}/>}
      </div>
    );
  }

  // CHECKOUT
  if(screen==="checkout") return(
    <div style={{fontFamily:F,background:T.bg,minHeight:"100vh",maxWidth:430,margin:"0 auto",color:T.tp,paddingBottom:20}}>
      <div style={{background:T.bgCard,padding:"14px 16px",display:"flex",alignItems:"center",gap:12,borderBottom:`1px solid ${T.bdr}`}}>
        <button onClick={()=>setScreen("cart")} style={{background:"none",border:"none",color:T.gold,fontSize:20,cursor:"pointer"}}>←</button>
        <span style={{fontWeight:800,fontSize:16}}>Checkout</span>
      </div>
      <div style={{padding:14,display:"flex",flexDirection:"column",gap:12}}>
        <div style={{background:T.bgCard,borderRadius:14,padding:16,border:`1px solid ${T.bdr}`}}>
          <div style={{fontWeight:700,fontSize:13,marginBottom:10}}>📍 Delivery Location</div>
          <div style={{background:T.bgIn,borderRadius:10,padding:10,fontSize:12,color:T.ts}}>📡 GPS: <b style={{color:T.tp}}>Ntinda, 2.1km · Kitintale Branch</b></div>
          <div style={{marginTop:8,padding:"8px 12px",background:"#002D1A",borderRadius:8,fontSize:11,color:T.green,fontWeight:700}}>✅ Delivery available · Est. 28 min · Fee: {ugx(fee)}</div>
        </div>
        <div style={{background:T.bgCard,borderRadius:14,padding:16,border:`1px solid ${T.bdr}`}}>
          {cartItems.map((i,k)=><div key={k} style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:5,color:T.ts}}><span>{i.name} ×{i.qty}</span><span style={{color:T.tp}}>{ugx(i.price*i.qty)}</span></div>)}
          <div style={{borderTop:`1px solid ${T.bdr}`,marginTop:8,paddingTop:8}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:T.ts,marginBottom:4}}><span>Subtotal</span><span>{ugx(subtotal)}</span></div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:T.ts,marginBottom:4}}><span>Delivery Fee</span><span>{ugx(fee)}</span></div>
            <div style={{display:"flex",justifyContent:"space-between",fontWeight:900,fontSize:15,color:T.gold,marginTop:6}}><span>TOTAL</span><span>{ugx(total)}</span></div>
          </div>
        </div>
        <PaymentSection payMethod={payMethod} setPayMethod={setPayMethod} txId={txId} setTxId={setTxId} cardNum={cardNum} setCardNum={setCardNum} cardExp={cardExp} setCardExp={setCardExp} cardCvv={cardCvv} setCardCvv={setCardCvv} cardName={cardName} setCardName={setCardName}/>
        <Btn full disabled={!canPlace()} style={{padding:16,fontSize:15,borderRadius:14}} onClick={placeOrder}>
          {payMethod==="visa"?"🔒 Pay Securely with Visa":"👉 I HAVE PAID — PLACE ORDER"}
        </Btn>
        {!canPlace()&&<div style={{textAlign:"center",fontSize:11,color:T.ts}}>
          {payMethod==="visa"?"Complete all card fields above to continue":"Enter valid 10–14 digit reference to continue"}
        </div>}
      </div>
    </div>
  );

  // CART
  if(screen==="cart") return(
    <div style={{fontFamily:F,background:T.bg,minHeight:"100vh",maxWidth:430,margin:"0 auto",color:T.tp,paddingBottom:72}}>
      <div style={{background:T.bgCard,padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${T.bdr}`}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <button onClick={()=>setScreen("home")} style={{background:"none",border:"none",color:T.gold,fontSize:20,cursor:"pointer"}}>←</button>
          <span style={{fontWeight:800,fontSize:16}}>🛒 My Cart</span>
        </div>
        {cartItems.length>0&&<button onClick={()=>setCart({})} style={{background:"none",border:"none",color:T.red,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:F}}>Clear All</button>}
      </div>
      <div style={{padding:14}}>
        {cartItems.length===0
          ?<div style={{textAlign:"center",padding:"60px 20px",color:T.ts}}>
            <div style={{fontSize:60,marginBottom:12}}>🛒</div>
            <div style={{fontWeight:700,fontSize:16,marginBottom:8,color:T.tp}}>Your cart is empty</div>
            <Btn onClick={()=>setScreen("home")}>Browse Products</Btn>
          </div>
          :<>
            {cartItems.map(item=>(
              <div key={item.sku} style={{background:T.bgCard,borderRadius:14,padding:12,marginBottom:10,display:"flex",alignItems:"center",gap:12,border:`1px solid ${T.bdr}`}}>
                <ProdImg image={item.image} emoji={item.emoji} size={56} radius={10}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:700,fontSize:12,color:T.tp,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.name}</div>
                  <div style={{fontSize:9,color:T.ts}}>{item.variant}</div>
                  <div style={{color:T.gold,fontWeight:900,fontSize:13}}>{ugx(item.price)}</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <button onClick={()=>rem(item.sku)} style={{width:28,height:28,borderRadius:8,background:T.bgIn,border:`1px solid ${T.bdr}`,color:T.gold,fontWeight:900,cursor:"pointer",fontSize:14}}>−</button>
                  <span style={{fontWeight:900,fontSize:14,minWidth:20,textAlign:"center"}}>{item.qty}</span>
                  <button onClick={()=>add(item.sku)} style={{width:28,height:28,borderRadius:8,background:T.gold,border:"none",color:T.bg,fontWeight:900,cursor:"pointer",fontSize:14}}>+</button>
                </div>
              </div>
            ))}
            <div style={{background:T.bgCard,borderRadius:14,padding:16,marginTop:8,border:`1px solid ${T.bdr}`}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:T.ts,marginBottom:5}}><span>Subtotal ({cartCount} items)</span><span>{ugx(subtotal)}</span></div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:T.ts}}><span>Est. Delivery</span><span>{ugx(fee)}</span></div>
              <div style={{display:"flex",justifyContent:"space-between",fontWeight:900,fontSize:16,color:T.gold,marginTop:8,paddingTop:8,borderTop:`1px solid ${T.bdr}`}}><span>TOTAL</span><span>{ugx(total)}</span></div>
            </div>
            <Btn full style={{padding:15,fontSize:15,borderRadius:14,marginTop:14}} onClick={()=>setScreen("checkout")}>Proceed to Checkout →</Btn>
          </>}
      </div>
      <Nav/>
      {showStaffLogin&&<StaffLogin onLogin={s=>{setShowStaffLogin(false);onStaffAccess(s);}} onClose={()=>setShowStaffLogin(false)}/>}
    </div>
  );

  // HOME
  return(
    <div style={{fontFamily:F,background:T.bg,minHeight:"100vh",maxWidth:430,margin:"0 auto",color:T.tp,paddingBottom:72}}>
      <div style={{background:T.bgCard,padding:"12px 14px 10px",position:"sticky",top:0,zIndex:50,borderBottom:`1px solid ${T.bdr}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <img src="/logo.png" alt="Gold Supermarket" style={{height:38,objectFit:"contain"}} onError={e=>{e.target.style.display="none";}}/>
            <div>
              <div style={{fontWeight:900,fontSize:14,color:T.gold,lineHeight:1.1}}>GOLD SUPERMARKET</div>
              <div style={{fontSize:9,color:T.ts}}>📍 Kitintale · Mile 8, Gayaza Rd</div>
            </div>
          </div>
          <button onClick={()=>setScreen("cart")} style={{background:T.gold,border:"none",borderRadius:20,padding:"7px 14px",fontWeight:800,fontSize:12,cursor:"pointer",color:T.bg,display:"flex",alignItems:"center",gap:6,fontFamily:F}}>
            🛒{cartCount>0&&<span style={{background:T.red,color:"#fff",borderRadius:"50%",width:18,height:18,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:10}}>{cartCount}</span>}
          </button>
        </div>
        <div style={{display:"flex",alignItems:"center",background:T.bgIn,borderRadius:30,padding:"0 14px",border:`1.5px solid ${focused?T.gold:T.bdr}`,transition:"border-color .2s"}}>
          <span style={{color:T.ts}}>🔍</span>
          <input style={{border:"none",outline:"none",flex:1,padding:"10px 8px",fontSize:13,background:"transparent",fontFamily:F,color:T.tp}} placeholder="Search products, SKU…" value={search} onChange={e=>setSearch(e.target.value)} onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}/>
          {search&&<button onClick={()=>setSearch("")} style={{background:"none",border:"none",cursor:"pointer",color:T.ts,fontSize:16}}>✕</button>}
        </div>
      </div>

      {/* Category chips */}
      <div style={{display:"flex",gap:8,overflowX:"auto",padding:"12px 14px 4px",scrollbarWidth:"none"}}>
        {[{id:"all",name:"All",icon:"🛒",color:T.gold,image:null},...categories].map(c=>(
          <button key={c.id} onClick={()=>setCat(c.id)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,background:cat===c.id?`${T.gold}22`:"transparent",border:`1.5px solid ${cat===c.id?T.gold:T.bdr}`,borderRadius:12,padding:"8px 12px",cursor:"pointer",flexShrink:0,minWidth:60,transition:"all .15s"}}>
            {c.image?<img src={c.image} style={{width:26,height:26,borderRadius:6,objectFit:"cover"}} alt=""/>:<span style={{fontSize:20}}>{c.icon}</span>}
            <span style={{fontSize:10,fontWeight:700,color:cat===c.id?T.gold:T.ts,whiteSpace:"nowrap"}}>{c.id==="all"?"All":c.name.split(" ")[0]}</span>
          </button>
        ))}
      </div>

      {/* Search results */}
      {search&&<div style={{padding:"8px 14px"}}>
        <div style={{fontSize:12,color:T.ts,marginBottom:10}}>{filtered.length} result{filtered.length!==1?"s":""} for "<b style={{color:T.tp}}>{search}</b>"</div>
        {filtered.length===0
          ?<div style={{textAlign:"center",padding:40,color:T.ts}}><div style={{fontSize:40}}>🔍</div><div style={{marginTop:8}}>No products found</div></div>
          :<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>{filtered.map(p=><ProdCard key={p.sku} p={p} cart={cart} add={add} rem={rem} onTap={setDetailProd} cats={categories}/>)}</div>}
      </div>}

      {!search&&<>
        {/* Hero */}
        {cat==="all"&&<div style={{margin:"12px 14px 0",background:`linear-gradient(135deg,${T.gold},${T.gDark} 50%,${T.red})`,borderRadius:16,padding:"16px 18px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontWeight:900,fontSize:16,color:T.bg}}>Fresh. Fast. Delivered.</div>
            <div style={{fontSize:11,color:"rgba(0,0,0,.55)",marginTop:2}}>Order now — arrives in 30 mins 🚀</div>
            <div style={{marginTop:8,background:"rgba(0,0,0,.12)",borderRadius:8,padding:"4px 10px",display:"inline-block",fontSize:11,color:T.bg,fontWeight:700}}>📍 Kitintale · Mile 8</div>
          </div>
          <span style={{fontSize:52}}>🛵</span>
        </div>}

        {/* Flash sale */}
        {cat==="all"&&flashItems.length>0&&<div style={{margin:"14px 14px 0"}}>
          <div style={{background:`linear-gradient(90deg,${T.rDark},${T.red})`,borderRadius:"14px 14px 0 0",padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{color:"#fff",fontWeight:900,fontSize:14}}>⚡ Flash Sales</span>
            <div style={{display:"flex",gap:4,alignItems:"center"}}>
              {[h,m,s].map((t,i)=>(
                <React.Fragment key={i}>
                  <span style={{background:"rgba(255,255,255,.2)",color:"#fff",padding:"3px 7px",borderRadius:6,fontFamily:"monospace",fontWeight:900,fontSize:13}}>{t}</span>
                  {i<2&&<span style={{color:"rgba(255,255,255,.5)",fontWeight:900}}>:</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
          <div style={{display:"flex",gap:10,overflowX:"auto",background:`${T.red}11`,borderRadius:"0 0 14px 14px",padding:"10px 14px 14px",scrollbarWidth:"none",border:`1px solid ${T.red}33`,borderTop:"none"}}>
            {flashItems.map(p=>(
              <div key={p.sku} onClick={()=>setDetailProd(p)} style={{background:T.bgCard,borderRadius:12,minWidth:115,overflow:"hidden",cursor:"pointer",border:`1.5px solid ${cart[p.sku]?T.gold:T.bdr}`,flexShrink:0}}>
                <div style={{height:80,background:T.bgEl,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
                  {p.image?<img src={p.image} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:36}}>{p.emoji}</span>}
                </div>
                <div style={{padding:"8px 8px 10px"}}>
                  <div style={{fontSize:10,fontWeight:700,color:T.tp,lineHeight:1.2,marginBottom:1}}>{p.name}</div>
                  <div style={{color:T.gold,fontWeight:900,fontSize:12,marginTop:3}}>{ugx(p.price)}</div>
                  <div onClick={e=>{e.stopPropagation();add(p.sku);}} style={{marginTop:5,background:cart[p.sku]?T.bgIn:T.gold,borderRadius:6,padding:"4px 0",textAlign:"center",fontSize:10,fontWeight:800,color:cart[p.sku]?T.gold:T.bg,cursor:"pointer"}}>
                    {cart[p.sku]?`In cart: ${cart[p.sku]}`:"+ Add"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>}

        <div style={{padding:"14px 14px 0"}}>
          {cat==="all"
            ?categories.map(c=>{
                const items=products.filter(p=>p.cat===c.id&&p.stock>0).slice(0,4);
                if(!items.length)return null;
                return <div key={c.id} style={{marginBottom:22}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      {c.image?<img src={c.image} style={{width:24,height:24,borderRadius:6,objectFit:"cover"}} alt=""/>:<span style={{fontSize:20}}>{c.icon}</span>}
                      <span style={{fontWeight:800,fontSize:15,color:T.tp}}>{c.name}</span>
                    </div>
                    <button onClick={()=>setCat(c.id)} style={{background:"none",border:`1px solid ${T.bdr}`,borderRadius:20,padding:"4px 12px",fontSize:11,fontWeight:700,color:T.gold,cursor:"pointer",fontFamily:F}}>See All →</button>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                    {items.map(p=><ProdCard key={p.sku} p={p} cart={cart} add={add} rem={rem} onTap={setDetailProd} cats={categories}/>)}
                  </div>
                </div>;
              })
            :<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {products.filter(p=>p.cat===cat).map(p=><ProdCard key={p.sku} p={p} cart={cart} add={add} rem={rem} onTap={setDetailProd} cats={categories}/>)}
            </div>}
        </div>
      </>}
      <Nav/>
      {showStaffLogin&&<StaffLogin onLogin={s=>{setShowStaffLogin(false);onStaffAccess(s);}} onClose={()=>setShowStaffLogin(false)}/>}
    </div>
  );
}

/* ═══════════════ ADMIN / MANAGER DASHBOARD ═══════════════ */
function Dashboard({products,setProducts,categories,setCategories,riders,setRiders,staff,onLogout}){
  const isAdmin=staff.role==="admin";
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
  const [notifs,setNotifs]=useState(INIT_NOTIFS);

  const fOrders=filterStatus==="all"?orders:orders.filter(o=>o.status===filterStatus);
  const fProds=catFilter==="all"?products:products.filter(p=>p.cat===catFilter);

  const verifyPay=id=>setOrders(os=>os.map(o=>o.id===id?{...o,status:"verified"}:o));
  const assignR=(oid,rid)=>{setOrders(os=>os.map(o=>o.id===oid?{...o,status:"on_the_way",rider:rid}:o));setRiders(rs=>rs.map(r=>r.id===rid?{...r,status:"busy"}:r));setShowAssign(null);alert("✅ Rider assigned! WhatsApp alert sent.");};
  const markDone=id=>{const o=orders.find(x=>x.id===id);setOrders(os=>os.map(x=>x.id===id?{...x,status:"delivered"}:x));if(o?.rider)setRiders(rs=>rs.map(r=>r.id===o.rider?{...r,status:"available",deliveries:r.deliveries+1}:r));};

  const openEditP=p=>{setEditProd(p);setNp({...p,price:String(p.price),origPrice:String(p.origPrice||""),stock:String(p.stock),discount:String(p.discount||0),badge:p.badge||""});setShowProdModal(true);};
  const openAddP=()=>{setEditProd(null);setNp({name:"",variant:"",cat:"FG",price:"",origPrice:"",stock:"",unit:"pack",emoji:"📦",image:null,express:false,discount:0,badge:""});setShowProdModal(true);};
  const saveP=()=>{
    if(!np.name||!np.price)return alert("Name and price required");
    if(editProd){setProducts(ps=>ps.map(p=>p.sku===editProd.sku?{...np,sku:editProd.sku,price:+np.price,origPrice:+np.origPrice||+np.price,stock:+np.stock,discount:+np.discount}:p));}
    else{const sku=mkSKU(np.cat);setProducts(ps=>[...ps,{...np,sku,price:+np.price,origPrice:+np.origPrice||+np.price,stock:+np.stock,discount:+np.discount}]);}
    setShowProdModal(false);
  };

  const openEditC=c=>{setEditCat(c);setNc({...c});setShowCatModal(true);};
  const openAddC=()=>{setEditCat(null);setNc({id:"",name:"",icon:"🛒",color:T.gold,image:null});setShowCatModal(true);};
  const saveC=()=>{if(!nc.name||!nc.id)return alert("ID and name required");if(editCat)setCategories(cs=>cs.map(c=>c.id===editCat.id?{...nc}:c));else setCategories(cs=>[...cs,{...nc}]);setShowCatModal(false);};

  const openEditR=r=>{setEditRider(r);setRf({...r});setShowRiderModal(true);};
  const openAddR=()=>{setEditRider(null);setRf({name:"",phone:"",bike:"",branch:staff.branch==="All"?"Kitintale":staff.branch,status:"available",photo:null});setShowRiderModal(true);};
  const saveR=()=>{if(!rf.name||!rf.phone)return alert("Name and phone required");if(editRider)setRiders(rs=>rs.map(r=>r.id===editRider.id?{...r,...rf}:r));else setRiders(rs=>[...rs,{...rf,id:`R${Date.now()}`,rating:5.0,deliveries:0}]);setShowRiderModal(false);};

  const st={orders:orders.length,pending:orders.filter(o=>o.status==="pending").length,active:orders.filter(o=>o.status==="on_the_way").length,revenue:orders.filter(o=>["verified","on_the_way","delivered"].includes(o.status)).reduce((s,o)=>s+o.total,0),lowStock:products.filter(p=>p.stock>0&&p.stock<=5).length,outStock:products.filter(p=>p.stock===0).length};

  const C={wrap:{fontFamily:F,background:T.bg,minHeight:"100vh",color:T.tp},hdr:{background:`linear-gradient(135deg,${T.red},${T.rDark})`,padding:"14px 18px",display:"flex",alignItems:"center",justifyContent:"space-between"},tabs:{display:"flex",background:T.bgCard,borderBottom:`2px solid ${T.bdr}`,overflowX:"auto",scrollbarWidth:"none"},tab:a=>({padding:"12px 14px",fontSize:11,fontWeight:700,cursor:"pointer",border:"none",background:"none",color:a?T.gold:T.ts,borderBottom:a?`3px solid ${T.gold}`:"3px solid transparent",whiteSpace:"nowrap",fontFamily:F}),card:{background:T.bgCard,borderRadius:14,padding:14,border:`1px solid ${T.bdr}`,marginBottom:12}};
  const sel={width:"100%",background:T.bgIn,border:`1px solid ${T.bdr}`,borderRadius:10,padding:"10px 12px",color:T.tp,fontSize:13,fontFamily:F,outline:"none"};

  // Available tabs — manager has limited access
  const availTabs=isAdmin
    ?[["orders","📦 Orders"],["inventory","🛍️ Inventory"],["categories","🏷️ Categories"],["riders","🏍️ Riders"],["alerts","🔔 Alerts"]]
    :[["orders","📦 Orders"],["inventory","🛍️ Inventory"],["riders","🏍️ Riders"]];

  return(
    <div style={C.wrap}>
      <div style={C.hdr}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <img src="/logo.png" alt="" style={{height:36,objectFit:"contain"}} onError={e=>{e.target.style.display="none";}}/>
          <div>
            <div style={{fontWeight:900,fontSize:13,color:T.gold}}>GOLD SUPERMARKET</div>
            <div style={{fontSize:9,color:"rgba(255,255,255,.4)"}}>
              {staff.role==="admin"?"🛡 Admin":"👔 Manager"} · {staff.name} · {staff.branch}
            </div>
          </div>
        </div>
        <Btn sm onClick={onLogout}>🚪 Logout</Btn>
      </div>

      {/* Role badge */}
      <div style={{background:isAdmin?"#2D1A00":"#001830",borderBottom:`1px solid ${T.bdr}`,padding:"6px 18px",display:"flex",alignItems:"center",gap:8}}>
        <span style={{fontSize:10,fontWeight:700,color:isAdmin?T.gold:"#60A5FA"}}>
          {isAdmin?"🛡️ ADMIN — Full Access":"👔 MANAGER — Limited Access (no categories, alerts or delete)"}
        </span>
      </div>

      <div style={C.tabs}>
        {availTabs.map(([k,l])=>(
          <button key={k} style={C.tab(tab===k)} onClick={()=>setTab(k)}>{l}</button>
        ))}
      </div>

      <div style={{padding:14}}>
        {/* Stats */}
        <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
          {[[T.gold,"📦","Orders",st.orders],["#FF8C00","⏳","Pending",st.pending],[T.green,"🏍️","Active",st.active],[T.green,"💰","Revenue",st.revenue>0?`${(st.revenue/1000).toFixed(0)}K`:"0"],["#FF8C00","⚠️","Low",st.lowStock],[T.red,"❌","Out",st.outStock]].map(([c,ico,l,v])=>(
            <div key={l} style={{background:`${c}18`,borderRadius:14,padding:"12px 8px",border:`1px solid ${c}33`,flex:1,minWidth:70,textAlign:"center"}}>
              <div style={{fontSize:16}}>{ico}</div>
              <div style={{fontWeight:900,fontSize:17,color:c,marginTop:2}}>{v}</div>
              <div style={{fontSize:9,color:T.ts,marginTop:1}}>{l}</div>
            </div>
          ))}
        </div>

        {/* ORDERS */}
        {tab==="orders"&&<div>
          <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap"}}>
            {[["all","All"],["pending","Pending"],["verified","Verified"],["on_the_way","On Way"],["delivered","Delivered"]].map(([k,l])=>(
              <button key={k} onClick={()=>setFilterStatus(k)} style={{background:filterStatus===k?T.gold:T.bgEl,color:filterStatus===k?T.bg:T.ts,border:`1px solid ${filterStatus===k?T.gold:T.bdr}`,borderRadius:20,padding:"5px 12px",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:F}}>{l}</button>
            ))}
          </div>
          {fOrders.map(order=>(
            <div key={order.id} style={C.card}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:8}}>
                <div>
                  <div style={{fontWeight:900,fontSize:14,color:T.gold}}>{order.id}</div>
                  <div style={{fontSize:11,color:T.ts,marginTop:2}}>👤 {order.customer} · 📞 {order.phone}</div>
                  <div style={{fontSize:10,color:T.tm,marginTop:2}}>📍 {order.location} · {order.dist}km · {order.branch} · 🕐 {order.ts}</div>
                  <div style={{marginTop:4,fontSize:11,color:T.ts}}>{order.items.map(i=>`${i.name}×${i.qty}`).join(", ")}</div>
                  <div style={{marginTop:3,fontSize:11}}>
                    Tx: <span style={{fontFamily:"monospace",color:T.gLight}}>{order.txId}</span> · <b style={{color:T.gold}}>{ugx(order.total)}</b>
                    {" · "}<span style={{fontSize:10,color:order.payMethod==="visa"?"#60A5FA":order.payMethod==="mtn"?"#F5C518":"#E4032D"}}>{order.payMethod==="visa"?"💳 Visa":order.payMethod==="mtn"?"📱 MoMo":"✈ Airtel"}</span>
                  </div>
                </div>
                <SPill status={order.status}/>
              </div>
              <div style={{display:"flex",gap:8,marginTop:10,flexWrap:"wrap"}}>
                {order.status==="pending"&&<Btn sm onClick={()=>verifyPay(order.id)}>✅ Verify Payment</Btn>}
                {order.status==="verified"&&<Btn sm onClick={()=>setShowAssign(order.id)}>🏍️ Assign Rider</Btn>}
                {order.status==="on_the_way"&&<>
                  <span style={{fontSize:11,color:T.ts,alignSelf:"center"}}>Rider: {riders.find(r=>r.id===order.rider)?.name}</span>
                  <Btn sm onClick={()=>markDone(order.id)}>✅ Delivered</Btn>
                </>}
              </div>
              {showAssign===order.id&&<div style={{marginTop:10,background:T.bgEl,borderRadius:12,padding:12}}>
                <div style={{fontSize:11,fontWeight:700,color:T.gold,marginBottom:8}}>Select Rider:</div>
                {riders.map(r=>(
                  <div key={r.id} onClick={()=>r.status==="available"&&assignR(order.id,r.id)} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:10,marginBottom:6,background:T.bgCard,cursor:r.status==="available"?"pointer":"not-allowed",border:`1px solid ${r.status==="available"?T.gold+"33":T.bdr}`,opacity:r.status==="available"?1:.5}}>
                    <div style={{width:36,height:36,borderRadius:"50%",background:T.bgIn,overflow:"hidden",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                      {r.photo?<img src={r.photo} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:<span style={{fontSize:18}}>🏍️</span>}
                    </div>
                    <div style={{flex:1}}><div style={{fontWeight:700,fontSize:12}}>{r.name}</div><div style={{fontSize:10,color:T.ts}}>{r.bike} · {r.deliveries} today · ⭐{r.rating}</div></div>
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
              {[{id:"all",name:"All"},...categories].map(c=>(
                <button key={c.id} onClick={()=>setCatFilter(c.id)} style={{background:catFilter===c.id?T.gold:T.bgEl,color:catFilter===c.id?T.bg:T.ts,border:`1px solid ${catFilter===c.id?T.gold:T.bdr}`,borderRadius:20,padding:"5px 10px",fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:F}}>
                  {c.id==="all"?"All":(c.icon+" "+c.name.split(" ")[0])}
                </button>
              ))}
            </div>
            <Btn sm onClick={openAddP}>+ Add Product</Btn>
          </div>
          {(st.lowStock>0||st.outStock>0)&&<div style={{background:"#2D000A",borderRadius:10,padding:10,marginBottom:12,border:`1px solid ${T.red}33`}}>
            <div style={{fontWeight:800,color:T.red,fontSize:12,marginBottom:6}}>⚠️ Stock Alerts</div>
            {products.filter(p=>p.stock===0).map(p=><div key={p.sku} style={{fontSize:10,color:"#FF8888",marginBottom:2}}>❌ {p.name} — OUT OF STOCK</div>)}
            {products.filter(p=>p.stock>0&&p.stock<=5).map(p=><div key={p.sku} style={{fontSize:10,color:"#FFAA44",marginBottom:2}}>⚠️ {p.name} — Only {p.stock} left</div>)}
          </div>}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:10}}>
            {fProds.map(p=>(
              <div key={p.sku} style={{background:T.bgCard,borderRadius:12,overflow:"hidden",border:`1px solid ${T.bdr}`,opacity:p.stock===0?.6:1}}>
                <div style={{height:85,background:T.bgEl,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",position:"relative"}}>
                  {p.image?<img src={p.image} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:<span style={{fontSize:36}}>{p.emoji}</span>}
                  {p.stock===0&&<div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.55)",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{color:"#fff",fontSize:9,fontWeight:700}}>OUT</span></div>}
                  {p.stock>0&&p.stock<=5&&<div style={{position:"absolute",bottom:4,left:4,background:"#FF8C00",color:"#fff",fontSize:8,fontWeight:700,padding:"1px 5px",borderRadius:6}}>LOW:{p.stock}</div>}
                </div>
                <div style={{padding:"8px 10px"}}>
                  <div style={{fontSize:8,color:T.tm,fontFamily:"monospace"}}>{p.sku}</div>
                  <div style={{fontWeight:700,fontSize:11,marginTop:2,color:T.tp,lineHeight:1.3}}>{p.name}</div>
                  <div style={{fontSize:9,color:T.ts}}>{p.variant}</div>
                  <div style={{color:T.gold,fontWeight:900,fontSize:12,marginTop:3}}>{ugx(p.price)}</div>
                  <div style={{display:"flex",gap:5,marginTop:8}}>
                    <Btn sm onClick={()=>openEditP(p)}>✏️ Edit</Btn>
                    {/* Managers cannot delete products */}
                    {isAdmin&&<Btn sm danger onClick={()=>setProducts(ps=>ps.filter(x=>x.sku!==p.sku))}>Del</Btn>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>}

        {/* CATEGORIES — Admin only */}
        {tab==="categories"&&isAdmin&&<div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <span style={{fontWeight:800,fontSize:15}}>Product Categories</span>
            <Btn sm onClick={openAddC}>+ New Category</Btn>
          </div>
          {categories.map(c=>(
            <div key={c.id} style={{...C.card,display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:56,height:56,borderRadius:12,background:T.bgEl,overflow:"hidden",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                {c.image?<img src={c.image} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:<span style={{fontSize:28}}>{c.icon}</span>}
              </div>
              <div style={{flex:1}}>
                <div style={{fontWeight:800,fontSize:14}}>{c.name}</div>
                <div style={{fontSize:10,color:T.ts,marginTop:2}}>Code: <span style={{fontFamily:"monospace",color:T.gold}}>{c.id}</span> · {products.filter(p=>p.cat===c.id).length} products</div>
                <div style={{width:24,height:4,borderRadius:2,background:c.color,marginTop:5}}/>
              </div>
              <div style={{display:"flex",gap:6}}>
                <Btn sm onClick={()=>openEditC(c)}>✏️</Btn>
                <Btn sm danger onClick={()=>setCategories(cs=>cs.filter(x=>x.id!==c.id))}>✕</Btn>
              </div>
            </div>
          ))}
        </div>}

        {/* RIDERS */}
        {tab==="riders"&&<div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <span style={{fontWeight:800,fontSize:15}}>Rider Management</span>
            <Btn sm onClick={openAddR}>+ Add Rider</Btn>
          </div>
          {riders.map(r=>(
            <div key={r.id} style={{...C.card,display:"flex",gap:12,alignItems:"flex-start"}}>
              <div style={{width:54,height:54,borderRadius:"50%",background:T.bgEl,overflow:"hidden",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                {r.photo?<img src={r.photo} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:<span style={{fontSize:26}}>🏍️</span>}
              </div>
              <div style={{flex:1}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:6}}>
                  <div>
                    <div style={{fontWeight:800,fontSize:14}}>{r.name}</div>
                    <div style={{fontSize:11,color:T.ts,marginTop:2}}>📞 {r.phone}</div>
                    <div style={{fontSize:11,color:T.ts}}>🏍️ <span style={{fontFamily:"monospace",color:T.gLight,fontWeight:700}}>{r.bike||"—"}</span></div>
                    <div style={{fontSize:11,color:T.ts}}>📍 {r.branch} · ⭐{r.rating} · {r.deliveries} today</div>
                  </div>
                  <SPill status={r.status}/>
                </div>
                <div style={{display:"flex",gap:6,marginTop:10}}>
                  <Btn sm onClick={()=>openEditR(r)}>✏️ Edit</Btn>
                  {isAdmin&&<Btn sm danger onClick={()=>setRiders(rs=>rs.filter(x=>x.id!==r.id))}>Remove</Btn>}
                </div>
              </div>
            </div>
          ))}
        </div>}

        {/* ALERTS — Admin only */}
        {tab==="alerts"&&isAdmin&&<div>
          <div style={{background:"#1A1A00",border:`1px solid ${T.gold}44`,borderRadius:12,padding:12,marginBottom:14}}>
            <div style={{fontWeight:800,fontSize:13,color:T.gold,marginBottom:4}}>🔒 Verified Numbers Only</div>
            <div style={{fontSize:11,color:T.ts}}>Only numbers on this list receive WhatsApp alerts.</div>
          </div>
          {notifs.map(n=>(
            <div key={n.id} style={{...C.card,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
              <div>
                <div style={{fontWeight:700,fontFamily:"monospace",fontSize:13}}>{n.num}</div>
                <div style={{fontSize:10,color:T.ts,marginTop:2}}>{n.role} · {n.branch}</div>
              </div>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <Toggle on={n.active} onChange={v=>setNotifs(ns=>ns.map(x=>x.id===n.id?{...x,active:v}:x))}/>
                <Btn sm danger onClick={()=>setNotifs(ns=>ns.filter(x=>x.id!==n.id))}>✕</Btn>
              </div>
            </div>
          ))}
          <Btn onClick={()=>{const num=prompt("+256 7XX XXX XXX");const role=prompt("Role:");const branch=prompt("Branch:");if(num&&role)setNotifs(ns=>[...ns,{id:Date.now(),num,role,branch:branch||"All",active:true}]);}}>+ Add Number</Btn>
          <div style={{...C.card,marginTop:14}}>
            <div style={{fontWeight:800,fontSize:12,color:T.gold,marginBottom:10}}>📱 Smart Alert Routing</div>
            {[["🛒 New order","Nearest branch manager"],["💳 MoMo/Airtel verified","All active admins — send to payment number"],["💳 Visa payment","Customer contact number only"],["🏍️ Rider assigned","Rider + Customer WhatsApp"],["✅ Delivered","Customer + Supervisor"],["⚠️ Low stock","Branch manager only"]].map(([ev,tg])=>(
              <div key={ev} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${T.bdr}`,fontSize:11}}>
                <span style={{color:T.ts}}>{ev}</span><span style={{color:T.tm,maxWidth:"55%",textAlign:"right"}}>{tg}</span>
              </div>
            ))}
          </div>
        </div>}
      </div>

      {/* ── Product Sheet */}
      <Sheet open={showProdModal} onClose={()=>setShowProdModal(false)} title={editProd?"Edit Product":"New Product"}>
        <div style={{display:"flex",gap:14,alignItems:"flex-start",marginBottom:14}}>
          <ImgUp current={np.image} onUpload={img=>setNp(p=>({...p,image:img}))} label="Product Image" size={72}/>
          <div style={{flex:1}}>
            <Fld label="Product Name" value={np.name} onChange={v=>setNp(p=>({...p,name:v}))} placeholder="e.g. Birthday Cake"/>
            <Fld label="Variant / Size" value={np.variant} onChange={v=>setNp(p=>({...p,variant:v}))} placeholder="e.g. Custom"/>
          </div>
        </div>
        {!np.image&&<Fld label="Emoji Fallback" value={np.emoji} onChange={v=>setNp(p=>({...p,emoji:v}))} placeholder="🎂"/>}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <Fld label="Price (UGX)" value={np.price} onChange={v=>setNp(p=>({...p,price:v}))} type="number"/>
          <Fld label="Orig. Price" value={np.origPrice} onChange={v=>setNp(p=>({...p,origPrice:v}))} type="number"/>
          <Fld label="Stock Qty" value={np.stock} onChange={v=>setNp(p=>({...p,stock:v}))} type="number"/>
          <Fld label="Unit" value={np.unit} onChange={v=>setNp(p=>({...p,unit:v}))} placeholder="piece/plate"/>
          <Fld label="Discount %" value={np.discount} onChange={v=>setNp(p=>({...p,discount:v}))} type="number"/>
          <Fld label="Badge" value={np.badge} onChange={v=>setNp(p=>({...p,badge:v}))} placeholder="Flash/Fresh/Order"/>
        </div>
        <div style={{marginBottom:10}}>
          <div style={{fontSize:10,fontWeight:700,color:T.ts,marginBottom:4,textTransform:"uppercase",letterSpacing:.5}}>Category</div>
          <select value={np.cat} onChange={e=>setNp(p=>({...p,cat:e.target.value}))} style={{width:"100%",background:T.bgIn,border:`1px solid ${T.bdr}`,borderRadius:10,padding:"10px 12px",color:T.tp,fontSize:13,fontFamily:F,outline:"none"}}>
            {categories.map(c=><option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
          </select>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
          <Toggle on={np.express} onChange={v=>setNp(p=>({...p,express:v}))} label="Express 30-min delivery"/>
        </div>
        <div style={{display:"flex",gap:10}}>
          <Btn style={{flex:1}} onClick={saveP}>💾 {editProd?"Save Changes":"Add Product"}</Btn>
          <Btn outline onClick={()=>setShowProdModal(false)}>Cancel</Btn>
        </div>
      </Sheet>

      {/* ── Category Sheet — admin only */}
      {isAdmin&&<Sheet open={showCatModal} onClose={()=>setShowCatModal(false)} title={editCat?"Edit Category":"New Category"}>
        <div style={{display:"flex",gap:14,alignItems:"flex-start",marginBottom:14}}>
          <ImgUp current={nc.image} onUpload={img=>setNc(c=>({...c,image:img}))} label="Category Image" size={72}/>
          <div style={{flex:1}}>
            <Fld label="Category Name" value={nc.name} onChange={v=>setNc(c=>({...c,name:v}))} placeholder="e.g. Cakes & Bakery"/>
            <Fld label="Category Code (2-3 letters)" value={nc.id} onChange={v=>setNc(c=>({...c,id:v.toUpperCase()}))} placeholder="e.g. BK"/>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <Fld label="Emoji Icon" value={nc.icon} onChange={v=>setNc(c=>({...c,icon:v}))} placeholder="🎂"/>
          <Fld label="Brand Color (hex)" value={nc.color} onChange={v=>setNc(c=>({...c,color:v}))} placeholder="#D4426A"/>
        </div>
        <div style={{display:"flex",gap:10,marginTop:4}}>
          <Btn style={{flex:1}} onClick={saveC}>💾 {editCat?"Save Changes":"Add Category"}</Btn>
          <Btn outline onClick={()=>setShowCatModal(false)}>Cancel</Btn>
        </div>
      </Sheet>}

      {/* ── Rider Sheet */}
      <Sheet open={showRiderModal} onClose={()=>setShowRiderModal(false)} title={editRider?"Edit Rider":"New Rider"}>
        <div style={{display:"flex",gap:14,alignItems:"flex-start",marginBottom:14}}>
          <ImgUp current={rf.photo} onUpload={img=>setRf(r=>({...r,photo:img}))} label="Rider Photo" size={72} radius={36}/>
          <div style={{flex:1}}>
            <Fld label="Full Name" value={rf.name} onChange={v=>setRf(r=>({...r,name:v}))} placeholder="e.g. Kato Denis"/>
            <Fld label="Phone Number" value={rf.phone} onChange={v=>setRf(r=>({...r,phone:v}))} placeholder="07XXXXXXXX"/>
          </div>
        </div>
        <Fld label="Motorcycle Registration Plate" value={rf.bike} onChange={v=>setRf(r=>({...r,bike:v.toUpperCase()}))} placeholder="e.g. UAX 123G" style={{fontFamily:"monospace",letterSpacing:1}}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <div>
            <div style={{fontSize:10,fontWeight:700,color:T.ts,marginBottom:4,textTransform:"uppercase",letterSpacing:.5}}>Branch</div>
            <select value={rf.branch} onChange={e=>setRf(r=>({...r,branch:e.target.value}))} style={{width:"100%",background:T.bgIn,border:`1px solid ${T.bdr}`,borderRadius:10,padding:"10px 12px",color:T.tp,fontSize:13,fontFamily:F,outline:"none"}}>
              <option>Kitintale</option>
              <option>Mile 8</option>
            </select>
          </div>
          <div>
            <div style={{fontSize:10,fontWeight:700,color:T.ts,marginBottom:4,textTransform:"uppercase",letterSpacing:.5}}>Status</div>
            <select value={rf.status} onChange={e=>setRf(r=>({...r,status:e.target.value}))} style={{width:"100%",background:T.bgIn,border:`1px solid ${T.bdr}`,borderRadius:10,padding:"10px 12px",color:T.tp,fontSize:13,fontFamily:F,outline:"none"}}>
              <option value="available">Available</option>
              <option value="busy">Busy</option>
              <option value="offline">Offline</option>
            </select>
          </div>
        </div>
        <div style={{display:"flex",gap:10,marginTop:14}}>
          <Btn style={{flex:1}} onClick={saveR}>💾 {editRider?"Save Changes":"Add Rider"}</Btn>
          <Btn outline onClick={()=>setShowRiderModal(false)}>Cancel</Btn>
        </div>
      </Sheet>
    </div>
  );
}

/* ═══════════════ RIDER APP ═══════════════ */
function RiderApp({riders,onBack}){
  const rider=riders[0];
  const [myOrders,setMyOrders]=useState(INIT_ORDERS.slice(0,2).map(o=>({...o,status:o.status==="on_the_way"?"on_the_way":"new"})));
  const accept=id=>setMyOrders(os=>os.map(o=>o.id===id?{...o,status:"on_the_way"}:o));
  const deliver=id=>setMyOrders(os=>os.map(o=>o.id===id?{...o,status:"delivered"}:o));
  return(
    <div style={{fontFamily:F,background:T.bg,minHeight:"100vh",color:T.tp,maxWidth:430,margin:"0 auto"}}>
      <div style={{background:"linear-gradient(135deg,#16A34A,#14532D)",padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:42,height:42,borderRadius:"50%",background:"rgba(255,255,255,.15)",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center"}}>
            {rider?.photo?<img src={rider.photo} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:<span style={{fontSize:22}}>🏍️</span>}
          </div>
          <div>
            <div style={{fontWeight:900,fontSize:15,color:"#fff"}}>{rider?.name||"Rider"}</div>
            <div style={{fontSize:10,color:"rgba(255,255,255,.55)"}}>🏍️ {rider?.bike||"—"} · 📍 {rider?.branch}</div>
          </div>
        </div>
        <Btn sm onClick={onBack}>← Back</Btn>
      </div>
      <div style={{padding:14}}>
        <div style={{display:"flex",gap:10,marginBottom:14}}>
          {[["📦",rider?.deliveries||0,"Today"],["⭐",rider?.rating||"5.0","Rating"],["⏱️","28 min","Avg"]].map(([ico,v,l])=>(
            <div key={l} style={{flex:1,background:T.bgCard,borderRadius:12,padding:"12px 8px",textAlign:"center",border:`1px solid ${T.bdr}`}}>
              <div style={{fontSize:19}}>{ico}</div>
              <div style={{fontWeight:900,fontSize:16,color:T.green,marginTop:3}}>{v}</div>
              <div style={{fontSize:9,color:T.ts}}>{l}</div>
            </div>
          ))}
        </div>
        {myOrders.map(o=>(
          <div key={o.id} style={{background:T.bgCard,borderRadius:14,padding:14,marginBottom:12,border:`1px solid ${T.bdr}`}}>
            <div style={{fontWeight:900,fontSize:13,color:T.gold}}>{o.id}</div>
            <div style={{fontSize:11,color:T.ts,marginTop:4}}>📍 Pickup: <b style={{color:T.tp}}>{o.branch} Branch</b></div>
            <div style={{fontSize:11,color:T.ts}}>🏠 Drop: <b style={{color:T.tp}}>{o.location}</b> ({o.dist}km)</div>
            <div style={{fontSize:11,color:T.ts}}>👤 {o.customer} · {o.phone}</div>
            <div style={{fontSize:10,color:T.tm,marginTop:3}}>{o.items.map(i=>`${i.name}×${i.qty}`).join(", ")}</div>
            <div style={{fontWeight:700,color:T.gold,marginTop:4}}>{ugx(o.total)}</div>
            <div style={{display:"flex",gap:8,marginTop:10,alignItems:"center",flexWrap:"wrap"}}>
              <SPill status={o.status}/>
              {o.status==="new"&&<Btn sm onClick={()=>accept(o.id)}>✅ Accept</Btn>}
              {o.status==="on_the_way"&&<>
                <a href={`https://maps.google.com/?q=${o.location},Kampala`} target="_blank" rel="noreferrer" style={{background:"#1565C0",color:"#fff",border:"none",borderRadius:8,padding:"6px 12px",fontWeight:800,fontSize:11,cursor:"pointer",textDecoration:"none",fontFamily:F}}>🗺️ Navigate</a>
                <Btn sm onClick={()=>deliver(o.id)}>✅ Delivered</Btn>
              </>}
              {o.status==="delivered"&&<span style={{color:T.green,fontWeight:700,fontSize:12}}>✅ Completed</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════ ROOT ═══════════════ */
export default function App(){
  const [mode,setMode]=useState("customer");
  const [products,setProducts]=useState(INIT_PRODUCTS);
  const [categories,setCategories]=useState(INIT_CATS);
  const [riders,setRiders]=useState(INIT_RIDERS);
  const [staff,setStaff]=useState(null); // logged-in staff member

  const handleStaffAccess=s=>{setStaff(s);setMode("dashboard");};
  const handleLogout=()=>{setStaff(null);setMode("customer");};

  return(
    <div style={{fontFamily:F,background:T.bg}}>
      {/* Mode switcher — ONLY visible in dev/demo; in production remove this bar */}
      <div style={{background:"#0A0A0A",display:"flex",justifyContent:"center",padding:"6px 0",borderBottom:`1px solid ${T.bdr}`,position:"sticky",top:0,zIndex:200}}>
        <button onClick={()=>setMode("customer")} style={{background:mode==="customer"?T.gold:"transparent",color:mode==="customer"?T.bg:T.ts,border:"none",padding:"6px 18px",fontWeight:800,fontSize:11,cursor:"pointer",borderRadius:mode==="customer"?8:0,fontFamily:F}}>🛒 Customer</button>
        <button onClick={()=>setMode("rider")} style={{background:mode==="rider"?T.gold:"transparent",color:mode==="rider"?T.bg:T.ts,border:"none",padding:"6px 18px",fontWeight:800,fontSize:11,cursor:"pointer",borderRadius:mode==="rider"?8:0,fontFamily:F}}>🏍️ Rider</button>
        {/* Staff dashboard — only accessible after login */}
        {staff&&<button onClick={()=>setMode("dashboard")} style={{background:mode==="dashboard"?T.gold:"transparent",color:mode==="dashboard"?T.bg:T.ts,border:"none",padding:"6px 18px",fontWeight:800,fontSize:11,cursor:"pointer",borderRadius:mode==="dashboard"?8:0,fontFamily:F}}>🧑‍💼 {staff.role==="admin"?"Admin":"Manager"}</button>}
      </div>

      {mode==="customer"&&<CustomerApp products={products} categories={categories} onStaffAccess={handleStaffAccess}/>}
      {mode==="rider"&&<RiderApp riders={riders} onBack={()=>setMode("customer")}/>}
      {mode==="dashboard"&&staff&&<Dashboard products={products} setProducts={setProducts} categories={categories} setCategories={setCategories} riders={riders} setRiders={setRiders} staff={staff} onLogout={handleLogout}/>}
      {mode==="dashboard"&&!staff&&<div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"80vh",color:T.ts,fontFamily:F}}>
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:40,marginBottom:12}}>🔒</div>
          <div style={{fontWeight:700,fontSize:16,color:T.tp,marginBottom:8}}>Login required</div>
          <Btn onClick={()=>setMode("customer")}>← Return to Shop</Btn>
        </div>
      </div>}
    </div>
  );
}
