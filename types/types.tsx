export type SongItemProps = {
  id: string
  title: string;
  artist: string;
  onDelete?: (id: string) => void;
};


export type SongListProps ={
    songs: SongItemProps[];
    onDelete?: (id: string) => void;
}