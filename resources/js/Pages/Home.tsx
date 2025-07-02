import {
    Box, Flex, Heading, VStack, HStack,
    Input, Button, Container, Select, Image, Text,
    useDisclosure,
    IconButton,
    Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody,
    Spacer,
    useMediaQuery,
    ChakraProvider
} from '@chakra-ui/react';
import { StarIcon, Spinner } from '@chakra-ui/icons'
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import React, { useEffect, useRef, useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';

export default function Home() {
    const [isMobile] = useMediaQuery('(max-width: 768px)');
    const inputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [showThumbnail, setShowThumbnail] = useState(false);
    const [selectedFormat, setSelectedFormat] = useState(1);

    const [videoInfo, setVideoInfo] = useState({
        'status': false,
        'url': '',
        'title': '',
        'thumbnail': '',
        'errorOutput': ''
    });
    const formats = [
        { id: 1, label: "MP4(1080P, 60FPS)" },
        { id: 2, label: "音声のみ (audio)" },
    ];

    useEffect(() => {
        if (response && videoInfo.status === false) {
            toast.error("URLに問題があるか。動画に制限がある可能性があります");
        }
    }, [response, videoInfo.status]);

    // 入力欄 変更時
    const handleChange = async () => {

        // 初期化
        setShowThumbnail(false);
        setLoading(true);
        setVideoInfo({
            status: false,
            url: '',
            title: '',
            thumbnail: '',
            errorOutput: ''
        });
        setResponse(false);

        if (inputRef.current) {
            const videoUrl = inputRef.current.value;
            if (!videoUrl) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('/api/isValidUrl', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                    },
                    body: JSON.stringify({ videoUrl: videoUrl }),
                });

                const data = await response.json();
                setResponse(true);

                if (data.status) {
                    setShowThumbnail(true);
                    setVideoInfo({
                        'status': data.status,
                        'url': videoUrl,
                        'title': data.title,
                        'thumbnail': data.thumbnail,
                        'errorOutput': ''
                    })
                } else {
                    setShowThumbnail(false);
                    setVideoInfo({
                        status: data.status,
                        url: '',
                        title: '',
                        thumbnail: '',
                        errorOutput: ''
                    });
                }

            } catch (error) {
                console.error("エラー:", error);
                alert("予期しないエラーが発生しました。システム管理者に連絡してください。");
            }
            setLoading(false);
        }
    };

    // 入力欄 フォーカス外れた時
    const handleBlur = () => {
        // setInputBg('#FFFFFF');
    };

    // 検索ボタンクリック時
    const handleSearch = async () => {
        console.log(selectedFormat);
        console.log(videoInfo.url);
        console.log(videoInfo);


        // 初期化
        // setShowThumbnail(false);
        setLoading(true);
        // setVideoInfo({
        //     status: false,
        //     url: '',
        //     title: '',
        //     thumbnail: '',
        //     errorOutput: ''
        // });
        // setResponse(false);

        // if (inputRef.current) {
            // const videoUrl = inputRef.current.value;
            // if (!videoUrl) {
            //     setLoading(false);
            //     return;
            // }

                    console.log(selectedFormat);
        console.log(videoInfo.url);
        console.log(videoInfo);


            try {
                const response = await fetch('/api/execDownload', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                    },
                    body: JSON.stringify({
                        videoUrl: videoInfo.url,
                        selectedFormat: selectedFormat, // 「1=mp4」「2=audio」
                    }),
                });

                const data = await response.json();
                setResponse(true);
                alert('成功');

                // if (data.status) {
                //     setShowThumbnail(true);
                //     setVideoInfo({
                //         'status': data.status,
                //         'url': videoUrl,
                //         'title': data.title,
                //         'thumbnail': data.thumbnail,
                //         'errorOutput': ''
                //     })
                // } else {
                //     setShowThumbnail(false);
                //     setVideoInfo({
                //         status: data.status,
                //         url: '',
                //         title: '',
                //         thumbnail: '',
                //         errorOutput: ''
                //     });
                // }

            } catch (error) {
                console.error("エラー:", error);
                alert("予期しないエラーが発生しました。システム管理者に連絡してください。");
            }
            // setLoading(false);
        // }
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
            <Toaster />
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

                <Flex justify="center" mt={10}>
                    <HStack
                        spacing={0}
                        w={isMobile ? '' : '50%'}
                        bg="white"
                        borderRadius="full"
                        boxShadow="0 0 0 4px rgba(128, 90, 213, 0.2)"
                        overflow="hidden"
                        display={'flex'}
                        justifyContent={'space-around'}
                    >
                        <Input
                            placeholder="https://www.youtube.com/watch?v=..."
                            onChange={handleChange}
                            onBlur={handleBlur}
                            ref={inputRef}
                            border="none"
                            size="lg"
                            _focus={{ boxShadow: 'none' }}
                        />
                        <Button
                            colorScheme="purple"
                            borderRadius="0"
                            h="100%"
                            px={6}
                        >
                            検索する
                        </Button>
                    </HStack>
                </Flex>

                {/* url入力時の検索中にスピナーを表示 */}
                {
                    loading && (
                        <VStack marginTop={'14px'}>
                            <Spinner boxSize="40px" thickness="4px" color="teal.500" />
                            <Text color="colorPalette.600">Loading...</Text>
                        </VStack>
                    )
                }

                {/* url入力後のリクエストの結果を表示します */}
                {
                    showThumbnail && response && (
                        videoInfo.status === true ? (
                            <Flex justify="center" align="center" minH="60vh">
                                <VStack spacing={4} align="stretch" maxW="300px" w="100%">
                                    {/* 🔽 修正済みサムネイル部分 */}
                                    <Box
                                        width="320px"
                                        height="180px"
                                        borderRadius="lg"
                                        overflow="hidden"
                                        mx="auto"
                                    >
                                        <Image
                                            src={videoInfo.thumbnail}
                                            alt="サムネイル"
                                            objectFit="cover"
                                            width="100%"
                                            height="100%"
                                        />
                                    </Box>
                                    <Text fontWeight="bold" fontSize="lg" textAlign="center">{videoInfo.title}</Text>
                                    <Box mx="auto">
                                        <Heading size="sm" mb={2} textAlign="center">
                                            ビデオフォーマットと解像度
                                        </Heading>
                                        <Select
                                            value={selectedFormat}
                                            onChange={(e) => setSelectedFormat(Number(e.target.value))}
                                        >
                                            {formats.map((format) => (
                                                <option key={format.id} value={format.id}>
                                                    {format.label}
                                                </option>
                                            ))}
                                        </Select>
                                    </Box>
                                    <ChakraProvider>
                                        <Button onClick={handleSearch} background="white" variant="solid" outlineColor={'#cccaeb'}>
                                            ダウンロード
                                        </Button>
                                    </ChakraProvider>
                                    <Text fontSize="sm" color="gray.600" textAlign="center">
                                        このYouTube動画をダウンロードすることで、あなたの手元に残せます。
                                    </Text>
                                </VStack>
                            </Flex>
                        ) : (
                            <Text color="red.500" textAlign="center" mt={4}>
                                URLに問題があります。正しい形式を確認してください。
                            </Text>
                        )
                    )
                }
            </Container >
            {/* PC限定セクション */}
            {
                !isMobile && (
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
                )
            }
            {/* フッター */}
            <Box as="footer" textAlign="center" py={4} fontSize="sm" color="gray.500">
                © 2025 YouTube Downloader. All rights reserved.
            </Box>
        </Box >
    );
}
