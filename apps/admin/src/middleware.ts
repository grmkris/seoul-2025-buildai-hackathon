import { routing } from "@/navigation";
import createMiddleware from "next-intl/middleware";

export default createMiddleware(routing);

export const config = {
  matcher: ["/", "/(en|sl|ge)/:path*"],
};
