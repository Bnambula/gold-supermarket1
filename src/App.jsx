import { useState, useEffect, useRef } from "react";
// Logo lives in /public/logo.png — replace with your actual file
const LOGO_URL = "/logo.png";

const G = {
  gold: "#F5B800", goldDark: "#D49A00", goldLight: "#FFD84D",
  red: "#C0001E", redDark: "#8B0015",
  cream: "#FFFBF0", dark: "#1A0A00", charcoal: "#2D1A00",
  smoke: "#F7F2E8", muted: "#9A8060",
  green: "#1B8C4E", greenLight: "#E6F7EE", orange: "#E86A00",
};

const mkSKU = (catCode, uid) => `PDT-${catCode}-${uid}`;

const ALL_PRODUCTS = [
  // ── FOOD & GROCERIES – Starches & Grains (FG01) ──
  { sku: mkSKU("FG01","SWTR"), name: "SWT MB Long Grain Rice (UG)", variant: "5KG", cat: "Food & Groceries", subcat: "Starches & Grains", price: 23200, origPrice: 24400, stock: 42, unit: "bag", emoji: "🌾", express: true, discount: 5, badge: null },
  { sku: mkSKU("FG01","ZHYR"), name: "Zhong YI Super Rice", variant: "5KG", cat: "Food & Groceries", subcat: "Starches & Grains", price: 26500, origPrice: 29500, stock: 18, unit: "bag", emoji: "🌾", express: false, discount: 10, badge: "Popular" },
  { sku: mkSKU("FG01","SWMB"), name: "SWT MB Long Grain Rice", variant: "25KG", cat: "Food & Groceries", subcat: "Starches & Grains", price: 103000, origPrice: 110000, stock: 8, unit: "bag", emoji: "🌾", express: false, discount: 7, badge: null },
  { sku: mkSKU("FG01","SWAR"), name: "SWT Aromatic Daily Use Rice", variant: "5KG", cat: "Food & Groceries", subcat: "Starches & Grains", price: 34200, origPrice: 36000, stock: 14, unit: "bag", emoji: "🌾", express: false, discount: 5, badge: null },
  { sku: mkSKU("FG01","MGMF"), name: "Maganjo Maize Flour", variant: "2KG", cat: "Food & Groceries", subcat: "Starches & Grains", price: 7500, origPrice: 8000, stock: 55, unit: "pack", emoji: "🌽", express: true, discount: 6, badge: "Local Fav" },
  { sku: mkSKU("FG01","NUMF"), name: "Numa Flour", variant: "2KG", cat: "Food & Groceries", subcat: "Starches & Grains", price: 6800, origPrice: 7200, stock: 30, unit: "pack", emoji: "🌽", express: true, discount: 6, badge: null },
  { sku: mkSKU("FG01","SUPF"), name: "Supreme All-Purpose Flour", variant: "2KG", cat: "Food & Groceries", subcat: "Starches & Grains", price: 9200, origPrice: 10000, stock: 22, unit: "pack", emoji: "🫘", express: false, discount: 8, badge: null },
  { sku: mkSKU("FG01","SLPA"), name: "Santa Lucia Pasta", variant: "500g", cat: "Food & Groceries", subcat: "Starches & Grains", price: 4500, origPrice: 5000, stock: 35, unit: "pack", emoji: "🍝", express: false, discount: 10, badge: null },
  { sku: mkSKU("FG01","INDO"), name: "Indomie Noodles Chicken", variant: "70g×40pcs carton", cat: "Food & Groceries", subcat: "Starches & Grains", price: 32000, origPrice: 35500, stock: 20, unit: "carton", emoji: "🍜", express: true, discount: 10, badge: "Flash" },
  // Cooking Essentials (FG02)
  { sku: mkSKU("FG02","KKSG"), name: "Kakira Sugar", variant: "10KG", cat: "Food & Groceries", subcat: "Cooking Essentials", price: 35000, origPrice: 36300, stock: 30, unit: "bag", emoji: "🍬", express: false, discount: 3, badge: null },
  { sku: mkSKU("FG02","SNSD"), name: "Sunseed Sunflower Cooking Oil", variant: "3L", cat: "Food & Groceries", subcat: "Cooking Essentials", price: 27800, origPrice: 31200, stock: 25, unit: "bottle", emoji: "🛢️", express: false, discount: 11, badge: "Sale" },
  { sku: mkSKU("FG02","STRF"), name: "Star Fry Cooking Oil", variant: "12×1L sachets", cat: "Food & Groceries", subcat: "Cooking Essentials", price: 82800, origPrice: 92000, stock: 6, unit: "carton", emoji: "🛢️", express: false, discount: 10, badge: null },
  { sku: mkSKU("FG02","MKWO"), name: "Mukwano Vegetable Oil", variant: "2L", cat: "Food & Groceries", subcat: "Cooking Essentials", price: 19500, origPrice: 21000, stock: 18, unit: "bottle", emoji: "🛢️", express: true, discount: 7, badge: null },
  { sku: mkSKU("FG02","SALT"), name: "Iodized Table Salt", variant: "1KG", cat: "Food & Groceries", subcat: "Cooking Essentials", price: 1800, origPrice: 2000, stock: 80, unit: "pack", emoji: "🧂", express: true, discount: 10, badge: null },
  // ── BEVERAGES ──
  { sku: mkSKU("BV01","RHMN"), name: "Riham Oner Mango Juice", variant: "300ml×12", cat: "Beverages", subcat: "Juices & Soft Drinks", price: 14600, origPrice: 16700, stock: 28, unit: "carton", emoji: "🥭", express: true, discount: 13, badge: "Flash" },
  { sku: mkSKU("BV01","RHAP"), name: "Riham Oner Apple Juice", variant: "300ml×12", cat: "Beverages", subcat: "Juices & Soft Drinks", price: 14600, origPrice: 16700, stock: 22, unit: "carton", emoji: "🍎", express: true, discount: 13, badge: "Flash" },
  { sku: mkSKU("BV01","RKBM"), name: "Riham Rockboom Energy Drink", variant: "320ml×12", cat: "Beverages", subcat: "Juices & Soft Drinks", price: 18900, origPrice: 21700, stock: 15, unit: "carton", emoji: "⚡", express: false, discount: 13, badge: "Flash" },
  { sku: mkSKU("BV01","COLA"), name: "Coca-Cola", variant: "500ml", cat: "Beverages", subcat: "Juices & Soft Drinks", price: 2000, origPrice: 2200, stock: 50, unit: "bottle", emoji: "🥤", express: true, discount: 9, badge: null },
  { sku: mkSKU("BV01","MWTR"), name: "Mineral Water", variant: "1.5L", cat: "Beverages", subcat: "Juices & Soft Drinks", price: 2500, origPrice: 2800, stock: 60, unit: "bottle", emoji: "💧", express: true, discount: 11, badge: null },
  { sku: mkSKU("BV02","JMWK"), name: "Jameson Irish Whiskey", variant: "750ml", cat: "Beverages", subcat: "Spirits & Wine", price: 88900, origPrice: 98000, stock: 8, unit: "bottle", emoji: "🥃", express: false, discount: 10, badge: null },
  { sku: mkSKU("BV02","FC7R"), name: "Four Cousins Sweet Rose", variant: "750ml", cat: "Beverages", subcat: "Spirits & Wine", price: 29500, origPrice: 32800, stock: 12, unit: "bottle", emoji: "🍷", express: false, discount: 10, badge: null },
  { sku: mkSKU("BV02","FCLR"), name: "Four Cousins Sweet Rose", variant: "1500ml", cat: "Beverages", subcat: "Spirits & Wine", price: 55000, origPrice: 61000, stock: 7, unit: "bottle", emoji: "🍷", express: false, discount: 10, badge: null },
  { sku: mkSKU("BV03","JESA"), name: "Jesa UHT Low Fat Milk", variant: "500ml×12", cat: "Beverages", subcat: "Dairy & Milk", price: 22500, origPrice: 25200, stock: 20, unit: "carton", emoji: "🥛", express: true, discount: 11, badge: "Top Offer" },
  { sku: mkSKU("BV03","FDST"), name: "Fresh Dairy Strawberry Milk", variant: "250ml×12", cat: "Beverages", subcat: "Dairy & Milk", price: 16800, origPrice: 18400, stock: 14, unit: "carton", emoji: "🍓", express: true, discount: 9, badge: null },
  { sku: mkSKU("BV03","FDCH"), name: "Fresh Dairy Chocolate Milk", variant: "250ml×12", cat: "Beverages", subcat: "Dairy & Milk", price: 16800, origPrice: 18400, stock: 11, unit: "carton", emoji: "🍫", express: true, discount: 9, badge: null },
  { sku: mkSKU("BV03","BLBD"), name: "Blue Band Margarine", variant: "500g", cat: "Beverages", subcat: "Dairy & Milk", price: 8900, origPrice: 9800, stock: 25, unit: "tub", emoji: "🧈", express: false, discount: 9, badge: null },
  { sku: mkSKU("BV04","KLGG"), name: "Kellogg's Cornflakes", variant: "500g", cat: "Beverages", subcat: "Cereals & Breakfast", price: 18500, origPrice: 20000, stock: 18, unit: "box", emoji: "🥣", express: false, discount: 8, badge: null },
  { sku: mkSKU("BV04","AUPC"), name: "Aunt Porridge Composite Flour", variant: "1KG", cat: "Beverages", subcat: "Cereals & Breakfast", price: 7200, origPrice: 8000, stock: 22, unit: "pack", emoji: "🌾", express: false, discount: 10, badge: "Local" },
  // ── HOUSEHOLD & CLEANING ──
  { sku: mkSKU("HC01","MDET"), name: "Magic Detergent Blue Breeze", variant: "10KG", cat: "Household & Cleaning", subcat: "Laundry", price: 39400, origPrice: 43700, stock: 15, unit: "bucket", emoji: "🧺", express: false, discount: 10, badge: "Top Offer" },
  { sku: mkSKU("HC01","OMOW"), name: "Omo Detergent", variant: "3KG", cat: "Household & Cleaning", subcat: "Laundry", price: 18500, origPrice: 20000, stock: 20, unit: "box", emoji: "🧺", express: false, discount: 8, badge: null },
  { sku: mkSKU("HC01","TOSS"), name: "Toss Detergent", variant: "2KG", cat: "Household & Cleaning", subcat: "Laundry", price: 12000, origPrice: 13500, stock: 18, unit: "pack", emoji: "🧺", express: false, discount: 11, badge: null },
  { sku: mkSKU("HC01","WSTR"), name: "White Star Bar Soap", variant: "800g×6", cat: "Household & Cleaning", subcat: "Laundry", price: 14500, origPrice: 16000, stock: 30, unit: "pack", emoji: "🧼", express: false, discount: 9, badge: null },
  { sku: mkSKU("HC02","JIK2"), name: "Jik Bleach Twin Pack", variant: "750ml×2", cat: "Household & Cleaning", subcat: "Home Care", price: 21200, origPrice: 23000, stock: 22, unit: "pack", emoji: "🧽", express: false, discount: 8, badge: "Top Offer" },
  { sku: mkSKU("HC02","VIMC"), name: "Vim All-Purpose Cleaner", variant: "500g", cat: "Household & Cleaning", subcat: "Home Care", price: 5500, origPrice: 6000, stock: 35, unit: "tin", emoji: "🧽", express: false, discount: 8, badge: null },
  { sku: mkSKU("HC02","SNLW"), name: "Sunlight Dishwashing Liquid", variant: "750ml", cat: "Household & Cleaning", subcat: "Home Care", price: 7200, origPrice: 8000, stock: 28, unit: "bottle", emoji: "🫧", express: false, discount: 10, badge: null },
  { sku: mkSKU("HC03","EUTP"), name: "Eurotop Toilet Paper", variant: "10 rolls", cat: "Household & Cleaning", subcat: "Toiletries", price: 12500, origPrice: 14000, stock: 40, unit: "pack", emoji: "🧻", express: false, discount: 11, badge: null },
  { sku: mkSKU("HC03","SNPD"), name: "Sanitary Pads", variant: "10pcs", cat: "Household & Cleaning", subcat: "Toiletries", price: 5500, origPrice: 6000, stock: 45, unit: "pack", emoji: "🌸", express: false, discount: 8, badge: null },
  { sku: mkSKU("HC03","CLGT"), name: "Colgate Toothpaste", variant: "175g", cat: "Household & Cleaning", subcat: "Toiletries", price: 6200, origPrice: 7000, stock: 38, unit: "tube", emoji: "🦷", express: false, discount: 11, badge: null },
  // ── PERSONAL & BABY CARE ──
  { sku: mkSKU("PC01","DTTL"), name: "Dettol Antibacterial Soap", variant: "175g", cat: "Personal & Baby Care", subcat: "Personal Care", price: 4800, origPrice: 5200, stock: 50, unit: "bar", emoji: "🧼", express: true, discount: 8, badge: null },
  { sku: mkSKU("PC01","LNZO"), name: "Lanzo Anti-Bacterial Soap", variant: "200g×18 carton", cat: "Personal & Baby Care", subcat: "Personal Care", price: 38000, origPrice: 41300, stock: 10, unit: "carton", emoji: "🧼", express: false, discount: 8, badge: "Bulk" },
  { sku: mkSKU("PC01","LUXS"), name: "Lux Soap", variant: "150g×4", cat: "Personal & Baby Care", subcat: "Personal Care", price: 9500, origPrice: 10500, stock: 32, unit: "pack", emoji: "🛁", express: false, discount: 10, badge: null },
  { sku: mkSKU("PC01","HDSH"), name: "Head & Shoulders Shampoo", variant: "400ml", cat: "Personal & Baby Care", subcat: "Personal Care", price: 18500, origPrice: 20500, stock: 18, unit: "bottle", emoji: "🚿", express: false, discount: 10, badge: null },
  { sku: mkSKU("PC02","PMPS"), name: "Pampers Diapers", variant: "Size S – 44pcs", cat: "Personal & Baby Care", subcat: "Baby Care", price: 42000, origPrice: 46000, stock: 12, unit: "pack", emoji: "👶", express: false, discount: 9, badge: "Top Offer" },
  { sku: mkSKU("PC02","HGSM"), name: "Huggies Diapers", variant: "Size M – 40pcs", cat: "Personal & Baby Care", subcat: "Baby Care", price: 45000, origPrice: 50000, stock: 9, unit: "pack", emoji: "👶", express: false, discount: 10, badge: "Top Offer" },
  { sku: mkSKU("PC02","BWIP"), name: "Baby Wipes", variant: "80pcs", cat: "Personal & Baby Care", subcat: "Baby Care", price: 8500, origPrice: 9500, stock: 30, unit: "pack", emoji: "🌿", express: false, discount: 11, badge: null },
  { sku: mkSKU("PC02","NLCT"), name: "Nestle Lactogen Formula", variant: "400g", cat: "Personal & Baby Care", subcat: "Baby Care", price: 38000, origPrice: 42000, stock: 8, unit: "tin", emoji: "🍼", express: false, discount: 10, badge: null },
  // ── SNACKS & SEASONINGS ──
  { sku: mkSKU("SK01","RYCO"), name: "Royco Mchuzi Mix Chicken", variant: "200g×2", cat: "Snacks & Seasonings", subcat: "Seasonings & Spices", price: 9700, origPrice: 10700, stock: 40, unit: "pack", emoji: "🍲", express: true, discount: 10, badge: "Top Offer" },
  { sku: mkSKU("SK01","SMBL"), name: "Simba Mbili Curry Powder", variant: "100g", cat: "Snacks & Seasonings", subcat: "Seasonings & Spices", price: 4500, origPrice: 5000, stock: 28, unit: "pack", emoji: "🌶️", express: false, discount: 10, badge: null },
  { sku: mkSKU("SK01","PLMS"), name: "Pilau Masala", variant: "100g", cat: "Snacks & Seasonings", subcat: "Seasonings & Spices", price: 5200, origPrice: 5800, stock: 22, unit: "pack", emoji: "🌶️", express: false, discount: 10, badge: null },
  { sku: mkSKU("SK02","BRTN"), name: "Britania Biscuits Assorted", variant: "400g", cat: "Snacks & Seasonings", subcat: "Snacks & Biscuits", price: 7500, origPrice: 8500, stock: 30, unit: "pack", emoji: "🍪", express: false, discount: 12, badge: null },
  { sku: mkSKU("SK02","SUMZ"), name: "Sumz Rings & Crisps", variant: "Multi-pack×10", cat: "Snacks & Seasonings", subcat: "Snacks & Biscuits", price: 5000, origPrice: 5800, stock: 35, unit: "pack", emoji: "🍟", express: true, discount: 14, badge: "Flash" },
  { sku: mkSKU("SK02","GNTS"), name: "Roasted Groundnuts", variant: "500g", cat: "Snacks & Seasonings", subcat: "Snacks & Biscuits", price: 6500, origPrice: 7000, stock: 20, unit: "pack", emoji: "🥜", express: true, discount: 7, badge: "Local" },
];

