import { forwardRef } from "react";
import { ArrowUpRight } from "lucide-react";

/**
 * Three variants:
 *  - solid:  gold fill, the primary "Book Tickets" action
 *  - ghost:  hairline outline for secondary actions
 *  - link:   underlined text link with an arrow
 * Renders an <a> when `href` is passed, otherwise a <button>.
 */
const Button = forwardRef(function Button(
  { variant = "solid", size = "md", href, icon = true, className = "", children, ...rest },
  ref
) {
  const Tag = href ? "a" : "button";
  const cls = `vr-btn vr-btn--${variant} vr-btn--${size} ${className}`;
  const external = href && /^https?:/.test(href);
  return (
    <Tag
      ref={ref}
      href={href}
      className={cls}
      {...(Tag === "button" ? { type: rest.type || "button" } : {})}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
    >
      <span className="vr-btn__label">{children}</span>
      {icon && <ArrowUpRight className="vr-btn__icon" size={size === "lg" ? 18 : 16} strokeWidth={1.5} aria-hidden="true" />}
    </Tag>
  );
});

export default Button;
