import { auth } from "@/auth";
import EmbeddedWallet from "@/components/EmbeddedWallet/EmbeddedWallet";
import "./styles.css";

const Modal = async () => {
  const session = await auth();
  console.log("session", session);
  return (
    <>
      <EmbeddedWallet session={session} />
    </>
  );
};

export default Modal;
