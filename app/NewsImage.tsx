"use client";

import { useState } from "react";

// Remote news thumbnails can 404 or hotlink-block; hide gracefully on error.
export default function NewsImage({ src, alt }: { src?: string | null; alt: string }) {
  const [ok, setOk] = useState(true);
  if (!src || !ok) return null;
  return (
    <img
      className="news-thumb"
      src={src}
      alt={alt}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setOk(false)}
    />
  );
}
