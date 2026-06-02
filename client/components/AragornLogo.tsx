import Image from 'next/image';

interface AragornLogoProps {
  className?: string;
  size?: number;
}

export default function AragornLogo({ className = '', size = 40 }: AragornLogoProps) {
  return (
    <Image
      src="/logo.png"
      alt="Aragorn"
      width={size}
      height={size}
      className={`rounded-lg object-contain ${className}`}
      priority
    />
  );
}
