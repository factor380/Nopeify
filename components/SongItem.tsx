import React from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { SongItemProps } from '../types/types';


function SongItem({ id, title, artist, onDelete }: SongItemProps) {
  return (
    <View style={styles.songItem}>
      <View style={styles.textWrap}>
        <Text style={styles.songTitle}>{title}</Text>
        <Text style={styles.songArtist}>{artist}</Text>
      </View>
      {onDelete && (
        <View style={styles.buttonWrap}>
          <Button
            title="מחק"
            color="#e22134"
            onPress={() => {
              Alert.alert(
                'אישור מחיקה',
                'האם אתה בטוח שברצונך למחוק שיר זה מהרשימה? פעולה זו אינה ניתנת לביטול.',
                [
                  { text: 'בטל', style: 'cancel' },
                  { text: 'מחק', style: 'destructive', onPress: () => onDelete(id) },
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
    width: 64,
  },
});