const CAT_META = {
  "Food & Groceries": { icon: "🌾", code: "FG", color: "#E86A00", subcats: ["Starches & Grains","Cooking Essentials"] },
  "Beverages":        { icon: "🥤", code: "BV", color: "#1565C0", subcats: ["Juices & Soft Drinks","Dairy & Milk","Cereals & Breakfast","Spirits & Wine"] },
  "Household & Cleaning": { icon: "🧴", code: "HC", color: "#2E7D32", subcats: ["Laundry","Home Care","Toiletries"] },
  "Personal & Baby Care": { icon: "👶", code: "PC", color: "#7B1FA2", subcats: ["Personal Care","Baby Care"] },
  "Snacks & Seasonings":  { icon: "🍪", code: "SK", color: "#C0001E", subcats: ["Seasonings & Spices","Snacks & Biscuits"] },
};

const CATS_MAIN = ["All", ...Object.keys(CAT_META)];
const FLASH_ITEMS = ALL_PRODUCTS.filter(p => p.badge === "Flash");

const RIDERS = [
  { id:"R1", name:"Kato Denis", phone:"0774123456", status:"available", deliveries:12 },
  { id:"R2", name:"Nakato Sarah", phone:"0755987654", status:"busy", deliveries:8 },
  { id:"R3", name:"Mugisha Brian", phone:"0701456789", status:"available", deliveries:15 },
];

