import { auth } from "@/auth";
import EmbeddedWallet from "@/components/EmbeddedWallet/EmbeddedWallet";
import "./styles.css";

const Modal = async () => {
  const session = await auth();
  return (
    <>
      <EmbeddedWallet />
    </>
  );
};

export default Modal;
