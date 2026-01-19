import { VideoPlayer } from '../ui/Video'
import { RootState } from '../../store';
import { useSelector } from 'react-redux';

const Video = () => {
    const { ayudantia } = useSelector((state: RootState) => state.ayudantia);

    return (
        <VideoPlayer
            url={ayudantia.video}
            aspectRatio="21:9"
            lazy={false}
            showInfo={false}
            vimeoOptions={{
                fullscreen: true,
                color: 'FF6B6B',
                title: true,
                byline: true,
                portrait: true,
            }}
        />
    )
}

export default Video