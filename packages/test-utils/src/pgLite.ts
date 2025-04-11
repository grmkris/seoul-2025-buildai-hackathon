import { PGlite } from "@electric-sql/pglite";
import { uuid_ossp } from "@electric-sql/pglite/contrib/uuid_ossp";

let db: PGlite;

/**
 * Creates a new PGlite instance, or returns the existing one if it already exists
 * @param props - Optional properties
 * @param props.fresh - If true, a new PGlite instance will be created
 * @returns The PGlite instance
 */
export const createPgLite = (props?: {
	fresh?: boolean;
}) => {
	if (props?.fresh) {
		return new PGlite({
			extensions: {
				uuid_ossp,
			},
		});
	}
	if (!db) {
		db = new PGlite({
			extensions: {
				uuid_ossp,
			},
		});
	}
	return db;
};

export type { PGlite };
