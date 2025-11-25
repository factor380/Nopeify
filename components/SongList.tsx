import React, { useCallback } from 'react';
import { FlatList } from 'react-native';
import SongItem from './SongItem';
import { SongListProps } from '../types/types';


export default function SongList({ songs }: SongListProps) {
  const renderItem = useCallback(({ item }: { item: { id: string; title: string; artist: string } }) => {
    return <SongItem id={item.id} title={item.title} artist={item.artist} />;
  }, []);

  return (
    <FlatList
      data={songs}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      initialNumToRender={8}
      maxToRenderPerBatch={10}
      windowSize={5}
      removeClippedSubviews={true}
    />
  );
}