import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type ButtonProps = ComponentPropsWithoutRef<"button"> & { href?: undefined };
type AnchorProps = ComponentPropsWithoutRef<"a"> & { href: string };

export type ActionProps = (ButtonProps | AnchorProps) & { children: ReactNode };

/**
 * Link oder Button mit derselben Optik. Interne Pfade („/…“, „#…“) laufen über next/link,
 * tel:, mailto: und externe Adressen über <a>, ohne href wird ein <button>.
 */
export function Action(props: ActionProps) {
  if (props.href === undefined) {
    const { type = "button", ...rest } = props as ButtonProps;
    return <button type={type} {...rest} />;
  }
  const { href, ...rest } = props as AnchorProps;
  if (href.startsWith("/") || href.startsWith("#")) {
    return <Link href={href} {...rest} />;
  }
  const external = /^https?:/.test(href);
  return <a href={href} {...(external ? { target: "_blank", rel: "noopener" } : {})} {...rest} />;
}
