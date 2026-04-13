import { useState, useEffect, useCallback, createContext, useContext, useRef } from "react";
import { Bar, XAxis, YAxis, Tooltip as ReTip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, LabelList } from "recharts";

// ── THEMES ────────────────────────────────────────────────────────────────────
const GOLD="#C9A84C";
const DARK={bg:"#111827",nav:"#1F2937",navBorder:"#374151",card:"#1F293788",cardBorder:"#374151",inp:"#111827",inpBorder:"#4B5563",text:"#F1F5F9",muted:"#9CA3AF",dim:"#6B7280",sideText:"#F1F5F9",sideMuted:"#9CA3AF",accent:GOLD,pos:"#10B981",neg:"#EF4444",warn:"#F59E0B",blue:"#3B82F6"};
// Light: white content, dark navy sidebar — classic finance look
const LIGHT={bg:"#F1F5F9",nav:"#1C3557",navBorder:"#2A4A73",card:"#FFFFFF",cardBorder:"#E2E8F0",inp:"#FFFFFF",inpBorder:"#CBD5E1",text:"#0F172A",muted:"#475569",dim:"#94A3B8",sideText:"#E2E8F0",sideMuted:"#94A3B8",accent:"#2563EB",pos:"#059669",neg:"#DC2626",warn:"#D97706",blue:"#2563EB"};
const ThemeCtx=createContext(DARK);
const useTh=()=>useContext(ThemeCtx);

// ── DEFAULT SETTINGS ──────────────────────────────────────────────────────────
const DEF_SETTINGS={
  zoom:1.25,
  ig:"golden_anchor_inc",
  advisorName:"Mauricio Hernandez",
  advisorEmail:"mauricio@goldenanchor.life",
  noContactDays:30,
  reminderAdvisor:{noContact:true,highDebt:true,promoExpiring:true,debtIncreasing:false},
  reminderClient:{bills:true,cards:true},
};

// ── STYLE FACTORIES ───────────────────────────────────────────────────────────
const mINP=th=>({background:th.inp,border:`1px solid ${th.inpBorder}`,color:th.text,borderRadius:8,padding:"8px 12px",fontSize:13,outline:"none",width:"100%",boxSizing:"border-box"});
const mCARD=th=>({background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12});
const mTH=th=>({fontSize:11,fontWeight:700,color:th.muted,padding:"0 6px 8px 0",textAlign:"left",whiteSpace:"nowrap",userSelect:"none",cursor:"pointer"});
const mTHR=th=>({...mTH(th),textAlign:"right",padding:"0 0 8px 6px"});
const mTD=th=>({fontSize:12,padding:"7px 6px 7px 0",borderTop:`1px solid ${th.cardBorder}`,color:th.text,verticalAlign:"middle"});
const mTDR=th=>({...mTD(th),textAlign:"right",padding:"7px 0 7px 6px"});
const mIIN=th=>({background:th.bg,border:`1px solid ${th.inpBorder}44`,color:th.text,borderRadius:6,padding:"4px 7px",fontSize:12,outline:"none",width:"100%"});

const COLOR_PRESETS=["#4472C4","#ED7D31","#FFC000","#70AD47","#FF0000","#5B9BD5","#C00000","#9DC3E6","#F4B942","#A9D18E","#8E44AD","#2ECC71","#E74C3C","#3498DB","#1ABC9C","#E91E63","#00BCD4","#FF5722","#C9A84C","#607D8B","#000000","#FFFFFF"];

// ── TRANSLATIONS ──────────────────────────────────────────────────────────────
const T={
  en:{
    signIn:"Sign In",advisorPortal:"Advisor Portal",email:"Email",password:"Password",
    dashboard:"Dashboard",clients:"Clients",monthly:"Monthly Statement",ratios:"Ratio Analysis",investments:"Portfolios",forms:"Forms",resources:"Resources",about:"About Us",report:"Client Report",notes:"Notes & Goals",intake:"Intake Form",profileSettings:"Profile & Settings",
    income:"Income",bills:"Bills",debt:"Debt",savings:"Assets & Savings",summary:"Summary",customAssets:"Physical Assets",
    p1:"Person 1",p2:"Person 2",joint:"Joint",totalIncome:"Net Income",totalBills:"Bills",totalDebt:"Total Debt",cashFlow:"Cash Flow",netWorth:"Net Worth",
    addClient:"New Client",editClient:"Edit Client",deleteLabel:"Delete",editLabel:"Edit",save:"Save",cancel:"Cancel",back:"← Back",confirmDelete:"Confirm delete?",
    weekly:"Weekly",biweekly:"Bi-Weekly",semimonthly:"Semi-Monthly",monthly2:"Monthly",annual:"Annual",
    interestDebt:"Interest Debt",interestFreeDebt:"0% Balance",minPay:"Min Pay",balance:"Balance",apr:"APR",limit:"Credit Limit",promoBalance:"Promo Balance",promoRate:"Promo Rate",promoEnd:"Promo Ends",
    strategy:"Strategy",avalanche:"Avalanche",snowball:"Snowball",
    currentRatio:"Current Ratio",dta:"Debt-to-Asset",dsr:"Debt Service Ratio",rsr:"Retirement Savings Ratio",efr:"Emergency Fund Ratio",
    conservative:"Conservative",growth:"Growth",aggressive:"Aggressive",
    good:"Good",warning:"Attention",critical:"Critical",
    newMonth:"Save Month",compareMonths:"Compare",currentMonth:"Current",newMonthTitle:"Save Month Snapshot",compareTitle:"Compare Months",selectToCompare:"Select months:",
    firstName:"First Name",lastName:"Last Name",partnerFirst:"Partner First Name",partnerLast:"Partner Last Name",
    phone:"Phone",address:"Address",dob:"Date of Birth",social:"Social Security Number",clientType:"Client Type",recommendedBy:"Recommended By",
    financeOnly:"Finance Only",financeAndHealth:"Finance + Health",
    person:"Assigned To",billName:"Bill Name",billType:"Type",dueDay:"Due Day",regular:"Regular",temporary:"Temporary",
    cardName:"Card Name",hasPromo:"Promotional Rate?",gross:"Gross",net:"Net",frequency:"Frequency",cost:"Amount ($)",
    assets:"Assets",liabilities:"Liabilities",checking:"Checking",savings2:"Savings",vehicle:"Vehicle",realEstate2:"Real Estate",
    creditCards:"Credit Cards",vehicleLoan:"Vehicle Loan",studentLoan:"Student Loan",personalLoan:"Personal Loan",
    totalAssets:"Total Assets",totalLiabilities:"Total Liabilities",efTarget:"Emergency Fund",
    assetName:"Asset Name",assetValue:"Value ($)",assetDesc:"Description",assetCat:"Category",addAsset:"Add Asset",
    shortTerm:"Short-Term Goals (0–1 yr)",midTerm:"Mid-Term Goals (1–5 yr)",longTerm:"Long-Term Goals (5+ yr)",
    setbacks:"Setbacks / Challenges",clientGoals:"What They Want to Achieve",generalNotes:"General Notes",
    holdings:"Holdings",debtTrend:"Debt vs Savings Trend",
    contributed:"Contributed",growthLabel:"Growth",futureValue:"Future Value",monthlyInvest:"Monthly Investment",years:"Years",
    period1:"1st Period · Days 1–15",period2:"2nd Period · Days 16–31",advisorRec:"Advisor Recommendations",
    benchmark:"Benchmark",limitInfo:"Maximum credit limit on this card",
    importExcel:"Import JSON",exportExcel:"Export JSON",downloadTemplate:"Download Template",
    addStock:"Add Holding",altPackages:"Alternative Packages",
    noData:"No historical data yet.",
    addBill:"Add Bill",addCard:"Add Debt / Card",addIncome:"Add Income",
    generatedOn:"Generated",igLink:"Instagram",website:"Website",referralCode:"Referral Code",
    certifications:"Certifications",services:"Services",connect:"Connect",
    aboutDesc:"Your financial anchor in a changing market. We help families and individuals build lasting financial security through strategic planning, debt elimination, and wealth building.",
    advisorBio:"Financial Advisor & Insurance Specialist with an MBA and multiple finance certifications. Based in Miami, FL.",
    darkMode:"Dark",lightMode:"Light",showSSN:"Show",hideSSN:"Hide",
    reminders:"Reminders",advisorReminders:"Advisor",clientReminders:"Client Alerts",
    dueThisWeek:"Due in 7 days",noDue:"No upcoming payments",
    noAdvisorAlerts:"No alerts — all clients are on track",
    versionHistory:"Saved Versions",restoreVersion:"Restore",savedAt:"Saved",
    overwriteWarning:"Snapshot exists — previous version will be archived.",
    formsTitle:"Forms & Documents",formsDesc:"Download forms to collect client information.",
    downloadJsonTemplate:"⬇ Download JSON Client Template",
    resourcesTitle:"Resources & Guides",resourcesDesc:"Educational resources for clients and advisors.",
    openGuide:"Open Guide →",
    serviceFinancial:"Financial Planning",serviceFinancialDesc:"Comprehensive budgeting, debt strategy, and wealth building.",
    serviceInsurance:"Insurance Advisory",serviceInsuranceDesc:"Life and health insurance planning tailored to your needs.",
    serviceInvestment:"Investment Guidance",serviceInvestmentDesc:"Portfolio allocation and growth projection strategy.",
    serviceRealEstate:"Real Estate Planning",serviceRealEstateDesc:"Homebuyer preparation and equity strategy.",
    serviceDebt:"Debt Elimination",serviceDebtDesc:"Avalanche/snowball strategies and negotiation guidance.",
    serviceRetirement:"Retirement Planning",serviceRetirementDesc:"IRA, 401k optimization and contribution strategies.",
    referralDesc:"Share your code with friends and family.",
    zoomLevel:"Display Size",noContactAlert:"No contact in",days:"days",highDebtAlert:"High debt ratio",promoExpiringAlert:"Promo expiring",debtIncAlert:"Debt increasing",
    showAltTicker:"Show Alt",showMainTicker:"Show Main",addToPortfolio:"Add to Portfolio",usePackage:"Use This Package",
    intakeNote:"Intake saves directly to the client profile. To record a monthly snapshot, use the Monthly Statement tab.",
  },
  es:{
    signIn:"Entrar",advisorPortal:"Portal del Asesor",email:"Correo",password:"Contraseña",
    dashboard:"Tablero",clients:"Clientes",monthly:"Estado Mensual",ratios:"Ratios",investments:"Portafolios",forms:"Formularios",resources:"Recursos",about:"Nosotros",report:"Reporte",notes:"Notas y Metas",intake:"Formulario",profileSettings:"Perfil y Ajustes",
    income:"Ingresos",bills:"Gastos",debt:"Deudas",savings:"Activos y Ahorros",summary:"Resumen",customAssets:"Activos Físicos",
    p1:"Persona 1",p2:"Persona 2",joint:"Conjunto",totalIncome:"Ingreso Neto",totalBills:"Gastos",totalDebt:"Deuda Total",cashFlow:"Flujo",netWorth:"Patrimonio",
    addClient:"Nuevo Cliente",editClient:"Editar",deleteLabel:"Eliminar",editLabel:"Editar",save:"Guardar",cancel:"Cancelar",back:"← Volver",confirmDelete:"¿Confirmar?",
    weekly:"Semanal",biweekly:"Quincenal",semimonthly:"Bisemanal",monthly2:"Mensual",annual:"Anual",
    interestDebt:"Deuda con Interés",interestFreeDebt:"Saldo 0%",minPay:"Pago Mín",balance:"Saldo",apr:"Tasa",limit:"Límite",promoBalance:"Saldo Promo",promoRate:"Tasa Promo",promoEnd:"Fin Promo",
    strategy:"Estrategia",avalanche:"Avalancha",snowball:"Bola de Nieve",
    currentRatio:"Ratio Liquidez",dta:"Deuda/Activos",dsr:"Ratio Deuda",rsr:"Ratio Retiro",efr:"Ratio Emergencia",
    conservative:"Conservador",growth:"Crecimiento",aggressive:"Agresivo",
    good:"Bien",warning:"Atención",critical:"Crítico",
    newMonth:"Guardar Mes",compareMonths:"Comparar",currentMonth:"Actual",newMonthTitle:"Guardar Mes",compareTitle:"Comparar Meses",selectToCompare:"Selecciona meses:",
    firstName:"Nombre",lastName:"Apellido",partnerFirst:"Nombre Pareja",partnerLast:"Apellido Pareja",
    phone:"Teléfono",address:"Dirección",dob:"Fecha Nacimiento",social:"Seguro Social",clientType:"Tipo",recommendedBy:"Referido Por",
    financeOnly:"Solo Finanzas",financeAndHealth:"Finanzas + Salud",
    person:"Asignado A",billName:"Nombre",billType:"Tipo",dueDay:"Día",regular:"Regular",temporary:"Temporal",
    cardName:"Tarjeta",hasPromo:"¿Tasa Promo?",gross:"Bruto",net:"Neto",frequency:"Frecuencia",cost:"Monto ($)",
    assets:"Activos",liabilities:"Pasivos",checking:"Corriente",savings2:"Ahorros",vehicle:"Vehículo",realEstate2:"Bienes Raíces",
    creditCards:"Tarjetas",vehicleLoan:"Préstamo Vehículo",studentLoan:"Préstamo Estudiantil",personalLoan:"Préstamo Personal",
    totalAssets:"Activos Totales",totalLiabilities:"Pasivos Totales",efTarget:"Fondo Emergencia",
    assetName:"Nombre Activo",assetValue:"Valor ($)",assetDesc:"Descripción",assetCat:"Categoría",addAsset:"Agregar",
    shortTerm:"Metas Corto (0–1 año)",midTerm:"Metas Mediano (1–5 años)",longTerm:"Metas Largo (5+ años)",
    setbacks:"Obstáculos",clientGoals:"Qué quieren lograr",generalNotes:"Notas Generales",
    holdings:"Composición",debtTrend:"Deuda vs Ahorros",
    contributed:"Aportado",growthLabel:"Crecimiento",futureValue:"Valor Futuro",monthlyInvest:"Inversión Mensual",years:"Años",
    period1:"1er Período · Días 1–15",period2:"2do Período · Días 16–31",advisorRec:"Recomendaciones",
    benchmark:"Referencia",limitInfo:"Límite máximo de crédito",
    importExcel:"Importar JSON",exportExcel:"Exportar JSON",downloadTemplate:"Plantilla",
    addStock:"Agregar",altPackages:"Paquetes Alternativos",
    noData:"Sin historial.",
    addBill:"Agregar Gasto",addCard:"Agregar Deuda",addIncome:"Agregar Ingreso",
    generatedOn:"Generado",igLink:"Instagram",website:"Sitio Web",referralCode:"Código Referido",
    certifications:"Certificaciones",services:"Servicios",connect:"Conectar",
    aboutDesc:"Tu ancla financiera en un mercado cambiante. Ayudamos a familias e individuos a construir seguridad financiera.",
    advisorBio:"Asesor Financiero y Especialista en Seguros con MBA. Con base en Miami, FL.",
    darkMode:"Oscuro",lightMode:"Claro",showSSN:"Mostrar",hideSSN:"Ocultar",
    reminders:"Recordatorios",advisorReminders:"Asesor",clientReminders:"Clientes",
    dueThisWeek:"Próximos 7 días",noDue:"Sin pagos próximos",
    noAdvisorAlerts:"Sin alertas — todos los clientes al día",
    versionHistory:"Versiones",restoreVersion:"Restaurar",savedAt:"Guardado",
    overwriteWarning:"Ya existe — la versión anterior quedará archivada.",
    formsTitle:"Formularios",formsDesc:"Descarga formularios para recopilar información.",
    downloadJsonTemplate:"⬇ Descargar Plantilla JSON",
    resourcesTitle:"Recursos y Guías",resourcesDesc:"Recursos educativos.",
    openGuide:"Abrir →",
    serviceFinancial:"Planificación Financiera",serviceFinancialDesc:"Presupuesto integral y estrategia de deuda.",
    serviceInsurance:"Asesoría de Seguros",serviceInsuranceDesc:"Planificación de seguros de vida y salud.",
    serviceInvestment:"Guía de Inversiones",serviceInvestmentDesc:"Asignación y proyección de crecimiento.",
    serviceRealEstate:"Planificación Inmobiliaria",serviceRealEstateDesc:"Preparación para comprador.",
    serviceDebt:"Eliminación de Deuda",serviceDebtDesc:"Estrategias avalancha/bola de nieve.",
    serviceRetirement:"Planificación de Retiro",serviceRetirementDesc:"Optimización IRA y 401k.",
    referralDesc:"Comparte tu código con amigos y familia.",
    zoomLevel:"Tamaño de Pantalla",noContactAlert:"Sin contacto en",days:"días",highDebtAlert:"Ratio deuda alto",promoExpiringAlert:"Promo por vencer",debtIncAlert:"Deuda en aumento",
    showAltTicker:"Alt",showMainTicker:"Main",addToPortfolio:"Agregar al Portfolio",usePackage:"Usar Este Paquete",
    intakeNote:"El formulario guarda directo al perfil del cliente. Para guardar el mes, usa la pestaña Estado Mensual.",
  },
};

const RATIOS_META={
  currentRatio:{en:"Liquid Assets ÷ Current Liabilities. Target > 1.0x",es:"Activos Líquidos ÷ Pasivos. Meta > 1.0x",threshold:1.0,better:"higher",fmt:v=>v.toFixed(2)+"x"},
  dta:{en:"Total Liabilities ÷ Total Assets. Should stay below 40%.",es:"Pasivos ÷ Activos. Menos del 40%.",threshold:0.40,better:"lower",fmt:v=>(v*100).toFixed(1)+"%"},
  dsr:{en:"Debt Payments ÷ Net Income. Below 36% is healthy.",es:"Pagos Deuda ÷ Ingreso. Menos del 36%.",threshold:0.36,better:"lower",fmt:v=>(v*100).toFixed(1)+"%"},
  rsr:{en:"Retirement Contributions ÷ Gross Income. Target 12–15%+.",es:"Contribuciones Retiro ÷ Ingreso Bruto. Meta 12–15%.",threshold:0.12,better:"higher",fmt:v=>(v*100).toFixed(1)+"%"},
  efr:{en:"Liquid Assets ÷ Monthly Bills. Target 3–6 months coverage.",es:"Activos Líquidos ÷ Gastos. Meta 3–6 meses.",threshold:3,better:"higher",fmt:v=>v.toFixed(1)+" mo"},
};

const PORTFOLIOS={
  conservative:{nameKey:"conservative",ret:5.5,risk:"Low",color:"#10B981",holdings:[{ticker:"FXAIX",alt:"VOO",name:"S&P 500 Index",pct:30,desc:"Broad U.S. large-cap exposure. Core holding."},{ticker:"FXNAX",alt:"VBTLX",name:"Total Bond Index",pct:40,desc:"Investment-grade U.S. bonds. Stability anchor."},{ticker:"FSPSX",alt:"VEA",name:"International Index",pct:15,desc:"Developed-market international diversification."},{ticker:"SPAXX",alt:"VMFXX",name:"Money Market",pct:15,desc:"Liquid cash equivalent."}]},
  growth:{nameKey:"growth",ret:8.5,risk:"Medium",color:"#3B82F6",holdings:[{ticker:"FXAIX",alt:"VOO",name:"S&P 500 Index",pct:50,desc:"Core U.S. equity allocation."},{ticker:"FSMAX",alt:"VXF",name:"Mid-Cap Index",pct:15,desc:"U.S. mid-cap growth potential."},{ticker:"FSPSX",alt:"VEA",name:"International Index",pct:15,desc:"Global diversification outside the U.S."},{ticker:"FXNAX",alt:"VBTLX",name:"Bond Index",pct:20,desc:"Fixed income buffer to reduce volatility."}]},
  aggressive:{nameKey:"aggressive",ret:11.0,risk:"High",color:"#F59E0B",holdings:[{ticker:"FXAIX",alt:"VOO",name:"S&P 500 Index",pct:40,desc:"Foundation of U.S. large-cap equities."},{ticker:"FSMAX",alt:"VXF",name:"Mid-Cap Index",pct:20,desc:"Higher growth potential."},{ticker:"VGT",alt:"FTEC",name:"Tech Sector ETF",pct:25,desc:"Technology sector concentration."},{ticker:"FSPSX",alt:"VEA",name:"International Index",pct:15,desc:"International exposure."}]},
};

const ALT_PACKS=[
  {id:"tech",label:"📱 More Tech",stocks:[{ticker:"NVDA",alt:"SMH",name:"NVIDIA",pct:10,desc:"AI/GPU leader. High growth, high volatility."},{ticker:"AAPL",alt:"QQQ",name:"Apple",pct:10,desc:"Mega-cap tech, strong moat."},{ticker:"MSFT",alt:"IGV",name:"Microsoft",pct:10,desc:"Cloud + AI dominant player."}]},
  {id:"bonds",label:"🏦 More Bonds",stocks:[{ticker:"BND",alt:"AGG",name:"Total Bond Market",pct:10,desc:"Broad bond market, investment grade."},{ticker:"TLT",alt:"EDV",name:"Long-Term Treasury",pct:10,desc:"20+ year U.S. treasuries."},{ticker:"VCSH",alt:"IGSB",name:"Short-Term Corp Bond",pct:10,desc:"Investment-grade corporate, short duration."}]},
  {id:"gold",label:"🥇 More Gold",stocks:[{ticker:"GLD",alt:"IAU",name:"Gold ETF",pct:10,desc:"Physical gold exposure via ETF."},{ticker:"PHYS",alt:"SGOL",name:"Physical Gold Trust",pct:10,desc:"Allocated physical gold. Inflation hedge."},{ticker:"NEM",alt:"WPM",name:"Newmont Mining",pct:10,desc:"Gold mining equity exposure."}]},
];

