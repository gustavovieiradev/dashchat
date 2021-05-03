import { Stack } from "@chakra-ui/react";
import { RiChatSmile3Fill, RiChatSmile3Line, RiContactsBook2Line, RiContactsLine, RiDashboardLine, RiEditLine, RiGitMergeLine, RiInputMethodLine, RiLogoutBoxLine, RiUserSmileLine, RiWechatLine } from "react-icons/ri";
import { AiOutlineFundProjectionScreen } from "react-icons/ai";
import { SiSwagger } from "react-icons/si";
import { NavLink } from "./NavLink";
import { NavSection } from "./NavSection";
import { Icon, Link, Text, LinkProps } from "@chakra-ui/react";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";

export function SidebarNav() {
  const [cookies, setCookie, removeCookie] = useCookies(['user']);
  const router = useRouter();

  function logout(ev) {
    ev.preventDefault();
    removeCookie('user');
    removeCookie('token');
    router.push('/');
  }

  return (
    <Stack spacing="12" align="flex-start">
      <NavSection title="CHAT">
        <NavLink href="/chat" icon={RiChatSmile3Line} children="Chat" />
        <NavLink href="/intent" icon={RiDashboardLine} children="Intenções" />
        <NavLink href="/conversations" icon={RiWechatLine} children="Conversas" />
        <NavLink href="/preview" icon={RiChatSmile3Fill} children="Preview" />
        <NavLink href="/endpoint" icon={SiSwagger} children="API" />
      </NavSection>

      <NavSection title="ADMIN">
        <NavLink href="/users" icon={RiUserSmileLine} children="Usuários" />
        <NavLink href="/clients" icon={RiContactsBook2Line} children="Clientes" />
        <NavLink href="/projects" icon={AiOutlineFundProjectionScreen} children="Projetos" />
      </NavSection>

      <NavSection title="">
        <NavLink href="/profile" icon={RiEditLine} children="Editar perfil" />
        <Link as="button" display="flex" alignItems="center" onClick={logout}>
          <Icon as={RiLogoutBoxLine} fontSize="20" />
          <Text ml="4" fontWeight="medium">Sair</Text>
        </Link>
      </NavSection>
    </Stack>
  )
}