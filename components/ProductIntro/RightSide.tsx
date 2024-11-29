import WalletIntroRight from "./sections/WalletIntroRight";
import WalletAdapterIntroRight from "./sections/WalletAdapterIntroRight";
import { motion } from "framer-motion";

const items = [
  { id: 0, Comp: <WalletIntroRight /> },
  { id: 1, Comp: <WalletAdapterIntroRight /> },
];
//
interface RightSideProps {
  isMobile: boolean;
}

const RightSide: React.FC<RightSideProps> = ({ isMobile }) => {
  return (
    <div className={`${isMobile ? "w-full" : "w-1/2 ml-auto"} overflow-y-auto`}>
      <WalletIntroRight />
    </div>
  );
};

export default RightSide;