const MONTHS_SHORT=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const MONTHS_LONG=["January","February","March","April","May","June","July","August","September","October","November","December"];
const ASSET_CATS=["Real Estate","Vehicle","Precious Metals","Business","Investment","Retirement","Collectible","Other"];
const PCOLS=["#3B82F6","#10B981","#F59E0B","#8B5CF6","#06B6D4","#F97316","#84CC16","#E11D48"];
const CERTS=["Master of Business Administration (MBA)","Bachelor of Business Administration (BBA)","FMVA — Financial Modeling & Valuation Analyst","FPWMP — Financial Planning & Wealth Management Professional","FL0215 — Florida Life & Health Insurance License"];

// ── SEED DATA ─────────────────────────────────────────────────────────────────
const mkClient=(p={})=>({id:Date.now()+Math.random(),firstName:"",lastName:"",partnerFirst:null,partnerLast:null,email:"",phone:"",address:"",dob:"",social:"",clientType:"financeOnly",recommendedBy:"",color1:"#4472C4",color2:"#ED7D31",efMonths:3,currentMonthLabel:"May 2026",incomeStreams:[],bills:[],cards:[],customAssets:[],assets:{checking:0,savings:0,retirement:0,vehicle:0,realEstate:0},liabilities:{creditCards:0,vehicle:0,student:0,personal:0},alloc:{stocks:25,retirement:20,realEstate:20,savings:15,vacation:10,other:10},portfolioCustom:{holdings:[]},notes:{shortTerm:"",midTerm:"",longTerm:"",setbacks:"",goals:"",general:""},monthSnapshots:[],...p});

const SEED=[
  mkClient({id:1,firstName:"Miguel",lastName:"Torres",partnerFirst:"Sofia",partnerLast:"Torres",email:"miguel.torres@email.com",phone:"(305) 555-0101",address:"1234 Coral Way, Miami FL 33145",dob:"1989-03-14",social:"123-45-6789",clientType:"financeAndHealth",recommendedBy:"Ana Rodriguez",color1:"#4472C4",color2:"#ED7D31",
    incomeStreams:[{id:1,person:"p1",label:"Main Job",gross:5200,net:3900,freq:"biweekly"},{id:2,person:"p2",label:"Main Job",gross:3800,net:2800,freq:"semimonthly"},{id:3,person:"p1",label:"Side Business",gross:800,net:700,freq:"monthly2"}],
    bills:[{id:1,name:"Rent",assignedTo:"joint",dueDay:1,cost:1830,type:"regular",freq:"monthly2"},{id:2,name:"Internet",assignedTo:"joint",dueDay:5,cost:80,type:"regular",freq:"monthly2"},{id:3,name:"Car Insurance",assignedTo:"p1",dueDay:12,cost:245,type:"regular",freq:"monthly2"},{id:4,name:"Electric",assignedTo:"joint",dueDay:20,cost:130,type:"regular",freq:"monthly2"},{id:5,name:"Phone",assignedTo:"joint",dueDay:22,cost:140,type:"regular",freq:"monthly2"}],
    cards:[{id:1,name:"Blue Business Cash",balance:2007,apr:30,min:70.25,limit:5000,promo:false},{id:2,name:"Chase Sapphire",balance:4961,apr:28.3,min:116.99,limit:8000,promo:true,promoBalance:1200,promoRate:0,promoEnd:"2026-06-01"},{id:3,name:"Best Buy",balance:850,apr:26.8,min:25,limit:2000,promo:true,promoBalance:850,promoRate:0,promoEnd:"2027-01-01"},{id:4,name:"Citi AAdvantage",balance:1303,apr:29,min:31.49,limit:3500,promo:false}],
    customAssets:[{id:1,name:"Primary Residence",value:480000,desc:"3/2 Coral Gables",cat:"Real Estate"},{id:2,name:"Gold Coins",value:5200,desc:"2 oz American Eagles",cat:"Precious Metals"}],
    assets:{checking:2500,savings:5000,retirement:8000,vehicle:17000,realEstate:0},liabilities:{creditCards:9121,vehicle:15929,student:0,personal:4800},
    notes:{shortTerm:"Pay off Best Buy promo before Jan 2027.",midTerm:"Pay off all credit cards by 2027.",longTerm:"Purchase investment property.",setbacks:"High rent.",goals:"Debt freedom and buy a duplex.",general:"Very motivated. Biweekly check-ins."},
    monthSnapshots:[
      {label:"Jan 2026",year:2026,month:1,income:8000,bills:6015,debt:11200,savings:4200,cashFlow:1985,savedAt:"2026-01-31T00:00:00Z",previousVersions:[],data:{incomeStreams:[{id:1,person:"p1",label:"Main Job",gross:5200,net:3900,freq:"biweekly"}],bills:[{id:1,name:"Rent",assignedTo:"joint",dueDay:1,cost:1830,type:"regular",freq:"monthly2"}],cards:[{id:1,name:"Blue Business Cash",balance:2600,apr:30,min:90,limit:5000,promo:false}],assets:{checking:1800,savings:3200,retirement:7200,vehicle:17500,realEstate:0},liabilities:{creditCards:11200,vehicle:16500,student:0,personal:4800},customAssets:[]}},
      {label:"Feb 2026",year:2026,month:2,income:8000,bills:6015,debt:10800,savings:4800,cashFlow:1985,savedAt:"2026-02-28T00:00:00Z",previousVersions:[],data:null},
      {label:"Mar 2026",year:2026,month:3,income:8500,bills:6015,debt:10400,savings:5200,cashFlow:2485,savedAt:"2026-03-31T00:00:00Z",previousVersions:[],data:null},
      {label:"Apr 2026",year:2026,month:4,income:8000,bills:6015,debt:9700,savings:5800,cashFlow:1985,savedAt:"2026-04-30T00:00:00Z",previousVersions:[],data:null},
    ]}),
  mkClient({id:2,firstName:"Amanda",lastName:"Chen",email:"amanda.chen@email.com",phone:"(786) 555-0202",address:"890 Brickell Ave #12D, Miami FL 33131",clientType:"financeOnly",color1:"#70AD47",efMonths:6,
    incomeStreams:[{id:1,person:"p1",label:"Salary",gross:6500,net:4800,freq:"semimonthly"}],
    bills:[{id:1,name:"Rent",assignedTo:"p1",dueDay:1,cost:1500,type:"regular",freq:"monthly2"},{id:2,name:"Car Payment",assignedTo:"p1",dueDay:10,cost:485,type:"regular",freq:"monthly2"},{id:3,name:"Electric",assignedTo:"p1",dueDay:15,cost:95,type:"regular",freq:"monthly2"}],
    cards:[{id:1,name:"Capital One",balance:1200,apr:27.4,min:35,limit:3000,promo:false}],
    customAssets:[{id:1,name:"Fidelity Account",value:22000,desc:"Brokerage — growth portfolio",cat:"Investment"}],
    assets:{checking:3800,savings:12000,retirement:22000,vehicle:18000,realEstate:0},liabilities:{creditCards:1200,vehicle:12500,student:18000,personal:0},
    notes:{shortTerm:"Pay off Capital One.",midTerm:"Pay off student loan by 2028.",longTerm:"Buy a condo.",setbacks:"High cost of living.",goals:"Financial independence by 45.",general:"Detail-oriented."},
    monthSnapshots:[
      {label:"Jan 2026",year:2026,month:1,income:4800,bills:2110,debt:33000,savings:10200,cashFlow:2690,savedAt:"2026-01-31T00:00:00Z",previousVersions:[],data:null},
      {label:"Feb 2026",year:2026,month:2,income:4800,bills:2110,debt:32400,savings:11000,cashFlow:2690,savedAt:"2026-02-28T00:00:00Z",previousVersions:[],data:null},
      {label:"Mar 2026",year:2026,month:3,income:4800,bills:2110,debt:31800,savings:11500,cashFlow:2690,savedAt:"2026-03-31T00:00:00Z",previousVersions:[],data:null},
      {label:"Apr 2026",year:2026,month:4,income:4800,bills:2110,debt:31700,savings:12000,cashFlow:2690,savedAt:"2026-04-30T00:00:00Z",previousVersions:[],data:null},
    ]}),
];

// ── HELPERS ───────────────────────────────────────────────────────────────────
const FREQ={weekly:52/12,biweekly:26/12,semimonthly:2,monthly2:1,annual:1/12};
const toM=(a,f)=>a*(FREQ[f]??1);
const fmt=n=>new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(n||0);
const fmtD=n=>new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2,maximumFractionDigits:2}).format(n||0);
const fmtShort=n=>{if(n>=1000000)return"$"+(n/1000000).toFixed(1)+"M";if(n>=1000)return"$"+(n/1000).toFixed(0)+"K";return fmt(n);};
const genId=()=>Date.now()+Math.floor(Math.random()*9999);
const sumNet=s=>(s||[]).reduce((a,i)=>a+toM(i.net,i.freq),0);
const sumGross=s=>(s||[]).reduce((a,i)=>a+toM(i.gross,i.freq),0);
const sumMin=c=>(c||[]).reduce((a,x)=>a+x.min,0);
const blockE=e=>['e','E','+','-'].includes(e.key)&&e.preventDefault();
const validateEmail=e=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
const formatPhone=r=>{const d=r.replace(/\D/g,"").slice(0,10);if(d.length<=3)return d;if(d.length<=6)return`(${d.slice(0,3)}) ${d.slice(3)}`;return`(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}`;};
const activeBills=bills=>{const t=new Date();return(bills||[]).filter(b=>{if(b.type==="temporary")return!b.maturity||new Date(b.maturity)>t;if(b.type==="annual")return b.dueMonth===t.getMonth()+1;return true;});};
const sumBills=bills=>activeBills(bills).reduce((s,b)=>s+toM(b.cost,b.freq),0);
const payoffM=(bal,apr,pay)=>{if(!bal||!pay)return null;const r=apr/100/12;if(r===0)return Math.ceil(bal/pay);const n=Math.log(pay/(pay-r*bal))/Math.log(1+r);return isFinite(n)&&n>0?Math.ceil(n):null;};
const payoffL=m=>{if(!m)return"—";const y=Math.floor(m/12),mo=m%12;return y>0?`${y}y ${mo}m`:`${mo}m`;};
const useSorted=(items,defKey,defDir="asc")=>{const[sk,setSK]=useState(defKey);const[sd,setSD]=useState(defDir);const toggle=k=>{if(k===sk)setSD(d=>d==="asc"?"desc":"asc");else{setSK(k);setSD("asc");}};const sorted=[...items].sort((a,b)=>{const av=a[sk],bv=b[sk];const r=typeof av==="string"?av.localeCompare(bv):(+av||0)-(+bv||0);return sd==="asc"?r:-r;});return{sorted,sortK:sk,sortD:sd,toggle};};
const SortArrow=({col,sortK,sortD})=>sortK===col?sortD==="asc"?"↑":"↓":"↕";
const migrateClient=c=>({...mkClient(),...c,customAssets:Array.isArray(c.customAssets)?c.customAssets:[],notes:c.notes||{shortTerm:"",midTerm:"",longTerm:"",setbacks:"",goals:"",general:""},portfolioCustom:c.portfolioCustom||{holdings:[]},address:c.address||"",dob:c.dob||"",social:c.social||"",clientType:c.clientType||"financeOnly",recommendedBy:c.recommendedBy||"",monthSnapshots:(c.monthSnapshots||[]).map(s=>({...s,data:s.data??null,previousVersions:s.previousVersions||[],savedAt:s.savedAt||""}))});

// ── REMINDER HELPERS ──────────────────────────────────────────────────────────
function getClientReminders(clients){
  const today=new Date();const day=today.getDate();const out=[];
  clients.forEach(c=>{
    (c.bills||[]).forEach(b=>{if(b.type!=="annual"&&b.dueDay){const diff=b.dueDay>=day?b.dueDay-day:b.dueDay+(31-day);if(diff<=7)out.push({client:`${c.firstName} ${c.lastName}`,name:b.name,dueDay:b.dueDay,amount:toM(b.cost,b.freq||"monthly2"),type:"bill",daysUntil:diff});}});
    (c.cards||[]).forEach(cc=>{if(cc.min>0)out.push({client:`${c.firstName} ${c.lastName}`,name:cc.name,dueDay:null,amount:cc.min,type:"card",daysUntil:null});});
  });
  return out.sort((a,b)=>(a.daysUntil??99)-(b.daysUntil??99));
}
function getAdvisorReminders(clients,settings){
  const today=new Date();const out=[];
  clients.forEach(c=>{
    const snaps=c.monthSnapshots||[];
    // No contact
    if(settings.reminderAdvisor?.noContact){
      const last=snaps[snaps.length-1];
      if(last?.savedAt){const days=Math.floor((today-new Date(last.savedAt))/(86400000));if(days>=(settings.noContactDays||30))out.push({type:"noContact",priority:days>60?"high":"med",client:`${c.firstName} ${c.lastName}`,detail:`Last review ${days} days ago`});}
      else if(snaps.length===0)out.push({type:"noContact",priority:"high",client:`${c.firstName} ${c.lastName}`,detail:"Never reviewed"});
    }
    // High DSR
    if(settings.reminderAdvisor?.highDebt){const net=sumNet(c.incomeStreams);const minD=sumMin(c.cards);const dsr=net>0?minD/net:0;if(dsr>0.36)out.push({type:"highDebt",priority:dsr>0.5?"high":"med",client:`${c.firstName} ${c.lastName}`,detail:`DSR ${(dsr*100).toFixed(0)}% — needs strategy`});}
    // Promo expiring
    if(settings.reminderAdvisor?.promoExpiring){(c.cards||[]).forEach(card=>{if(card.promo&&card.promoEnd){const daysLeft=Math.floor((new Date(card.promoEnd)-today)/86400000);if(daysLeft>=0&&daysLeft<=60)out.push({type:"promo",priority:daysLeft<=14?"high":"med",client:`${c.firstName} ${c.lastName}`,detail:`${card.name} promo ends in ${daysLeft} days`});}});}
    // Debt increasing
    if(settings.reminderAdvisor?.debtIncreasing){if(snaps.length>=2&&snaps[snaps.length-1].debt>snaps[0].debt)out.push({type:"debtRising",priority:"med",client:`${c.firstName} ${c.lastName}`,detail:`Debt up ${fmt(snaps[snaps.length-1].debt-snaps[0].debt)} since ${snaps[0].label}`});}
  });
  return out.sort((a,b)=>a.priority==="high"?-1:1);
}

// ── PRIMITIVES ────────────────────────────────────────────────────────────────
function Pill({children,color="#94A3B8"}){return<span style={{background:color+"22",color,border:`1px solid ${color}44`,borderRadius:99,padding:"1px 8px",fontSize:11,fontWeight:600,whiteSpace:"nowrap"}}>{children}</span>;}
function InfoTip({text}){const[v,setV]=useState(false);const th=useTh();return<span style={{position:"relative",display:"inline-block",marginLeft:4}}><span onMouseEnter={()=>setV(true)} onMouseLeave={()=>setV(false)} style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:15,height:15,borderRadius:99,fontSize:9,cursor:"help",background:GOLD+"22",color:GOLD,border:`1px solid ${GOLD}44`}}>?</span>{v&&<span style={{position:"absolute",bottom:20,left:"50%",transform:"translateX(-50%)",width:230,padding:"10px 12px",borderRadius:10,fontSize:11,lineHeight:1.6,zIndex:999,background:th.nav,border:`1px solid ${th.cardBorder}`,color:th.muted,boxShadow:"0 12px 40px #000a"}}>{text}</span>}</span>;}
function SC({label,value,color,sub}){const th=useTh();return<div style={{...mCARD(th),padding:14,flex:1}}><div style={{fontSize:11,color:th.muted,marginBottom:4}}>{label}</div><div style={{fontSize:18,fontWeight:800,color:color||th.accent}}>{value}</div>{sub&&<div style={{fontSize:10,color:th.dim,marginTop:2}}>{sub}</div>}</div>;}
function Field({label,children}){const th=useTh();return<div style={{marginBottom:14}}><label style={{fontSize:11,color:th.muted,display:"block",marginBottom:5}}>{label}</label>{children}</div>;}
function Row2({children}){const count=Array.isArray(children)?children.filter(Boolean).length:1;return<div style={{display:"grid",gridTemplateColumns:`repeat(${count},1fr)`,gap:12}}>{children}</div>;}
function SHdr({label,right}){const th=useTh();return<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}><span style={{fontSize:12,fontWeight:700,color:th.accent,letterSpacing:"0.08em",textTransform:"uppercase"}}>{label}</span>{right}</div>;}
function PersonTag({who,client}){const color=who==="p1"?client.color1:who==="p2"?(client.color2||"#94A3B8"):"#94A3B8";const name=who==="p1"?client.firstName:who==="p2"?(client.partnerFirst||"P2"):"Joint";return<Pill color={color}>{name}</Pill>;}
function StatusBadge({value,meta,t}){const g=meta.better==="higher"?value>=meta.threshold:value<=meta.threshold;const w=meta.better==="higher"?value>=meta.threshold*0.5:value<=meta.threshold*1.4;const c=g?"#10B981":w?"#F59E0B":"#EF4444";return<Pill color={c}>{g?t.good:w?t.warning:t.critical}</Pill>;}
function Btn({children,onClick,color,small,style={}}){const th=useTh();const c=color||th.accent;return<button onClick={onClick} style={{fontSize:small?11:12,padding:small?"3px 10px":"7px 16px",borderRadius:8,background:c+"22",color:c,border:`1px solid ${c}44`,cursor:"pointer",fontWeight:600,...style}}>{children}</button>;}
function BtnSolid({children,onClick,style={}}){const th=useTh();return<button onClick={onClick} style={{fontSize:12,padding:"7px 20px",borderRadius:8,background:th.accent,color:"#fff",fontWeight:700,border:"none",cursor:"pointer",...style}}>{children}</button>;}
function Toggle({label,checked,onChange}){const th=useTh();return<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}><span style={{fontSize:12,color:th.muted}}>{label}</span><div onClick={()=>onChange(!checked)} style={{width:36,height:20,borderRadius:99,background:checked?th.accent:th.cardBorder,cursor:"pointer",position:"relative",transition:"background 0.2s",flexShrink:0}}><div style={{position:"absolute",top:2,left:checked?18:2,width:16,height:16,borderRadius:99,background:"#fff",transition:"left 0.2s",boxShadow:"0 1px 3px #0004"}}/></div></div>;}

// ── COLOR CIRCLE ──────────────────────────────────────────────────────────────
function ColorCircle({value,onChange}){
  const[open,setOpen]=useState(false);const th=useTh();
  return<div style={{position:"relative"}}>
    <div onClick={()=>setOpen(o=>!o)} style={{width:34,height:34,borderRadius:"50%",background:value,border:"3px solid white",boxShadow:"0 0 0 1px #0004",cursor:"pointer"}}/>
    {open&&<><div onClick={()=>setOpen(false)} style={{position:"fixed",inset:0,zIndex:299}}/><div style={{position:"absolute",top:40,left:0,background:th.nav,border:`1px solid ${th.cardBorder}`,borderRadius:12,padding:10,zIndex:300,boxShadow:"0 16px 40px #000a",width:194}}><div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:5,marginBottom:10}}>{COLOR_PRESETS.map(c=><div key={c} onClick={()=>{onChange({target:{value:c}});setOpen(false);}} style={{width:24,height:24,borderRadius:"50%",background:c,border:value===c?"3px solid white":"2px solid transparent",cursor:"pointer",boxShadow:"0 0 0 1px #0003"}}/>)}</div><div style={{borderTop:`1px solid ${th.cardBorder}`,paddingTop:8,fontSize:10,color:th.dim,marginBottom:4}}>Custom</div><input type="color" value={value} onChange={onChange} style={{width:"100%",height:26,cursor:"pointer",borderRadius:6,border:"none",background:"none"}}/></div></>}
  </div>;
}

// ── SSN INPUT ────────────────────────────────────────────────────────────────
function SSNInput({value,onChange,t}){
  const[show,setShow]=useState(false);const th=useTh();
  const fmtSSN=v=>{const d=v.replace(/\D/g,"").slice(0,9);if(d.length<=3)return d;if(d.length<=5)return`${d.slice(0,3)}-${d.slice(3)}`;return`${d.slice(0,3)}-${d.slice(3,5)}-${d.slice(5)}`;};
  return<div style={{display:"flex",gap:8,alignItems:"center"}}><input type={show?"text":"password"} value={value} onChange={e=>onChange({target:{value:fmtSSN(e.target.value)}})} style={{...mINP(th),flex:1}} placeholder="###-##-####" maxLength={11}/><button onClick={()=>setShow(s=>!s)} style={{fontSize:11,padding:"6px 10px",borderRadius:7,background:th.inp,color:th.muted,border:`1px solid ${th.inpBorder}`,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}}>{show?(t.hideSSN||"Hide"):(t.showSSN||"Show")}</button></div>;
}

