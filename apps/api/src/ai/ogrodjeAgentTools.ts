import { tool } from "ai";
import type { Logger } from "logger";
import {
  createOgrodjeClient,
  EventsQueryParamsSchema,
  MeetupEventsQueryParamsSchema,
  MeetupsQueryParamsSchema,
  MeetupEventsPathParamsSchema,
} from "ogrodje-client";
import { z } from "zod";

export const createOgrodjeClientTools = (props: {
  logger: Logger;
}) => {
  const client = createOgrodjeClient();

  const eventsTool = tool({
    id: "ogrodje.events" as const,
    description: "Get events from the Ogrodje API",
    parameters: EventsQueryParamsSchema,
    execute: async (params) => {
      const result = await client.events(params);
      if (result.isErr()) {
        props.logger.error({
          msg: "Error fetching events:",
          error: result.error,
        });
        // Return a structured error or a message the AI can understand
        return { error: `Failed to fetch events: ${result.error.message}` };
      }
      return result.value; // Return the actual events data on success
    },
  });

  const meetupsTool = tool({
    id: "ogrodje.meetups" as const,
    description: "Get meetups from the Ogrodje API",
    parameters: MeetupsQueryParamsSchema,
    execute: async (params) => {
      const result = await client.meetups(params);
      if (result.isErr()) {
        props.logger.error({
          msg: "Error fetching meetups:",
          error: result.error,
        });
        return { error: `Failed to fetch meetups: ${result.error.message}` };
      }
      return result.value;
    },
  });

  const meetupEventsTool = tool({
    id: "ogrodje.meetupEvents" as const,
    description: "Get events for a specific meetup from the Ogrodje API",
    parameters: z.object({
      path: MeetupEventsPathParamsSchema,
      query: MeetupEventsQueryParamsSchema,
    }),
    execute: async ({ path, query }) => {
      const result = await client.meetupEvents(path, query);
      if (result.isErr()) {
        props.logger.error({
          msg: "Error fetching meetup events:",
          error: result.error,
        });
        return {
          error: `Failed to fetch meetup events: ${result.error.message}`,
        };
      }
      return result.value;
    },
  });

  const timelineTool = tool({
    id: "ogrodje.timeline" as const,
    description: "Get the events timeline from the Ogrodje API",
    parameters: z.object({}), // No parameters
    execute: async () => {
      const result = await client.timeline();
      if (result.isErr()) {
        props.logger.error({
          msg: "Error fetching timeline:",
          error: result.error,
        });
        return { error: `Failed to fetch timeline: ${result.error.message}` };
      }
      return result.value;
    },
  });

  return {
    eventsTool,
    meetupsTool,
    meetupEventsTool,
    timelineTool,
  };
};
