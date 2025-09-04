import { http, HttpResponse } from "msw";
import {
  USER_BETS_TABLE,
  USER_SCORES_TABLE,
  SUPABASE_V1_URL,
} from "~/services/constants/dbService";
import {
  mockSupabaseBets,
  mockSupabaseScore,
  mockOngoingBet,
  mockUserScore,
} from "./mockedData";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export const betsRequestHandler = [
  http.get(
    `${SUPABASE_URL}${SUPABASE_V1_URL}${USER_BETS_TABLE}`,
    async ({ request }) => {
      const url = new URL(request.url);
      const userId = url.searchParams.get("user_id");

      if (!userId) {
        return HttpResponse.json([], { status: 200 });
      }

      return HttpResponse.json(mockSupabaseBets, { status: 200 });
    }
  ),

  http.post(`${SUPABASE_URL}${SUPABASE_V1_URL}${USER_BETS_TABLE}`, async () => {
    return HttpResponse.json([...mockSupabaseBets, mockOngoingBet], {
      status: 201,
    });
  }),

  http.patch(
    `${SUPABASE_URL}${SUPABASE_V1_URL}${USER_BETS_TABLE}`,
    async ({ request }) => {
      const url = new URL(request.url);
      const betId = url.searchParams.get("id");
      const body = (await request.json()) as { success: boolean };

      if (!betId) {
        return HttpResponse.json(
          { message: "Bet ID required" },
          { status: 400 }
        );
      }

      const updatedBet = {
        ...mockOngoingBet,
        id: betId,
        success: body.success,
      };

      return HttpResponse.json([updatedBet], { status: 200 });
    }
  ),

  http.get(
    `${SUPABASE_URL}${SUPABASE_V1_URL}${USER_SCORES_TABLE}`,
    async ({ request }) => {
      const url = new URL(request.url);
      const userIdParam = url.searchParams.get("user_id");

      if (!userIdParam) {
        return HttpResponse.json([], { status: 200 });
      }

      return HttpResponse.json(mockSupabaseScore, { status: 200 });
    }
  ),

  http.post(
    `${SUPABASE_URL}${SUPABASE_V1_URL}${USER_SCORES_TABLE}`,
    async ({ request }) => {
      const body = (await request.json()) as {
        user_id: string;
        score: number;
      };

      return HttpResponse.json(
        { ...mockUserScore, score: body.score },
        { status: 201 }
      );
    }
  ),

  http.patch(
    `${SUPABASE_URL}${SUPABASE_V1_URL}${USER_SCORES_TABLE}`,
    async ({ request }) => {
      const url = new URL(request.url);
      const userId = url.searchParams.get("user_id");
      const body = (await request.json()) as { score: number };

      if (!userId) {
        return HttpResponse.json(
          { message: "User ID required" },
          { status: 400 }
        );
      }

      const updatedScore = {
        ...mockUserScore,
        score: body.score,
      };

      return HttpResponse.json(updatedScore, { status: 200 });
    }
  ),
];