// ── MODAL ─────────────────────────────────────────────────────────────────────
function Modal({title,onClose,children,width=480}){const th=useTh();return<div onClick={e=>e.target===e.currentTarget&&onClose()} style={{position:"fixed",inset:0,background:"#000b",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}><div style={{background:th.nav,border:`1px solid ${th.cardBorder}`,borderRadius:16,padding:24,width:"100%",maxWidth:width,maxHeight:"90vh",overflowY:"auto",boxShadow:"0 32px 80px #000d"}}><div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}><span style={{fontSize:14,fontWeight:700,color:th.text}}>{title}</span><button onClick={onClose} style={{background:"none",border:"none",color:th.muted,cursor:"pointer",fontSize:22,lineHeight:1}}>×</button></div>{children}</div></div>;}
function SaveBar({onSave,onCancel,onDelete,t}){const[conf,setConf]=useState(false);const th=useTh();return<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:20,paddingTop:16,borderTop:`1px solid ${th.cardBorder}`}}><div>{onDelete&&!conf&&<button onClick={()=>setConf(true)} style={{fontSize:12,padding:"6px 14px",borderRadius:8,background:"#EF444422",color:"#EF4444",border:"1px solid #EF444444",cursor:"pointer"}}>{t.deleteLabel}</button>}{onDelete&&conf&&<div style={{display:"flex",gap:8,alignItems:"center"}}><span style={{fontSize:11,color:"#EF4444"}}>{t.confirmDelete}</span><button onClick={onDelete} style={{fontSize:12,padding:"5px 12px",borderRadius:8,background:"#EF4444",color:"#fff",border:"none",cursor:"pointer"}}>Yes</button><button onClick={()=>setConf(false)} style={{fontSize:12,padding:"5px 12px",borderRadius:8,background:th.cardBorder,color:th.muted,border:"none",cursor:"pointer"}}>No</button></div>}</div><div style={{display:"flex",gap:8}}><button onClick={onCancel} style={{fontSize:12,padding:"7px 16px",borderRadius:8,background:th.inp,color:th.muted,border:"none",cursor:"pointer"}}>{t.cancel}</button><BtnSolid onClick={onSave}>{t.save}</BtnSolid></div></div>;}
function InlineAddRow({cols,onSave}){const th=useTh();const[open,setOpen]=useState(false);const[vals,setVals]=useState({});const u=k=>e=>setVals(p=>({...p,[k]:e.target.value}));const save=()=>{if(onSave(vals)){setVals({});setOpen(false);}};if(!open)return<tr onClick={()=>setOpen(true)} style={{cursor:"pointer"}}><td colSpan={cols.length+1} style={{...mTD(th),color:th.dim,fontStyle:"italic",padding:"8px 0"}}>+ Add row…</td></tr>;return<tr style={{background:th.bg+"88"}}>{cols.map(c=><td key={c.key} style={{...mTD(th),paddingRight:6}}>{c.type==="select"?<select value={vals[c.key]||c.default||""} onChange={u(c.key)} style={{...mIIN(th),padding:"3px 6px"}}>{c.options.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}</select>:<input type={c.type||"text"} placeholder={c.placeholder||""} value={vals[c.key]||""} onChange={u(c.key)} onKeyDown={c.numeric?blockE:undefined} style={mIIN(th)} onKeyUp={e=>e.key==="Enter"&&save()}/>}</td>)}<td style={{...mTDR(th),whiteSpace:"nowrap"}}><button onClick={save} style={{fontSize:12,padding:"3px 10px",borderRadius:6,background:GOLD,color:"#0D1B2A",border:"none",cursor:"pointer",fontWeight:700,marginRight:4}}>✓</button><button onClick={()=>setOpen(false)} style={{fontSize:12,padding:"3px 8px",borderRadius:6,background:th.inp,color:th.muted,border:"none",cursor:"pointer"}}>×</button></td></tr>;}

// ── PROFILE & SETTINGS MODAL ─────────────────────────────────────────────────
function ProfileModal({settings,onSave,onClose,t}){
  const th=useTh();const[s,setS]=useState({...settings});
  const u=k=>e=>setS(p=>({...p,[k]:e.target.value}));
  const uRA=k=>v=>setS(p=>({...p,reminderAdvisor:{...p.reminderAdvisor,[k]:v}}));
  const ZOOMS=[{v:0.9,l:"90%"},{v:1.0,l:"100%"},{v:1.15,l:"115%"},{v:1.25,l:"125%"},{v:1.35,l:"135%"}];
  const INP=mINP(th);
  return<Modal title={t.profileSettings} onClose={onClose} width={480}>
    <div style={{fontSize:11,fontWeight:700,color:th.dim,marginBottom:10,letterSpacing:"0.07em"}}>DISPLAY SIZE</div>
    <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>{ZOOMS.map(z=><button key={z.v} onClick={()=>setS(p=>({...p,zoom:z.v}))} style={{fontSize:12,padding:"6px 14px",borderRadius:8,cursor:"pointer",background:s.zoom===z.v?th.accent+"22":"transparent",color:s.zoom===z.v?th.accent:th.muted,border:`1px solid ${s.zoom===z.v?th.accent:th.cardBorder}`,fontWeight:s.zoom===z.v?700:400}}>{z.l}</button>)}</div>
    <div style={{fontSize:11,fontWeight:700,color:th.dim,marginBottom:10,letterSpacing:"0.07em"}}>CONTACT INFO</div>
    <Row2><Field label="Advisor Name"><input style={INP} value={s.advisorName||""} onChange={u("advisorName")}/></Field><Field label="Email"><input style={INP} value={s.advisorEmail||""} onChange={u("advisorEmail")}/></Field></Row2>
    <Field label="Instagram Handle"><div style={{position:"relative"}}><span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:th.dim,fontSize:12}}>@</span><input style={{...INP,paddingLeft:28}} value={s.ig||""} onChange={u("ig")}/></div></Field>
    <div style={{fontSize:11,fontWeight:700,color:th.dim,marginBottom:10,marginTop:4,letterSpacing:"0.07em"}}>ADVISOR REMINDERS</div>
    <Toggle label="No contact (reach-out alert)" checked={!!s.reminderAdvisor?.noContact} onChange={v=>uRA("noContact")(v)}/>
    {s.reminderAdvisor?.noContact&&<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10,paddingLeft:8}}><span style={{fontSize:11,color:th.dim}}>Alert after</span><input type="number" min={7} max={180} value={s.noContactDays||30} onChange={e=>setS(p=>({...p,noContactDays:+e.target.value||30}))} style={{...mIIN(th),width:60,textAlign:"center"}}/><span style={{fontSize:11,color:th.dim}}>days</span></div>}
    <Toggle label="High debt ratio clients (DSR > 36%)" checked={!!s.reminderAdvisor?.highDebt} onChange={v=>uRA("highDebt")(v)}/>
    <Toggle label="Promo rates expiring within 60 days" checked={!!s.reminderAdvisor?.promoExpiring} onChange={v=>uRA("promoExpiring")(v)}/>
    <Toggle label="Clients with increasing debt trend" checked={!!s.reminderAdvisor?.debtIncreasing} onChange={v=>uRA("debtIncreasing")(v)}/>
    <SaveBar onSave={()=>onSave(s)} onCancel={onClose} t={t}/>
  </Modal>;
}

// ── CLIENT FORM ───────────────────────────────────────────────────────────────
function ClientForm({client,onSave,onDelete,onClose,t}){
  const th=useTh();const[f,setF]=useState({firstName:"",lastName:"",partnerFirst:"",partnerLast:"",email:"",phone:"",address:"",dob:"",social:"",clientType:"financeOnly",recommendedBy:"",color1:"#4472C4",color2:"#ED7D31",...(client||{})});
  const[errs,setErrs]=useState({});const u=k=>e=>setF(p=>({...p,[k]:e.target.value}));
  const save=()=>{const e={};if(!f.firstName)e.firstName="Required";if(!f.lastName)e.lastName="Required";if(!f.email)e.email="Required";else if(!validateEmail(f.email))e.email="Invalid email";if(Object.keys(e).length){setErrs(e);return;}onSave(migrateClient({...client,...f,id:client?.id||genId(),partnerFirst:f.partnerFirst||null,partnerLast:f.partnerLast||null,color2:f.partnerFirst?f.color2:null}));};
  const INP=mINP(th);
  return<Modal title={client?t.editClient:t.addClient} onClose={onClose} width={560}>
    <Row2><div><label style={{fontSize:11,color:th.muted,display:"block",marginBottom:5}}>{t.firstName} *</label><input style={INP} value={f.firstName} onChange={u("firstName")}/>{errs.firstName&&<div style={{fontSize:10,color:"#EF4444",marginTop:2}}>{errs.firstName}</div>}</div><div><label style={{fontSize:11,color:th.muted,display:"block",marginBottom:5}}>{t.lastName} *</label><input style={INP} value={f.lastName} onChange={u("lastName")}/>{errs.lastName&&<div style={{fontSize:10,color:"#EF4444",marginTop:2}}>{errs.lastName}</div>}</div></Row2>
    <Row2><Field label={t.partnerFirst}><input style={INP} value={f.partnerFirst||""} onChange={u("partnerFirst")} placeholder="Leave blank if single"/></Field><Field label={t.partnerLast}><input style={INP} value={f.partnerLast||""} onChange={u("partnerLast")}/></Field></Row2>
    <div><label style={{fontSize:11,color:th.muted,display:"block",marginBottom:5}}>{t.email} *</label><input style={INP} value={f.email} onChange={u("email")}/>{errs.email&&<div style={{fontSize:10,color:"#EF4444",marginTop:2}}>{errs.email}</div>}</div><div style={{height:12}}/>
    <Row2><Field label={t.phone}><input style={INP} value={f.phone||""} placeholder="(305) 555-0000" onChange={e=>setF(p=>({...p,phone:formatPhone(e.target.value)}))}/></Field><Field label={t.dob}><input type="date" style={INP} value={f.dob||""} onChange={u("dob")}/></Field></Row2>
    <Field label={t.address}><input style={INP} value={f.address||""} onChange={u("address")}/></Field>
    <Field label={t.social}><SSNInput value={f.social||""} onChange={u("social")} t={t}/></Field>
    <Row2><Field label={t.clientType}><select style={INP} value={f.clientType||"financeOnly"} onChange={u("clientType")}><option value="financeOnly">{t.financeOnly}</option><option value="financeAndHealth">{t.financeAndHealth}</option></select></Field><Field label={t.recommendedBy}><input style={INP} value={f.recommendedBy||""} onChange={u("recommendedBy")}/></Field></Row2>
    <div style={{display:"flex",gap:24,alignItems:"center",marginBottom:14}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}><ColorCircle value={f.color1||"#4472C4"} onChange={u("color1")}/><span style={{fontSize:12,color:th.muted}}>{f.firstName||t.p1}</span></div>
      {f.partnerFirst&&<div style={{display:"flex",alignItems:"center",gap:8}}><ColorCircle value={f.color2||"#ED7D31"} onChange={u("color2")}/><span style={{fontSize:12,color:th.muted}}>{f.partnerFirst}</span></div>}
    </div>
    <SaveBar onSave={save} onCancel={onClose} onDelete={client?onDelete:null} t={t}/>
  </Modal>;
}

