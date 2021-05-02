import { ChakraProvider } from "@chakra-ui/react";
import { AppProps } from "next/app";
import { SidebarDrawerProvider } from "../contexts/SidebarDrawerContext";
import { UserProvider } from "../contexts/UserContext";
import { theme } from "../styles/theme";
import Router from "next/router";
import ProgressBar from "@badrap/bar-of-progress";

import '../styles/global.scss';

const progress = new ProgressBar({
  size: 3,
  color: "#D53F8C",
  delay: 100,
  className: 'bar-of-progress'
});

Router.events.on("routeChangeStart", progress.start);
Router.events.on("routeChangeComplete", progress.finish);
Router.events.on("routeChangeError", progress.finish);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <UserProvider>
        <SidebarDrawerProvider>
          <Component {...pageProps} />
        </SidebarDrawerProvider>
      </UserProvider>
    </ChakraProvider>
  )
}

export default MyApp
