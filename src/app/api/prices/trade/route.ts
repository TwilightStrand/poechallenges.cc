import { NextRequest, NextResponse } from "next/server";

// Fetches the cheapest instant buyout price from the official PoE trade API
// Uses status: "securable" which means automated/instant buyout — real prices, no price fixers

const TRADE_API = "https://www.pathofexile.com/api/trade";

export async function GET(request: NextRequest) {
  const league = request.nextUrl.searchParams.get("league");
  const item = request.nextUrl.searchParams.get("item");

  if (!league || !item) {
    return NextResponse.json({ error: "Missing league or item" }, { status: 400 });
  }

  try {
    // Step 1: Search for the item with instant buyout only
    const searchBody = {
      query: {
        type: item,
        status: { option: "securable" },
        stats: [{ type: "and", filters: [] }],
      },
      sort: { price: "asc" },
    };

    const searchRes = await fetch(`${TRADE_API}/search/${encodeURIComponent(league)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "PoEChallengeTracker/1.0",
      },
      body: JSON.stringify(searchBody),
      next: { revalidate: 300 }, // cache 5 minutes
    });

    // The trade API may block us without a POESESSID — that's expected
    // In that case, return null and fall back to poe.ninja
    if (!searchRes.ok) {
      return NextResponse.json({
        price: null,
        error: "Trade API unavailable (may need authentication)",
      });
    }

    const searchData = await searchRes.json();
    const resultIds: string[] = searchData.result?.slice(0, 5) ?? [];
    const queryId = searchData.id;

    if (resultIds.length === 0 || !queryId) {
      return NextResponse.json({ price: null, listings: 0 });
    }

    // Step 2: Fetch the first few listings to get the cheapest price
    const fetchRes = await fetch(
      `${TRADE_API}/fetch/${resultIds.join(",")}?query=${queryId}`,
      {
        headers: { "User-Agent": "PoEChallengeTracker/1.0" },
      },
    );

    if (!fetchRes.ok) {
      return NextResponse.json({ price: null, error: "Failed to fetch listings" });
    }

    const fetchData = await fetchRes.json();
    const listings = fetchData.result ?? [];

    if (listings.length === 0) {
      return NextResponse.json({ price: null, listings: 0 });
    }

    // Extract cheapest price in chaos
    const prices: number[] = [];
    for (const listing of listings) {
      const price = listing.listing?.price;
      if (price?.currency === "chaos") {
        prices.push(price.amount);
      } else if (price?.currency === "divine") {
        // Convert divine to chaos (rough estimate, could use poe.ninja rate)
        prices.push(price.amount * 300);
      }
    }

    if (prices.length === 0) {
      return NextResponse.json({ price: null, listings: listings.length });
    }

    const cheapest = Math.min(...prices);
    const total = searchData.total ?? listings.length;

    return NextResponse.json({
      price: cheapest,
      listings: total,
      source: "trade-securable",
    });
  } catch {
    return NextResponse.json({ price: null, error: "Trade API request failed" });
  }
}
