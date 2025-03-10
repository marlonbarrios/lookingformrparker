import { route } from "@fal-ai/serverless-proxy/nextjs";
import { type NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  return new Response("Not needed", { status: 200 });
};

export const GET = (req: NextRequest) => {
  return new Response("Not needed", { status: 200 });
};
