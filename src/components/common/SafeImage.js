"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

export default function SafeImage({
  src,
  alt,
  fallbackSrc = "/images/property-placeholder.jpg",
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
      className={className}
      onError={() => {
        setImgSrc(fallbackSrc);
      }}
    />
  );
}
