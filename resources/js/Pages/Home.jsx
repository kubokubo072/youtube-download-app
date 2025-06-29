// YouTubeDownloader.js
import {
  Box,
  Flex,
  Heading,
  Input,
  Button,
  useDisclosure,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  VStack,
  HStack,
  useMediaQuery,
  Text,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import React from 'react';

export default function Home() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isMobile] = useMediaQuery('(max-width: 768px)');

  const NavLinks = () => (
    <HStack spacing={6}>
      <Button variant="ghost" _hover={{ bg: 'teal.600', color: 'white' }}>
        ホーム
      </Button>
      <Button variant="ghost" _hover={{ bg: 'teal.600', color: 'white' }}>
        使い方
      </Button>
      <Button variant="ghost" _hover={{ bg: 'teal.600', color: 'white' }}>
        よくある質問
      </Button>
    </HStack>
  );

  return (
    <Box>
      {/* Header */}
      <Flex
        as="header"
        bg={isMobile ? 'teal.600' : 'teal.500'}
        color={isMobile ? 'yellow.200' : 'white'}
        align="center"
        justify="space-between"
        px={4}
        py={3}
        shadow="md"
      >
        <Heading
          size={isMobile ? 'md' : 'lg'}
          fontWeight="bold"
          letterSpacing="wide"
        >
          YouTubeダウンローダー
        </Heading>

        {isMobile ? (
          <>
            <IconButton
              aria-label={isOpen ? 'メニューを閉じる' : 'メニューを開く'}
              icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
              onClick={isOpen ? onClose : onOpen}
              variant="ghost"
              colorScheme="yellow"
              fontSize="2xl"
            />
            <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
              <DrawerOverlay />
              <DrawerContent>
                <DrawerHeader borderBottomWidth="1px">メニュー</DrawerHeader>
                <DrawerBody>
                  <VStack align="start" spacing={4} mt={4}>
                    <Button variant="ghost" w="100%" onClick={onClose}>
                      ホーム
                    </Button>
                    <Button variant="ghost" w="100%" onClick={onClose}>
                      使い方
                    </Button>
                    <Button variant="ghost" w="100%" onClick={onClose}>
                      よくある質問
                    </Button>
                  </VStack>
                </DrawerBody>
              </DrawerContent>
            </Drawer>
          </>
        ) : (
          <NavLinks />
        )}
      </Flex>

      {/* Main content */}
      <Flex
        direction="column"
        align="center"
        justify="center"
        minH="70vh"
        px={4}
        py={10}
        bg="gray.50"
      >
        <Heading
          size={isMobile ? 'lg' : '2xl'}
          textAlign="center"
          mb={6}
          color={isMobile ? 'teal.700' : 'teal.900'}
        >
          YouTube動画を簡単ダウンロード
        </Heading>

        <Flex
          direction={isMobile ? 'column' : 'row'}
          width="100%"
          maxW="600px"
          gap={4}
        >
          <Input placeholder="URLを入力してください" size="lg" />
          <Button colorScheme="teal" size="lg" px={8}>
            ダウンロード
          </Button>
        </Flex>
      </Flex>

      {/* Footer */}
      <Box as="footer" textAlign="center" py={4} fontSize="sm" color="gray.500">
        © 2025 YouTube Downloader. All rights reserved.
      </Box>
    </Box>
  );
}
