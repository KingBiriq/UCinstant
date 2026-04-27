import{NextResponse}from"next/server";import{g2bulk}from"@/lib/g2bulk";
export async function POST(req:Request){const b=await req.json();const d=await g2bulk("/games/checkPlayerId",{method:"POST",body:JSON.stringify({game:b.game,user_id:b.user_id,server_id:b.server_id||""})});return NextResponse.json(d)}
