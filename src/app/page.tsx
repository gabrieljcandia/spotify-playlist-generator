"use client"
import { useState } from 'react';
import { searchSongs } from './utils/spotify';
import ChatGPTIntegration from './components/chat';
import SongSearch from './components/search-song';

export default function Home() {
  return (<>
    <ChatGPTIntegration />
    <SongSearch />
  </>)
}
