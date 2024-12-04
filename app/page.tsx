import { auth } from "@/auth";
import Appbar from "@/components/Appbar/Appbar";
import { Footer } from "@/components/Appbar/Footer";
import LoginAppbar from "@/components/Appbar/LoginAppbar";
import Home from "@/components/Home/Home";

export default async function Page() {
  const session = await auth();

  return (
    <div className="flex flex-col ">
      {!session?.idToken ? (
        <>
          <Appbar />
          <Home />
          <Footer />
        </>
      ) : (
        <>
          <LoginAppbar session={session} />
        </>
      )}
    </div>
  );
}
