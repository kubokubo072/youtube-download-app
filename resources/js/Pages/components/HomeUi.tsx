import {
  Box, Button, Container, Flex, Heading, HStack,
  Image, Input, Select, Spinner, Text, VStack, useMediaQuery,
  ChakraProvider,
} from "@chakra-ui/react";
import { Toaster } from 'react-hot-toast';
import React, { RefObject, Dispatch, SetStateAction } from "react";

type Format = {
  id: number;
  label: string;
};

type VideoInfo = {
  status: boolean;
  url: string;
  title: string;
  thumbnail: string;
  errorOutput: string;
};

type User = {
  name: string;
};

type Props = {
  isMobile: boolean;
  inputRef: RefObject<HTMLInputElement | null>;
  loading: boolean;
  videoInfo: VideoInfo;
  formats: Format[];
  selectedFormat: number;
  setSelectedFormat: Dispatch<SetStateAction<number>>;
  handleChange: () => void;
  execDownload: () => void;
  handleLogout: () => void;
  user?: User;
};

export const HomeUi: React.FC<Props> = ({
  isMobile, inputRef, loading, videoInfo, formats, selectedFormat,
  setSelectedFormat, handleChange, execDownload, handleLogout, user
}) => {

  const MobileHeader = () => (
    <Flex bg="teal.600" color="yellow.200" px={4} py={3} shadow="md" align="center" justify="space-between">
      <Heading size="md">YouTubeダウンローダー</Heading>
    </Flex>
  );

  const DesktopHeader = () => (
    <Flex bg="teal.500" color="white" px={8} py={4} shadow="md" align="center" justify="space-between">
      <Heading size="lg" color="black">YouTubeダウンローダー</Heading>
      <VStack spacing={2} align="end">
        {user && <Text color="black">ようこそ、{user.name}さん</Text>}
        <Button size="sm" colorScheme="yellow" variant="outline" color="black" onClick={handleLogout}>ログアウト</Button>
      </VStack>
    </Flex>
  );

  return (
    <Box>
      <Toaster />
      {isMobile ? <MobileHeader /> : <DesktopHeader />}
      <Container maxW={isMobile ? 'container.sm' : 'container.md'} py={10} borderRadius="lg" bg="#E2E8F0">
        <Heading size={isMobile ? 'lg' : '2xl'} textAlign="center" mb={6} color={isMobile ? 'teal.700' : 'teal.900'}>
          YouTube動画のurlを貼り付けてください
        </Heading>

        <Flex justify="center" mt={10}>
          <HStack spacing={0} w={isMobile ? '' : '50%'} bg="white" borderRadius="full" overflow="hidden">
            <Input placeholder="https://www.youtube.com/watch?v=..." onChange={handleChange} ref={inputRef} border="none" size="lg" />
            <Button colorScheme="purple" px={6}>検索する</Button>
          </HStack>
        </Flex>

        {loading && (
          <VStack mt="14px">
            <Spinner boxSize="40px" thickness="4px" color="teal.500" />
            <Text>Loading...</Text>
          </VStack>
        )}

        {videoInfo.status && (
          <Flex justify="center" align="center" minH="60vh">
            <VStack spacing={4} align="stretch" maxW="300px" w="100%">
              <Box width="320px" height="180px" borderRadius="lg" overflow="hidden" mx="auto">
                <Image src={videoInfo.thumbnail} alt="サムネイル" objectFit="cover" width="100%" height="100%" />
              </Box>
              <Text fontWeight="bold" fontSize="lg" textAlign="center">{videoInfo.title}</Text>
              <Box mx="auto">
                <Heading size="sm" mb={2} textAlign="center">ビデオフォーマットと解像度</Heading>
                <Select value={selectedFormat} onChange={(e) => setSelectedFormat(Number(e.target.value))}>
                  {formats.map((format) => (
                    <option key={format.id} value={format.id}>{format.label}</option>
                  ))}
                </Select>
              </Box>
              <ChakraProvider>
                <Button onClick={execDownload} background="white" variant="solid">ダウンロード</Button>
              </ChakraProvider>
              <Text fontSize="sm" color="gray.600" textAlign="center">このYouTube動画をダウンロードすることで、あなたの手元に残せます。</Text>
            </VStack>
          </Flex>
        )}
      </Container>

      {!isMobile && (
        <Box px={8} py={10} bg="white" borderTop="1px solid #eee">
          <Heading size="lg" color="teal.700" mb={4}>このアプリについて</Heading>
          <Text fontSize="md" color="gray.600" mb={2}>このアプリは、YouTubeの動画を簡単にダウンロードできる無料ツールです。</Text>
          <Text fontSize="md" color="gray.600">ご利用には法令遵守をお願いします。</Text>
        </Box>
      )}

      <Box as="footer" textAlign="center" py={4} fontSize="sm" color="gray.500">
        © 2025 YouTube Downloader. All rights reserved.
      </Box>
    </Box>
  );
};
