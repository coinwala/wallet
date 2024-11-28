import { useState, useRef, useEffect } from "react";
import LeftSide from "../ProductIntro/LeftSide";
import RightSide from "../ProductIntro/RightSide";

export default function WalletIntro() {
  const [activeSection, setActiveSection] = useState(0);
  const sectionsRef = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(Number(entry.target.id));
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      sectionsRef.current.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  return (
    <main className="flex w-full min-h-screen ">
      <LeftSide activeSection={activeSection} />
      <RightSide
        sectionsRef={sectionsRef}
        setActiveSection={setActiveSection}
      />
    </main>
  );
}
