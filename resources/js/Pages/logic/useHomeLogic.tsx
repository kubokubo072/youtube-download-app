import { useEffect, useRef, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { toast } from 'react-hot-toast';
import { route } from 'ziggy-js';

interface VideoInfo {
    status: boolean;
    url: string;
    title: string;
    thumbnail: string;
    errorOutput: string
}

interface FormatOption {
    id: number;
    label: string;
}

interface HomeLogic {
    inputRef: React.RefObject<HTMLInputElement>;
    loading: boolean;
    selectedFormat: number;
    setSelectedFormat: React.Dispatch<React.SetStateAction<number>>;
    showErrorMessage: boolean;
    videoInfo: VideoInfo;
    formats: FormatOption[];
    handleChange: () => void;
    execDownload: () => void;
    handleLogout: () => void;
    user: any;
}

export const useHomeLogic = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [selectedFormat, setSelectedFormat] = useState(1);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const page = usePage();
    const user = (page.props as any)?.auth?.user;

    const formats: FormatOption[] = [
        // const formats = [
        { id: 1, label: "MP4(1080P, 60FPS)" },
        { id: 2, label: "音声のみ (audio)" },
    ];

    const [videoInfo, setVideoInfo] = useState<VideoInfo>({
        // const [videoInfo, setVideoInfo] = useState({
        status: false,
        url: '',
        title: '',
        thumbnail: '',
        errorOutput: ''
    });

    useEffect(() => {
        if (showErrorMessage) {
            toast.error("URLに問題があるか。動画に制限がある可能性があります");
            const timer = setTimeout(() => setShowErrorMessage(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showErrorMessage]);

    const handleChange = async () => {
        setLoading(true);
        setVideoInfo({ status: false, url: '', title: '', thumbnail: '', errorOutput: '' });

        const videoUrl = inputRef.current?.value;
        if (!videoUrl) {
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/isValidUrl', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
                body: JSON.stringify({ videoUrl }),
            });
            const data = await res.json();

            if (data.status) {
                setVideoInfo({
                    status: data.status,
                    url: videoUrl,
                    title: data.title,
                    thumbnail: data.thumbnail,
                    errorOutput: ''
                });
            } else {
                setShowErrorMessage(true);
            }
        } catch (e) {
            alert("予期しないエラーが発生しました。");
        } finally {
            setLoading(false);
        }
    };

    const execDownload = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/execDownload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
                body: JSON.stringify({
                    videoUrl: videoInfo.url,
                    videoTitle: videoInfo.title,
                    selectedFormat,
                }),
            });
            const data = await res.json();

            if (!data.status) {
                alert("ファイル生成に失敗しました");
                return;
            }

            const blobRes = await fetch(data.downloadUrl);
            const blob = await blobRes.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = data.fileName;
            a.click();
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        } catch (e) {
            alert("予期しないエラーが発生しました。");
        } finally {
            setLoading(false);
            setVideoInfo({ status: false, url: '', title: '', thumbnail: '', errorOutput: '' });
        }
    };

    const handleLogout = () => {
        router.post(route('logout'));
    };

    return {
        inputRef,
        loading,
        selectedFormat,
        setSelectedFormat,
        showErrorMessage,
        videoInfo,
        formats,
        handleChange,
        execDownload,
        handleLogout,
        user,
    };
};
