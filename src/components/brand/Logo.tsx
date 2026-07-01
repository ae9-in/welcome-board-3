import logoAsset from "@/assets/logo.png";

export function LogoMark({ className = "", alt = "Welcome Onboard" }: { className?: string; alt?: string }) {
  return <img src={logoAsset} alt={alt} className={className} draggable={false} />;
}

export const logoUrl = logoAsset;