import type { ContextVariables } from "@/types";
export declare const publicRoutes: import("hono/hono-base").HonoBase<{
    Variables: ContextVariables;
}, {
    "*": {};
} | import("hono/types").MergeSchemaPath<{
    "/": {
        $get: {
            input: {};
            output: {
                title: string;
                id: `cnv_${string}`;
                createdAt: string;
                updatedAt: string;
                createdBy: `mbr_${string}`;
                updatedBy: `mbr_${string}`;
                workspaceId: `wsp_${string}`;
            }[];
            outputFormat: "json";
            status: 200;
        } | {
            input: {};
            output: {
                requestId: `req_${string}`;
                message: string;
            };
            outputFormat: "json";
            status: 400;
        } | {
            input: {};
            output: {
                requestId: `req_${string}`;
                message: string;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {};
            output: {
                requestId: `req_${string}`;
                message: string;
            };
            outputFormat: "json";
            status: 403;
        } | {
            input: {};
            output: {
                requestId: `req_${string}`;
                message: string;
            };
            outputFormat: "json";
            status: 404;
        } | {
            input: {};
            output: {
                requestId: `req_${string}`;
                message: string;
            };
            outputFormat: "json";
            status: 500;
        };
    };
}, "/public/conversations"> | import("hono/types").MergeSchemaPath<{
    "/:conversationId": {
        $get: {
            input: {
                param: {
                    conversationId: string;
                };
            };
            output: {
                requestId: `req_${string}`;
                message: string;
            };
            outputFormat: "json";
            status: 400;
        } | {
            input: {
                param: {
                    conversationId: string;
                };
            };
            output: {
                requestId: `req_${string}`;
                message: string;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {
                param: {
                    conversationId: string;
                };
            };
            output: {
                requestId: `req_${string}`;
                message: string;
            };
            outputFormat: "json";
            status: 403;
        } | {
            input: {
                param: {
                    conversationId: string;
                };
            };
            output: {
                requestId: `req_${string}`;
                message: string;
            };
            outputFormat: "json";
            status: 404;
        } | {
            input: {
                param: {
                    conversationId: string;
                };
            };
            output: {
                requestId: `req_${string}`;
                message: string;
            };
            outputFormat: "json";
            status: 500;
        } | {
            input: {
                param: {
                    conversationId: string;
                };
            };
            output: {
                title: string;
                id: `cnv_${string}`;
                createdAt: string;
                updatedAt: string;
                createdBy: `mbr_${string}`;
                updatedBy: `mbr_${string}`;
                workspaceId: `wsp_${string}`;
            };
            outputFormat: "json";
            status: 200;
        };
    };
}, "/public/conversations/:conversationId"> | import("hono/types").MergeSchemaPath<{
    "/": {
        $post: {
            input: {
                param: {
                    conversationId: string;
                };
            } & {
                header: {
                    Authorization?: string | undefined;
                };
            } & {
                json: {
                    message: Omit<import("ai").Message, "data" | "annotations">;
                };
            };
            output: {
                requestId: `req_${string}`;
                message: string;
            };
            outputFormat: "json";
            status: 400;
        } | {
            input: {
                param: {
                    conversationId: string;
                };
            } & {
                header: {
                    Authorization?: string | undefined;
                };
            } & {
                json: {
                    message: Omit<import("ai").Message, "data" | "annotations">;
                };
            };
            output: {
                requestId: `req_${string}`;
                message: string;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {
                param: {
                    conversationId: string;
                };
            } & {
                header: {
                    Authorization?: string | undefined;
                };
            } & {
                json: {
                    message: Omit<import("ai").Message, "data" | "annotations">;
                };
            };
            output: {
                requestId: `req_${string}`;
                message: string;
            };
            outputFormat: "json";
            status: 403;
        } | {
            input: {
                param: {
                    conversationId: string;
                };
            } & {
                header: {
                    Authorization?: string | undefined;
                };
            } & {
                json: {
                    message: Omit<import("ai").Message, "data" | "annotations">;
                };
            };
            output: {
                requestId: `req_${string}`;
                message: string;
            };
            outputFormat: "json";
            status: 404;
        } | {
            input: {
                param: {
                    conversationId: string;
                };
            } & {
                header: {
                    Authorization?: string | undefined;
                };
            } & {
                json: {
                    message: Omit<import("ai").Message, "data" | "annotations">;
                };
            };
            output: {
                requestId: `req_${string}`;
                message: string;
            };
            outputFormat: "json";
            status: 500;
        } | {
            input: {
                param: {
                    conversationId: string;
                };
            } & {
                header: {
                    Authorization?: string | undefined;
                };
            } & {
                json: {
                    message: Omit<import("ai").Message, "data" | "annotations">;
                };
            };
            output: {};
            outputFormat: string;
            status: 200;
        };
    };
}, "/public/conversations/:conversationId/messages">, "/public/conversations">;
export type PublicRoutes = typeof publicRoutes;
