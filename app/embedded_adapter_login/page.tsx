import { auth } from "@/auth";
import AdapterLogin from "@/components/AdapterLogin/AdapterLogin";
import prisma from "../db";

export default async function page() {
  const session = await auth();

  console.log("raghav", session);
  return (
    <div>
      <AdapterLogin session={session} />
    </div>
  );
}
