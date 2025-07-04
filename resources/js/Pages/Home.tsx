import {
    Box, Flex, Heading, VStack, HStack,
    Input, Button, Container, Select, Image, Text,
    useMediaQuery,
    ChakraProvider
} from '@chakra-ui/react';
import { StarIcon, Spinner } from '@chakra-ui/icons'
import React, { useEffect, useRef, useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { route } from 'ziggy-js'
import { router } from '@inertiajs/react'
import { usePage } from '@inertiajs/react';

export default function Home() {
    const [isMobile] = useMediaQuery('(max-width: 768px)');
    const inputRef = useRef<HTMLInputElement>(null); // ユーザーの入力値を取得
    const [loading, setLoading] = useState(false);
    const [selectedFormat, setSelectedFormat] = useState(1); // mp4 or audioを選択
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const page = usePage();
    const user = (page.props as any)?.auth?.user;
    const handleLogout = () => {
        router.post(route('logout'))
    }
    const formats = [
        { id: 1, label: "MP4(1080P, 60FPS)" },
        { id: 2, label: "音声のみ (audio)" },
    ];
    const [videoInfo, setVideoInfo] = useState({
        'status': false,
        'url': '',
        'title': '',
        'thumbnail': '',
        'errorOutput': ''
    });

    useEffect(() => {
        if (showErrorMessage) {
            toast.error("URLに問題があるか。動画に制限がある可能性があります");
            // 一定時間後にエラーステートを false に戻す（例：3秒後）
            const timer = setTimeout(() => {
                setShowErrorMessage(false);
            }, 3000);
            // クリーンアップ関数でタイマーをクリア（安全のため）
            return () => clearTimeout(timer);
        }
    }, [showErrorMessage]);

    // 入力欄 変更時
    const handleChange = async () => {
        // 初期化
        setLoading(true);
        setVideoInfo({
            status: false,
            url: '',
            title: '',
            thumbnail: '',
            errorOutput: ''
        });

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

                if (data.status) {
                    setVideoInfo({
                        'status': data.status,
                        'url': videoUrl,
                        'title': data.title,
                        'thumbnail': data.thumbnail,
                        'errorOutput': ''
                    })
                } else {
                    setShowErrorMessage(true);
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

    // ダウンロード
    const execDownload = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/execDownload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
                body: JSON.stringify({
                    videoUrl: videoInfo.url,
                    videoTitle: videoInfo.title,
                    selectedFormat: selectedFormat, // 「1=mp4」「2=audio」
                }),
            });

            const data = await response.json();
            if (!data.status) {
                alert('ファイル生成に失敗しました');
            }

            setLoading(false);
            setVideoInfo({
                status: false,
                url: '',
                title: '',
                thumbnail: '',
                errorOutput: ''
            });

            // ファイル取得
            const res = await fetch(data.downloadUrl);
            const blob = await res.blob();

            // 保存
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = data.fileName;
            a.click();

            // メモリ解放
            setTimeout(() => {
                URL.revokeObjectURL(url);
            }, 1000);

            // 初期化
            setVideoInfo({
                status: false,
                url: '',
                title: '',
                thumbnail: '',
                errorOutput: ''
            });

        } catch (error) {
            // console.error("エラーが発生しました:", error);
            alert("予期しないエラーが発生しました。システム管理者に連絡してください。");
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
            </Flex>
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
            <VStack spacing={2} align="end">
                {user && (
                    <Text color={'black'}>ようこそ、{user.name}さん</Text>
                )}
                <Button
                    size="sm"
                    colorScheme="yellow"
                    variant="outline"
                    color={'black'}
                    onClick={handleLogout}
                >
                    ログアウト
                </Button>
            </VStack>
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
                {
                    videoInfo.status && (
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
                                    <Button onClick={execDownload} background="white" variant="solid" outlineColor={'#cccaeb'}>
                                        ダウンロード
                                    </Button>
                                </ChakraProvider>
                                <Text fontSize="sm" color="gray.600" textAlign="center">
                                    このYouTube動画をダウンロードすることで、あなたの手元に残せます。
                                </Text>
                            </VStack>
                        </Flex>
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
