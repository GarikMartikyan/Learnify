import { Image, type ImageProps } from "antd";
import fullLogo from "../../assets/logos/learnify_full_logo.png";
import logoImage from "../../assets/logos/logo_image.png";
import logoText from "../../assets/logos/logo_text_imahe_height.png";
import logoTextSlim from "../../assets/logos/learnify_text_slim.png";

export interface LogoProps extends ImageProps {
  variant?: "full" | "image" | "text" | "text-slim";
}

export function Logo({ variant = "full", style, ...rest }: LogoProps) {
  let logoSrc;
  switch (variant) {
    case "image":
      logoSrc = logoImage;
      break;
    case "text":
      logoSrc = logoText;
      break;
    case "text-slim":
      logoSrc = logoTextSlim;
      break;
    default:
      logoSrc = fullLogo;
      break;
  }
  const finalStyles: ImageProps["style"] = {
    height: 60,
    ...style,
  };
  return <Image src={logoSrc} preview={false} {...rest} style={finalStyles} />;
}