// ── CARD / BILL / ASSET MODALS ────────────────────────────────────────────────
function CardModal({card,onSave,onDelete,onClose,t}){
  const th=useTh();const[f,setF]=useState({name:"",balance:0,apr:0,min:0,limit:0,promo:false,promoBalance:0,promoRate:0,promoEnd:"",...(card||{})});const[err,setErr]=useState("");
  const u=k=>e=>setF(p=>({...p,[k]:e.target.type==="checkbox"?e.target.checked:e.target.value}));
  const save=()=>{if(!f.name){setErr("Name required.");return;}if(f.promo&&+f.promoBalance>+f.balance){setErr("Promo balance cannot exceed card balance.");return;}onSave({...f,id:card?.id||genId(),balance:+f.balance,apr:+f.apr,min:+f.min,limit:+f.limit,promoBalance:+f.promoBalance,promoRate:+f.promoRate});};
  const INP=mINP(th);
  return<Modal title={card?`${t.editLabel} Card`:t.addCard} onClose={onClose}>
    <Field label={t.cardName}><input style={INP} value={f.name} onChange={u("name")}/></Field>
    <Row2><Field label="Balance ($)"><input type="number" min={0} onKeyDown={blockE} style={INP} value={f.balance} onChange={u("balance")}/></Field><Field label="APR (%)"><input type="number" min={0} step="0.1" onKeyDown={blockE} style={INP} value={f.apr} onChange={u("apr")}/></Field></Row2>
    <Row2><Field label="Min Pay ($)"><input type="number" min={0} onKeyDown={blockE} style={INP} value={f.min} onChange={u("min")}/></Field><Field label={<span>{t.limit} ($)<InfoTip text={t.limitInfo}/></span>}><input type="number" min={0} onKeyDown={blockE} style={INP} value={f.limit} onChange={u("limit")}/></Field></Row2>
    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}><input type="checkbox" id="pr" checked={!!f.promo} onChange={u("promo")} style={{accentColor:GOLD,width:16,height:16,cursor:"pointer"}}/><label htmlFor="pr" style={{fontSize:12,color:th.muted,cursor:"pointer"}}>{t.hasPromo}</label></div>
    {f.promo&&<><Row2><Field label="Promo Balance ($)"><input type="number" min={0} onKeyDown={blockE} style={INP} value={f.promoBalance} onChange={u("promoBalance")}/></Field><Field label="Promo Rate (%)"><input type="number" min={0} onKeyDown={blockE} style={INP} value={f.promoRate} onChange={u("promoRate")}/></Field></Row2><Field label={t.promoEnd}><input type="date" style={INP} value={f.promoEnd} onChange={u("promoEnd")}/></Field></>}
    {err&&<div style={{fontSize:11,color:"#EF4444",background:"#EF444411",borderRadius:8,padding:"8px 10px",marginBottom:10}}>{err}</div>}
    <div style={{...mCARD(th),padding:12,fontSize:12,display:"flex",gap:20,marginBottom:4}}><span style={{color:th.muted}}>Interest/mo: <span style={{color:"#EF4444",fontWeight:700}}>{fmtD((+f.balance)*(+f.apr)/100/12)}</span></span><span style={{color:th.muted}}>Payoff: <span style={{color:GOLD,fontWeight:700}}>{payoffL(payoffM(+f.balance,+f.apr,+f.min))}</span></span></div>
    <SaveBar onSave={save} onCancel={onClose} onDelete={card?onDelete:null} t={t}/>
  </Modal>;
}
function BillModal({bill,client,onSave,onDelete,onClose,t}){
  const th=useTh();const[f,setF]=useState({name:"",assignedTo:"joint",cost:0,type:"regular",freq:"monthly2",dueDay:1,dueMonth:1,maturity:"",...(bill||{})});const u=k=>e=>setF(p=>({...p,[k]:e.target.value}));
  const persons=[["p1",client.firstName||t.p1],["p2",client.partnerFirst||t.p2],["joint",t.joint]].filter(([k])=>k!=="p2"||client.partnerFirst);
  const save=()=>{if(!f.name){alert("Name required.");return;}const day=Math.min(31,Math.max(1,+f.dueDay||1));onSave({...f,id:bill?.id||genId(),cost:+f.cost,dueDay:f.type==="annual"?null:day,dueMonth:f.type==="annual"?+f.dueMonth:null,freq:f.type==="annual"?"annual":f.freq});};
  const INP=mINP(th);
  return<Modal title={bill?`${t.editLabel} Bill`:t.addBill} onClose={onClose}>
    <Row2><Field label={t.billName}><input style={INP} value={f.name} onChange={u("name")}/></Field><Field label={t.person}><select style={INP} value={f.assignedTo} onChange={u("assignedTo")}>{persons.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></Field></Row2>
    <Row2><Field label={t.billType}><select style={INP} value={f.type} onChange={u("type")}>{["regular","annual","temporary"].map(k=><option key={k} value={k}>{t[k]||k}</option>)}</select></Field>{f.type!=="annual"&&<Field label={t.frequency}><select style={INP} value={f.freq} onChange={u("freq")}>{["weekly","biweekly","semimonthly","monthly2"].map(k=><option key={k} value={k}>{t[k]}</option>)}</select></Field>}</Row2>
    <Row2><Field label={t.cost}><input type="number" min={0} onKeyDown={blockE} style={INP} value={f.cost} onChange={u("cost")}/></Field>{f.type!=="annual"?<Field label={t.dueDay}><input type="number" min={1} max={31} onKeyDown={blockE} style={INP} value={f.dueDay} onChange={e=>setF(p=>({...p,dueDay:Math.min(31,Math.max(1,+e.target.value||1))}))}/></Field>:<Field label="Due Month (1–12)"><input type="number" min={1} max={12} onKeyDown={blockE} style={INP} value={f.dueMonth} onChange={u("dueMonth")}/></Field>}</Row2>
    {f.type==="temporary"&&<Field label="Maturity Date"><input type="date" style={INP} value={f.maturity} onChange={u("maturity")}/></Field>}
    <SaveBar onSave={save} onCancel={onClose} onDelete={bill?onDelete:null} t={t}/>
  </Modal>;
}
function AssetModal({asset,onSave,onDelete,onClose,t}){
  const th=useTh();const[f,setF]=useState({name:"",value:0,desc:"",cat:"Real Estate",...(asset||{})});const u=k=>e=>setF(p=>({...p,[k]:e.target.value}));const INP=mINP(th);
  return<Modal title={asset?`${t.editLabel} Asset`:t.addAsset} onClose={onClose}>
    <Row2><Field label={t.assetName}><input style={INP} value={f.name} onChange={u("name")}/></Field><Field label={t.assetCat}><select style={INP} value={f.cat} onChange={u("cat")}>{ASSET_CATS.map(c=><option key={c} value={c}>{c}</option>)}</select></Field></Row2>
    <Field label={t.assetValue}><input type="number" min={0} onKeyDown={blockE} style={INP} value={f.value} onChange={u("value")}/></Field>
    <Field label={t.assetDesc}><textarea style={{...INP,height:72,resize:"vertical"}} value={f.desc} onChange={u("desc")} placeholder="Optional…"/></Field>
    <SaveBar onSave={()=>{if(!f.name){alert("Name required.");return;}onSave({...f,id:asset?.id||genId(),value:+f.value});}} onCancel={onClose} onDelete={asset?onDelete:null} t={t}/>
  </Modal>;
}

// ── INCOME SECTION ────────────────────────────────────────────────────────────
function IncomeSection({client,onUpdate,t}){
  const th=useTh();const total=sumNet(client.incomeStreams);
  const persons=[["p1",client.firstName||t.p1],["p2",client.partnerFirst||t.p2],["joint",t.joint]].filter(([k])=>k!=="p2"||client.partnerFirst);
  const save=s=>{const ex=client.incomeStreams.find(x=>x.id===s.id);onUpdate({...client,incomeStreams:ex?client.incomeStreams.map(x=>x.id===s.id?s:x):[...client.incomeStreams,s]});};
  const del=id=>onUpdate({...client,incomeStreams:client.incomeStreams.filter(x=>x.id!==id)});
  return<div><SHdr label={t.income} right={<Btn small onClick={()=>save({id:genId(),person:"p1",label:"New Source",gross:0,net:0,freq:"biweekly"})}>+ {t.addIncome}</Btn>}/>
    <table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr><th style={mTH(th)}>Source</th><th style={mTH(th)}>Person</th><th style={mTH(th)}>Freq</th><th style={mTHR(th)}>Gross/mo</th><th style={mTHR(th)}>Net/mo</th><th/></tr></thead><tbody>
      {client.incomeStreams.map(s=><IncomeRow key={s.id} s={s} client={client} persons={persons} onSave={save} onDel={()=>del(s.id)} t={t}/>)}
      <InlineAddRow cols={[{key:"label",placeholder:"Source"},{key:"person",type:"select",options:persons.map(([v,l])=>({v,l})),default:"p1"},{key:"freq",type:"select",options:["biweekly","semimonthly","monthly2","weekly"].map(k=>({v:k,l:t[k]})),default:"biweekly"},{key:"gross",placeholder:"Gross",numeric:true},{key:"net",placeholder:"Net",numeric:true}]} onSave={vals=>{if(!vals.label||!vals.net)return false;save({id:genId(),person:vals.person||"p1",label:vals.label,gross:+vals.gross||0,net:+vals.net,freq:vals.freq||"biweekly"});return true;}}/>
    </tbody><tfoot><tr style={{borderTop:`2px solid ${GOLD}44`}}><td colSpan={4} style={{paddingTop:10,fontSize:11,color:th.dim}}>Gross: {fmt(sumGross(client.incomeStreams))}</td><td style={{...mTHR(th),paddingTop:10}}>Net total</td><td style={{paddingTop:10,textAlign:"right",fontWeight:800,color:GOLD,fontSize:15}}>{fmt(total)}</td></tr></tfoot></table>
  </div>;
}
function IncomeRow({s,client,persons,onSave,onDel,t}){
  const th=useTh();const[e,setE]=useState(false);const[f,setF]=useState(s);const u=k=>ev=>setF(p=>({...p,[k]:ev.target.value}));
  if(e)return<tr style={{background:th.bg+"88"}}><td style={mTD(th)}><input style={mIIN(th)} value={f.label} onChange={u("label")}/></td><td style={mTD(th)}><select style={{...mIIN(th),padding:"3px 6px"}} value={f.person} onChange={u("person")}>{persons.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></td><td style={mTD(th)}><select style={{...mIIN(th),padding:"3px 6px"}} value={f.freq} onChange={u("freq")}>{["weekly","biweekly","semimonthly","monthly2"].map(k=><option key={k} value={k}>{t[k]}</option>)}</select></td><td style={mTDR(th)}><input type="number" style={{...mIIN(th),textAlign:"right"}} value={f.gross} onChange={u("gross")} onKeyDown={blockE}/></td><td style={mTDR(th)}><input type="number" style={{...mIIN(th),textAlign:"right"}} value={f.net} onChange={u("net")} onKeyDown={blockE}/></td><td style={{...mTDR(th),whiteSpace:"nowrap"}}><button onClick={()=>{onSave({...f,gross:+f.gross,net:+f.net});setE(false);}} style={{fontSize:11,padding:"2px 8px",borderRadius:6,background:GOLD,color:"#0D1B2A",border:"none",cursor:"pointer",marginRight:3}}>✓</button><button onClick={()=>setE(false)} style={{fontSize:11,padding:"2px 6px",borderRadius:6,background:th.inp,color:th.muted,border:"none",cursor:"pointer",marginRight:3}}>×</button><button onClick={onDel} style={{fontSize:11,padding:"2px 6px",borderRadius:6,background:"#EF444422",color:"#EF4444",border:"none",cursor:"pointer"}}>🗑</button></td></tr>;
  return<tr onDoubleClick={()=>setE(true)}><td style={{...mTD(th),fontWeight:600}}>{s.label}</td><td style={mTD(th)}><PersonTag who={s.person} client={client}/></td><td style={{...mTD(th),color:th.dim}}>{t[s.freq]}</td><td style={{...mTDR(th),color:th.muted}}>{fmt(toM(s.gross,s.freq))}</td><td style={{...mTDR(th),fontWeight:700}}>{fmt(toM(s.net,s.freq))}</td><td style={mTDR(th)}><Btn small onClick={()=>setE(true)}>{t.editLabel}</Btn></td></tr>;
}

// ── BILLS & DEBT SECTIONS (unchanged, kept compact) ──────────────────────────
function BillsSection({client,onUpdate,t}){
  const th=useTh();const[modal,setModal]=useState(null);
  const{sorted,sortK,sortD,toggle}=useSorted(activeBills(client.bills),"dueDay","asc");
  const persons=[["p1",client.firstName||t.p1],["p2",client.partnerFirst||t.p2],["joint",t.joint]].filter(([k])=>k!=="p2"||client.partnerFirst);
  const save=b=>{const ex=client.bills.find(x=>x.id===b.id);onUpdate({...client,bills:ex?client.bills.map(x=>x.id===b.id?b:x):[...client.bills,b]});setModal(null);};
  const del=id=>{onUpdate({...client,bills:client.bills.filter(x=>x.id!==id)});setModal(null);};
  const h1=sorted.filter(b=>(b.dueDay||1)<=15),h2=sorted.filter(b=>(b.dueDay||1)>15);
  const STH=({k,children,right})=><th onClick={()=>toggle(k)} style={right?mTHR(th):mTH(th)}>{children} <SortArrow col={k} sortK={sortK} sortD={sortD}/></th>;
  const BT=({title,rows})=><div style={{marginBottom:14}}><div style={{fontSize:11,fontWeight:700,color:th.dim,marginBottom:6}}>{title}</div><table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr><STH k="name">Name</STH><STH k="assignedTo">Person</STH><STH k="dueDay">Day</STH><STH k="type">Type</STH><STH k="cost" right>Monthly</STH><th/></tr></thead><tbody>{rows.map(b=><tr key={b.id}><td style={{...mTD(th),fontWeight:600}}>{b.name}{b.type==="temporary"&&<span style={{marginLeft:6}}><Pill color="#F59E0B">TEMP</Pill></span>}</td><td style={mTD(th)}><PersonTag who={b.assignedTo} client={client}/></td><td style={{...mTD(th),textAlign:"center",color:th.dim}}>{b.dueDay||"—"}</td><td style={{...mTD(th),fontSize:11,color:th.dim}}>{t[b.type]||b.type}</td><td style={{...mTDR(th),fontWeight:700}}>{fmt(toM(b.cost,b.freq))}</td><td style={mTDR(th)}><Btn small onClick={()=>setModal(b)}>{t.editLabel}</Btn></td></tr>)}<InlineAddRow cols={[{key:"name",placeholder:"Bill name"},{key:"assignedTo",type:"select",options:persons.map(([v,l])=>({v,l})),default:"joint"},{key:"dueDay",placeholder:"Day",numeric:true},{key:"type",type:"select",options:[{v:"regular",l:t.regular},{v:"temporary",l:t.temporary},{v:"annual",l:t.annual}],default:"regular"},{key:"cost",placeholder:"Amount",numeric:true}]} onSave={vals=>{if(!vals.name||!vals.cost)return false;save({id:genId(),name:vals.name,assignedTo:vals.assignedTo||"joint",cost:+vals.cost,type:vals.type||"regular",freq:"monthly2",dueDay:Math.min(31,Math.max(1,+vals.dueDay||1))});return true;}}/></tbody></table></div>;
  return<div>{modal&&<BillModal bill={modal==="new"?null:modal} client={client} onSave={save} onDelete={modal!=="new"?()=>del(modal.id):null} onClose={()=>setModal(null)} t={t}/>}<SHdr label={t.bills} right={<Btn small onClick={()=>setModal("new")}>+ {t.addBill}</Btn>}/><BT title={t.period1} rows={h1}/><BT title={t.period2} rows={h2}/><div style={{display:"flex",justifyContent:"flex-end",gap:12,paddingTop:8,borderTop:`1px solid ${GOLD}44`}}><span style={{fontSize:11,color:th.muted}}>{t.totalBills}</span><span style={{fontWeight:800,fontSize:15,color:GOLD}}>{fmt(sumBills(client.bills))}</span></div></div>;
}
function DebtSection({client,onUpdate,t}){
  const th=useTh();const[strat,setStrat]=useState("avalanche");const[modal,setModal]=useState(null);const[expPromo,setExpPromo]=useState(null);
  const{sorted,sortK,sortD,toggle}=useSorted(client.cards,strat==="avalanche"?"apr":"balance","desc");
  const STH=({k,children,right})=><th onClick={()=>toggle(k)} style={right?mTHR(th):mTH(th)}>{children} <SortArrow col={k} sortK={sortK} sortD={sortD}/></th>;
  const save=c=>{const ex=client.cards.find(x=>x.id===c.id);onUpdate({...client,cards:ex?client.cards.map(x=>x.id===c.id?c:x):[...client.cards,c]});setModal(null);};
  const del=id=>{onUpdate({...client,cards:client.cards.filter(x=>x.id!==id)});setModal(null);};
  const intT=client.cards.filter(c=>c.apr>0).reduce((s,c)=>s+c.balance,0),moCost=client.cards.reduce((s,c)=>s+(c.balance*c.apr/100/12),0);
  return<div>
    {modal&&<CardModal card={modal==="new"?null:modal} onSave={save} onDelete={modal!=="new"?()=>del(modal.id):null} onClose={()=>setModal(null)} t={t}/>}
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}><span style={{fontSize:12,fontWeight:700,color:th.accent,letterSpacing:"0.08em",textTransform:"uppercase"}}>{t.debt}</span>
      <div style={{display:"flex",gap:8}}><Btn small onClick={()=>setModal("new")}>+ {t.addCard}</Btn>{[["avalanche",t.avalanche],["snowball",t.snowball]].map(([k,l])=><button key={k} onClick={()=>setStrat(k)} style={{fontSize:11,padding:"3px 10px",borderRadius:7,cursor:"pointer",background:strat===k?GOLD:"transparent",color:strat===k?"#0D1B2A":th.muted,fontWeight:strat===k?700:400,border:`1px solid ${strat===k?GOLD:th.cardBorder}`}}>{l}</button>)}</div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:14}}><SC label={t.interestDebt} value={fmt(intT)} color={th.neg}/><SC label={t.interestFreeDebt} value={fmt(client.cards.filter(c=>c.apr===0).reduce((s,c)=>s+c.balance,0))} color={th.pos}/><SC label="Monthly Interest" value={fmtD(moCost)} color={th.warn}/></div>
    <table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr><STH k="name">Card</STH><STH k="apr" right>APR</STH><STH k="balance" right>Balance</STH><th style={mTHR(th)}>{t.minPay}</th><STH k="limit" right>Limit</STH><th style={mTHR(th)}>Payoff</th><th/></tr></thead>
      <tbody>{sorted.map((c,idx)=>{const pm=payoffM(c.balance,c.apr,c.min),open=expPromo===c.id;return[<tr key={c.id}><td style={{...mTD(th),fontWeight:600}}><div style={{display:"flex",alignItems:"center",gap:4,flexWrap:"wrap"}}>{idx===0&&c.apr>0&&<Pill color={th.neg}>🎯</Pill>}<span>{c.name}</span>{c.promo&&<button onClick={()=>setExpPromo(open?null:c.id)} style={{fontSize:9,padding:"1px 6px",borderRadius:4,background:"#8B5CF622",color:"#8B5CF6",border:"1px solid #8B5CF633",cursor:"pointer"}}>PROMO</button>}{c.apr===0&&<Pill color={th.pos}>0%</Pill>}</div></td><td style={{...mTDR(th),color:c.apr>0?th.warn:th.pos}}>{c.apr>0?c.apr+"%":"—"}</td><td style={{...mTDR(th),fontWeight:700,color:c.apr>0?th.neg:th.pos}}>{fmt(c.balance)}</td><td style={{...mTDR(th),fontWeight:700,color:GOLD}}>{fmtD(c.min)}</td><td style={{...mTDR(th),color:th.muted,fontSize:11}}>{c.limit?fmt(c.limit):"—"}</td><td style={{...mTDR(th),color:th.dim,fontSize:11}}>{payoffL(pm)}</td><td style={mTDR(th)}><Btn small onClick={()=>setModal(c)}>{t.editLabel}</Btn></td></tr>,open&&c.promo?<tr key={c.id+"p"}><td colSpan={7} style={{...mTD(th),paddingLeft:20,background:"#8B5CF611",borderTop:"none",fontSize:11,color:"#8B5CF6"}}>Promo: {fmt(c.promoBalance)} at {c.promoRate}% · ends {c.promoEnd?new Date(c.promoEnd).toLocaleDateString("en-US",{month:"short",year:"numeric"}):"—"}</td></tr>:null];})}
        <InlineAddRow cols={[{key:"name",placeholder:"Card / Loan"},{key:"apr",placeholder:"APR %",numeric:true},{key:"balance",placeholder:"Balance",numeric:true},{key:"min",placeholder:"Min pay",numeric:true},{key:"limit",placeholder:"Limit",numeric:true}]} onSave={vals=>{if(!vals.name||!vals.balance)return false;save({id:genId(),name:vals.name,balance:+vals.balance,apr:+vals.apr||0,min:+vals.min||0,limit:+vals.limit||0,promo:false});return true;}}/>
      </tbody><tfoot><tr style={{borderTop:`2px solid ${GOLD}44`}}><td style={{paddingTop:10,fontSize:11,color:th.dim}}>Totals</td><td/><td style={{...mTDR(th),paddingTop:10,fontWeight:800,color:th.neg,fontSize:14}}>{fmt(client.cards.reduce((s,c)=>s+c.balance,0))}</td><td style={{...mTDR(th),paddingTop:10,fontWeight:800,color:GOLD}}>{fmtD(sumMin(client.cards))}</td><td/><td/><td/></tr></tfoot></table>
  </div>;
}

// ── CUSTOM ASSETS SECTION ─────────────────────────────────────────────────────
function CustomAssetsSection({client,onUpdate,t}){
  const th=useTh();const[modal,setModal]=useState(null);
  const assets=Array.isArray(client.customAssets)?client.customAssets:[];
  const total=assets.reduce((s,a)=>s+(+a.value||0),0);
  const save=a=>{const ex=assets.find(x=>x.id===a.id);onUpdate({...client,customAssets:ex?assets.map(x=>x.id===a.id?a:x):[...assets,a]});setModal(null);};
  const del=id=>{onUpdate({...client,customAssets:assets.filter(x=>x.id!==id)});setModal(null);};
  const catColors={"Real Estate":th.pos,"Vehicle":th.blue,"Precious Metals":GOLD,"Business":"#8B5CF6","Investment":"#06B6D4","Retirement":"#F97316","Collectible":"#EC4899","Other":th.muted};
  const catIcons={"Real Estate":"🏠","Vehicle":"🚗","Precious Metals":"🥇","Business":"🏢","Investment":"📈","Retirement":"🎯","Collectible":"🖼️","Other":"💼"};
  return<div>
    {modal&&<AssetModal asset={modal==="new"?null:modal} onSave={save} onDelete={modal!=="new"?()=>del(modal.id):null} onClose={()=>setModal(null)} t={t}/>}
    <SHdr label={t.customAssets} right={<Btn small onClick={()=>setModal("new")}>+ {t.addAsset}</Btn>}/>
    {assets.length===0&&<div style={{fontSize:12,color:th.dim,padding:"12px 0",fontStyle:"italic"}}>No physical assets yet.</div>}
    <div style={{display:"flex",flexDirection:"column",gap:8}}>
      {assets.map(a=><div key={a.id} style={{...mCARD(th),padding:"10px 14px",display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:32,height:32,borderRadius:8,background:(catColors[a.cat]||th.muted)+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{catIcons[a.cat]||"💼"}</div>
        <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13,color:th.text}}>{a.name}</div>{a.desc&&<div style={{fontSize:11,color:th.muted,marginTop:1}}>{a.desc}</div>}<div style={{marginTop:3}}><Pill color={catColors[a.cat]||th.muted}>{a.cat}</Pill></div></div>
        <div style={{textAlign:"right"}}><div style={{fontSize:16,fontWeight:800,color:th.pos}}>{fmt(+a.value||0)}</div><Btn small onClick={()=>setModal(a)} style={{marginTop:4}}>{t.editLabel}</Btn></div>
      </div>)}
    </div>
    {assets.length>0&&<div style={{display:"flex",justifyContent:"flex-end",gap:12,paddingTop:12,marginTop:8,borderTop:`1px solid ${GOLD}44`}}><span style={{fontSize:11,color:th.muted}}>Total</span><span style={{fontWeight:800,fontSize:15,color:th.pos}}>{fmt(total)}</span></div>}
  </div>;
}

// ── SAVINGS SECTION ───────────────────────────────────────────────────────────
function SavingsSection({client,onUpdate,t}){
  const th=useTh();const[assets,setA]=useState({...client.assets});const[liabs,setL]=useState({...client.liabilities});const[alloc,setAl]=useState({...client.alloc});const[efM,setEfM]=useState(client.efMonths||3);const[dirty,setDirty]=useState(false);
  useEffect(()=>{setA({...client.assets});setL({...client.liabilities});setAl({...client.alloc});setEfM(client.efMonths||3);setDirty(false);},[client.id]);// eslint-disable-line
  const ua=k=>e=>{setA(p=>({...p,[k]:+e.target.value||0}));setDirty(true);};const ul=k=>e=>{setL(p=>({...p,[k]:+e.target.value||0}));setDirty(true);};const ual=k=>e=>{setAl(p=>({...p,[k]:Math.min(100,Math.max(0,+e.target.value||0))}));setDirty(true);};
  const customTotal=Array.isArray(client.customAssets)?client.customAssets.reduce((s,a)=>s+(+a.value||0),0):0;
  const tA=Object.values(assets).reduce((s,v)=>s+v,0)+customTotal,tL=Object.values(liabs).reduce((s,v)=>s+v,0);
  const liquid=assets.checking+assets.savings,efTarget=sumBills(client.bills)*(efM||3),efPct=Math.min(100,efTarget>0?liquid/efTarget*100:0);
  const net=sumNet(client.incomeStreams),bills=sumBills(client.bills),minD=sumMin(client.cards),avail=net-bills-minD;
  const allocItems=[{k:"stocks",l:"Stocks",c:th.blue},{k:"retirement",l:"Retirement",c:"#8B5CF6"},{k:"realEstate",l:"Real Estate",c:th.pos},{k:"savings",l:"Savings",c:"#06B6D4"},{k:"vacation",l:"Vacation",c:th.warn},{k:"other",l:"Other",c:th.muted}];
  const totalPct=Object.values(alloc).reduce((s,v)=>s+v,0);
  const AI=({label,k,val,fn})=><div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}><span style={{fontSize:12,color:th.muted,flex:1}}>{label}</span><input type="number" min={0} onKeyDown={blockE} value={val} onChange={fn(k)} style={{...mIIN(th),width:100,textAlign:"right"}}/></div>;
  const INP=mINP(th);
  return<div>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}><span style={{fontSize:12,fontWeight:700,color:th.accent,letterSpacing:"0.08em",textTransform:"uppercase"}}>{t.savings}</span>{dirty&&<BtnSolid onClick={()=>{onUpdate({...client,assets,liabilities:liabs,alloc,efMonths:efM});setDirty(false);}}>{t.save} ✓</BtnSolid>}</div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
      <div style={{...mCARD(th),padding:14}}><div style={{fontSize:11,fontWeight:700,color:th.dim,marginBottom:10}}>{t.assets.toUpperCase()}</div>
        <AI label={t.checking} k="checking" val={assets.checking} fn={ua}/><AI label={t.savings2} k="savings" val={assets.savings} fn={ua}/><AI label="Retirement" k="retirement" val={assets.retirement} fn={ua}/><AI label={t.vehicle} k="vehicle" val={assets.vehicle} fn={ua}/><AI label={t.realEstate2} k="realEstate" val={assets.realEstate} fn={ua}/>
        {customTotal>0&&<div style={{fontSize:11,color:th.dim,paddingTop:6,marginTop:4,borderTop:`1px solid ${th.cardBorder}`}}>Physical Assets: <span style={{color:th.pos,fontWeight:700}}>{fmt(customTotal)}</span></div>}
        <div style={{borderTop:`1px solid ${th.cardBorder}`,marginTop:10,paddingTop:10,display:"flex",justifyContent:"space-between"}}><span style={{fontSize:12,fontWeight:700,color:th.text}}>{t.totalAssets}</span><span style={{fontSize:14,fontWeight:800,color:th.pos}}>{fmt(tA)}</span></div></div>
      <div style={{...mCARD(th),padding:14}}><div style={{fontSize:11,fontWeight:700,color:th.dim,marginBottom:10}}>{t.liabilities.toUpperCase()}</div>
        <AI label={t.creditCards} k="creditCards" val={liabs.creditCards} fn={ul}/><AI label={t.vehicleLoan} k="vehicle" val={liabs.vehicle} fn={ul}/><AI label={t.studentLoan} k="student" val={liabs.student} fn={ul}/><AI label={t.personalLoan} k="personal" val={liabs.personal} fn={ul}/>
        <div style={{borderTop:`1px solid ${th.cardBorder}`,marginTop:10,paddingTop:10}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:12,fontWeight:700}}>{t.totalLiabilities}</span><span style={{fontSize:14,fontWeight:800,color:th.neg}}>{fmt(tL)}</span></div><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:12,color:th.muted}}>{t.netWorth}</span><span style={{fontSize:14,fontWeight:800,color:tA-tL>=0?th.pos:th.neg}}>{fmt(tA-tL)}</span></div></div></div>
    </div>
    <div style={{...mCARD(th),padding:14,marginBottom:14}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}><span style={{fontSize:11,fontWeight:700,color:th.dim}}>{(t.efTarget||"Emergency Fund").toUpperCase()}</span><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:11,color:th.dim}}>Target:</span><select value={efM} onChange={e=>{setEfM(+e.target.value);setDirty(true);}} style={{...mIIN(th),width:88,padding:"3px 8px"}}>{[1,3,6].map(n=><option key={n} value={n}>{n} months</option>)}</select></div></div>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:8}}><span style={{color:th.muted}}>Liquid: {fmt(liquid)}</span><span style={{color:th.muted}}>Target: {fmt(efTarget)}</span><span style={{color:th.muted}}>Gap: {fmt(Math.max(0,efTarget-liquid))}</span></div>
      <div style={{background:th.cardBorder,borderRadius:99,height:8,overflow:"hidden"}}><div style={{height:"100%",borderRadius:99,width:`${efPct}%`,background:efPct>=100?th.pos:th.warn,transition:"width 0.4s"}}/></div>
      <div style={{fontSize:11,marginTop:4,color:efPct>=100?th.pos:th.warn}}>{efPct.toFixed(0)}% funded · {efM}-month target</div>
    </div>
    <div style={{...mCARD(th),padding:14}}>
      <div style={{fontSize:11,fontWeight:700,color:th.dim,marginBottom:12,display:"flex",justifyContent:"space-between"}}><span>INVESTMENT ALLOCATION</span><span style={{color:Math.abs(totalPct-100)<1?th.pos:th.warn}}>{totalPct}%{Math.abs(totalPct-100)<1?" ✓":" ≠ 100%"}</span></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div><div style={{fontSize:11,color:th.dim,marginBottom:8}}>Available: <span style={{color:avail>=0?th.pos:th.neg,fontWeight:700}}>{fmt(avail)}/mo</span></div>{allocItems.map(a=><div key={a.k} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><div style={{width:8,height:8,borderRadius:99,background:a.c,flexShrink:0}}/><span style={{flex:1,fontSize:12,color:th.muted}}>{a.l}</span><input type="number" min={0} max={100} onKeyDown={blockE} value={alloc[a.k]} onChange={ual(a.k)} style={{...mIIN(th),width:44,textAlign:"right"}}/><span style={{fontSize:11,color:th.dim}}>%</span><span style={{fontSize:12,fontWeight:700,color:th.text,width:56,textAlign:"right"}}>{fmt(avail*(alloc[a.k]/100))}</span></div>)}</div>
        <ResponsiveContainer width="100%" height={180}><PieChart><Pie data={allocItems.map(a=>({name:a.l,value:alloc[a.k],color:a.c}))} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={2} dataKey="value">{allocItems.map((a,i)=><Cell key={i} fill={a.c} stroke="none"/>)}</Pie></PieChart></ResponsiveContainer>
      </div>
    </div>
  </div>;
}

