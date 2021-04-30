import { Stack } from "@chakra-ui/react";
import { RiContactsLine, RiDashboardLine, RiGitMergeLine, RiInputMethodLine } from "react-icons/ri";
import { NavLink } from "./NavLink";
import { NavSection } from "./NavSection";
import { Icon, Link, Text, LinkProps } from "@chakra-ui/react";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";

export function SidebarNav() {
  const [cookies, setCookie, removeCookie] = useCookies(['user']);
  const router = useRouter();

  function logout() {
    removeCookie('user');
    removeCookie('token');
    router.push('/');
  }

  return (
    <Stack spacing="12" align="flex-start">
      <NavSection title="CHAT">
        <NavLink href="/chat" icon={RiDashboardLine} children="Chat" />
        <NavLink href="/intent" icon={RiDashboardLine} children="Intenções" />
        <NavLink href="/conversations" icon={RiDashboardLine} children="Conversas" />
        <NavLink href="/preview" icon={RiDashboardLine} children="Preview" />
      </NavSection>

      <NavSection title="ADMIN">
        <NavLink href="/users" icon={RiContactsLine} children="Usuários" />
        <NavLink href="/clients" icon={RiContactsLine} children="Clientes" />
        <NavLink href="/projects" icon={RiContactsLine} children="Projetos" />
      </NavSection>

      <Link as="button" display="flex" alignItems="center" onClick={logout}>
        <Icon as={RiContactsLine} fontSize="20" />
        <Text ml="4" fontWeight="medium">Sair</Text>
      </Link>
    </Stack>
  )
}