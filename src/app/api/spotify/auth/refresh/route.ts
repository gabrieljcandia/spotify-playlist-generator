import { Cookies } from "@/app/constant/cookies";
import { NextResponse } from "next/server";

export async function POST(req: Request): Promise<NextResponse> {
    const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;

    if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
        return NextResponse.json({ error: "Missing required environment variables" }, { status: 400 });
    }

    const refreshToken = req.headers.get("Cookie")?.split("; ")
        .find((cookie) => cookie.startsWith(`${Cookies.SPOTIFY_REFRESH_TOKEN}=`))
        ?.split("=")[1];

    if (!refreshToken) {
        return NextResponse.json({ error: "Missing refresh token" }, { status: 400 });
    }

    const authBuffer = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64");

    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            Authorization: `Basic ${authBuffer}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: refreshToken,
        }),
    });

    if (!response.ok) {
        console.error("Failed to refresh access token", response.status, await response.json())
        return NextResponse.json({ error: "Failed to refresh access token" }, { status: response.status });
    }

    const { access_token, expires_in } = await response.json();

    // Store new access token as a secure cookie
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "Strict",
    };

    const expirationDate = new Date(Date.now() + expires_in * 1000).getTime();

    const headers = new Headers();
    headers.append("Set-Cookie", `${Cookies.SPOTIFY_ACCESS_TOKEN}=${access_token}; Max-Age=${expires_in}; ${Object.entries(cookieOptions).map(([k, v]) => `${k}=${v}`).join("; ")}`);
    headers.append("Set-Cookie", `${Cookies.SPOTIFY_EXPIRES_AT}=${expirationDate}; Max-Age=${expires_in}; Path=/; Secure; SameSite=Strict`);

    return NextResponse.json({ message: "Access token refreshed" }, { status: 200, headers });
}