// ── NOTES & INTAKE ────────────────────────────────────────────────────────────
function NotesSection({client,onUpdate,t}){
  const th=useTh();const[f,setF]=useState({...client.notes||{}});const[saved,setSaved]=useState(false);
  const u=k=>e=>setF(p=>({...p,[k]:e.target.value}));const save=()=>{onUpdate({...client,notes:f});setSaved(true);setTimeout(()=>setSaved(false),2000);};
  const TA=({label,k})=><Field label={label}><textarea value={f[k]||""} onChange={u(k)} style={{...mINP(th),height:80,resize:"vertical",lineHeight:1.6}} placeholder="Notes…"/></Field>;
  return<div><SHdr label={t.notes} right={<div style={{display:"flex",gap:8,alignItems:"center"}}>{saved&&<span style={{fontSize:11,color:th.pos}}>✓ Saved</span>}<BtnSolid onClick={save}>{t.save}</BtnSolid></div>}/><TA label={t.clientGoals} k="goals"/><TA label={t.shortTerm} k="shortTerm"/><TA label={t.midTerm} k="midTerm"/><TA label={t.longTerm} k="longTerm"/><TA label={t.setbacks} k="setbacks"/><TA label={t.generalNotes} k="general"/></div>;
}
function IntakeSection({client,onUpdate,t}){
  const th=useTh();const[saved,setSaved]=useState(false);
  const[pf,setPf]=useState({firstName:client.firstName||"",lastName:client.lastName||"",partnerFirst:client.partnerFirst||"",partnerLast:client.partnerLast||"",email:client.email||"",phone:client.phone||"",address:client.address||"",dob:client.dob||"",social:client.social||"",clientType:client.clientType||"financeOnly",recommendedBy:client.recommendedBy||""});
  const up=k=>e=>setPf(p=>({...p,[k]:e.target.value}));
  const saveAll=()=>{onUpdate({...client,...pf,partnerFirst:pf.partnerFirst||null,partnerLast:pf.partnerLast||null});setSaved(true);setTimeout(()=>setSaved(false),2000);};
  const INP=mINP(th);const Div=()=><div style={{height:1,background:th.cardBorder,margin:"24px 0"}}/>;
  return<div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><span style={{fontSize:12,fontWeight:700,color:th.accent,letterSpacing:"0.08em",textTransform:"uppercase"}}>{t.intake}</span><div style={{display:"flex",gap:8}}>{saved&&<span style={{fontSize:11,color:th.pos,alignSelf:"center"}}>✓ Saved</span>}<BtnSolid onClick={saveAll}>{t.save} All</BtnSolid></div></div>
    <div style={{background:th.accent+"11",border:`1px solid ${th.accent}33`,borderRadius:8,padding:"8px 12px",fontSize:11,color:th.muted,marginBottom:16}}>ℹ {t.intakeNote}</div>
    <div style={{fontSize:11,fontWeight:700,color:th.muted,marginBottom:12}}>PERSONAL INFORMATION</div>
    <Row2><Field label={t.firstName}><input style={INP} value={pf.firstName} onChange={up("firstName")}/></Field><Field label={t.lastName}><input style={INP} value={pf.lastName} onChange={up("lastName")}/></Field></Row2>
    <Row2><Field label={t.partnerFirst}><input style={INP} value={pf.partnerFirst} onChange={up("partnerFirst")} placeholder="Leave blank if single"/></Field><Field label={t.partnerLast}><input style={INP} value={pf.partnerLast} onChange={up("partnerLast")}/></Field></Row2>
    <Row2><Field label={t.email}><input style={INP} value={pf.email} onChange={up("email")}/></Field><Field label={t.phone}><input style={INP} value={pf.phone} placeholder="(305) 555-0000" onChange={e=>setPf(p=>({...p,phone:formatPhone(e.target.value)}))}/></Field></Row2>
    <Field label={t.address}><input style={INP} value={pf.address} onChange={up("address")}/></Field>
    <Row2><Field label={t.dob}><input type="date" style={INP} value={pf.dob} onChange={up("dob")}/></Field><Field label={t.social}><SSNInput value={pf.social} onChange={up("social")} t={t}/></Field></Row2>
    <Row2><Field label={t.clientType}><select style={INP} value={pf.clientType} onChange={up("clientType")}><option value="financeOnly">{t.financeOnly}</option><option value="financeAndHealth">{t.financeAndHealth}</option></select></Field><Field label={t.recommendedBy}><input style={INP} value={pf.recommendedBy} onChange={up("recommendedBy")}/></Field></Row2>
    <Div/><div style={{fontSize:11,fontWeight:700,color:th.muted,marginBottom:12}}>{t.income.toUpperCase()}</div><IncomeSection client={client} onUpdate={onUpdate} t={t}/>
    <Div/><div style={{fontSize:11,fontWeight:700,color:th.muted,marginBottom:12}}>{t.bills.toUpperCase()}</div><BillsSection client={client} onUpdate={onUpdate} t={t}/>
    <Div/><div style={{fontSize:11,fontWeight:700,color:th.muted,marginBottom:12}}>{t.debt.toUpperCase()}</div><DebtSection client={client} onUpdate={onUpdate} t={t}/>
    <Div/><div style={{fontSize:11,fontWeight:700,color:th.muted,marginBottom:12}}>{t.customAssets.toUpperCase()}</div><CustomAssetsSection client={client} onUpdate={onUpdate} t={t}/>
    <Div/><SavingsSection key={client.id+"-sv"} client={client} onUpdate={onUpdate} t={t}/>
    <Div/><NotesSection client={client} onUpdate={onUpdate} t={t}/>
    <div style={{position:"sticky",bottom:0,background:th.nav,borderTop:`1px solid ${th.cardBorder}`,padding:"12px 0",display:"flex",justifyContent:"flex-end",gap:8,marginTop:24}}>{saved&&<span style={{fontSize:11,color:th.pos,alignSelf:"center"}}>✓ Saved</span>}<BtnSolid onClick={saveAll}>{t.save} All Changes</BtnSolid></div>
  </div>;
}

// ── SUMMARY ───────────────────────────────────────────────────────────────────
function SummarySection({client,lang,t}){
  const th=useTh();const net=sumNet(client.incomeStreams),bills=sumBills(client.bills),minD=sumMin(client.cards),cash=net-bills-minD,dsr=net>0?minD/net:0;
  const snaps=client.monthSnapshots||[];const trend=[...snaps.slice(-5),{label:client.currentMonthLabel||"Now",debt:Math.round(client.cards.reduce((s,c)=>s+c.balance,0)),savings:Math.round(client.assets.checking+client.assets.savings)}];
  const pie=[{name:"Bills",value:Math.round(bills),color:th.neg},{name:"Min Debt",value:Math.round(minD),color:th.warn},{name:"Cash Flow",value:Math.round(Math.max(0,cash)),color:th.pos}];
  const recs=[];
  if(dsr>0.5)recs.push({type:"critical",en:`⚠ Debt payments consume ${(dsr*100).toFixed(0)}% of income. Immediate restructuring needed.`,es:`⚠ Pagos consumen el ${(dsr*100).toFixed(0)}% del ingreso.`});
  else if(dsr>0.36)recs.push({type:"warning",en:`Debt service ratio ${(dsr*100).toFixed(0)}% exceeds 36%.`,es:`Ratio deuda ${(dsr*100).toFixed(0)}% supera 36%.`});
  if(cash<300)recs.push({type:"warning",en:`Cash flow ${fmt(cash)}/mo is tight.`,es:`Flujo ${fmt(cash)}/mes muy ajustado.`});
  else recs.push({type:"good",en:`Cash flow ${fmt(cash)}/mo is healthy.`,es:`Flujo ${fmt(cash)}/mes saludable.`});
  return<div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:10,marginBottom:16}}><SC label={t.totalIncome} value={fmt(net)} color={th.pos}/><SC label={t.totalBills} value={fmt(bills)} color={th.neg}/><SC label={t.minPay} value={fmt(minD)} color={th.warn}/><SC label={t.cashFlow} value={fmt(cash)} color={cash>=0?th.pos:th.neg}/></div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
      <div style={{...mCARD(th),padding:12}}><div style={{fontSize:11,fontWeight:700,color:th.dim,marginBottom:8}}>WHERE INCOME GOES</div>
        <ResponsiveContainer width="100%" height={130}><PieChart><Pie data={pie} cx="50%" cy="50%" innerRadius={36} outerRadius={58} paddingAngle={2} dataKey="value">{pie.map((e,i)=><Cell key={i} fill={e.color} stroke="none"/>)}</Pie><ReTip contentStyle={{background:th.nav,border:`1px solid ${th.cardBorder}`,borderRadius:8,fontSize:11}} formatter={v=>fmt(v)}/></PieChart></ResponsiveContainer>
        <div style={{display:"flex",justifyContent:"center",gap:10,flexWrap:"wrap"}}>{pie.map(d=><div key={d.name} style={{display:"flex",alignItems:"center",gap:4,fontSize:11}}><div style={{width:8,height:8,borderRadius:99,background:d.color}}/><span style={{color:th.muted}}>{d.name}: <span style={{color:d.color,fontWeight:700}}>{fmt(d.value)}</span></span></div>)}</div>
      </div>
      {trend.length>1&&<div style={{...mCARD(th),padding:12}}><div style={{fontSize:11,fontWeight:700,color:th.dim,marginBottom:8}}>{t.debtTrend}</div>
        <ResponsiveContainer width="100%" height={130}><BarChart data={trend} barGap={2} margin={{top:18,right:0,left:0,bottom:0}}><XAxis dataKey="label" tick={{fontSize:8,fill:th.dim}} axisLine={false} tickLine={false}/><YAxis hide/><ReTip contentStyle={{background:th.nav,border:`1px solid ${th.cardBorder}`,borderRadius:8,fontSize:11}} formatter={v=>fmt(v)}/><Bar dataKey="debt" name="Debt" fill={th.neg+"88"} radius={[2,2,0,0]}><LabelList dataKey="debt" position="top" formatter={v=>v>0?fmtShort(v):""} style={{fontSize:8,fill:th.dim}}/></Bar><Bar dataKey="savings" name="Savings" fill={th.pos+"88"} radius={[2,2,0,0]}><LabelList dataKey="savings" position="top" formatter={v=>v>0?fmtShort(v):""} style={{fontSize:8,fill:th.dim}}/></Bar></BarChart></ResponsiveContainer>
        <div style={{display:"flex",gap:10,marginTop:4}}><div style={{display:"flex",alignItems:"center",gap:4,fontSize:10}}><div style={{width:8,height:8,borderRadius:2,background:th.neg}}/><span style={{color:th.dim}}>Debt</span></div><div style={{display:"flex",alignItems:"center",gap:4,fontSize:10}}><div style={{width:8,height:8,borderRadius:2,background:th.pos}}/><span style={{color:th.dim}}>Savings</span></div></div>
      </div>}
    </div>
    <div style={{fontSize:11,fontWeight:700,color:th.dim,marginBottom:8}}>{t.advisorRec}</div>
    {recs.map((r,i)=>{const c=r.type==="critical"?th.neg:r.type==="warning"?th.warn:th.pos;return<div key={i} style={{background:c+"11",border:`1px solid ${c}33`,borderRadius:8,padding:"10px 12px",fontSize:12,color:c,lineHeight:1.6,marginBottom:8}}>{r[lang]||r.en}</div>;})}
  </div>;
}

// ── MONTHLY + HISTORY ─────────────────────────────────────────────────────────
function NewMonthModal({client,onSave,onClose,t}){
  const th=useTh();const now=new Date();const[yr,setYr]=useState(now.getFullYear());const[mo,setMo]=useState(now.getMonth());
  const snaps=client.monthSnapshots||[];const net=sumNet(client.incomeStreams),bills=sumBills(client.bills),minD=sumMin(client.cards),debt=client.cards.reduce((s,c)=>s+c.balance,0);
  const snap={label:`${MONTHS_SHORT[mo]} ${yr}`,year:yr,month:mo+1,income:Math.round(net),bills:Math.round(bills),debt:Math.round(debt),savings:Math.round(client.assets.checking+client.assets.savings),cashFlow:Math.round(net-bills-minD),data:{incomeStreams:[...client.incomeStreams],bills:[...client.bills],cards:[...client.cards],assets:{...client.assets},liabilities:{...client.liabilities},customAssets:[...(client.customAssets||[])]}};
  const existing=snaps.find(s=>s.label===snap.label);
  const doSave=()=>{const prevVersions=existing?(existing.previousVersions||[]).concat([{savedAt:existing.savedAt||"",income:existing.income,bills:existing.bills,debt:existing.debt,savings:existing.savings,cashFlow:existing.cashFlow,data:existing.data}]):[];onSave({...snap,savedAt:new Date().toISOString(),previousVersions:prevVersions});};
  const INP=mINP(th);
  return<Modal title={t.newMonthTitle} onClose={onClose}>
    <div style={{display:"flex",gap:8,marginBottom:14}}><select style={{...INP,flex:1}} value={mo} onChange={e=>setMo(+e.target.value)}>{MONTHS_LONG.map((m,i)=><option key={i} value={i}>{m}</option>)}</select><input type="number" style={{...INP,width:88}} value={yr} onChange={e=>setYr(+e.target.value)} min={2020} max={2040} onKeyDown={blockE}/></div>
    {existing&&<div style={{fontSize:11,color:th.warn,background:th.warn+"11",border:`1px solid ${th.warn}33`,borderRadius:8,padding:"8px 10px",marginBottom:12}}>⚠ {t.overwriteWarning}</div>}
    <div style={{...mCARD(th),padding:14,marginBottom:16}}>{[["Income",fmt(snap.income),th.pos],["Bills",fmt(snap.bills),th.neg],["Total Debt",fmt(snap.debt),th.warn],["Savings",fmt(snap.savings),th.blue],["Cash Flow",fmt(snap.cashFlow),snap.cashFlow>=0?th.pos:th.neg]].map(([l,v,c])=><div key={l} style={{display:"flex",justifyContent:"space-between",marginBottom:6,fontSize:12}}><span style={{color:th.muted}}>{l}</span><span style={{color:c,fontWeight:700}}>{v}</span></div>)}</div>
    <SaveBar onSave={doSave} onCancel={onClose} t={t}/>
  </Modal>;
}
function CompareModal({snapshots,onClose,t}){
  const th=useTh();const n=snapshots.length;const[sel,setSel]=useState(n>=2?[snapshots[n-2].label,snapshots[n-1].label]:[]);
  const toggle=l=>setSel(p=>p.includes(l)?p.filter(x=>x!==l):[...p,l]);const rows=snapshots.filter(s=>sel.includes(s.label));
  const fields=[{k:"income",l:"Income",c:th.pos},{k:"bills",l:"Bills",c:th.neg},{k:"debt",l:"Debt",c:th.warn},{k:"savings",l:"Savings",c:th.blue},{k:"cashFlow",l:"Cash Flow",c:GOLD}];
  return<Modal title={t.compareTitle} onClose={onClose} width={640}><div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:16}}>{snapshots.map(s=><button key={s.label} onClick={()=>toggle(s.label)} style={{fontSize:11,padding:"4px 12px",borderRadius:8,cursor:"pointer",background:sel.includes(s.label)?th.accent+"22":"transparent",color:sel.includes(s.label)?th.accent:th.muted,border:`1px solid ${sel.includes(s.label)?th.accent:th.cardBorder}`}}>{s.label}</button>)}</div>
    {rows.length>=2?<table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}><thead><tr><th style={mTH(th)}>Metric</th>{rows.map(r=><th key={r.label} style={mTHR(th)}>{r.label}</th>)}<th style={mTHR(th)}>Δ</th></tr></thead><tbody>{fields.map(f=>{const vals=rows.map(r=>r[f.k]||0);const ch=vals[vals.length-1]-vals[0];const pct=vals[0]?((ch/vals[0])*100).toFixed(1):0;return<tr key={f.k}><td style={{...mTD(th),color:f.c,fontWeight:600}}>{f.l}</td>{vals.map((v,i)=><td key={i} style={{...mTDR(th),color:f.c}}>{fmt(v)}</td>)}<td style={{...mTDR(th),color:ch>=0?th.pos:th.neg,fontWeight:700}}>{ch>=0?"+":""}{fmt(ch)} ({pct}%)</td></tr>;})}</tbody></table>:<div style={{textAlign:"center",padding:20,color:th.dim,fontSize:12}}>Select 2 months.</div>}
    <div style={{display:"flex",justifyContent:"flex-end",marginTop:16}}><Btn onClick={onClose}>{t.cancel}</Btn></div>
  </Modal>;
}
function VersionHistoryModal({snap,onRestore,onClose,t}){
  const th=useTh();const versions=snap.previousVersions||[];
  return<Modal title={`${t.versionHistory} — ${snap.label}`} onClose={onClose} width={540}>
    {versions.length===0?<div style={{textAlign:"center",padding:20,color:th.dim,fontSize:12}}>No previous versions yet.</div>:versions.slice().reverse().map((v,i)=><div key={i} style={{...mCARD(th),padding:14,marginBottom:10}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><span style={{fontSize:12,color:th.muted}}>{t.savedAt}: {v.savedAt?new Date(v.savedAt).toLocaleString("en-US",{month:"short",day:"numeric",year:"numeric",hour:"2-digit",minute:"2-digit"}):"Unknown"}</span><Btn small onClick={()=>{onRestore(v);onClose();}} color={th.pos}>{t.restoreVersion}</Btn></div>
      <div style={{display:"flex",gap:16,fontSize:11,flexWrap:"wrap"}}>{[["Income",v.income,th.pos],["Bills",v.bills,th.neg],["Debt",v.debt,th.warn],["Savings",v.savings,th.blue]].map(([l,val,c])=><div key={l}><span style={{color:th.dim}}>{l}: </span><span style={{color:c,fontWeight:700}}>{fmt(val)}</span></div>)}</div>
    </div>)}
    <div style={{display:"flex",justifyContent:"flex-end",marginTop:16}}><Btn onClick={onClose}>{t.cancel}</Btn></div>
  </Modal>;
}
function MonthDropdown({client,selected,onSelect,t}){
  const th=useTh();const[open,setOpen]=useState(false);const snaps=client.monthSnapshots||[];
  const byYear={};snaps.forEach(s=>{if(!byYear[s.year])byYear[s.year]=[];byYear[s.year].push(s);});
  return<div style={{position:"relative"}}><button onClick={()=>setOpen(o=>!o)} style={{fontSize:13,fontWeight:700,color:th.text,background:th.inp,border:`1px solid ${th.inpBorder}`,borderRadius:8,padding:"6px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:8}}>{selected} <span style={{color:th.dim,fontSize:10}}>▾</span></button>
    {open&&<div onClick={()=>setOpen(false)} style={{position:"fixed",inset:0,zIndex:99}}/>}
    {open&&<div style={{position:"absolute",top:"calc(100% + 4px)",left:0,background:th.nav,border:`1px solid ${th.cardBorder}`,borderRadius:10,padding:6,zIndex:100,minWidth:220,maxHeight:320,overflowY:"auto",boxShadow:"0 12px 40px #000a"}}>
      <button onClick={()=>{onSelect(client.currentMonthLabel||"Current");setOpen(false);}} style={{display:"block",width:"100%",textAlign:"left",padding:"7px 12px",fontSize:12,borderRadius:8,cursor:"pointer",background:selected===(client.currentMonthLabel||"Current")?th.accent+"22":"transparent",color:selected===(client.currentMonthLabel||"Current")?th.accent:th.text,border:"none",fontWeight:700}}>{client.currentMonthLabel||"Current"} <span style={{fontSize:10,color:th.pos}}>● active</span></button>
      {Object.entries(byYear).sort(([a],[b])=>+b-+a).map(([yr,sn])=><div key={yr}><div style={{fontSize:10,fontWeight:700,color:th.dim,padding:"6px 12px 2px"}}>{yr} ({sn.length})</div>{sn.slice().reverse().map(s=><button key={s.label} onClick={()=>{onSelect(s.label);setOpen(false);}} style={{display:"block",width:"100%",textAlign:"left",padding:"5px 12px 5px 20px",fontSize:12,borderRadius:8,cursor:"pointer",background:selected===s.label?th.accent+"22":"transparent",color:selected===s.label?th.accent:th.muted,border:"none",fontWeight:selected===s.label?700:400}}>{s.label}{s.data&&<span style={{fontSize:9,marginLeft:4,color:th.pos}}>●</span>}</button>)}</div>)}
      {snaps.length===0&&<div style={{fontSize:11,color:th.dim,padding:"8px 12px",fontStyle:"italic"}}>{t.noData}</div>}
    </div>}
  </div>;
}
function HistoricalView({snap,client,onUpdate,t}){
  const th=useTh();const[verModal,setVerModal]=useState(false);const snaps=client.monthSnapshots||[];const d=snap.data;
  const doRestore=v=>{const restored={...snap,...v,savedAt:v.savedAt};onUpdate({...client,monthSnapshots:snaps.map(s=>s.label===snap.label?restored:s)});};
  if(!d)return<div style={{...mCARD(th),padding:20}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><span style={{fontSize:14,color:th.muted}}>{snap.label} — Summary Only</span>{(snap.previousVersions||[]).length>0&&<Btn small onClick={()=>setVerModal(true)} color={th.warn}>{t.versionHistory}</Btn>}</div>{verModal&&<VersionHistoryModal snap={snap} onRestore={doRestore} onClose={()=>setVerModal(false)} t={t}/>}<div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10}}>{[["Income",snap.income,th.pos],["Bills",snap.bills,th.neg],["Debt",snap.debt,th.warn],["Savings",snap.savings,th.blue],["Cash Flow",snap.cashFlow,snap.cashFlow>=0?th.pos:th.neg]].map(([l,v,c])=><div key={l}><div style={{fontSize:10,color:th.dim,marginBottom:4}}>{l}</div><div style={{fontSize:15,fontWeight:800,color:c}}>{fmt(v)}</div></div>)}</div></div>;
  const netI=d.incomeStreams.reduce((s,i)=>s+toM(i.net,i.freq),0),tA=Object.values(d.assets||{}).reduce((s,v)=>s+v,0)+((d.customAssets||[]).reduce((s,a)=>s+(+a.value||0),0)),tL=Object.values(d.liabilities||{}).reduce((s,v)=>s+v,0);
  return<div>{verModal&&<VersionHistoryModal snap={snap} onRestore={doRestore} onClose={()=>setVerModal(false)} t={t}/>}
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,flex:1}}>{[["Income",fmt(netI),th.pos],["Bills",fmt(snap.bills),th.neg],["Debt",fmt(snap.debt),th.warn],["Net Worth",fmt(tA-tL),tA-tL>=0?th.pos:th.neg]].map(([l,v,c])=><div key={l} style={{...mCARD(th),padding:10,textAlign:"center"}}><div style={{fontSize:10,color:th.dim,marginBottom:3}}>{l}</div><div style={{fontSize:14,fontWeight:800,color:c}}>{v}</div></div>)}</div>
      {(snap.previousVersions||[]).length>0&&<Btn small onClick={()=>setVerModal(true)} color={th.warn} style={{marginLeft:10}}>{t.versionHistory} ({snap.previousVersions.length})</Btn>}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
      <div style={{...mCARD(th),padding:14}}><div style={{fontSize:11,fontWeight:700,color:th.dim,marginBottom:10}}>INCOME</div><table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}><thead><tr><th style={mTH(th)}>Source</th><th style={mTHR(th)}>Net/mo</th></tr></thead><tbody>{(d.incomeStreams||[]).map(s=><tr key={s.id}><td style={mTD(th)}>{s.label}</td><td style={{...mTDR(th),color:th.pos}}>{fmt(toM(s.net,s.freq))}</td></tr>)}</tbody></table></div>
      <div style={{...mCARD(th),padding:14}}><div style={{fontSize:11,fontWeight:700,color:th.dim,marginBottom:10}}>DEBT</div><table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}><thead><tr><th style={mTH(th)}>Card</th><th style={mTHR(th)}>Balance</th></tr></thead><tbody>{(d.cards||[]).map(c=><tr key={c.id}><td style={mTD(th)}>{c.name}</td><td style={{...mTDR(th),color:th.neg}}>{fmt(c.balance)}</td></tr>)}</tbody></table></div>
    </div>
  </div>;
}
function MonthlyTab({client,onUpdate,lang,t}){
  const th=useTh();const[sec,setSec]=useState("summary");const[nmOpen,setNmOpen]=useState(false);const[cmpOpen,setCmpOpen]=useState(false);
  const curLabel=client.currentMonthLabel||"Current";const[viewing,setViewing]=useState(curLabel);
  const snaps=client.monthSnapshots||[];const isCurrent=viewing===curLabel;const viewSnap=snaps.find(s=>s.label===viewing);
  const saveSnap=snap=>{const i=snaps.findIndex(s=>s.label===snap.label);const upd=i>=0?snaps.map((s,idx)=>idx===i?snap:s):[...snaps,snap];onUpdate({...client,monthSnapshots:upd});setNmOpen(false);};
  const secs=[{id:"summary",l:t.summary},{id:"income",l:t.income},{id:"bills",l:t.bills},{id:"debt",l:t.debt},{id:"savings",l:t.savings},{id:"customAssets",l:t.customAssets}];
  return<div>
    {nmOpen&&<NewMonthModal client={client} onSave={saveSnap} onClose={()=>setNmOpen(false)} t={t}/>}
    {cmpOpen&&snaps.length>=2&&<CompareModal snapshots={snaps} onClose={()=>setCmpOpen(false)} t={t}/>}
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}><MonthDropdown client={client} selected={viewing} onSelect={setViewing} t={t}/><div style={{display:"flex",gap:8}}>{snaps.length>=2&&<Btn small onClick={()=>setCmpOpen(true)}>↔ {t.compareMonths}</Btn>}<Btn small onClick={()=>setNmOpen(true)} color={th.pos}>+ {t.newMonth}</Btn></div></div>
    {!isCurrent&&viewSnap&&<><div style={{...mCARD(th),padding:12,marginBottom:14,display:"flex",alignItems:"center",justifyContent:"space-between"}}><span style={{fontSize:12,fontWeight:700,color:th.muted}}>📅 {viewSnap.label}</span><button onClick={()=>setViewing(curLabel)} style={{fontSize:11,padding:"3px 10px",borderRadius:8,background:"none",color:th.accent,border:`1px solid ${th.accent}`,cursor:"pointer"}}>← Back</button></div><HistoricalView snap={viewSnap} client={client} onUpdate={onUpdate} t={t}/></>}
    {isCurrent&&<><div style={{display:"flex",gap:6,marginBottom:14,overflowX:"auto",paddingBottom:4}}>{secs.map(s=><button key={s.id} onClick={()=>setSec(s.id)} style={{fontSize:11,padding:"5px 12px",borderRadius:8,whiteSpace:"nowrap",cursor:"pointer",background:sec===s.id?th.accent:"transparent",color:sec===s.id?"#fff":th.muted,fontWeight:sec===s.id?700:400,border:`1px solid ${sec===s.id?th.accent:th.cardBorder}`}}>{s.l}</button>)}</div>
      <div style={{background:th.bg+"99",border:`1px solid ${th.cardBorder}`,borderRadius:12,padding:18}}>
        {sec==="summary"&&<SummarySection client={client} lang={lang} t={t}/>}
        {sec==="income"&&<IncomeSection client={client} onUpdate={onUpdate} t={t}/>}
        {sec==="bills"&&<BillsSection client={client} onUpdate={onUpdate} t={t}/>}
        {sec==="debt"&&<DebtSection client={client} onUpdate={onUpdate} t={t}/>}
        {sec==="savings"&&<SavingsSection key={client.id+"-sv"} client={client} onUpdate={onUpdate} t={t}/>}
        {sec==="customAssets"&&<CustomAssetsSection client={client} onUpdate={onUpdate} t={t}/>}
      </div></>}
  </div>;
}

