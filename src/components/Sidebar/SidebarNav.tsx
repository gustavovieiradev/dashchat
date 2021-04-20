import { Stack } from "@chakra-ui/react";
import { RiContactsLine, RiDashboardLine, RiGitMergeLine, RiInputMethodLine } from "react-icons/ri";
import { NavLink } from "./NavLink";
import { NavSection } from "./NavSection";

export function SidebarNav() {
  return (
    <Stack spacing="12" align="flex-start">
      <NavSection title="GERAL">
        <NavLink href="/dashboard" icon={RiDashboardLine} children="Dashboard" />
        <NavLink href="/users" icon={RiContactsLine} children="Usuários" />
      </NavSection>
      <NavSection title="AUTOMAÇÃO">
        <NavLink href="/dashboard" icon={RiInputMethodLine} children="Formulários" />
        <NavLink href="/dashboard" icon={RiGitMergeLine} children="Automação" />
      </NavSection>
    </Stack>
  )
}