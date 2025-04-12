import type { OpenAPIHono } from "@hono/zod-openapi";
export declare const PUBLIC_ROUTES_PATH = "/public/";
declare const publicRoutes: OpenAPIHono<import("hono").Env, import("hono/types").MergeSchemaPath<{
    "/:conversationId": {
        $get: {
            input: {
                param: {
                    conversationId: string;
                };
            };
            output: {
                message: string;
                requestId: `req_${string}`;
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
                message: string;
                requestId: `req_${string}`;
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
                message: string;
                requestId: `req_${string}`;
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
                message: string;
                requestId: `req_${string}`;
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
                message: string;
                requestId: `req_${string}`;
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
                createdAt: string;
                updatedAt: string;
                id: `cnv_${string}`;
                createdBy: `mbr_${string}`;
                updatedBy: `mbr_${string}`;
                workspaceId: `wsp_${string}`;
            };
            outputFormat: "json";
            status: 200;
        };
    };
}, "/">, "/">;
export { publicRoutes };