// ── RATIOS TAB ────────────────────────────────────────────────────────────────
function RatiosTab({client,lang,t}){
  const th=useTh();const tA=Object.values(client.assets).reduce((s,v)=>s+v,0)+(Array.isArray(client.customAssets)?client.customAssets.reduce((s,a)=>s+(+a.value||0),0):0),tL=Object.values(client.liabilities).reduce((s,v)=>s+v,0);
  const net=sumNet(client.incomeStreams),gross=sumGross(client.incomeStreams),bills=sumBills(client.bills),minD=sumMin(client.cards);
  const liquid=client.assets.checking+client.assets.savings,curL=client.liabilities.creditCards;
  const ratios=[{k:"currentRatio",v:curL>0?liquid/curL:999},{k:"dta",v:tA>0?tL/tA:0},{k:"dsr",v:net>0?minD/net:0},{k:"rsr",v:gross>0?(client.assets.retirement/12)/gross:0},{k:"efr",v:bills>0?liquid/bills:0}];
  const bm={currentRatio:"> 1.0x",dta:"< 40%",dsr:"< 36%",rsr:"> 12%",efr:`> ${client.efMonths} mo`};
  return<div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:20}}><SC label={t.totalAssets} value={fmt(tA)} color={th.pos}/><SC label={t.totalLiabilities} value={fmt(tL)} color={th.neg}/><SC label={t.netWorth} value={fmt(tA-tL)} color={tA-tL>=0?th.pos:th.neg}/></div>
    <div style={{display:"flex",flexDirection:"column",gap:10}}>{ratios.map(r=>{const meta=RATIOS_META[r.k];return<div key={r.k} style={{...mCARD(th),padding:"14px 16px"}}><div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}><div style={{display:"flex",alignItems:"center"}}><span style={{fontSize:13,fontWeight:700,color:th.text}}>{t[r.k]}</span><InfoTip text={meta[lang]||meta.en}/></div><div style={{display:"flex",alignItems:"center",gap:12}}><span style={{fontSize:11,color:th.dim}}>{t.benchmark}: {bm[r.k]}</span><span style={{fontSize:16,fontWeight:800,color:th.accent}}>{meta.fmt(r.v)}</span><StatusBadge value={r.v} meta={meta} t={t}/></div></div></div>;})}
    </div>
  </div>;
}

// ── INVESTMENTS TAB (ticker swap + alt package swap) ─────────────────────────
function InvestmentsTab({client,onUpdate,t}){
  const th=useTh();const[sel,setSel]=useState("growth");const[monthly,setMonthly]=useState(300);const[years,setYears]=useState(10);
  const[showAdd,setShowAdd]=useState(false);const[nh,setNh]=useState({ticker:"",alt:"",name:"",pct:"0",desc:""});
  const[showAlt,setShowAlt]=useState(false);// global alt ticker toggle
  const custom=client.portfolioCustom||{holdings:[]};const p=PORTFOLIOS[sel];
  const r=p.ret/100/12;const n=years*12;const fv=monthly>0?(monthly*((Math.pow(1+r,n)-1)/r)):0;const contrib=monthly*n;
  const allHoldings=[...p.holdings,...(custom.holdings||[])];
  const addH=()=>{if(!nh.ticker.trim()){alert("Ticker required.");return;}const h={id:genId(),ticker:nh.ticker.trim().toUpperCase(),alt:nh.alt.trim().toUpperCase(),name:nh.name.trim(),pct:parseFloat(nh.pct)||0,desc:nh.desc.trim()};onUpdate({...client,portfolioCustom:{...custom,holdings:[...(custom.holdings||[]),h]}});setNh({ticker:"",alt:"",name:"",pct:"0",desc:""});setShowAdd(false);};
  const delH=id=>onUpdate({...client,portfolioCustom:{...custom,holdings:(custom.holdings||[]).filter(h=>h.id!==id)}});
  // Add single stock from alt pack
  const addAltStock=s=>onUpdate({...client,portfolioCustom:{...custom,holdings:[...(custom.holdings||[]),{id:genId(),ticker:s.ticker,alt:s.alt,name:s.name,pct:s.pct,desc:s.desc}]}});
  // Use entire alt package (replaces custom holdings)
  const useAltPack=pack=>onUpdate({...client,portfolioCustom:{...custom,holdings:pack.stocks.map(s=>({id:genId(),ticker:s.ticker,alt:s.alt,name:s.name,pct:s.pct,desc:s.desc}))}});
  const INP=mINP(th);const tickerOf=h=>showAlt&&h.alt?h.alt:h.ticker;
  return<div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:20}}>{Object.entries(PORTFOLIOS).map(([k,port])=><button key={k} onClick={()=>setSel(k)} style={{...mCARD(th),padding:14,textAlign:"left",cursor:"pointer",background:sel===k?port.color+"22":th.card,border:`1px solid ${sel===k?port.color:th.cardBorder}`}}><div style={{fontSize:11,fontWeight:700,color:sel===k?port.color:th.muted,marginBottom:4}}>{t[port.nameKey]||port.nameKey}</div><div style={{fontSize:22,fontWeight:800,color:sel===k?port.color:th.dim}}>{port.ret}%</div><div style={{fontSize:10,color:th.dim}}>Expected annual return</div><Pill color={port.color}>{port.risk} Risk</Pill></button>)}</div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
      <div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <span style={{fontSize:11,fontWeight:700,color:th.dim}}>{(t.holdings||"Holdings").toUpperCase()}</span>
          <div style={{display:"flex",gap:6}}>
            <button onClick={()=>setShowAlt(s=>!s)} style={{fontSize:11,padding:"3px 10px",borderRadius:7,cursor:"pointer",background:showAlt?th.accent+"22":"transparent",color:showAlt?th.accent:th.muted,border:`1px solid ${showAlt?th.accent:th.cardBorder}`}}>{showAlt?(t.showMainTicker||"Main"):(t.showAltTicker||"Alt")}</button>
            <Btn small onClick={()=>setShowAdd(s=>!s)}>+ {t.addStock}</Btn>
          </div>
        </div>
        {allHoldings.map((h,i)=><div key={(h.id||h.ticker)+i} style={{...mCARD(th),padding:"10px 12px",marginBottom:8,display:"flex",alignItems:"flex-start",gap:10}}>
          <div style={{width:6,height:6,borderRadius:99,background:PCOLS[i%PCOLS.length],marginTop:5,flexShrink:0}}/>
          <div style={{flex:1}}><div style={{fontSize:12,fontWeight:700,color:th.text}}><span style={{color:PCOLS[i%PCOLS.length]}}>{tickerOf(h)}</span>{h.alt&&<span style={{fontSize:10,color:th.dim,marginLeft:4}}>({showAlt?h.ticker:h.alt})</span>} — {h.name}</div>{h.desc&&<div style={{fontSize:11,color:th.muted,marginTop:2}}>{h.desc}</div>}</div>
          <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:12,fontWeight:700,color:PCOLS[i%PCOLS.length]}}>{h.pct}%</span>{h.id&&<button onClick={()=>delH(h.id)} style={{fontSize:10,padding:"1px 6px",borderRadius:4,background:"#EF444422",color:"#EF4444",border:"none",cursor:"pointer"}}>×</button>}</div>
        </div>)}
        {showAdd&&<div style={{...mCARD(th),padding:14,marginTop:8}}>
          <div style={{fontSize:12,fontWeight:700,color:th.text,marginBottom:12}}>Add Custom Holding</div>
          <Row2><Field label="Ticker *"><input style={INP} value={nh.ticker} onChange={e=>setNh(p=>({...p,ticker:e.target.value}))}/></Field><Field label="Alt Ticker"><input style={INP} value={nh.alt} onChange={e=>setNh(p=>({...p,alt:e.target.value}))}/></Field></Row2>
          <Row2><Field label="Name"><input style={INP} value={nh.name} onChange={e=>setNh(p=>({...p,name:e.target.value}))}/></Field><Field label="Allocation %"><input type="number" min={0} max={100} onKeyDown={blockE} style={INP} value={nh.pct} onChange={e=>setNh(p=>({...p,pct:e.target.value}))}/></Field></Row2>
          <Field label="Description"><input style={INP} value={nh.desc} onChange={e=>setNh(p=>({...p,desc:e.target.value}))}/></Field>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:8}}><Btn onClick={()=>setShowAdd(false)}>{t.cancel}</Btn><BtnSolid onClick={addH}>{t.addStock}</BtnSolid></div>
        </div>}
        <div style={{fontSize:11,fontWeight:700,color:th.dim,marginTop:14,marginBottom:8}}>{t.altPackages||"Alternative Packages"}</div>
        {ALT_PACKS.map(pk=><details key={pk.id} style={{...mCARD(th),padding:"8px 12px",marginBottom:6}}><summary style={{fontSize:12,fontWeight:700,color:th.muted,cursor:"pointer",listStyle:"none",display:"flex",justifyContent:"space-between",alignItems:"center"}}><span>{pk.label}</span><Btn small onClick={e=>{e.preventDefault();useAltPack(pk);}} color={th.warn}>{t.usePackage||"Use Package"}</Btn></summary>
          <div style={{marginTop:10}}>{pk.stocks.map(s=><div key={s.ticker} style={{marginBottom:8,fontSize:11,display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}><div><span style={{fontWeight:700,color:th.text}}>{showAlt&&s.alt?s.alt:s.ticker}</span><span style={{color:th.dim}}> / {showAlt?s.ticker:s.alt}</span> — {s.name}<br/><span style={{color:th.dim}}>{s.desc}</span></div><Btn small onClick={()=>addAltStock(s)}>{t.addToPortfolio||"+ Add"}</Btn></div>)}</div>
        </details>)}
      </div>
      <div>
        <div style={{fontSize:11,fontWeight:700,color:th.dim,marginBottom:10}}>PROJECTION</div>
        <Field label={t.monthlyInvest}><input type="number" min={0} onKeyDown={blockE} value={monthly} onChange={e=>setMonthly(Math.max(0,+e.target.value||0))} style={INP}/></Field>
        <div style={{marginBottom:14}}><label style={{fontSize:11,color:th.muted,display:"block",marginBottom:5}}>{t.years}: <span style={{fontWeight:700,color:th.text}}>{years}</span></label><input type="range" min={1} max={30} step={1} value={years} onChange={e=>{const v=parseInt(e.target.value,10);if(!isNaN(v))setYears(v);}} style={{width:"100%",accentColor:th.accent,cursor:"pointer",height:6}}/><div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:th.dim,marginTop:2}}><span>1 yr</span><span>30 yr</span></div></div>
        <div style={{...mCARD(th),padding:14,marginBottom:16}}>{[{l:t.contributed||"Contributed",v:fmt(contrib),c:th.muted},{l:t.growthLabel||"Growth",v:"+"+fmt(fv-contrib),c:th.pos},{l:`${t.futureValue||"Future Value"} (${years}yr @ ${p.ret}%)`,v:fmt(fv),c:th.accent,big:true}].map(row=><div key={row.l} style={{display:"flex",justifyContent:"space-between",marginBottom:8,fontSize:row.big?14:12,fontWeight:row.big?800:400}}><span style={{color:th.muted}}>{row.l}</span><span style={{color:row.c,fontWeight:row.big?800:600}}>{row.v}</span></div>)}</div>
        <div style={{...mCARD(th),padding:14}}><div style={{fontSize:11,fontWeight:700,color:th.dim,marginBottom:6}}>ALLOCATION</div>
          <ResponsiveContainer width="100%" height={140}><PieChart><Pie data={allHoldings.map((h,i)=>({name:tickerOf(h),value:h.pct||1,color:PCOLS[i%PCOLS.length]}))} cx="50%" cy="50%" innerRadius={32} outerRadius={56} paddingAngle={2} dataKey="value">{allHoldings.map((h,i)=><Cell key={i} fill={PCOLS[i%PCOLS.length]} stroke="none"/>)}</Pie><ReTip contentStyle={{background:th.nav,border:`1px solid ${th.cardBorder}`,borderRadius:8,fontSize:11}} formatter={(v,n)=>[v+"%",n]}/></PieChart></ResponsiveContainer>
        </div>
      </div>
    </div>
  </div>;
}