const initOrders = [
  { id:"OGS250326001", customer:"Aisha Namukasa", phone:"0772345678", items:[{name:"SWT MB Long Grain Rice",qty:2,price:23200},{name:"Royco Mchuzi Mix",qty:1,price:9700}], total:60100, fee:3000, location:"Ntinda", dist:2.1, branch:"Kitintale", status:"pending", txId:"MOM12345678", rider:null, ts:"09:14" },
  { id:"OGS250326002", customer:"Robert Ssempala", phone:"0753678901", items:[{name:"Sunseed Cooking Oil 3L",qty:1,price:27800},{name:"Kakira Sugar 10KG",qty:1,price:35000}], total:66800, fee:4000, location:"Kireka", dist:4.2, branch:"Kalerwe", status:"verified", txId:"AIR87654321", rider:"R3", ts:"09:32" },
  { id:"OGS250326003", customer:"Grace Akello", phone:"0700234567", items:[{name:"Mineral Water 1.5L",qty:6,price:2500}], total:19000, fee:4000, location:"Bukoto", dist:3.8, branch:"Kitintale", status:"on_the_way", txId:"MOM99887766", rider:"R1", ts:"08:55" },
];

const fmtUGX = n => `UGX ${Number(n).toLocaleString()}`;

function useCountdown() {
  const total = useRef(12*3600+40*60+17);
  const [t,setT] = useState(total.current);
  useEffect(() => { const id=setInterval(()=>setT(x=>x>0?x-1:0),1000); return ()=>clearInterval(id); },[]);
  return { h:String(Math.floor(t/3600)).padStart(2,"0"), m:String(Math.floor((t%3600)/60)).padStart(2,"0"), s:String(t%60).padStart(2,"0") };
}

const StatusBadge = ({status}) => {
  const map={pending:{label:"⏳ Awaiting Verify",bg:"#FFF3CD",color:"#856404"},verified:{label:"✓ Verified",bg:"#D1ECF1",color:"#0C5460"},on_the_way:{label:"🏍️ On the Way",bg:"#D4EDDA",color:"#155724"},delivered:{label:"✅ Delivered",bg:"#E2E3E5",color:"#383D41"}};
  const s=map[status]||map.pending;
  return <span style={{background:s.bg,color:s.color,padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700}}>{s.label}</span>;
};

