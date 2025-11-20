import React from 'react';
import { FlatList } from 'react-native';
import SongItem from './SongItem';
import { SongListProps } from '../types/types';


export default function SongList({ songs }: SongListProps) {
  return (
    <FlatList
      data={songs}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <SongItem title={item.title} artist={item.artist} id={''} />}
    />
  );
}