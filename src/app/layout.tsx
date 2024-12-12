import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Spotify Playlist Generator',
  description:
    'Generate custom Spotify playlists based on your mood, scenarios, and preferences.',
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#4caf50',
  openGraph: {
    title: 'Spotify Playlist Generator',
    description:
      'Create and customize Spotify playlists tailored to your preferences.',
    url: 'https://spotify-playlist-generator-nine.vercel.app/',
    siteName: 'Spotify Playlist Generator',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Spotify Playlist Generator',
    description:
      'Generate Spotify playlists based on mood, scenario, and more.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#4caf50" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