function ProductCard({p,cart,addToCart,removeFromCart}) {
  const inCart=cart[p.sku]||0, outStock=p.stock===0;
  const catColor=CAT_META[p.cat]?.color||G.red;
  return (
    <div style={{background:"#fff",borderRadius:14,overflow:"hidden",boxShadow:"0 2px 10px rgba(0,0,0,0.07)",border:`1.5px solid ${inCart?G.gold:"#F0E8D0"}`,position:"relative",opacity:outStock?0.6:1,display:"flex",flexDirection:"column"}}>
      <div style={{position:"absolute",top:7,left:7,display:"flex",flexDirection:"column",gap:3,zIndex:2}}>
        {p.badge==="Flash"&&<span style={{background:G.red,color:"#fff",fontSize:8,fontWeight:900,padding:"2px 5px",borderRadius:8}}>⚡FLASH</span>}
        {p.badge&&p.badge!=="Flash"&&<span style={{background:catColor,color:"#fff",fontSize:8,fontWeight:800,padding:"2px 5px",borderRadius:8}}>{p.badge}</span>}
        {p.stock>0&&p.stock<=5&&<span style={{background:"#FFF3CD",color:"#856404",fontSize:8,fontWeight:700,padding:"2px 5px",borderRadius:8}}>Only {p.stock}!</span>}
      </div>
      {p.discount>0&&<div style={{position:"absolute",top:7,right:7,background:G.green,color:"#fff",fontSize:9,fontWeight:900,padding:"2px 6px",borderRadius:10}}>-{p.discount}%</div>}
      <div style={{background:`linear-gradient(180deg,${G.cream},#fff)`,padding:"14px 0 8px",textAlign:"center",fontSize:38}}>{p.emoji}</div>
      <div style={{padding:"6px 9px 10px",flex:1,display:"flex",flexDirection:"column"}}>
        <div style={{fontSize:8,color:"#AAA",fontFamily:"monospace",marginBottom:2,letterSpacing:0.3}}>{p.sku}</div>
        <div style={{fontWeight:700,fontSize:11,color:G.dark,lineHeight:1.3,marginBottom:1}}>{p.name}</div>
        <div style={{fontSize:9,color:G.muted,marginBottom:4}}>{p.variant}</div>
        <div style={{marginTop:"auto"}}>
          <div style={{color:G.red,fontWeight:900,fontSize:13}}>{fmtUGX(p.price)}</div>
          {p.origPrice>p.price&&<div style={{fontSize:9,color:"#BBB",textDecoration:"line-through"}}>{fmtUGX(p.origPrice)}</div>}
        </div>
        <div style={{marginTop:7}}>
          {outStock?(
            <div style={{width:"100%",textAlign:"center",fontSize:9,color:"#BBB",fontWeight:700,padding:"5px 0",background:"#F5F5F5",borderRadius:8}}>Out of Stock</div>
          ):inCart?(
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <button onClick={()=>removeFromCart(p.sku)} style={{width:26,height:26,borderRadius:8,border:`2px solid ${G.gold}`,background:"#fff",fontWeight:900,cursor:"pointer"}}>−</button>
              <span style={{fontWeight:900,fontSize:13}}>{inCart}</span>
              <button onClick={()=>addToCart(p.sku)} style={{width:26,height:26,borderRadius:8,border:"none",background:G.gold,fontWeight:900,cursor:"pointer"}}>+</button>
            </div>
          ):(
            <button onClick={()=>addToCart(p.sku)} style={{width:"100%",padding:"6px 0",border:"none",borderRadius:8,background:G.red,color:"#fff",fontWeight:800,fontSize:11,cursor:"pointer"}}>+ Add</button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Category Section with Load More ──────────────────────────────
function CatSection({catName,items,cart,addToCart,removeFromCart,perRow=4,onSeeAll}) {
  const [expanded,setExpanded]=useState(false);
  const shown=expanded?items:items.slice(0,perRow);
  const meta=CAT_META[catName];
  return (
    <div style={{marginBottom:8}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 14px 8px"}}>
        <div style={{display:"flex",alignItems:"center",gap:7}}>
          <span style={{fontSize:20}}>{meta?.icon}</span>
          <span style={{fontWeight:900,fontSize:15,color:G.dark}}>{catName}</span>
          <span style={{fontSize:10,color:G.muted,background:"#F0EAE0",borderRadius:10,padding:"2px 7px"}}>{items.length}</span>
        </div>
        {onSeeAll&&<button onClick={onSeeAll} style={{fontSize:11,fontWeight:700,color:G.red,cursor:"pointer",background:"none",border:"none"}}>See All →</button>}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,padding:"0 14px"}}>
        {shown.map(p=><ProductCard key={p.sku} p={p} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart}/>)}
      </div>
      {items.length>perRow&&(
        <button onClick={()=>setExpanded(e=>!e)} style={{display:"block",margin:"10px auto 4px",padding:"8px 22px",background:"#fff",border:`1.5px solid ${meta?.color||G.gold}55`,borderRadius:20,fontWeight:800,fontSize:11,color:meta?.color||G.goldDark,cursor:"pointer"}}>
          {expanded?`Show Less ▲`:`Load More (${items.length-perRow} more) ▼`}
        </button>
      )}
    </div>
  );
}

// ── Subcat Section inside single-cat view ────────────────────────
function SubcatSection({subcat,items,cart,addToCart,removeFromCart}) {
  const [expanded,setExpanded]=useState(false);
  const INIT=4;
  const shown=expanded?items:items.slice(0,INIT);
  return (
    <div style={{marginBottom:20}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 14px 8px"}}>
        <span style={{fontWeight:800,fontSize:13,color:G.charcoal}}>{subcat}</span>
        <span style={{fontSize:10,color:G.muted}}>{items.length} items</span>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,padding:"0 14px"}}>
        {shown.map(p=><ProductCard key={p.sku} p={p} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart}/>)}
      </div>
      {items.length>INIT&&(
        <button onClick={()=>setExpanded(e=>!e)} style={{display:"block",margin:"10px auto 4px",padding:"7px 20px",background:"#fff",border:`1.5px solid ${G.gold}55`,borderRadius:18,fontWeight:800,fontSize:11,color:G.goldDark,cursor:"pointer"}}>
          {expanded?`Show Less ▲`:`Load More (${items.length-INIT} more) ▼`}
        </button>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// CUSTOMER APP
// ══════════════════════════════════════════════════════════════════
function CustomerApp({onAdminUnlock}) {
  const [cat,setCat]=useState("All");
  const [search,setSearch]=useState("");
  const [cart,setCart]=useState({});
  const [screen,setScreen]=useState("home");
  const [order,setOrder]=useState(null);
  const [txId,setTxId]=useState("");
  const [payMethod,setPayMethod]=useState("mtn");
  const [lockTaps,setLockTaps]=useState(0);
  const {h,m,s}=useCountdown();

  const addToCart=sku=>setCart(c=>({...c,[sku]:(c[sku]||0)+1}));
  const removeFromCart=sku=>setCart(c=>{const n={...c};if(n[sku]>1)n[sku]--;else delete n[sku];return n;});
  const cartCount=Object.values(cart).reduce((a,b)=>a+b,0);
  const cartItems=Object.entries(cart).map(([sku,qty])=>({...ALL_PRODUCTS.find(p=>p.sku===sku),qty})).filter(i=>i.sku);
  const subtotal=cartItems.reduce((s,i)=>s+i.price*i.qty,0);
  const estFee=4000, total=subtotal+estFee;

  const handleLockTap=()=>{const n=lockTaps+1;setLockTaps(n);if(n>=5){onAdminUnlock();setLockTaps(0);}};
  const placeOrder=()=>{
    if(!txId)return alert("Please enter your transaction ID");
    setOrder({id:`OGS${Date.now().toString().slice(-6)}`,customer:"You",phone:"07XXXXXXXX",items:cartItems.map(i=>({name:i.name,qty:i.qty,price:i.price})),total,fee:estFee,location:"Your Location",dist:3.2,branch:"Kitintale",status:"pending",txId,rider:null,ts:new Date().toLocaleTimeString("en-UG",{hour:"2-digit",minute:"2-digit"})});
    setCart({});setScreen("tracking");
  };

  const filteredSearch=ALL_PRODUCTS.filter(p=>
    p.name.toLowerCase().includes(search.toLowerCase())||
    p.sku.toLowerCase().includes(search.toLowerCase())||
    p.subcat.toLowerCase().includes(search.toLowerCase())||
    p.cat.toLowerCase().includes(search.toLowerCase())
  );

  const S={
    wrap:{fontFamily:"'Sora','Nunito',sans-serif",background:G.smoke,minHeight:"100vh",maxWidth:430,margin:"0 auto",paddingBottom:75},
    hdr:{background:`linear-gradient(135deg,${G.red},${G.redDark})`,padding:"12px 14px 10px",position:"sticky",top:0,zIndex:50,boxShadow:"0 3px 12px rgba(0,0,0,0.25)"},
    cartBtn:{background:G.gold,border:"none",borderRadius:20,padding:"7px 14px",fontWeight:800,fontSize:12,cursor:"pointer",color:G.dark,display:"flex",alignItems:"center",gap:5},
    footer:{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:"#fff",borderTop:"1px solid #EEE",display:"flex",justifyContent:"space-around",padding:"8px 0 10px",zIndex:40},
    footerBtn:a=>({display:"flex",flexDirection:"column",alignItems:"center",gap:2,fontSize:10,fontWeight:700,color:a?G.red:G.muted,cursor:"pointer",border:"none",background:"none",padding:"0 10px"}),
    catChip:a=>({background:a?G.gold:"#fff",color:a?G.dark:G.muted,border:a?"none":"1.5px solid #E5D5B0",borderRadius:20,padding:"6px 12px",fontSize:11,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0,boxShadow:a?`0 2px 8px ${G.goldLight}88`:"none"}),
    card:{background:"#fff",borderRadius:14,padding:16,border:"1.5px solid #F0E8D0",marginBottom:12},
  };

  // TRACKING
  if(screen==="tracking"&&order) return (
    <div style={S.wrap}>
      <div style={S.hdr}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <button onClick={()=>setScreen("home")} style={{background:"none",border:"none",color:G.gold,fontSize:18,cursor:"pointer"}}>←</button>
          <span style={{color:G.gold,fontWeight:900,fontSize:16}}>Order Tracking</span>
        </div>
      </div>
      <div style={{padding:16}}>
        <div style={{background:`linear-gradient(135deg,${G.gold},${G.goldDark})`,borderRadius:16,padding:20,marginBottom:14,boxShadow:`0 4px 16px ${G.gold}44`}}>
          <div style={{fontSize:10,fontWeight:700,color:G.charcoal,opacity:0.7}}>ORDER ID</div>
          <div style={{fontWeight:900,fontSize:18,color:G.dark}}>{order.id}</div>
          <div style={{marginTop:8}}><StatusBadge status={order.status}/></div>
        </div>
        {["Order Placed","Payment Verified","Rider Assigned","On the Way","Delivered"].map((step,i)=>{
          const reached=["pending","verified","assigned","on_the_way","delivered"].indexOf(order.status)>=i-1;
          return (
            <div key={step} style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
              <div style={{width:28,height:28,borderRadius:"50%",background:reached?G.gold:"#E5E5E5",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,color:reached?G.dark:"#BBB",flexShrink:0}}>{i+1}</div>
              <div style={{fontWeight:reached?700:400,color:reached?G.dark:G.muted,fontSize:14}}>{step}</div>
            </div>
          );
        })}
        <div style={S.card}>
          {order.items.map((item,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:5}}>
              <span>{item.name} ×{item.qty}</span><span style={{fontWeight:700}}>{fmtUGX(item.price*item.qty)}</span>
            </div>
          ))}
          <div style={{borderTop:"1px dashed #E0D5BC",marginTop:8,paddingTop:8,display:"flex",justifyContent:"space-between",fontSize:12,color:G.muted}}><span>Delivery Fee</span><span>{fmtUGX(order.fee)}</span></div>
          <div style={{display:"flex",justifyContent:"space-between",fontWeight:900,fontSize:15,color:G.red,marginTop:6}}><span>TOTAL</span><span>{fmtUGX(order.total)}</span></div>
        </div>
        <div style={{background:"#E8F5FF",borderRadius:12,padding:14,fontSize:12,color:"#0066AA"}}>
          <b>📱 WhatsApp Alerts Active</b><br/>You'll get a message when your rider is assigned and when delivered.
        </div>
      </div>
    </div>
  );

  // CHECKOUT
  if(screen==="checkout") return (
    <div style={S.wrap}>
      <div style={S.hdr}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <button onClick={()=>setScreen("cart")} style={{background:"none",border:"none",color:G.gold,fontSize:18,cursor:"pointer"}}>←</button>
          <span style={{color:G.gold,fontWeight:900,fontSize:16}}>Checkout</span>
        </div>
      </div>
      <div style={{padding:16}}>
        <div style={S.card}>
          <div style={{fontWeight:800,fontSize:13,color:G.dark,marginBottom:10}}>📍 Delivery Location</div>
          <div style={{background:G.smoke,borderRadius:10,padding:10,fontSize:12,color:G.muted}}>📡 GPS Detected: <b style={{color:G.dark}}>Ntinda (2.1 km · Kitintale branch)</b></div>
          <div style={{marginTop:8,padding:"7px 10px",background:G.greenLight,borderRadius:8,fontSize:11,color:G.green,fontWeight:700}}>✅ Delivery available · Est. 28 minutes</div>
          <div style={{marginTop:12,borderTop:"1px dashed #EEE",paddingTop:10}}>
            {cartItems.map((i,k)=><div key={k} style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4,color:G.charcoal}}><span>{i.name} ×{i.qty}</span><span>{fmtUGX(i.price*i.qty)}</span></div>)}
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:G.muted,marginTop:6}}><span>Delivery Fee</span><span>{fmtUGX(estFee)}</span></div>
            <div style={{display:"flex",justifyContent:"space-between",fontWeight:900,fontSize:15,color:G.red,marginTop:8,paddingTop:8,borderTop:"1px solid #EEE"}}><span>TOTAL</span><span>{fmtUGX(total)}</span></div>
          </div>
        </div>
        <div style={S.card}>
          <div style={{fontWeight:800,fontSize:13,color:G.dark,marginBottom:10}}>💳 Payment Method</div>
          {["mtn","airtel"].map(pm=>(
            <div key={pm} onClick={()=>setPayMethod(pm)} style={{display:"flex",alignItems:"center",gap:10,padding:10,borderRadius:10,border:`2px solid ${payMethod===pm?G.gold:"#EEE"}`,marginBottom:8,cursor:"pointer",background:payMethod===pm?G.cream:"#fff"}}>
              <span style={{fontSize:22}}>{pm==="mtn"?"📱":"📲"}</span>
              <div><div style={{fontWeight:700,fontSize:12}}>{pm==="mtn"?"MTN Mobile Money":"Airtel Money"}</div><div style={{fontSize:10,color:G.muted}}>{pm==="mtn"?"Send to: 0774 XXX XXX":"Send to: 0755 XXX XXX"}</div></div>
              {payMethod===pm&&<span style={{marginLeft:"auto",color:G.gold,fontWeight:900}}>✓</span>}
            </div>
          ))}
          <label style={{fontSize:11,fontWeight:700,color:G.muted,display:"block",marginBottom:5,marginTop:10}}>TRANSACTION ID</label>
          <input value={txId} onChange={e=>setTxId(e.target.value)} placeholder="e.g. MOM12345678" style={{width:"100%",padding:"10px 12px",borderRadius:10,border:`2px solid ${txId?G.gold:"#EEE"}`,fontSize:13,outline:"none",fontFamily:"monospace",boxSizing:"border-box"}}/>
        </div>
        <button onClick={placeOrder} style={{width:"100%",padding:15,background:`linear-gradient(135deg,${G.red},${G.redDark})`,color:"#fff",border:"none",borderRadius:14,fontWeight:900,fontSize:15,cursor:"pointer",boxShadow:`0 4px 14px ${G.red}55`}}>
          👉 I HAVE PAID — PLACE ORDER
        </button>
      </div>
    </div>
  );

  // CART
  if(screen==="cart") return (
    <div style={S.wrap}>
      <div style={S.hdr}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <button onClick={()=>setScreen("home")} style={{background:"none",border:"none",color:G.gold,fontSize:18,cursor:"pointer"}}>←</button>
          <span style={{color:G.gold,fontWeight:900,fontSize:16}}>🛒 My Cart ({cartCount})</span>
        </div>
      </div>
      <div style={{padding:16}}>
        {cartItems.length===0?(
          <div style={{textAlign:"center",padding:60,color:G.muted}}>
            <div style={{fontSize:50,marginBottom:12}}>🛒</div>
            <div style={{fontWeight:700}}>Your cart is empty</div>
            <button onClick={()=>setScreen("home")} style={{marginTop:16,background:G.gold,border:"none",borderRadius:10,padding:"10px 24px",fontWeight:800,cursor:"pointer"}}>Shop Now</button>
          </div>
        ):(
          <>
            {cartItems.map(item=>(
              <div key={item.sku} style={{background:"#fff",borderRadius:14,padding:12,marginBottom:10,display:"flex",alignItems:"center",gap:12,border:"1.5px solid #F0E8D0"}}>
                <span style={{fontSize:28,flexShrink:0}}>{item.emoji}</span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:700,fontSize:12,color:G.dark,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.name}</div>
                  <div style={{fontSize:9,color:G.muted}}>{item.variant}</div>
                  <div style={{fontSize:9,color:"#AAA",fontFamily:"monospace"}}>{item.sku}</div>
                  <div style={{color:G.red,fontWeight:800,fontSize:13}}>{fmtUGX(item.price)}</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
                  <button onClick={()=>removeFromCart(item.sku)} style={{width:26,height:26,borderRadius:"50%",border:`2px solid ${G.gold}`,background:"#fff",fontWeight:900,cursor:"pointer"}}>−</button>
                  <span style={{fontWeight:800,fontSize:14,minWidth:18,textAlign:"center"}}>{item.qty}</span>
                  <button onClick={()=>addToCart(item.sku)} style={{width:26,height:26,borderRadius:"50%",border:"none",background:G.gold,fontWeight:900,cursor:"pointer"}}>+</button>
                </div>
              </div>
            ))}
            <div style={{...S.card,marginTop:8}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:G.muted,marginBottom:5}}><span>Subtotal ({cartCount} items)</span><span>{fmtUGX(subtotal)}</span></div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:G.muted}}><span>Est. Delivery</span><span>{fmtUGX(estFee)}</span></div>
              <div style={{display:"flex",justifyContent:"space-between",fontWeight:900,fontSize:16,color:G.red,marginTop:8,paddingTop:8,borderTop:"1px solid #EEE"}}><span>TOTAL</span><span>{fmtUGX(total)}</span></div>
            </div>
            <button onClick={()=>setScreen("checkout")} style={{width:"100%",marginTop:14,padding:15,background:`linear-gradient(135deg,${G.red},${G.redDark})`,color:"#fff",border:"none",borderRadius:14,fontWeight:900,fontSize:14,cursor:"pointer",boxShadow:`0 4px 14px ${G.red}44`}}>
              Proceed to Checkout →
            </button>
          </>
        )}
      </div>
    </div>
  );

  // ── HOME ──
  return (
    <div style={S.wrap}>
      <div style={S.hdr}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <img src={LOGO_URL} alt="Gold Supermarket" style={{height:42,width:"auto",objectFit:"contain",filter:"drop-shadow(0 1px 4px rgba(0,0,0,0.3))"}} onError={e=>{e.target.style.display="none";}} />
            <div>
              <div style={{color:G.gold,fontWeight:900,fontSize:15,letterSpacing:0.3,lineHeight:1.1}}>GOLD SUPERMARKET</div>
              <div style={{color:"#FFD84D88",fontSize:9,fontWeight:600}}>📍 Kitintale · Mile 8, Gayaza Rd</div>
            </div>
          </div>
          <button onClick={()=>setScreen("cart")} style={S.cartBtn}>
            🛒 <span style={{background:G.red,color:"#fff",borderRadius:"50%",width:18,height:18,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,flexShrink:0}}>{cartCount}</span>
          </button>
        </div>
        <div style={{display:"flex",alignItems:"center",background:"#fff",borderRadius:25,padding:"0 12px",marginTop:10,border:`1.5px solid ${G.goldLight}`}}>
          <span style={{color:G.muted}}>🔍</span>
          <input style={{border:"none",outline:"none",flex:1,padding:"9px 8px",fontSize:12,background:"transparent",fontFamily:"inherit"}} placeholder="Search by name, SKU, category…" value={search} onChange={e=>setSearch(e.target.value)}/>
          {search&&<button onClick={()=>setSearch("")} style={{background:"none",border:"none",cursor:"pointer",color:G.muted,fontSize:16}}>✕</button>}
        </div>
      </div>

      {/* Hero */}
      {!search&&cat==="All"&&(
        <div style={{background:`linear-gradient(135deg,${G.gold},${G.goldDark} 60%,${G.red})`,padding:"14px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontWeight:900,fontSize:15,color:G.dark}}>Fresh. Fast. Delivered. 🚀</div>
            <div style={{fontSize:11,color:G.charcoal,opacity:0.8}}>Order now — arrive in 30 mins</div>
          </div>
          <span style={{fontSize:38}}>🛵</span>
        </div>
      )}

      {/* Cat chips */}
      {!search&&(
        <div style={{display:"flex",gap:8,overflowX:"auto",padding:"10px 14px",scrollbarWidth:"none"}}>
          {CATS_MAIN.map(c=>(
            <button key={c} style={S.catChip(cat===c)} onClick={()=>setCat(c)}>
              {c==="All"?"🛒":CAT_META[c]?.icon} {c==="All"?"All":c.split(" ")[0]}
            </button>
          ))}
        </div>
      )}

      {/* SEARCH RESULTS */}
      {search&&(
        <div style={{padding:"10px 14px"}}>
          <div style={{fontWeight:700,fontSize:12,color:G.muted,marginBottom:10}}>{filteredSearch.length} result{filteredSearch.length!==1?"s":""} for "{search}"</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {filteredSearch.map(p=><ProductCard key={p.sku} p={p} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart}/>)}
          </div>
          {filteredSearch.length===0&&<div style={{textAlign:"center",padding:40,color:G.muted}}><div style={{fontSize:40}}>🔍</div><div style={{marginTop:8}}>No products found</div></div>}
        </div>
      )}

      {/* SINGLE CAT */}
      {!search&&cat!=="All"&&(
        <div style={{padding:"10px 0"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,padding:"4px 14px 12px"}}>
            <span style={{fontSize:24}}>{CAT_META[cat]?.icon}</span>
            <span style={{fontWeight:900,fontSize:16,color:G.dark}}>{cat}</span>
            <span style={{fontSize:11,color:G.muted}}>({ALL_PRODUCTS.filter(p=>p.cat===cat).length} items)</span>
          </div>
          {CAT_META[cat]?.subcats.map(sub=>{
            const items=ALL_PRODUCTS.filter(p=>p.cat===cat&&p.subcat===sub);
            if(!items.length)return null;
            return <SubcatSection key={sub} subcat={sub} items={items} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart}/>;
          })}
        </div>
      )}

      {/* ALL CATS HOME */}
      {!search&&cat==="All"&&(
        <>
          {/* Flash Sale Banner */}
          <div style={{background:`linear-gradient(135deg,${G.redDark},${G.red})`,margin:"0 14px 16px",borderRadius:14,overflow:"hidden"}}>
            <div style={{padding:"12px 14px 8px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{color:"#fff",fontWeight:900,fontSize:15}}>⚡ Flash Sales</span>
              <div style={{display:"flex",gap:3}}>
                {[h,m,s].map((t,i)=>(
                  <React.Fragment key={i}>
                    <span style={{background:"rgba(255,255,255,0.2)",color:"#fff",padding:"3px 7px",borderRadius:6,fontFamily:"monospace",fontWeight:900,fontSize:13}}>{t}</span>
                    {i<2&&<span style={{color:"#fff",fontWeight:900,alignSelf:"center",fontSize:14}}>:</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
            <div style={{display:"flex",gap:10,overflowX:"auto",padding:"4px 14px 14px",scrollbarWidth:"none"}}>
              {FLASH_ITEMS.map(p=>(
                <div key={p.sku} style={{background:"#fff",borderRadius:12,minWidth:115,padding:"10px 10px 12px",flexShrink:0,cursor:"pointer",border:`1.5px solid ${cart[p.sku]?G.gold:"transparent"}`}} onClick={()=>addToCart(p.sku)}>
                  <div style={{fontSize:26,textAlign:"center"}}>{p.emoji}</div>
                  <div style={{fontSize:10,fontWeight:700,color:G.dark,marginTop:4,lineHeight:1.2}}>{p.name}</div>
                  <div style={{fontSize:8,color:G.muted}}>{p.variant}</div>
                  <div style={{color:G.red,fontWeight:900,fontSize:11,marginTop:3}}>{fmtUGX(p.price)}</div>
                  <div style={{fontSize:9,background:G.green,color:"#fff",borderRadius:6,textAlign:"center",padding:"2px 0",marginTop:4,fontWeight:800}}>-{p.discount}%</div>
                  {cart[p.sku]&&<div style={{marginTop:3,fontSize:8,background:G.gold,borderRadius:4,textAlign:"center",fontWeight:700}}>In cart: {cart[p.sku]}</div>}
                </div>
              ))}
            </div>
          </div>

          {/* Per-cat sections */}
          {Object.keys(CAT_META).map(catName=>{
            const items=ALL_PRODUCTS.filter(p=>p.cat===catName);
            return <CatSection key={catName} catName={catName} items={items} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} onSeeAll={()=>setCat(catName)}/>;
          })}
        </>
      )}

      <div style={S.footer}>
        <button style={S.footerBtn(true)}>🏠<span>Home</span></button>
        <button style={S.footerBtn(false)} onClick={()=>setScreen("cart")}>🛒<span>Cart{cartCount>0?` (${cartCount})`:""}</span></button>
        <button style={S.footerBtn(false)}>📦<span>Orders</span></button>
        <button style={{...S.footerBtn(false),opacity:0.3}} onClick={handleLockTap}>🔒<span>Staff</span></button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// ADMIN DASHBOARD
// ══════════════════════════════════════════════════════════════════
function AdminDashboard({onBack}) {
  const [tab,setTab]=useState("orders");
  const [orders,setOrders]=useState(initOrders);
  const [products,setProducts]=useState(ALL_PRODUCTS);
  const [riders,setRiders]=useState(RIDERS);
  const [notifNums,setNotifNums]=useState([
    {id:1,num:"+256 774 000 001",role:"Branch Manager – Kitintale",active:true},
    {id:2,num:"+256 755 000 002",role:"Branch Manager – Mile 8, Gayaza Rd",active:true},
    {id:3,num:"+256 700 000 003",role:"Delivery Supervisor",active:false},
  ]);
  const [filterStatus,setFilterStatus]=useState("all");
  const [showAssign,setShowAssign]=useState(null);
  const [catFilter,setCatFilter]=useState("All");
  const [addProd,setAddProd]=useState(false);
  const [newProd,setNewProd]=useState({name:"",cat:"Food & Groceries",price:"",origPrice:"",stock:"",unit:"pack",emoji:"📦",variant:"",discount:0});

  const filteredOrders=filterStatus==="all"?orders:orders.filter(o=>o.status===filterStatus);
  const filteredProds=catFilter==="All"?products:products.filter(p=>p.cat===catFilter);
  const verifyPayment=id=>setOrders(os=>os.map(o=>o.id===id?{...o,status:"verified"}:o));
  const assignRider=(orderId,riderId)=>{setOrders(os=>os.map(o=>o.id===orderId?{...o,status:"on_the_way",rider:riderId}:o));setRiders(rs=>rs.map(r=>r.id===riderId?{...r,status:"busy"}:r));setShowAssign(null);alert("✅ Rider assigned! WhatsApp sent to rider and customer.");};
  const markDelivered=id=>{const o=orders.find(x=>x.id===id);setOrders(os=>os.map(x=>x.id===id?{...x,status:"delivered"}:x));if(o?.rider)setRiders(rs=>rs.map(r=>r.id===o.rider?{...r,status:"available",deliveries:r.deliveries+1}:r));};

  const todayOrders=orders.length,pending=orders.filter(o=>o.status==="pending").length,active=orders.filter(o=>o.status==="on_the_way").length;
  const revenue=orders.filter(o=>o.status!=="pending").reduce((s,o)=>s+o.total,0);
  const lowStock=products.filter(p=>p.stock>0&&p.stock<=5).length,outStock=products.filter(p=>p.stock===0).length;

  const A={
    wrap:{fontFamily:"'Sora','Nunito',sans-serif",background:"#0F0700",minHeight:"100vh",color:"#FFF"},
    hdr:{background:`linear-gradient(135deg,${G.red},#6B0010)`,padding:"14px 20px",display:"flex",alignItems:"center",justifyContent:"space-between"},
    tabs:{display:"flex",gap:0,background:"#1A0A00",borderBottom:`2px solid ${G.gold}22`,overflowX:"auto"},
    tab:a=>({padding:"12px 16px",fontSize:11,fontWeight:700,cursor:"pointer",border:"none",background:"none",color:a?G.gold:"#666",borderBottom:a?`3px solid ${G.gold}`:"3px solid transparent",whiteSpace:"nowrap"}),
    card:{background:"#1A0A00",borderRadius:14,padding:14,border:`1px solid ${G.gold}22`,marginBottom:12},
    sc:c=>({background:`linear-gradient(135deg,${c}22,${c}11)`,borderRadius:14,padding:14,border:`1px solid ${c}44`,flex:1,minWidth:75}),
    btn:c=>({background:c,border:"none",borderRadius:8,padding:"6px 10px",color:c===G.gold?G.dark:"#fff",fontWeight:800,fontSize:11,cursor:"pointer"}),
    input:{background:"#2D1A00",border:`1px solid ${G.gold}44`,borderRadius:8,padding:"7px 10px",color:"#fff",fontSize:12,outline:"none",fontFamily:"inherit",width:"100%",boxSizing:"border-box"},
    lbl:{fontSize:10,fontWeight:700,color:"#888",marginBottom:3,display:"block"},
  };

  return (
    <div style={A.wrap}>
      <div style={A.hdr}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <img src={LOGO_URL} alt="Gold Supermarket" style={{height:38,width:"auto",objectFit:"contain",filter:"brightness(1.2) drop-shadow(0 1px 4px rgba(0,0,0,0.4))"}} onError={e=>{e.target.style.display="none";}} />
          <div><div style={{fontWeight:900,fontSize:15,color:G.gold}}>GOLD SUPERMARKET — Admin</div><div style={{fontSize:10,color:"#FFD84D88"}}>{new Date().toLocaleDateString("en-UG",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</div></div>
        </div>
        <button onClick={onBack} style={{background:G.gold,border:"none",borderRadius:8,padding:"7px 12px",fontWeight:800,fontSize:11,cursor:"pointer"}}>← Customer View</button>
      </div>
      <div style={A.tabs}>
        {[["orders","📦 Orders"],["inventory","🛍️ Inventory"],["riders","🏍️ Riders"],["notifications","🔔 Alerts"]].map(([k,l])=>(
          <button key={k} style={A.tab(tab===k)} onClick={()=>setTab(k)}>{l}</button>
        ))}
      </div>
      <div style={{padding:14}}>
        <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
          {[["📦","Orders",todayOrders,G.gold],["⏳","Pending",pending,"#FF8C00"],["🏍️","Active",active,G.green],["💰","Revenue",revenue>0?`${(revenue/1000).toFixed(0)}K`:"0",G.green],["⚠️","Low Stock",lowStock,"#FF8C00"],["❌","Out Stock",outStock,G.red]].map(([icon,label,val,color])=>(
            <div key={label} style={A.sc(color)}><div style={{fontSize:16}}>{icon}</div><div style={{fontWeight:900,fontSize:18,color,marginTop:2}}>{val}</div><div style={{fontSize:9,color:"#777",marginTop:1}}>{label}</div></div>
          ))}
        </div>

        {/* ORDERS */}
        {tab==="orders"&&(
          <div>
            <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap"}}>
              {[["all","All"],["pending","Pending"],["verified","Verified"],["on_the_way","On Way"],["delivered","Delivered"]].map(([k,l])=>(
                <button key={k} onClick={()=>setFilterStatus(k)} style={{...A.btn(filterStatus===k?G.gold:"#2D1A00"),border:filterStatus===k?"none":`1px solid ${G.gold}33`}}>{l}</button>
              ))}
            </div>
            {filteredOrders.map(order=>(
              <div key={order.id} style={A.card}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:8}}>
                  <div>
                    <div style={{fontWeight:900,fontSize:14,color:G.gold}}>{order.id}</div>
                    <div style={{fontSize:11,color:"#CCC",marginTop:2}}>👤 {order.customer} · 📞 {order.phone}</div>
                    <div style={{fontSize:10,color:"#888",marginTop:2}}>📍 {order.location} · {order.dist}km · {order.branch} · 🕐 {order.ts}</div>
                    <div style={{marginTop:5,fontSize:11,color:"#AAA"}}>{order.items.map(i=>`${i.name}×${i.qty}`).join(", ")}</div>
                    <div style={{marginTop:3,fontSize:11}}>Tx: <span style={{fontFamily:"monospace",color:G.goldLight}}>{order.txId}</span> · <b style={{color:G.gold}}>{fmtUGX(order.total)}</b></div>
                  </div>
                  <StatusBadge status={order.status}/>
                </div>
                <div style={{display:"flex",gap:6,marginTop:10,flexWrap:"wrap"}}>
                  {order.status==="pending"&&<button onClick={()=>verifyPayment(order.id)} style={A.btn(G.green)}>✅ Verify Payment</button>}
                  {order.status==="verified"&&<button onClick={()=>setShowAssign(order.id)} style={A.btn(G.gold)}>🏍️ Assign Rider</button>}
                  {order.status==="on_the_way"&&(<><span style={{fontSize:10,color:"#888",alignSelf:"center"}}>Rider: {riders.find(r=>r.id===order.rider)?.name}</span><button onClick={()=>markDelivered(order.id)} style={A.btn("#4CAF50")}>✅ Mark Delivered</button></>)}
                </div>
                {showAssign===order.id&&(
                  <div style={{marginTop:10,background:"#2D1A00",borderRadius:10,padding:12}}>
                    <div style={{fontSize:11,fontWeight:700,color:G.gold,marginBottom:8}}>Select Rider:</div>
                    {riders.map(r=>(
                      <div key={r.id} onClick={()=>r.status==="available"&&assignRider(order.id,r.id)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"7px 10px",borderRadius:8,marginBottom:5,background:r.status==="available"?"#3D2A00":"#1F1200",cursor:r.status==="available"?"pointer":"not-allowed",border:`1px solid ${r.status==="available"?G.gold+"44":"#333"}`}}>
                        <div><div style={{fontWeight:700,fontSize:12}}>{r.name}</div><div style={{fontSize:10,color:"#888"}}>{r.phone} · {r.deliveries} today</div></div>
                        <span style={{fontSize:10,fontWeight:700,color:r.status==="available"?G.green:"#888"}}>{r.status==="available"?"✅ Available":"🔴 Busy"}</span>
                      </div>
                    ))}
                    <button onClick={()=>setShowAssign(null)} style={{...A.btn("#555"),marginTop:6}}>Cancel</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* INVENTORY */}
        {tab==="inventory"&&(
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10,flexWrap:"wrap",gap:8}}>
              <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                {["All",...Object.keys(CAT_META)].map(c=>(
                  <button key={c} onClick={()=>setCatFilter(c)} style={{...A.btn(catFilter===c?G.gold:"#2D1A00"),border:catFilter===c?"none":`1px solid ${G.gold}33`}}>{c==="All"?"All":CAT_META[c].icon+" "+c.split(" ")[0]}</button>
                ))}
              </div>
              <button onClick={()=>setAddProd(true)} style={A.btn(G.green)}>+ Add Product</button>
            </div>
            {addProd&&(
              <div style={{...A.card,border:`1px solid ${G.gold}88`,marginBottom:14}}>
                <div style={{fontWeight:800,color:G.gold,marginBottom:10}}>New Product</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  {[["name","Name"],["variant","Variant"],["price","Price (UGX)"],["origPrice","Orig. Price"],["stock","Stock"],["unit","Unit"],["emoji","Emoji"],["discount","Discount %"]].map(([k,l])=>(
                    <div key={k}><label style={A.lbl}>{l}</label><input style={A.input} value={newProd[k]} onChange={e=>setNewProd(p=>({...p,[k]:e.target.value}))}/></div>
                  ))}
                </div>
                <div style={{marginTop:8}}><label style={A.lbl}>Category</label>
                  <select style={{...A.input,height:34}} value={newProd.cat} onChange={e=>setNewProd(p=>({...p,cat:e.target.value}))}>
                    {Object.keys(CAT_META).map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div style={{display:"flex",gap:8,marginTop:10}}>
                  <button onClick={()=>{
                    if(!newProd.name||!newProd.price)return;
                    const meta=CAT_META[newProd.cat];
                    const sku=mkSKU(`${meta.code}99`,newProd.name.replace(/\s+/g,"").toUpperCase().slice(0,4));
                    setProducts(ps=>[...ps,{...newProd,sku,id:Date.now(),price:+newProd.price,origPrice:+newProd.origPrice||+newProd.price,stock:+newProd.stock,discount:+newProd.discount,express:false,badge:null,subcat:meta.subcats[0]}]);
                    setAddProd(false);setNewProd({name:"",cat:"Food & Groceries",price:"",origPrice:"",stock:"",unit:"pack",emoji:"📦",variant:"",discount:0});
                  }} style={A.btn(G.green)}>✅ Save</button>
                  <button onClick={()=>setAddProd(false)} style={A.btn("#555")}>Cancel</button>
                </div>
              </div>
            )}
            {(lowStock>0||outStock>0)&&(
              <div style={{background:"#3D1200",borderRadius:10,padding:10,marginBottom:12,border:"1px solid #C0001E44"}}>
                <div style={{fontWeight:800,color:G.red,fontSize:12,marginBottom:6}}>⚠️ Stock Alerts</div>
                {products.filter(p=>p.stock===0).map(p=><div key={p.sku} style={{fontSize:10,color:"#FF8888",marginBottom:2}}>❌ {p.name} ({p.variant}) — OUT OF STOCK</div>)}
                {products.filter(p=>p.stock>0&&p.stock<=5).map(p=><div key={p.sku} style={{fontSize:10,color:"#FFAA44",marginBottom:2}}>⚠️ {p.name} — Only {p.stock} left</div>)}
              </div>
            )}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(175px,1fr))",gap:10}}>
              {filteredProds.map(p=>(
                <div key={p.sku} style={{...A.card,opacity:p.stock===0?0.55:1,marginBottom:0}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                    <span style={{fontSize:24}}>{p.emoji}</span>
                    {p.stock===0&&<span style={{fontSize:8,background:"#FF444422",color:"#FF6666",padding:"2px 5px",borderRadius:6,fontWeight:700}}>OUT</span>}
                    {p.stock>0&&p.stock<=5&&<span style={{fontSize:8,background:"#FF880022",color:"#FFAA44",padding:"2px 5px",borderRadius:6,fontWeight:700}}>LOW:{p.stock}</span>}
                  </div>
                  <div style={{fontSize:8,color:"#666",fontFamily:"monospace",marginTop:3}}>{p.sku}</div>
                  <div style={{fontWeight:700,fontSize:11,marginTop:2,lineHeight:1.3}}>{p.name}</div>
                  <div style={{fontSize:9,color:"#888"}}>{p.variant}</div>
                  <div style={{color:G.goldLight,fontWeight:800,fontSize:12,marginTop:3}}>{fmtUGX(p.price)}</div>
                  {p.discount>0&&<div style={{fontSize:9,color:G.green}}>-{p.discount}% off · Stock: {p.stock}</div>}
                  <div style={{display:"flex",gap:5,marginTop:8,flexWrap:"wrap"}}>
                    <button onClick={()=>{const s=prompt(`New stock for ${p.name}:`,p.stock);if(s!==null)setProducts(ps=>ps.map(x=>x.sku===p.sku?{...x,stock:+s}:x));}} style={A.btn(G.gold)}>Edit</button>
                    <button onClick={()=>setProducts(ps=>ps.filter(x=>x.sku!==p.sku))} style={A.btn("#8B0015")}>Del</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RIDERS */}
        {tab==="riders"&&(
          <div>
            <div style={{fontWeight:800,color:G.gold,marginBottom:12}}>Rider Management</div>
            {riders.map(r=>(
              <div key={r.id} style={{...A.card,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
                <div><div style={{fontWeight:800,fontSize:14}}>🏍️ {r.name}</div><div style={{fontSize:11,color:"#888",marginTop:2}}>📞 {r.phone}</div><div style={{fontSize:10,color:"#666",marginTop:2}}>Deliveries today: <b style={{color:G.gold}}>{r.deliveries}</b></div></div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:11,fontWeight:700,padding:"4px 10px",borderRadius:20,background:r.status==="available"?"#1B8C4E22":"#FF000022",color:r.status==="available"?G.green:"#FF6666"}}>{r.status==="available"?"✅ Available":"🔴 Busy"}</span>
                  <button onClick={()=>setRiders(rs=>rs.filter(x=>x.id!==r.id))} style={A.btn("#8B0015")}>Remove</button>
                </div>
              </div>
            ))}
            <button onClick={()=>{const name=prompt("Rider name:");const phone=prompt("Phone:");if(name&&phone)setRiders(rs=>[...rs,{id:`R${Date.now()}`,name,phone,status:"available",deliveries:0}]);}} style={{...A.btn(G.gold),padding:"9px 16px",fontSize:12}}>+ Add Rider</button>
          </div>
        )}

        {/* NOTIFICATIONS */}
        {tab==="notifications"&&(
          <div>
            <div style={{...A.card,border:`1px solid ${G.gold}66`,marginBottom:14}}>
              <div style={{fontWeight:800,fontSize:13,color:G.gold,marginBottom:4}}>🔒 Verified Admin Numbers Only</div>
              <div style={{fontSize:11,color:"#888"}}>Only numbers on this list receive WhatsApp alerts. Unverified numbers are blocked automatically.</div>
            </div>
            {notifNums.map(n=>(
              <div key={n.id} style={{...A.card,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
                <div><div style={{fontWeight:700,fontFamily:"monospace",fontSize:13}}>{n.num}</div><div style={{fontSize:10,color:"#888",marginTop:2}}>{n.role}</div></div>
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                  <div onClick={()=>setNotifNums(ns=>ns.map(x=>x.id===n.id?{...x,active:!x.active}:x))} style={{width:38,height:20,borderRadius:10,background:n.active?G.green:"#333",cursor:"pointer",position:"relative"}}>
                    <div style={{position:"absolute",top:2,left:n.active?19:2,width:16,height:16,borderRadius:"50%",background:"#fff",transition:"all .2s"}}/>
                  </div>
                  <button onClick={()=>setNotifNums(ns=>ns.filter(x=>x.id!==n.id))} style={A.btn("#8B0015")}>✕</button>
                </div>
              </div>
            ))}
            <button onClick={()=>{const num=prompt("Phone (+256...)");const role=prompt("Role:");if(num&&role)setNotifNums(ns=>[...ns,{id:Date.now(),num,role,active:true}]);}} style={{...A.btn(G.gold),padding:"9px 16px",fontSize:12}}>+ Add Number</button>
            <div style={{marginTop:18,...A.card}}>
              <div style={{fontWeight:800,fontSize:12,color:G.gold,marginBottom:10}}>📱 Smart Alert Routing</div>
              {[["🛒 New order","Nearby branch manager + Supervisor"],["💳 Payment verified","All active admin numbers"],["🏍️ Rider assigned","Rider (personal) + Customer WhatsApp"],["✅ Delivered","Customer + Supervisor"],["⚠️ Low stock","Branch manager only"]].map(([ev,tg])=>(
                <div key={ev} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid #2D1A00",fontSize:11}}>
                  <span style={{color:"#CCC"}}>{ev}</span><span style={{color:"#888",maxWidth:"55%",textAlign:"right"}}>{tg}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// RIDER APP
// ══════════════════════════════════════════════════════════════════
function RiderApp({onBack}) {
  const rider=RIDERS[0];
  const [myOrders,setMyOrders]=useState(initOrders.slice(0,2).map(o=>({...o,status:o.status==="on_the_way"?"on_the_way":"new"})));
  const accept=id=>setMyOrders(os=>os.map(o=>o.id===id?{...o,status:"on_the_way"}:o));
  const deliver=id=>setMyOrders(os=>os.map(o=>o.id===id?{...o,status:"delivered"}:o));
  const R={
    wrap:{fontFamily:"'Sora','Nunito',sans-serif",background:"#0A1A0F",minHeight:"100vh",color:"#FFF",paddingBottom:20},
    hdr:{background:`linear-gradient(135deg,${G.green},#0D5C2B)`,padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"},
    card:{background:"#0D2015",borderRadius:14,padding:14,border:"1px solid #1B8C4E44",marginBottom:12},
    btn:c=>({background:c,border:"none",borderRadius:10,padding:"9px 16px",fontWeight:800,fontSize:12,cursor:"pointer",color:c===G.gold?G.dark:"#fff"}),
  };
  return (
    <div style={R.wrap}>
      <div style={R.hdr}>
        <div><div style={{fontWeight:900,fontSize:16}}>🏍️ Rider Portal</div><div style={{fontSize:10,color:"#88CC99",marginTop:2}}>Welcome, {rider.name}</div></div>
        <button onClick={onBack} style={{background:G.gold,border:"none",borderRadius:8,padding:"6px 12px",fontWeight:800,fontSize:11,cursor:"pointer"}}>← Back</button>
      </div>
      <div style={{padding:14}}>
        <div style={{...R.card,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><div style={{fontWeight:800,fontSize:14}}>{rider.name}</div><div style={{fontSize:11,color:"#88CC99",marginTop:2}}>📞 {rider.phone}</div></div>
          <div style={{background:"#1B8C4E",borderRadius:20,padding:"5px 12px",fontWeight:800,fontSize:11}}>✅ Available</div>
        </div>
        <div style={{display:"flex",gap:8,marginBottom:14}}>
          {[["📦","Today",rider.deliveries],["⭐","Rating","4.9"],["⏱️","Avg","28 min"]].map(([icon,l,v])=>(
            <div key={l} style={{flex:1,background:"#0D2015",borderRadius:12,padding:10,textAlign:"center",border:"1px solid #1B8C4E33"}}>
              <div style={{fontSize:18}}>{icon}</div>
              <div style={{fontWeight:900,fontSize:16,color:G.green,marginTop:3}}>{v}</div>
              <div style={{fontSize:9,color:"#888"}}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{fontWeight:800,color:G.green,marginBottom:10}}>📦 My Deliveries</div>
        {myOrders.map(order=>(
          <div key={order.id} style={R.card}>
            <div style={{fontWeight:800,fontSize:12,color:G.green}}>{order.id}</div>
            <div style={{fontSize:11,color:"#CCC",marginTop:4}}>📍 Pickup: <b>{order.branch} Branch</b></div>
            <div style={{fontSize:11,color:"#CCC"}}>🏠 Drop: <b>{order.location}</b> ({order.dist} km)</div>
            <div style={{fontSize:11,color:"#CCC"}}>👤 {order.customer} · {order.phone}</div>
            <div style={{fontSize:10,color:"#888",marginTop:3}}>{order.items.map(i=>`${i.name}×${i.qty}`).join(", ")}</div>
            <div style={{display:"flex",gap:8,marginTop:10,flexWrap:"wrap",alignItems:"center"}}>
              <StatusBadge status={order.status}/>
              {order.status==="new"&&<button onClick={()=>accept(order.id)} style={R.btn(G.green)}>✅ Accept</button>}
              {order.status==="on_the_way"&&(
                <><a href={`https://maps.google.com/?q=${order.location},Kampala`} target="_blank" rel="noreferrer" style={{...R.btn("#1565C0"),textDecoration:"none"}}>🗺️ Navigate</a><button onClick={()=>deliver(order.id)} style={R.btn(G.gold)}>✅ Delivered</button></>
              )}
              {order.status==="delivered"&&<span style={{color:G.green,fontWeight:700,fontSize:12}}>✅ Completed</span>}
            </div>
          </div>
        ))}
        <div style={{...R.card,background:"#071510"}}><div style={{fontWeight:800,fontSize:12,color:"#88CC99",marginBottom:6}}>📱 WhatsApp Alert Active</div><div style={{fontSize:11,color:"#888"}}>New deliveries arrive on: <b style={{color:"#CCC"}}>{rider.phone}</b></div></div>
      </div>
    </div>
  );
}

// ROOT
export default function App() {
  const [mode,setMode]=useState("customer");
  return (
    <div style={{fontFamily:"'Sora',sans-serif"}}>
      <div style={{background:"#0F0700",display:"flex",justifyContent:"center",gap:0,padding:"7px 0",borderBottom:`2px solid ${G.gold}44`,position:"sticky",top:0,zIndex:100}}>
        {[["customer","🛒 Customer"],["admin","🧑‍💼 Admin"],["rider","🏍️ Rider"]].map(([m,l])=>(
          <button key={m} onClick={()=>setMode(m)} style={{background:mode===m?G.gold:"transparent",color:mode===m?G.dark:"#888",border:"none",padding:"6px 18px",fontWeight:800,fontSize:11,cursor:"pointer",borderRadius:mode===m?8:0}}>{l}</button>
        ))}
      </div>
      {mode==="customer"&&<CustomerApp onAdminUnlock={()=>setMode("admin")}/>}
      {mode==="admin"&&<AdminDashboard onBack={()=>setMode("customer")}/>}
      {mode==="rider"&&<RiderApp onBack={()=>setMode("customer")}/>}
    </div>
  );
}
