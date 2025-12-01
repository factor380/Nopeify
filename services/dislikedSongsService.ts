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
    private subscribers: Set<(songs: DislikedSong[]) => void> = new Set();

    getAll(): DislikedSong[] {
        return Object.values(this.dislikedSongs);
    }

    getById(id: string): DislikedSong | undefined {
        return this.dislikedSongs[id];
    }

    add(song: DislikedSong): void {
        this.dislikedSongs[song.id] = song;
        this.notify();
    }

    remove(id: string): void {
        delete this.dislikedSongs[id];
        this.notify();
    }

    isDisliked(id: string): boolean { 
        return id in this.dislikedSongs;
    }

    subscribe(cb: (songs: DislikedSong[]) => void): () => void {
        this.subscribers.add(cb);
        // immediately call with current list
        cb(this.getAll());
        return () => this.subscribers.delete(cb);
    }

    private notify() {
        const all = this.getAll();
        this.subscribers.forEach(cb => {
            try { cb(all); } catch (e) { console.error('Subscriber error', e); }
        });
    }
}

const dislikedSongsService = new DislikedSongsService();
export default dislikedSongsService;
