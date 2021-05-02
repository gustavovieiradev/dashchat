import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";
import { ReactElement, cloneElement } from "react";

interface ActiveLinkProps extends LinkProps {
  children: ReactElement;
  exact?: boolean;
}

export function ActiveLink({children, exact = false, ...rest}: ActiveLinkProps) {
  const { asPath } = useRouter();

  let isActive = false;

  if (exact && (asPath === rest.href || asPath === rest.as)) {
    isActive = true;
  }

  if (!exact && (asPath.startsWith(String(rest.href)) || asPath.startsWith(String(rest.as)) )) {
    isActive = true;
  }

  return (
    <Link {...rest}>
      {cloneElement(children, {
        _hover: {
          color: isActive ? 'pink.400' : 'whiteAlpha.700'
        },
        color: isActive ? 'pink.400' : 'gray.50'
      })}
    </Link>
  )
}