// ── CLIENT REPORT ─────────────────────────────────────────────────────────────
function ClientReport({client,lang,t}){
  const th=useTh();const net=sumNet(client.incomeStreams),bills=sumBills(client.bills),minD=sumMin(client.cards),cash=net-bills-minD;
  const tA=Object.values(client.assets).reduce((s,v)=>s+v,0)+(Array.isArray(client.customAssets)?client.customAssets.reduce((s,a)=>s+(+a.value||0),0):0),tL=Object.values(client.liabilities).reduce((s,v)=>s+v,0);
  const h1=activeBills(client.bills).filter(b=>(b.dueDay||1)<=15),h2=activeBills(client.bills).filter(b=>(b.dueDay||1)>15);
  const RS=({label,items})=><div style={{...mCARD(th),padding:14,marginBottom:14}}><div style={{fontSize:11,fontWeight:700,color:th.dim,marginBottom:10}}>{label}</div><table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>{items}</table></div>;
  return<div>
    <div style={{...mCARD(th),padding:18,marginBottom:16}}>
      <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:10,marginBottom:16}}><div><div style={{fontSize:20,fontWeight:800,color:th.text}}>{client.firstName} {client.lastName}{client.partnerFirst&&<span style={{color:th.muted,fontWeight:400}}> & {client.partnerFirst}</span>}</div><div style={{fontSize:11,color:th.muted,marginTop:4}}>{client.email}{client.phone?` · ${client.phone}`:""}</div>{client.address&&<div style={{fontSize:11,color:th.dim,marginTop:2}}>{client.address}</div>}</div><div style={{textAlign:"right",fontSize:11,color:th.dim}}>{t.generatedOn}: {new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}</div></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}><SC label={t.totalIncome} value={fmt(net)} color={th.pos}/><SC label={t.totalBills} value={fmt(bills)} color={th.neg}/><SC label={t.totalDebt} value={fmt(client.cards.reduce((s,c)=>s+c.balance,0))} color={th.warn}/><SC label={t.netWorth} value={fmt(tA-tL)} color={tA-tL>=0?th.pos:th.neg}/></div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
      <div><RS label="INCOME" items={<><thead><tr><th style={mTH(th)}>Source</th><th style={mTHR(th)}>Net/mo</th></tr></thead><tbody>{client.incomeStreams.map(s=><tr key={s.id}><td style={mTD(th)}>{s.label}</td><td style={{...mTDR(th),fontWeight:700,color:th.pos}}>{fmt(toM(s.net,s.freq))}</td></tr>)}<tr><td style={{...mTD(th),fontWeight:700}}>TOTAL</td><td style={{...mTDR(th),fontWeight:800,color:th.pos}}>{fmt(net)}</td></tr></tbody></>}/><RS label={`BILLS 1–15`} items={<><thead><tr><th style={mTH(th)}>Name</th><th style={mTHR(th)}>Monthly</th></tr></thead><tbody>{h1.map(b=><tr key={b.id}><td style={mTD(th)}>{b.name}</td><td style={{...mTDR(th),fontWeight:600}}>{fmt(toM(b.cost,b.freq))}</td></tr>)}</tbody></>}/><RS label="BILLS 16–31" items={<><thead><tr><th style={mTH(th)}>Name</th><th style={mTHR(th)}>Monthly</th></tr></thead><tbody>{h2.map(b=><tr key={b.id}><td style={mTD(th)}>{b.name}</td><td style={{...mTDR(th),fontWeight:600}}>{fmt(toM(b.cost,b.freq))}</td></tr>)}<tr><td style={{...mTD(th),fontWeight:700}}>TOTAL</td><td style={{...mTDR(th),fontWeight:800,color:th.neg}}>{fmt(bills)}</td></tr></tbody></>}/></div>
      <div><RS label="DEBT" items={<><thead><tr><th style={mTH(th)}>Card</th><th style={mTHR(th)}>Balance</th><th style={mTHR(th)}>APR</th><th style={mTHR(th)}>Min</th></tr></thead><tbody>{client.cards.map(c=><tr key={c.id}><td style={mTD(th)}>{c.name}</td><td style={{...mTDR(th),color:th.neg,fontWeight:700}}>{fmt(c.balance)}</td><td style={{...mTDR(th),color:th.warn}}>{c.apr>0?c.apr+"%":"0%"}</td><td style={{...mTDR(th),color:GOLD}}>{fmtD(c.min)}</td></tr>)}<tr><td style={{...mTD(th),fontWeight:700}}>TOTAL</td><td style={{...mTDR(th),fontWeight:800,color:th.neg}}>{fmt(client.cards.reduce((s,c)=>s+c.balance,0))}</td><td/><td style={{...mTDR(th),color:GOLD,fontWeight:700}}>{fmtD(sumMin(client.cards))}</td></tr></tbody></>}/>
      <RS label="ASSETS & NET WORTH" items={<><tbody>{[["Checking",client.assets.checking],["Savings",client.assets.savings],["Retirement",client.assets.retirement],["Vehicle",client.assets.vehicle],...(Array.isArray(client.customAssets)?client.customAssets:[]).map(a=>[a.name,+a.value||0])].filter(([,v])=>v>0).map(([l,v])=><tr key={l}><td style={mTD(th)}>{l}</td><td style={{...mTDR(th),color:th.pos}}>{fmt(v)}</td></tr>)}<tr><td style={{...mTD(th),fontWeight:700}}>TOTAL ASSETS</td><td style={{...mTDR(th),fontWeight:800,color:th.pos}}>{fmt(tA)}</td></tr><tr><td style={{...mTD(th),fontWeight:700}}>NET WORTH</td><td style={{...mTDR(th),fontWeight:800,fontSize:15,color:tA-tL>=0?th.pos:th.neg}}>{fmt(tA-tL)}</td></tr></tbody></>}/>
      {client.notes?.goals&&<div style={{...mCARD(th),padding:14}}><div style={{fontSize:11,fontWeight:700,color:th.dim,marginBottom:8}}>GOALS</div><div style={{fontSize:12,color:th.muted,lineHeight:1.7}}>{client.notes.goals}</div></div>}</div>
    </div>
    <div style={{fontSize:12,color:th.dim,textAlign:"center",padding:"10px 0",borderTop:`1px solid ${th.cardBorder}`,marginTop:8}}>Golden Anchor Financial Advisory · mauricio@goldenanchor.life</div>
  </div>;
}

// ── REMINDERS PANEL (split advisor / client) ──────────────────────────────────
function RemindersPanel({clients,settings,t}){
  const th=useTh();const[tab,setTab]=useState("advisor");
  const advisorAlerts=getAdvisorReminders(clients,settings);
  const clientRem=getClientReminders(clients);const cBills=clientRem.filter(u=>u.type==="bill");const cCards=clientRem.filter(u=>u.type==="card");
  const priColor=p=>p==="high"?th.neg:th.warn;
  const typeIcon={noContact:"📞",highDebt:"⚠️",promo:"⏰",debtRising:"📈"};
  return<div style={{...mCARD(th),padding:14,marginTop:16}}>
    <div style={{display:"flex",gap:6,marginBottom:12}}>
      <button onClick={()=>setTab("advisor")} style={{fontSize:11,padding:"4px 12px",borderRadius:8,cursor:"pointer",background:tab==="advisor"?th.accent+"22":"transparent",color:tab==="advisor"?th.accent:th.muted,border:`1px solid ${tab==="advisor"?th.accent:th.cardBorder}`,fontWeight:tab==="advisor"?700:400}}>🔔 {t.advisorReminders} {advisorAlerts.length>0&&<span style={{background:advisorAlerts.some(a=>a.priority==="high")?th.neg:th.warn,color:"#fff",borderRadius:99,padding:"0 5px",fontSize:10,marginLeft:4}}>{advisorAlerts.length}</span>}</button>
      <button onClick={()=>setTab("clients")} style={{fontSize:11,padding:"4px 12px",borderRadius:8,cursor:"pointer",background:tab==="clients"?th.accent+"22":"transparent",color:tab==="clients"?th.accent:th.muted,border:`1px solid ${tab==="clients"?th.accent:th.cardBorder}`,fontWeight:tab==="clients"?700:400}}>👥 {t.clientReminders} {(cBills.length+cCards.length)>0&&<span style={{background:th.warn,color:"#fff",borderRadius:99,padding:"0 5px",fontSize:10,marginLeft:4}}>{cBills.length+cCards.length}</span>}</button>
    </div>
    {tab==="advisor"&&(advisorAlerts.length===0?<div style={{fontSize:11,color:th.dim,fontStyle:"italic",padding:"4px 0"}}>{t.noAdvisorAlerts}</div>:<div style={{display:"flex",flexDirection:"column",gap:6}}>{advisorAlerts.slice(0,8).map((a,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",borderRadius:8,background:priColor(a.priority)+"11",border:`1px solid ${priColor(a.priority)}22`}}><span style={{fontSize:16}}>{typeIcon[a.type]||"📋"}</span><div style={{flex:1}}><div style={{fontSize:12,fontWeight:700,color:th.text}}>{a.client}</div><div style={{fontSize:11,color:th.muted}}>{a.detail}</div></div><div style={{width:8,height:8,borderRadius:99,background:priColor(a.priority),flexShrink:0}}/></div>)}</div>)}
    {tab==="clients"&&<>
      {cBills.length===0&&cCards.length===0?<div style={{fontSize:11,color:th.dim,fontStyle:"italic"}}>{t.noDue}</div>:<>
        {cBills.length>0&&<><div style={{fontSize:10,fontWeight:700,color:th.muted,marginBottom:6}}>{t.dueThisWeek.toUpperCase()}</div>{cBills.slice(0,6).map((u,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6,fontSize:11}}><div><span style={{fontWeight:600,color:th.text}}>{u.name}</span><span style={{color:th.dim,marginLeft:6}}>— {u.client}</span></div><div style={{textAlign:"right"}}><span style={{color:u.daysUntil<=2?th.neg:th.warn,fontWeight:700}}>{fmt(u.amount)}</span><span style={{fontSize:9,color:th.dim,display:"block"}}>Day {u.dueDay}</span></div></div>)}</>}
        {cCards.length>0&&<div style={{marginTop:8,paddingTop:8,borderTop:`1px solid ${th.cardBorder}`}}><div style={{fontSize:10,fontWeight:700,color:th.muted,marginBottom:6}}>CREDIT CARD MINIMUMS</div>{cCards.slice(0,5).map((u,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5,fontSize:11}}><span>{u.name} <span style={{color:th.dim}}>— {u.client}</span></span><span style={{color:th.warn,fontWeight:700}}>{fmtD(u.amount)}</span></div>)}</div>}
      </>}
    </>}
  </div>;
}

// ── DASHBOARD ─────────────────────────────────────────────────────────────────
function Dashboard({clients,t,settings,onSelect,onAdd}){
  const th=useTh();const totalDebt=clients.reduce((s,c)=>s+c.cards.reduce((x,cc)=>x+cc.balance,0),0),totalIncome=clients.reduce((s,c)=>s+sumNet(c.incomeStreams),0);
  const finOnly=clients.filter(c=>c.clientType==="financeOnly").length,finHealth=clients.filter(c=>c.clientType==="financeAndHealth").length;
  const withDebt=clients.filter(c=>c.cards.reduce((s,cc)=>s+cc.balance,0)>0).length,noDebt=clients.length-withDebt;
  const improving=clients.filter(c=>{const s=c.monthSnapshots||[];return s.length>=2&&s[s.length-1].debt<s[0].debt;}).length;
  const trendData=["Jan","Feb","Mar","Apr","May"].map(m=>({m,debt:clients.reduce((s,c)=>{const sn=(c.monthSnapshots||[]).find(x=>x.label.startsWith(m));return s+(sn?.debt||0);},0),savings:clients.reduce((s,c)=>{const sn=(c.monthSnapshots||[]).find(x=>x.label.startsWith(m));return s+(sn?.savings||0);},0)}));
  const pieColors=[[{name:t.financeOnly,value:finOnly,color:th.blue},{name:t.financeAndHealth,value:finHealth,color:th.pos}],[{name:"Has Debt",value:withDebt,color:th.neg},{name:"Debt Free",value:noDebt,color:th.pos}]];
  return<div style={{padding:24}}>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}><div><h2 style={{fontSize:18,fontWeight:800,color:th.text,margin:0}}>{t.dashboard}</h2><div style={{fontSize:11,color:th.dim,marginTop:2}}>{clients.length} clients</div></div><button onClick={onAdd} style={{fontSize:12,padding:"8px 16px",borderRadius:10,background:th.accent,color:"#fff",fontWeight:700,border:"none",cursor:"pointer"}}>+ {t.addClient}</button></div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:12,marginBottom:20}}><SC label="Total Clients" value={clients.length} color={th.accent}/><SC label="Monthly Income" value={fmt(totalIncome)} color={th.pos}/><SC label="Total Debt" value={fmt(totalDebt)} color={th.neg}/><SC label="Improving" value={improving} color={improving>0?th.pos:th.warn} sub={`${clients.length-improving} declining`}/></div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:4}}>
      {pieColors.map((data,ci)=><div key={ci} style={{...mCARD(th),padding:14}}><div style={{fontSize:11,fontWeight:700,color:th.dim,marginBottom:8}}>{ci===0?"CLIENT TYPE":"DEBT STATUS"}</div><div style={{display:"flex",alignItems:"center",gap:16}}><ResponsiveContainer width={90} height={90}><PieChart><Pie data={data} cx="50%" cy="50%" innerRadius={22} outerRadius={40} paddingAngle={3} dataKey="value">{data.map((e,i)=><Cell key={i} fill={e.color} stroke="none"/>)}</Pie></PieChart></ResponsiveContainer><div>{data.map(d=><div key={d.name} style={{display:"flex",alignItems:"center",gap:6,marginBottom:5}}><div style={{width:8,height:8,borderRadius:99,background:d.color}}/><span style={{fontSize:11,color:th.muted}}>{d.name}: <span style={{fontWeight:700,color:d.color}}>{d.value}</span></span></div>)}</div></div></div>)}
      <div style={{...mCARD(th),padding:14}}><div style={{fontSize:11,fontWeight:700,color:th.dim,marginBottom:8}}>{t.debtTrend}</div>
        <ResponsiveContainer width="100%" height={100}><BarChart data={trendData} barGap={2} margin={{top:16,right:0,left:0,bottom:0}}><XAxis dataKey="m" tick={{fontSize:9,fill:th.dim}} axisLine={false} tickLine={false}/><YAxis hide/><ReTip contentStyle={{background:th.nav,border:`1px solid ${th.cardBorder}`,borderRadius:8,fontSize:10}} formatter={v=>fmt(v)}/><Bar dataKey="debt" name="Debt" fill={th.neg+"88"} radius={[2,2,0,0]}><LabelList dataKey="debt" position="top" formatter={v=>v>0?fmtShort(v):""} style={{fontSize:8,fill:th.dim}}/></Bar><Bar dataKey="savings" name="Savings" fill={th.pos+"88"} radius={[2,2,0,0]}><LabelList dataKey="savings" position="top" formatter={v=>v>0?fmtShort(v):""} style={{fontSize:8,fill:th.dim}}/></Bar></BarChart></ResponsiveContainer>
        <div style={{display:"flex",gap:10,marginTop:4}}><div style={{display:"flex",alignItems:"center",gap:4,fontSize:10}}><div style={{width:8,height:8,borderRadius:2,background:th.neg}}/><span style={{color:th.dim}}>Debt</span></div><div style={{display:"flex",alignItems:"center",gap:4,fontSize:10}}><div style={{width:8,height:8,borderRadius:2,background:th.pos}}/><span style={{color:th.dim}}>Savings</span></div></div>
      </div>
    </div>
    <RemindersPanel clients={clients} settings={settings} t={t}/>
    <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:16}}>{clients.map(c=>{const net=sumNet(c.incomeStreams),debt=c.cards.reduce((s,cc)=>s+cc.balance,0),tA=Object.values(c.assets).reduce((s,v)=>s+v,0)+(Array.isArray(c.customAssets)?c.customAssets.reduce((s,a)=>s+(+a.value||0),0):0),tL=Object.values(c.liabilities).reduce((s,v)=>s+v,0),snaps=c.monthSnapshots||[];const improving2=snaps.length>=2&&snaps[snaps.length-1].debt<snaps[0].debt;return<div key={c.id} onClick={()=>onSelect(c)} style={{...mCARD(th),padding:"14px 18px",cursor:"pointer",display:"flex",alignItems:"center",gap:16}}><div style={{width:44,height:44,borderRadius:99,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:14,background:c.color1+"22",color:c.color1,border:`2px solid ${c.color1}44`,flexShrink:0}}>{c.firstName[0]}{c.lastName[0]}</div><div style={{flex:1}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:2}}><span style={{fontSize:14,fontWeight:700,color:th.text}}>{c.firstName} {c.lastName}</span>{c.partnerFirst&&<span style={{fontSize:12,color:th.dim}}>& {c.partnerFirst}</span>}{improving2&&<Pill color={th.pos}>↑</Pill>}</div><div style={{fontSize:11,color:th.dim}}>{c.email}</div></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:20,textAlign:"right"}}><div><div style={{fontSize:10,color:th.dim,marginBottom:2}}>Net/mo</div><div style={{fontSize:13,fontWeight:700,color:th.pos}}>{fmt(net)}</div></div><div><div style={{fontSize:10,color:th.dim,marginBottom:2}}>Debt</div><div style={{fontSize:13,fontWeight:700,color:th.neg}}>{fmt(debt)}</div></div><div><div style={{fontSize:10,color:th.dim,marginBottom:2}}>Net Worth</div><div style={{fontSize:13,fontWeight:700,color:tA-tL>=0?GOLD:th.neg}}>{fmt(tA-tL)}</div></div></div><span style={{color:th.accent,fontSize:18}}>›</span></div>;})}
    </div>
  </div>;
}

