export declare const customerConversationRoutes: import("@hono/zod-openapi").OpenAPIHono<{
    Variables: import("../../types").ContextVariables;
}, {
    "/admin/workspaces/:workspaceId/customers/:customerId/conversations": {
        $get: {
            input: {
                param: {
                    workspaceId: string;
                    customerId: string;
                };
            } & {
                query: {
                    page?: number | undefined;
                    limit?: number | undefined;
                    orderBy?: "createdAt" | "updatedAt" | "title" | undefined;
                    orderDirection?: "asc" | "desc" | undefined;
                };
            };
            output: {};
            outputFormat: string;
            status: 400;
        } | {
            input: {
                param: {
                    workspaceId: string;
                    customerId: string;
                };
            } & {
                query: {
                    page?: number | undefined;
                    limit?: number | undefined;
                    orderBy?: "createdAt" | "updatedAt" | "title" | undefined;
                    orderDirection?: "asc" | "desc" | undefined;
                };
            };
            output: {};
            outputFormat: string;
            status: 403;
        } | {
            input: {
                param: {
                    workspaceId: string;
                    customerId: string;
                };
            } & {
                query: {
                    page?: number | undefined;
                    limit?: number | undefined;
                    orderBy?: "createdAt" | "updatedAt" | "title" | undefined;
                    orderDirection?: "asc" | "desc" | undefined;
                };
            };
            output: {};
            outputFormat: string;
            status: 404;
        } | {
            input: {
                param: {
                    workspaceId: string;
                    customerId: string;
                };
            } & {
                query: {
                    page?: number | undefined;
                    limit?: number | undefined;
                    orderBy?: "createdAt" | "updatedAt" | "title" | undefined;
                    orderDirection?: "asc" | "desc" | undefined;
                };
            };
            output: {
                data: {
                    id: `cnv_${string}`;
                    createdAt: string;
                    updatedAt: string;
                    createdBy: `cst_${string}` | null;
                    updatedBy: string;
                    workspaceId: `wsp_${string}`;
                    title: string;
                }[];
                pagination: {
                    currentPage: number;
                    totalPages: number;
                    pageSize: number;
                    totalCount: number;
                };
            };
            outputFormat: "json";
            status: 200;
        };
    };
}, "/">;
