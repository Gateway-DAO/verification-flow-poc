import { Gateway } from "@gateway-dao/sdk";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const gateway = new Gateway({
      apiKey: process.env.API_KEY as string,
      token: process.env.BEARER as string,
      url: process.env.API_URL as string,
    });

    const data = await gateway.proof.createProofMessage(body.id);

    return Response.json({
      message: data?.createProofMessage,
    });
  } catch (error: any) {
    console.log(JSON.stringify(error, null, 4));

    return Response.json(
      { message: error?.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
