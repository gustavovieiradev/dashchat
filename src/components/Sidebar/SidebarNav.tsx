import { Stack } from "@chakra-ui/react";
import { RiContactsLine, RiDashboardLine, RiGitMergeLine, RiInputMethodLine } from "react-icons/ri";
import { NavLink } from "./NavLink";
import { NavSection } from "./NavSection";

export function SidebarNav() {
  return (
    <Stack spacing="12" align="flex-start">
      <NavSection title="CHAT">
        <NavLink href="/chat" icon={RiDashboardLine} children="Chat" />
        <NavLink href="/intent" icon={RiDashboardLine} children="Intenções" />
      </NavSection>

      <NavSection title="USUÁRIOS">
        <NavLink href="/users" icon={RiContactsLine} children="Usuários" />
      </NavSection>

      <NavLink href="/" icon={RiContactsLine} children="Sair" exact={true} />
    </Stack>
  )
}