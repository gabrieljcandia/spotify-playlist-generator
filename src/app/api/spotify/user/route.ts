import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Cookies } from "@/app/constant/cookies";

export async function GET(): Promise<NextResponse> {
    const cookieStore = await cookies();
    const access_token = cookieStore.get(Cookies.SPOTIFY_ACCESS_TOKEN)?.value;

    if (!access_token) {
        return NextResponse.json({ error: "Access token missing or expired" }, { status: 401 });
    }

    const response = await fetch(`https://api.spotify.com/v1/me`, {
        headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
        }
    });

    if (!response.ok) {
        return NextResponse.json({ error: "Failed to get user profile" }, { status: response.status });
    }

    const data = await response.json();
    console.debug(`Me data: ${JSON.stringify(data)}`);
    return NextResponse.json(data);
}
