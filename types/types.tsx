export type SongItemProps = {
  id: string
  title: string;
  artist: string;
};


export type SongListProps ={
    songs: SongItemProps[]
}