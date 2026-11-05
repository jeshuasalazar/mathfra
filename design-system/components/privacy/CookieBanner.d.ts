export interface CookieBannerProps {
  onAccept?: () => void;
  onReject?: () => void;
  onConfigure?: () => void;
  isStatic?: boolean;
}
export declare function CookieBanner(props: CookieBannerProps): JSX.Element;
