import { Icon, Link as ChakraLink, Text, LinkProps } from "@chakra-ui/react";
import { ElementType } from "react";
import Link from 'next/link';
import { ActiveLink } from "../ActiveLink";

interface NavLinkProps extends LinkProps {
  icon: ElementType;
  children: string;
  href: string;
  exact?: boolean;
}

export function NavLink({icon, children, href, exact = false, ...rest}: NavLinkProps) {
  return (
    <ActiveLink href={href} passHref exact>
      <ChakraLink display="flex" align="center" {...rest}>
        <Icon as={icon} fontSize="20" />
        <Text ml="4" fontWeight="medium">{children}</Text>
      </ChakraLink>
    </ActiveLink>
  );
}