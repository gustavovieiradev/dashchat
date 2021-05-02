import { Box, Divider, Flex, Heading, Text, VStack, Input, InputGroup, InputRightElement, Icon } from "@chakra-ui/react";
import { RiSendPlaneFill } from "react-icons/ri";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";

export default function Preview() {
  return (
    <Box>
      <Header />
      <Flex w="100%" my="6" maxW={1480} mx="auto" px="6">
        <Sidebar />
        <Box flex="1" borderRadius={8} bg="gray.800" p="8">
          <Heading size="lg" fontWeight="normal">Preview</Heading>
          <Heading size="md" fontWeight="normal">Teste seu chatbot</Heading>
          <Divider my="6" borderColor="gray.700" />

          <Box>
            <Flex w="100%" bgColor="gray.900" h="80px" borderTopRadius="10" align="center" px="5">
              <Heading size="lg" fontWeight="normal">Bem vindo</Heading>
            </Flex>
            <Box borderLeftWidth="3px" borderRightWidth="3px" borderColor="gray.900" p="5" height="500">
              <VStack spacing="3">
                <Flex align="flex-start" w="100%">
                  <Text w="200px" borderRadius="10" bgColor={"pink.500"} color="white" p="3">Ola</Text>
                </Flex>
                <Flex justify="flex-end" w="100%">
                <Text w="200px" borderRadius="10" bgColor={"gray.900"} color="white" p="3">Ola</Text>
                </Flex>
              </VStack>
            </Box>
            <Flex h="80px" bgColor="gray.900" borderBottomRadius="10" align="center" px="5">
              {/* <Input name="dfsa"/> */}
              <InputGroup>
                <Input
                  name="search"
                  id="search"
                  bg="gray.800"
                  variant="filled"
                  _hover={{
                    bgColor: 'gray.800'
                  }}
                  _focus={{
                    bgColor: 'gray.800',
                    borderColor: 'pink.500'
                  }}
                  size="lg"
                  placeholder="Digite aqui...."
                />
                <InputRightElement children={<Icon as={RiSendPlaneFill} color="pink.500" w="7" h="7" mt="2"/>} />
              </InputGroup>
            </Flex>
          </Box>

        </Box>
      </Flex>
    </Box>
  )
}