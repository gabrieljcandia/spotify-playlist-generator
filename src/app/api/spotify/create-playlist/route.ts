import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Cookies } from "@/app/constant/cookies";

export async function POST(req: Request): Promise<NextResponse> {
    const cookieStore = await cookies();
    const access_token = cookieStore.get(Cookies.SPOTIFY_ACCESS_TOKEN)?.value;

    if (!access_token) {
        return NextResponse.json({ error: "Access token missing or expired" }, { status: 401 });
    }

    const { userId, playlistName, description, isPublic } = await req.json();

    console.log(`Creating playlist for user ${userId} with name ${playlistName}`);

    if (!userId || !playlistName) {
        return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: playlistName,
            description: description || "Generated by Spotify Playlist Generator",
            public: isPublic ?? true,
        }),
    });

    console.debug(`Create Playlist Response: ${JSON.stringify(response)}`);

    if (!response.ok) {
        return NextResponse.json({ error: "Failed to create playlist" }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
}
