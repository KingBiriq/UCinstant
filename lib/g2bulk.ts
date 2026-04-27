const BASE=process.env.G2BULK_BASE_URL||"https://api.g2bulk.com/v1";
const KEY=process.env.G2BULK_API_KEY||"";
export async function g2bulk(path:string,options:RequestInit={}){
 const r=await fetch(`${BASE}${path}`,{...options,headers:{"Content-Type":"application/json","Accept":"application/json",...(KEY?{"X-API-Key":KEY}:{}),...(options.headers||{})},cache:"no-store"});
 const t=await r.text(); let data:any={}; try{data=t?JSON.parse(t):{}}catch{data={raw:t}}
 if(!r.ok)return{success:false,status:r.status,message:data?.message||data?.error||"G2Bulk error",data};
 return data;
}
export function arr(d:any){return Array.isArray(d)?d:Array.isArray(d?.data)?d.data:Array.isArray(d?.games)?d.games:Array.isArray(d?.catalogues)?d.catalogues:Array.isArray(d?.categories)?d.categories:[]}
