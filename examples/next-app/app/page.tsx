import Image from "next/image";
import { imagePath } from "@typest/next";

export default function Home() {
  return (
    <Image
      className="dark:invert"
      src={imagePath("next.svg")}
      alt="Next.js logo"
      width={100}
      height={20}
      priority
    />
  );
}
