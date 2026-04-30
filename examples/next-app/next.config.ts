import type { NextConfig } from "next";
import { withTypedAssets } from "@typest/nextjs/plugin";

const nextConfig: NextConfig = {
  /* config options here */
};

export default withTypedAssets({
  sources: [{ dir: "public" }],
})(nextConfig);
