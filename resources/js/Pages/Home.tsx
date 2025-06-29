// Home.tsx
import {
    Box, Flex, Heading,
    Input, Button,
    useDisclosure,
    IconButton,
    Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody,
    VStack, HStack,
    Text,
    Spacer,
    useMediaQuery,
    Container,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import React, { useRef, useState } from 'react';

export default function Home() {
    //
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isMobile] = useMediaQuery('(max-width: 768px)');

    const inputRef = useRef<HTMLInputElement>(null);
    const [inputValue, setInputValue] = useState<string>('');
    const [inputBg, setInputBg] = React.useState("#FFFFFF");

    // 入力欄 変更時
    const handleChange = () => {
        if (inputRef.current) {
            const value = inputRef.current.value;
            setInputValue(value);
            setInputBg('#E2E8F0');
        }
    };

    // 入力欄 フォーカス外れた時
    const handleBlur = () => {
        setInputBg('#FFFFFF');
    };

    // 検索ボタンクリック時
    const handleSearch = async () => {
        if (!inputValue) {
            return;
        }
        try {
            const response = await fetch('/api/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
                body: JSON.stringify({ videoUrl: inputValue }),
            });

            const data = await response.json();
            console.log("サーバーからの応答:", data);
            alert("検索完了！");

        } catch (error) {
            console.error("エラー:", error);
            alert("検索中にエラーが発生しました");
        }
    };

    // モバイル用のヘッダー
    const MobileHeader = () => (
        <>
            <Flex
                as="header"
                bg="teal.600"
                color="yellow.200"
                align="center"
                justify="space-between"
                px={4}
                py={3}
                shadow="md"
            >
                <Heading size="md">YouTubeダウンローダー</Heading>
                <IconButton
                    aria-label={isOpen ? 'メニューを閉じる' : 'メニューを開く'}
                    icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                    onClick={isOpen ? onClose : onOpen}
                    variant="ghost"
                    colorScheme="yellow"
                />
            </Flex>
            <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth="1px">メニュー</DrawerHeader>
                    <DrawerBody>
                        <VStack align="start" spacing={4} mt={4}>
                            <Button variant="ghost" w="100%" onClick={onClose}>ホーム</Button>
                            <Button variant="ghost" w="100%" onClick={onClose}>使い方</Button>
                            <Button variant="ghost" w="100%" onClick={onClose}>よくある質問</Button>
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );

    // PC用のヘッダー
    const DesktopHeader = () => (
        <Flex
            as="header"
            bg="teal.500"
            color="white"
            align="center"
            justify="space-between"
            px={8}
            py={4}
            shadow="md"
        >
            <Heading size="lg" color={'black'}>YouTubeダウンローダー</Heading>
            <HStack spacing={6}>
                <Button variant="ghost">ホーム</Button>
                <Button variant="ghost">使い方</Button>
                <Button variant="ghost">よくある質問</Button>
                <Spacer />
                <Text>ようこそ、kubokubo072さん</Text>
                <Button
                    size="sm"
                    colorScheme="yellow"
                    variant="outline"
                    onClick={() => alert('ログアウト')}
                >
                    ログアウト
                </Button>
            </HStack>
        </Flex>
    );

    return (
        <Box>
            {isMobile ? <MobileHeader /> : <DesktopHeader />}

            {/* メインコンテンツ */}
            <Container
                maxW={isMobile ? 'container.sm' : 'container.md'}
                py={10}
                borderRadius="lg"
                bg="#E2E8F0"
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
                    gap={4}
                    justify="center"
                    align="center"
                >
                    <Input onChange={handleChange} onBlur={handleBlur} bg={inputBg} ref={inputRef} placeholder="URLを入力してください" size="lg" />
                    <Button onClick={handleSearch} colorScheme="teal" size="lg" px={8}>
                        検索
                    </Button>
                </Flex>
            </Container>

            {/* PC限定セクション */}
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

            {/* フッター */}
            <Box as="footer" textAlign="center" py={4} fontSize="sm" color="gray.500">
                © 2025 YouTube Downloader. All rights reserved.
            </Box>
        </Box>
    );
}