// ── CLIENTS LIST ──────────────────────────────────────────────────────────────
function ClientList({clients,t,onSelect,onAdd}){
  const th=useTh();const[search,setSearch]=useState("");const filtered=clients.filter(c=>`${c.firstName} ${c.lastName} ${c.email}`.toLowerCase().includes(search.toLowerCase()));
  return<div style={{padding:24}}><div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}><h2 style={{fontSize:18,fontWeight:800,color:th.text,margin:0}}>{t.clients}</h2><div style={{display:"flex",gap:8}}><input placeholder="Search…" value={search} onChange={e=>setSearch(e.target.value)} style={{...mINP(th),width:180,padding:"6px 12px"}}/><button onClick={onAdd} style={{fontSize:12,padding:"8px 16px",borderRadius:10,background:th.accent,color:"#fff",fontWeight:700,border:"none",cursor:"pointer"}}>+ {t.addClient}</button></div></div>
    <div style={{display:"flex",flexDirection:"column",gap:8}}>{filtered.map(c=><div key={c.id} onClick={()=>onSelect(c)} style={{...mCARD(th),padding:"12px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:12}}><div style={{width:36,height:36,borderRadius:99,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:13,background:c.color1+"22",color:c.color1,border:`2px solid ${c.color1}44`,flexShrink:0}}>{c.firstName[0]}{c.lastName[0]}</div><div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,color:th.text}}>{c.firstName} {c.lastName}</div><div style={{fontSize:11,color:th.dim}}>{c.email}</div></div><span style={{color:th.muted,fontSize:11}}>{fmt(sumNet(c.incomeStreams))}/mo</span><span style={{color:th.accent,fontSize:16}}>›</span></div>)}</div>
  </div>;
}

// ── SIDEBAR PAGES ─────────────────────────────────────────────────────────────
const downloadTemplate=()=>{const d={firstName:"",lastName:"",partnerFirst:"",partnerLast:"",email:"",phone:"",address:"",dob:"",social:"",clientType:"financeOnly",recommendedBy:"",efMonths:3,incomeStreams:[{person:"p1",label:"Main Job",gross:0,net:0,freq:"biweekly"}],bills:[{name:"Rent",assignedTo:"joint",dueDay:1,cost:0,type:"regular",freq:"monthly2"}],cards:[{name:"",balance:0,apr:0,min:0,limit:0}],customAssets:[],assets:{checking:0,savings:0,retirement:0,vehicle:0,realEstate:0},liabilities:{creditCards:0,vehicle:0,student:0,personal:0},notes:{shortTerm:"",midTerm:"",longTerm:"",setbacks:"",goals:"",general:""}};const blob=new Blob([JSON.stringify(d,null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="golden_anchor_template.json";a.click();URL.revokeObjectURL(url);};
const exportClient=client=>{const blob=new Blob([JSON.stringify(client,null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`${client.firstName}_${client.lastName}_GA.json`;a.click();URL.revokeObjectURL(url);};
function FormsPage({t}){const th=useTh();const forms=[{title:"New Client Intake Form",desc:"Comprehensive form to collect all initial client data",icon:"📋",type:"PDF"},{title:"Monthly Budget Worksheet",desc:"Track monthly income, expenses, and savings",icon:"📊",type:"XLSX"},{title:"Debt Reduction Plan",desc:"Snowball/Avalanche strategy worksheet",icon:"💳",type:"XLSX"},{title:"Net Worth Calculator",desc:"Complete asset and liability summary",icon:"🏦",type:"XLSX"},{title:"Financial Goals Worksheet",desc:"Short, mid, and long-term goal planning",icon:"🎯",type:"PDF"},{title:"Insurance Needs Analysis",desc:"Life, health, and property coverage review",icon:"🛡️",type:"PDF"}];return<div style={{padding:24}}><h2 style={{fontSize:18,fontWeight:800,color:th.text,marginBottom:4,marginTop:0}}>{t.formsTitle}</h2><p style={{fontSize:11,color:th.dim,marginBottom:16,marginTop:0}}>{t.formsDesc}</p><div style={{marginBottom:16}}><button onClick={downloadTemplate} style={{fontSize:12,padding:"8px 16px",borderRadius:8,background:th.accent,color:"#fff",border:"none",cursor:"pointer",fontWeight:700}}>{t.downloadJsonTemplate}</button></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>{forms.map(f=><div key={f.title} style={{...mCARD(th),padding:16}}><div style={{fontSize:28,marginBottom:8}}>{f.icon}</div><div style={{fontWeight:700,fontSize:13,color:th.text,marginBottom:4}}>{f.title}</div><div style={{fontSize:11,color:th.muted,marginBottom:10,lineHeight:1.5}}>{f.desc}</div><Pill color={th.accent}>{f.type}</Pill></div>)}</div></div>;}
function ResourcesPage({t}){const th=useTh();const guides=[{title:"Understanding Your Credit Score",desc:"How scores are calculated and strategies to improve.",icon:"📈"},{title:"Debt Payoff Strategies",desc:"Avalanche vs. Snowball — which works best.",icon:"💡"},{title:"Building an Emergency Fund",desc:"Why 3–6 months matters and how to get there.",icon:"🛡️"},{title:"Retirement Savings 101",desc:"Roth IRA, 401k, and contribution strategies.",icon:"🎯"},{title:"First-Time Homebuyer Guide",desc:"Pre-approval, down payment, and DTI explained.",icon:"🏠"},{title:"Investment Allocation Basics",desc:"Risk tolerance and time horizon planning.",icon:"📊"}];return<div style={{padding:24}}><h2 style={{fontSize:18,fontWeight:800,color:th.text,marginBottom:4,marginTop:0}}>{t.resourcesTitle}</h2><p style={{fontSize:11,color:th.dim,marginBottom:16,marginTop:0}}>{t.resourcesDesc}</p><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>{guides.map(g=><div key={g.title} style={{...mCARD(th),padding:16}}><div style={{fontSize:28,marginBottom:8}}>{g.icon}</div><div style={{fontWeight:700,fontSize:13,color:th.text,marginBottom:6}}>{g.title}</div><div style={{fontSize:11,color:th.muted,lineHeight:1.6,marginBottom:10}}>{g.desc}</div><button style={{fontSize:11,padding:"4px 12px",borderRadius:6,background:th.accent+"22",color:th.accent,border:`1px solid ${th.accent}44`,cursor:"pointer"}}>{t.openGuide}</button></div>)}</div></div>;}
function AboutPage({t,settings}){
  const th=useTh();const SERVICES=[{icon:"📊",k:"serviceFinancial"},{icon:"🛡️",k:"serviceInsurance"},{icon:"💹",k:"serviceInvestment"},{icon:"🏠",k:"serviceRealEstate"},{icon:"📉",k:"serviceDebt"},{icon:"🎯",k:"serviceRetirement"}];
  return<div style={{padding:24}}>
    <div style={{...mCARD(th),padding:24,marginBottom:20,textAlign:"center"}}><div style={{fontSize:40,marginBottom:8}}>⚓</div><div style={{fontSize:24,fontWeight:800,color:GOLD,fontFamily:"Georgia,serif"}}>Golden Anchor</div><div style={{fontSize:10,color:th.dim,letterSpacing:"0.2em",marginTop:2}}>FINANCIAL ADVISORY</div><div style={{fontSize:13,color:th.muted,marginTop:12,lineHeight:1.7,maxWidth:480,margin:"12px auto 0"}}>{t.aboutDesc}</div></div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20}}>
      <div style={{...mCARD(th),padding:18}}><div style={{fontSize:15,fontWeight:800,color:th.text,marginBottom:8}}>{settings?.advisorName||t.advisorName||"Mauricio Hernandez"}</div><div style={{fontSize:12,color:th.muted,lineHeight:1.7,marginBottom:12}}>{t.advisorBio}</div>
        <div style={{fontSize:13,fontWeight:700,color:th.dim,marginBottom:10,letterSpacing:"0.04em"}}>{t.certifications}</div>
        {CERTS.map(c=><div key={c} style={{fontSize:13,color:th.muted,marginBottom:7,display:"flex",gap:8,alignItems:"flex-start"}}><span style={{color:GOLD,flexShrink:0}}>✓</span><span>{c}</span></div>)}</div>
      <div>
        <div style={{...mCARD(th),padding:18,marginBottom:12}}>
          <div style={{fontSize:13,fontWeight:700,color:th.dim,marginBottom:12,letterSpacing:"0.04em"}}>{t.connect}</div>
          {[{icon:"🌐",label:t.website,val:"goldenanchor.life",href:"https://goldenanchor.life"},{icon:"📸",label:"Instagram",val:`@${settings?.ig||"golden_anchor_inc"}`,href:`https://instagram.com/${settings?.ig||"golden_anchor_inc"}`},{icon:"✉️",label:"Email",val:settings?.advisorEmail||"mauricio@goldenanchor.life",href:`mailto:${settings?.advisorEmail||"mauricio@goldenanchor.life"}`}].map(l=><div key={l.label} style={{display:"flex",gap:10,alignItems:"center",marginBottom:12}}><span style={{fontSize:20}}>{l.icon}</span><div><div style={{fontSize:10,color:th.dim}}>{l.label}</div><a href={l.href} style={{fontSize:12,color:th.accent,fontWeight:600,textDecoration:"none"}}>{l.val}</a></div></div>)}
        </div>
        <div style={{...mCARD(th),padding:18,background:GOLD+"11",border:`1px solid ${GOLD}44`}}><div style={{fontSize:11,fontWeight:700,color:GOLD,marginBottom:8,letterSpacing:"0.08em"}}>{(t.referralCode||"Referral Code").toUpperCase()}</div><div style={{fontSize:28,fontWeight:800,color:GOLD,letterSpacing:"0.1em",fontFamily:"monospace"}}>GOLDEN-2026</div><div style={{fontSize:11,color:th.muted,marginTop:6}}>{t.referralDesc}</div></div>
      </div>
    </div>
    <div style={{fontSize:14,fontWeight:700,color:th.text,marginBottom:12}}>{t.services}</div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>{SERVICES.map(s=><div key={s.k} style={{...mCARD(th),padding:14}}><div style={{fontSize:24,marginBottom:6}}>{s.icon}</div><div style={{fontWeight:700,fontSize:13,color:th.text,marginBottom:4}}>{t[s.k]}</div><div style={{fontSize:12,color:th.muted,lineHeight:1.5}}>{t[s.k+"Desc"]}</div></div>)}</div>
  </div>;
}

// ── CLIENT DETAIL ─────────────────────────────────────────────────────────────
function ClientDetail({client,onUpdate,lang,t,onBack}){
  const th=useTh();const[tab,setTab]=useState("report");const[editOpen,setEditOpen]=useState(false);
  const tA=Object.values(client.assets).reduce((s,v)=>s+v,0)+(Array.isArray(client.customAssets)?client.customAssets.reduce((s,a)=>s+(+a.value||0),0):0),tL=Object.values(client.liabilities).reduce((s,v)=>s+v,0);
  const tabs=[{id:"report",l:t.report},{id:"monthly",l:t.monthly},{id:"ratios",l:t.ratios},{id:"investments",l:t.investments},{id:"intake",l:t.intake},{id:"notes",l:t.notes}];
  const fileRef=useRef();
  const importC=e=>{const f=e.target.files[0];if(!f)return;const reader=new FileReader();reader.onload=ev=>{try{const d=JSON.parse(ev.target.result);onUpdate(migrateClient({...d,id:client.id}));alert("Imported!");}catch{alert("Invalid JSON.");}};reader.readAsText(f);e.target.value="";};
  return<div style={{flex:1,overflowY:"auto"}}>
    {editOpen&&<ClientForm client={client} onSave={c=>{onUpdate(c);setEditOpen(false);}} onDelete={null} onClose={()=>setEditOpen(false)} t={t}/>}
    <input ref={fileRef} type="file" accept=".json" onChange={importC} style={{display:"none"}}/>
    <div style={{padding:"18px 24px",borderBottom:`1px solid ${th.cardBorder}`}}>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
        <button onClick={onBack} style={{fontSize:12,padding:"5px 12px",borderRadius:8,background:th.inp,color:th.muted,border:"none",cursor:"pointer"}}>{t.back}</button>
        <div style={{width:40,height:40,borderRadius:99,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:14,background:GOLD+"22",color:GOLD,border:`2px solid ${GOLD}44`,flexShrink:0}}>{client.firstName[0]}{client.lastName[0]}</div>
        <div><div style={{fontWeight:700,fontSize:15,color:th.text}}>{client.firstName} {client.lastName}{client.partnerFirst&&<span style={{color:th.muted,fontWeight:400}}> & {client.partnerFirst}</span>}</div><div style={{fontSize:11,color:th.dim}}>{client.email}</div></div>
        <div style={{marginLeft:"auto",display:"flex",gap:6}}><Btn small onClick={()=>setEditOpen(true)}>{t.editClient}</Btn><Btn small onClick={downloadTemplate}>{t.downloadTemplate}</Btn><Btn small onClick={()=>fileRef.current?.click()}>{t.importExcel}</Btn><Btn small onClick={()=>exportClient(client)}>{t.exportExcel}</Btn></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:10,marginBottom:14}}><SC label={t.totalIncome} value={fmt(client.monthSnapshots?.slice(-1)[0]?.income||sumNet(client.incomeStreams))} color={th.pos}/><SC label={t.totalDebt} value={fmt(client.cards.reduce((s,c)=>s+c.balance,0))} color={th.neg}/><SC label={t.totalAssets} value={fmt(tA)} color={th.blue}/><SC label={t.netWorth} value={fmt(tA-tL)} color={tA-tL>=0?th.pos:th.neg}/></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        {[{k1:"debt",c1:th.neg,k2:"savings",c2:th.pos,l:t.debtTrend},{k1:"cashFlow",c1:GOLD,k2:"income",c2:th.pos,l:"Cash Flow Trend"}].map((ch,ci)=><div key={ci} style={{...mCARD(th),padding:10}}><div style={{fontSize:11,fontWeight:700,color:th.dim,marginBottom:6}}>{ch.l}</div><ResponsiveContainer width="100%" height={80}><BarChart data={client.monthSnapshots||[]} barGap={2} margin={{top:14,right:0,left:0,bottom:0}}><XAxis dataKey="label" tick={{fontSize:8,fill:th.dim}} axisLine={false} tickLine={false}/><YAxis hide/><ReTip contentStyle={{background:th.nav,border:`1px solid ${th.cardBorder}`,borderRadius:8,fontSize:10}} formatter={v=>fmt(v)}/><Bar dataKey={ch.k1} fill={ch.c1+"66"} radius={[2,2,0,0]}><LabelList dataKey={ch.k1} position="top" formatter={v=>v>0?fmtShort(v):""} style={{fontSize:8,fill:th.dim}}/></Bar><Bar dataKey={ch.k2} fill={ch.c2+"66"} radius={[2,2,0,0]}><LabelList dataKey={ch.k2} position="top" formatter={v=>v>0?fmtShort(v):""} style={{fontSize:8,fill:th.dim}}/></Bar></BarChart></ResponsiveContainer></div>)}
      </div>
    </div>
    <div style={{padding:"0 24px"}}>
      <div style={{display:"flex",gap:0,borderBottom:`1px solid ${th.cardBorder}`,marginBottom:20,overflowX:"auto"}}>{tabs.map(tb=><button key={tb.id} onClick={()=>setTab(tb.id)} style={{fontSize:12,padding:"10px 14px",background:"none",border:"none",cursor:"pointer",fontWeight:tab===tb.id?700:400,color:tab===tb.id?th.accent:th.muted,borderBottom:tab===tb.id?`2px solid ${th.accent}`:"2px solid transparent",marginBottom:-1,whiteSpace:"nowrap"}}>{tb.l}</button>)}</div>
      {tab==="report"&&<ClientReport client={client} lang={lang} t={t}/>}
      {tab==="monthly"&&<MonthlyTab client={client} onUpdate={onUpdate} lang={lang} t={t}/>}
      {tab==="ratios"&&<RatiosTab client={client} lang={lang} t={t}/>}
      {tab==="investments"&&<InvestmentsTab client={client} onUpdate={onUpdate} t={t}/>}
      {tab==="intake"&&<IntakeSection client={client} onUpdate={onUpdate} t={t}/>}
      {tab==="notes"&&<NotesSection client={client} onUpdate={onUpdate} t={t}/>}
      <div style={{height:40}}/>
    </div>
  </div>;
}

// ── LOGIN ─────────────────────────────────────────────────────────────────────
const CREDS={email:"mauricio@goldenanchor.life",password:"GoldenAnchor2026"};
function Login({onLogin,t,isDark,onToggleTheme}){
  const[em,setEm]=useState("");const[pw,setPw]=useState("");const[err,setErr]=useState("");
  const go=()=>{if(em===CREDS.email&&pw===CREDS.password)onLogin();else setErr("Invalid credentials.");};
  const INP={background:isDark?"#111827":"#F0F7FF",border:`1px solid ${isDark?"#4B5563":"#CBD5E1"}`,color:isDark?"#F1F5F9":"#0F172A",borderRadius:8,padding:"8px 12px",fontSize:13,outline:"none",width:"100%",boxSizing:"border-box"};
  return<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:isDark?"linear-gradient(135deg,#0D1724 0%,#1F2937 100%)":"linear-gradient(135deg,#1C3557 0%,#2A4A73 100%)"}}>
    <div style={{width:340}}>
      <div style={{textAlign:"center",marginBottom:32}}><div style={{fontSize:40,marginBottom:8}}>⚓</div><div style={{fontSize:26,fontWeight:800,color:GOLD,letterSpacing:"0.06em",fontFamily:"Georgia,serif"}}>Golden Anchor</div><div style={{fontSize:10,color:"#94A3B8",letterSpacing:"0.2em",marginTop:2}}>FINANCIAL ADVISORY</div></div>
      <div style={{background:isDark?"#1F2937":"#FFFFFF",border:`1px solid ${isDark?"#374151":"#CBD5E1"}`,borderRadius:16,padding:28,boxShadow:"0 32px 80px #0006"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}><span style={{fontSize:12,fontWeight:600,color:"#6B7280"}}>{t.advisorPortal}</span><button onClick={onToggleTheme} style={{fontSize:11,padding:"3px 10px",borderRadius:8,background:isDark?"#374151":"#EFF6FF",color:isDark?"#9CA3AF":"#1D4ED8",border:"none",cursor:"pointer"}}>{isDark?"☀ "+t.lightMode:"🌙 "+t.darkMode}</button></div>
        <div style={{marginBottom:14}}><label style={{fontSize:11,color:"#6B7280",display:"block",marginBottom:5}}>{t.email}</label><input value={em} onChange={ev=>setEm(ev.target.value)} style={INP} onKeyDown={ev=>ev.key==="Enter"&&go()}/></div>
        <div style={{marginBottom:14}}><label style={{fontSize:11,color:"#6B7280",display:"block",marginBottom:5}}>{t.password}</label><input type="password" value={pw} onChange={ev=>setPw(ev.target.value)} style={INP} onKeyDown={ev=>ev.key==="Enter"&&go()}/></div>
        {err&&<div style={{fontSize:11,color:"#EF4444",marginBottom:12,padding:"8px 10px",background:"#EF444411",borderRadius:8}}>{err}</div>}
        <button onClick={go} style={{width:"100%",padding:12,borderRadius:12,fontWeight:800,fontSize:14,cursor:"pointer",background:`linear-gradient(135deg,${GOLD},#D4AF37)`,color:"#0D1B2A",border:"none",marginTop:4}}>{t.signIn}</button>
        <div style={{marginTop:10,padding:"8px 10px",background:isDark?"#111827":"#F0F7FF",borderRadius:8,fontSize:10,color:"#6B7280"}}>mauricio@goldenanchor.life · GoldenAnchor2026</div>
      </div>
    </div>
  </div>;
}

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App(){
  const[loggedIn,setLoggedIn]=useState(false);const[lang,setLang]=useState("en");const[isDark,setDark]=useState(true);const theme=isDark?DARK:LIGHT;const t=T[lang];
  const[settings,setSettings]=useState(()=>{try{return{...DEF_SETTINGS,...JSON.parse(localStorage.getItem("ga_settings")||"{}")};} catch{return DEF_SETTINGS;}});
  const[nav,setNav]=useState("dashboard");const[selected,setSelected]=useState(null);const[addOpen,setAddOpen]=useState(false);const[profileOpen,setProfileOpen]=useState(false);
  const[clients,setClients]=useState(()=>{try{const s=localStorage.getItem("ga_v3");return s?JSON.parse(s).map(migrateClient):SEED.map(migrateClient);}catch{return SEED.map(migrateClient);}});
  useEffect(()=>{try{localStorage.setItem("ga_v3",JSON.stringify(clients));}catch{}},[clients]);
  useEffect(()=>{try{localStorage.setItem("ga_settings",JSON.stringify(settings));}catch{}},[settings]);
  const updateClient=useCallback(c=>{const mc=migrateClient(c);setClients(p=>p.map(x=>x.id===mc.id?mc:x));setSelected(mc);},[]);
  const addClient=c=>{const mc=migrateClient(c);setClients(p=>[...p,mc]);setAddOpen(false);setSelected(mc);setNav("clients");};
  const NAV=[{id:"dashboard",icon:"⊞",l:t.dashboard},{id:"clients",icon:"👥",l:t.clients},null,{id:"forms",icon:"📋",l:t.forms},{id:"resources",icon:"📚",l:t.resources},{id:"about",icon:"⚓",l:t.about}];
  if(!loggedIn)return<ThemeCtx.Provider value={theme}><Login onLogin={()=>setLoggedIn(true)} t={t} isDark={isDark} onToggleTheme={()=>setDark(d=>!d)}/></ThemeCtx.Provider>;
  return<ThemeCtx.Provider value={theme}>
    {addOpen&&<ClientForm onSave={addClient} onDelete={null} onClose={()=>setAddOpen(false)} t={t}/>}
    {profileOpen&&<ProfileModal settings={settings} onSave={s=>{setSettings(s);setProfileOpen(false);}} onClose={()=>setProfileOpen(false)} t={t}/>}
    <div style={{display:"flex",minHeight:"100vh",background:theme.bg,fontFamily:"system-ui,sans-serif",color:theme.text,zoom:settings.zoom||1}}>
      <div style={{width:210,flexShrink:0,background:theme.nav,borderRight:`1px solid ${theme.navBorder}`,display:"flex",flexDirection:"column"}}>
        <div style={{padding:"18px 16px",borderBottom:`1px solid ${theme.navBorder}`}}><div style={{fontSize:17,fontWeight:800,color:GOLD,fontFamily:"Georgia,serif",letterSpacing:"0.04em"}}>⚓ Golden Anchor</div><div style={{fontSize:9,color:theme.sideMuted,letterSpacing:"0.14em",marginTop:2}}>ADVISOR PORTAL</div></div>
        <nav style={{flex:1,padding:10}}>{NAV.map((n,i)=>n===null?<div key={i} style={{height:1,background:theme.navBorder,margin:"6px 4px"}}/>:<button key={n.id} onClick={()=>{setNav(n.id);setSelected(null);}} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"8px 12px",borderRadius:9,background:nav===n.id&&!selected?GOLD+"22":"transparent",color:nav===n.id&&!selected?GOLD:theme.sideMuted,fontWeight:600,border:"none",cursor:"pointer",fontSize:13,textAlign:"left",marginBottom:2}}><span>{n.icon}</span>{n.l}</button>)}</nav>
        <div style={{padding:10,borderTop:`1px solid ${theme.navBorder}`}}>
          <button onClick={()=>setProfileOpen(true)} style={{width:"100%",padding:"7px",borderRadius:8,fontSize:12,cursor:"pointer",background:"transparent",color:GOLD,border:`1px solid ${GOLD}44`,fontWeight:700,marginBottom:8}}>⚙ {t.profileSettings}</button>
          <button onClick={()=>setDark(d=>!d)} style={{width:"100%",padding:"6px",borderRadius:8,fontSize:12,cursor:"pointer",background:"transparent",color:theme.sideMuted,border:`1px solid ${theme.navBorder}`,fontWeight:600,marginBottom:6}}>{isDark?"☀ "+t.lightMode:"🌙 "+t.darkMode}</button>
          <button onClick={()=>setLang(l=>l==="en"?"es":"en")} style={{width:"100%",padding:"5px",borderRadius:8,fontSize:12,cursor:"pointer",background:"transparent",color:theme.sideMuted,border:`1px solid ${theme.navBorder}`,fontWeight:700,marginBottom:10}}>EN | ES</button>
          <div style={{fontSize:11,color:theme.sideMuted}}>{settings.advisorName||"Mauricio Hernandez"}<br/><span style={{fontSize:10,opacity:0.7}}>Advisor</span></div>
        </div>
      </div>
      <div style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column"}}><div style={{flex:1,overflowY:"auto"}}>
        {selected?<ClientDetail client={selected} onUpdate={updateClient} lang={lang} t={t} onBack={()=>setSelected(null)}/>:nav==="dashboard"?<Dashboard clients={clients} t={t} settings={settings} onSelect={c=>{setSelected(c);setNav("clients");}} onAdd={()=>setAddOpen(true)}/>:nav==="clients"?<ClientList clients={clients} t={t} onSelect={c=>setSelected(c)} onAdd={()=>setAddOpen(true)}/>:nav==="forms"?<FormsPage t={t}/>:nav==="resources"?<ResourcesPage t={t}/>:<AboutPage t={t} settings={settings}/>}
      </div></div>
    </div>
  </ThemeCtx.Provider>;
}
