import { Box, Button, Code, Divider, Flex, Heading, HStack, Radio, RadioGroup, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { Input } from "../../components/Form/Input";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";

export default function Chat() {
  return (
    <Box>
      <Header />
      <Flex as="form" w="100%" my="6" maxW={1480} mx="auto" px="6">
        <Sidebar />
        <Box flex="1" borderRadius={8} bg="gray.800" p={["6", "8"]}>
          <Heading size="lg" fontWeight="normal">Informações do chat</Heading>
          <Divider my="6" borderColor="gray.700" />
          <VStack spacing="8">
            <Box w="100%">
              <Text fontWeight="medium" mb="2">Para ter o chat em qualquer página do seu site basta colar o seguinte código: </Text>
              <Code children={'<iframe src="http://192.168.0.210:3001" style={{position: "absolute", bottom: "10px", right: "10px", height: "800px", width: "400px"}} title="Iframe Example"></iframe>'} />
            </Box>
            <Box w="100%">
              <Text fontWeight="medium" mb="2">Para ter o chat completo em qualquer página do seu site basta colar o seguinte código: </Text>
              <Code children={'<iframe src="http://192.168.0.210:3001/chat" style={{position: "absolute", height: "100%", width: "100%"}} title="Iframe Example"></iframe>'} />
            </Box>
            <Box w="100%">
              <Input name="title" label="Título" />
            </Box>
            <Box w="100%">
              <Text fontWeight="medium" mb="2">Selecione o tema: </Text>
              <RadioGroup>
                <HStack align="start">
                  <Box bg="black" p="2" borderRadius="5">
                    <Radio value="1" colorScheme="black">Preto e branco</Radio>
                  </Box>
                  <Box bg="red.500" p="2" borderRadius="5">
                    <Radio value="2" colorScheme="red">Preto e branco</Radio>
                  </Box>
                  <Box bg="green.500" p="2" borderRadius="5">
                    <Radio value="3" colorScheme="green">Verde e branco</Radio>
                  </Box>
                  <Box bg="blue.500" p="2" borderRadius="5">
                    <Radio value="4" colorScheme="blue">Azul e branco</Radio>
                  </Box>
                </HStack>
              </RadioGroup>
            </Box>

          </VStack>
          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Button colorScheme="pink" type="submit">Salvar</Button>
            </HStack>
          </Flex>
        </Box>
      </Flex>
    </Box>
  )
}