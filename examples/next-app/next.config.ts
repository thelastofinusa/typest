import type { NextConfig } from "next";
import { withTypedAssets } from "@typest/next";

const nextConfig: NextConfig = { reactCompiler: true };

export default withTypedAssets({
  sources: [{ dir: "public" }],
})(nextConfig);
