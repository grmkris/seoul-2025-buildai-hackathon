import type { db } from "@/db/db";
import type { ContextVariables } from "@/types";
import { createMiddleware } from "hono/factory";
import type { Logger } from "logger";
import { MemberId, OrganizationId, SessionId, UserId } from "typeid";
import { createAuth } from "./auth";
import { OrganizationRole, SystemRole } from "./types";

export const createRequestMiddleware = (props: {
  db: db;
  logger: Logger;
}) => {
  const { db, logger: parentLogger } = props;
  return createMiddleware<{ Variables: ContextVariables }>(async (c, next) => {
    const requestId = c.get("requestId");
    const logger = parentLogger.child({
      requestId,
    });
    logger.debug({
      msg: "Request received",
      path: c.req.path,
      method: c.req.method,
      params: c.req.param(),
      query: c.req.query(),
      headers: c.req.raw.headers,
    });
    c.set("logger", logger);
    c.set("db", db);
    // Initialize null values
    c.set("session", null);
    // @ts-ignore
    const authToken = c.env.authToken;

    const headers = authToken
      ? new Headers({ Authorization: `Bearer ${authToken}` })
      : c.req.raw.headers;

    const auth = createAuth({
      db,
      logger,
    });
    // @ts-ignore
    const session = await auth.api.getSession({ headers });

    if (!session) {
      logger.debug({
        msg: "No session found",
        headers: c.req.raw.headers,
      });
      return next();
    }

    // Get active member
    const member = await auth.api.getActiveMember({
      headers,
    });

    const organizationRole = OrganizationRole.nullish().parse(member?.role);
    /**
     * Deprecated use either systemRole or organizationRole
     */
    const role = organizationRole;
    const sessionRole = session.user.role;
    const sessionId = SessionId.parse(session.session.id);
    const organizationId = OrganizationId.nullish().parse(
      session.session.activeOrganizationId,
    );
    const userId = UserId.parse(session.user.id);
    const memberId = MemberId.nullish().parse(member?.id);

    logger.debug({
      msg: "Active member",
      memberId,
      sessionRole,
      role,
      sessionId,
      organizationId,
      userId,
    });
    // Set user with proper type
    c.set("session", {
      activeOrganizationId: OrganizationId.parse(
        session.session.activeOrganizationId,
      ),
      organizationRole: OrganizationRole.parse(member?.role),
      systemRole: SystemRole.parse(session.user.role),
      userId: UserId.parse(session.user.id),
      memberId: MemberId.parse(member?.id),
    });

    return next();
  });
};
