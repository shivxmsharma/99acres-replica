"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

export default function SafeImage({
  src,
  alt,
  fallbackSrc = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800",
  className,
  ...props
}) {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);

  useEffect(() => {
    setImgSrc(src || fallbackSrc);
  }, [src, fallbackSrc]);

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt || "Image"}
      className={`${className} object-cover`}
      fill={!props.width && !props.height}
      sizes={props.sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
      onError={() => {
        setImgSrc(fallbackSrc);
      }}
    />
  );
}
