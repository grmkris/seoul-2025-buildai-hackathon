import { createClient, type NormalizeOAS, type OASOutput } from "fets";
import { z } from "zod";
import { type Result, err, ok } from "neverthrow";
import type { openapi } from "./openapi";

const client = createClient<NormalizeOAS<typeof openapi>>({
  endpoint: "https://goo.ogrodje.si",
});

export const EventsQueryParamsSchema = z.object({
  limit: z.number().int().optional(),
  offset: z.number().int().optional(),
});

export const MeetupsQueryParamsSchema = z.object({
  limit: z.number().int().optional(),
  offset: z.number().int().optional(),
});

export const MeetupEventsPathParamsSchema = z.object({
  meetup_id: z.string(),
});

export const MeetupEventsQueryParamsSchema = z.object({
  limit: z.number().int().optional(),
  offset: z.number().int().optional(),
});

// Define custom error types for the Ogrodje client
export type OgrodjeClientError =
  | { type: "GET_EVENTS_ERROR"; message: string; cause?: unknown }
  | { type: "GET_MEETUPS_ERROR"; message: string; cause?: unknown }
  | { type: "GET_MEETUP_EVENTS_ERROR"; message: string; cause?: unknown }
  | { type: "GET_TIMELINE_ERROR"; message: string; cause?: unknown }
  | { type: "FETCH_ERROR"; message: string; cause?: unknown }; // General fetch error

// Extract response types (Replace 'any' with actual types if known, possibly from openapi)
// Assuming the openapi types provide response structures, e.g., EventsResponse, MeetupsResponse etc.
// For now, using 'any' as a placeholder. You might need to generate/import these from your OpenAPI spec.
type EventsResponse = OASOutput<NormalizeOAS<typeof openapi>, '/events', 'get', '200'>
type MeetupsResponse = OASOutput<NormalizeOAS<typeof openapi>, '/meetups', 'get', '200'>
type MeetupEventsResponse = OASOutput<NormalizeOAS<typeof openapi>, '/meetups/{meetup_id}/events', 'get', '200'>
type TimelineResponse = OASOutput<NormalizeOAS<typeof openapi>, '/timeline', 'get', '200'>

export const createOgrodjeClient = () => {
  const events = async (
    props: z.infer<typeof EventsQueryParamsSchema>,
  ): Promise<Result<EventsResponse, OgrodjeClientError>> => {
    try {
      const validatedProps = EventsQueryParamsSchema.parse(props);
      const response = await client["/events"].get({ query: validatedProps });
      if (!response.ok) { // Check response.ok instead of status
        const errorData = await response.json().catch(() => ({})); // Try to get error details
        return err({
          type: "GET_EVENTS_ERROR",
          message: `Failed to get events. Status: ${response.status}`,
          cause: errorData,
        });
      }
      const data = await response.json();
      return ok(data);
    } catch (error) {
      // Handle validation errors or network errors
      return err({
        type: error instanceof z.ZodError ? "GET_EVENTS_ERROR" : "FETCH_ERROR",
        message: "Failed during events fetch or validation",
        cause: error,
      });
    }
  };

  const meetups = async (
    props: z.infer<typeof MeetupsQueryParamsSchema>,
  ): Promise<Result<MeetupsResponse, OgrodjeClientError>> => {
    try {
      const validatedProps = MeetupsQueryParamsSchema.parse(props);
      const response = await client["/meetups"].get({ query: validatedProps });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return err({
          type: "GET_MEETUPS_ERROR",
          message: `Failed to get meetups. Status: ${response.status}`,
          cause: errorData,
        });
      }
      const data = await response.json();
      return ok(data);
    } catch (error) {
      return err({
        type: error instanceof z.ZodError ? "GET_MEETUPS_ERROR" : "FETCH_ERROR",
        message: "Failed during meetups fetch or validation",
        cause: error,
      });
    }
  };

  const meetupEvents = async (
    pathParams: z.infer<typeof MeetupEventsPathParamsSchema>,
    queryParams: z.infer<typeof MeetupEventsQueryParamsSchema>,
  ): Promise<Result<MeetupEventsResponse, OgrodjeClientError>> => {
    try {
      const validatedPathParams = MeetupEventsPathParamsSchema.parse(pathParams);
      const validatedQueryParams =
        MeetupEventsQueryParamsSchema.parse(queryParams);
      const response = await client["/meetups/{meetup_id}/events"].get({
        params: validatedPathParams,
        query: validatedQueryParams,
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return err({
          type: "GET_MEETUP_EVENTS_ERROR",
          message: `Failed to get meetup events. Status: ${response.status}`,
          cause: errorData,
        });
      }
      const data = await response.json();
      return ok(data);
    } catch (error) {
       return err({
        type: error instanceof z.ZodError ? "GET_MEETUP_EVENTS_ERROR" : "FETCH_ERROR",
        message: "Failed during meetup events fetch or validation",
        cause: error,
      });
    }
  };

  const timeline = async (): Promise<
    Result<TimelineResponse, OgrodjeClientError>
  > => {
    try {
      const response = await client["/timeline"].get({});
      if (!response.ok) {
         const errorData = await response.json().catch(() => ({}));
        return err({
          type: "GET_TIMELINE_ERROR",
          message: `Failed to get timeline. Status: ${response.status}`,
          cause: errorData,
        });
      }
      const data = await response.json();
      return ok(data);
     } catch (error) {
       return err({
        type: "FETCH_ERROR", // No validation here, so likely a fetch issue
        message: "Failed during timeline fetch",
        cause: error,
      });
    }
  };

  return {
    events,
    meetups,
    meetupEvents,
    timeline,
  };
};
