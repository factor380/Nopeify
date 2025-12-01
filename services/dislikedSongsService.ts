// שירות לניהול שירים שלא אהבתי (במילון)
export interface DislikedSong {
    id: string;
    title: string;
    artist: string;
}

class DislikedSongsService {
    private dislikedSongs: Record<string, DislikedSong> = {
        '1KEdF3FNF9bKRCxN3KUMbx': {
            id: '1KEdF3FNF9bKRCxN3KUMbx',
            title: 'Friday',
            artist: 'Rebecca Black'
        }
    };

    getAll(): DislikedSong[] {
        return Object.values(this.dislikedSongs);
    }

    getById(id: string): DislikedSong | undefined {
        return this.dislikedSongs[id];
    }
    isDisliked(id: string): boolean { 
        return id in this.dislikedSongs;
    }

    add(song: DislikedSong): void {
        this.dislikedSongs[song.id] = song;
    }

    remove(id: string): void {
        delete this.dislikedSongs[id];
    }
}

const dislikedSongsService = new DislikedSongsService();
export default dislikedSongsService;
