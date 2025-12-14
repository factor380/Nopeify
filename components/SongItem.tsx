import React from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { SongItemProps } from '../types/types';
import AppButton from './Generic Components/AppButton';


function SongItem({ id, title, artist, onDelete }: SongItemProps) {
  return (
    <View style={styles.songItem}>
      <View style={styles.textWrap}>
        <Text style={styles.songTitle}>{title}</Text>
        <Text style={styles.songArtist}>{artist}</Text>
      </View>
      {onDelete && (
        <View style={[styles.buttonWrap, { minWidth: 56, marginLeft: 8 }]}>
          <AppButton
            title="Delete"
            color="#e22134"
            onPress={() => {
              Alert.alert(
          'Delete confirmation',
          'Are you sure you want to delete this song from the list? This action cannot be undone.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => onDelete(id) },
          ],
          { cancelable: true }
              );
            }}
          />
        </View>
      )}
    </View>
  );
}

export default React.memo(SongItem);

const styles = StyleSheet.create({
  songItem: {
    marginBottom: 15,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f3f3f3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  songTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  songArtist: {
    fontSize: 14,
    color: '#666',
  },
  textWrap: {
    flex: 1,
    paddingRight: 8,
  },
  buttonWrap: {
    textTransform: 'none',
    fontSize: 10,
    width: 70,
  },
});