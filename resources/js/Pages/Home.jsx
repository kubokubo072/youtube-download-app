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
    Spacer,
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
            {/* <Box background={'#EDF2F7'}> */}
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
                    <Flex align="center" gap={8}>
                        <NavLinks />
                        <Spacer />
                        <HStack spacing={4}>
                            <Text color={'black'}>ようこそ、kubokubo072さん</Text>
                            <Button
                                size="sm"
                                colorScheme="yellow"
                                variant="outline"
                                onClick={() => alert('ログアウト処理をここに')}
                            >
                                ログアウト
                            </Button>
                        </HStack>
                    </Flex>
                )}
            </Flex>

            {/* Main content */}
            <Flex
                direction="column"
                align="center"
                justify="center"
                minH="50vh"
                px={4}
                py={10}
                background={'#E2E8F0'}
                // maxW="800px"       // 横幅の最大制限
                mx="auto"          // 横中央寄せ（margin left/right auto）
                borderRadius="lg"  // お好みで見た目を調整
            >
                <Heading
                    size={isMobile ? 'lg' : '2xl'}
                    textAlign="center"
                    mb={6}
                    color={isMobile ? 'teal.700' : 'teal.900'}
                >
                    YouTube動画のurlを貼り付けてください
                </Heading>

                <Flex
                    direction={isMobile ? 'column' : 'row'}
                    width="100%"
                    maxW="600px"
                    gap={4}
                    justify="center"      // ← これを追加
                    align="center"        // ← これも追加（縦中央）
                >

                    {/* <Flex
                    direction={isMobile ? 'column' : 'row'}
                    width="100%"
                    maxW="600px"
                    gap={4}
                > */}
                    <Input placeholder="URLを入力してください" size="lg" />
                    <Button colorScheme="teal" size="lg" px={8}>
                        ダウンロード
                    </Button>
                </Flex>
            </Flex>

            {/* PC専用の説明セクション */}
            {!isMobile && (
                <Box px={8} py={10} bg="white" borderTop="1px solid #eee">
                    <Heading size="lg" color="teal.700" mb={4}>
                        このアプリについて
                    </Heading>
                    <Text fontSize="md" color="gray.600" mb={2}>
                        このアプリは、YouTubeの動画を簡単にダウンロードできる無料ツールです。
                    </Text>
                    <Text fontSize="md" color="gray.600">
                        ご利用には法令遵守をお願いします。
                    </Text>
                </Box>
            )}

            {/* Footer */}
            <Box as="footer" textAlign="center" py={4} fontSize="sm" color="gray.500">
                © 2025 YouTube Downloader. All rights reserved.
            </Box>
        </Box>
    );
}
