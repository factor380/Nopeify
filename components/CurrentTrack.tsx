import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ActivityIndicator, Image, StyleSheet, Button, Alert } from 'react-native';
import spotifyService from '../services/spotifyService';
import dislikedSongsService from '../services/dislikedSongsService';
import BackgroundService from 'react-native-background-actions';
import AppButton from './Generic Components/AppButton';
export default function CurrentTrack() {
    const [track, setTrack] = useState<any>(null);
    const lastTrackIdRef = useRef<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Poll every 5 seconds for UI display
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    useEffect(() => {
        let mounted = true;
        const poll = async () => {
            try {
                const response = await spotifyService.getCurrentPlayback();
                const newTrack = response?.item || null;
                const newId = newTrack?.id || null;

                console.log('Polled current track:', newId, newTrack?.name);
                if (mounted && newId !== lastTrackIdRef.current) {
                    setTrack(newTrack);
                    lastTrackIdRef.current = newId;
                }

            } catch (err) {
                if (mounted) setTrack(null);
            }
        };
        poll();
        intervalRef.current = setInterval(poll, 5000);
        return () => {
            mounted = false;
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    const fetchCurrentTrack = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await spotifyService.getCurrentPlayback();
            setTrack(response?.item || null);
        } catch (err: any) {
            setError('Unable to load current track');
            setTrack(null);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <ActivityIndicator size="small" color="#1DB954" />;
    if (error) return <Text style={styles.error}>{error}</Text>;
    if (!track) return <Text style={styles.noData}>No track currently playing</Text>;

    return (
        <View style={styles.container}>
            {track.album?.images?.[0]?.url && (
                <Image source={{ uri: track.album.images[0].url }} style={styles.image} />
            )}
            <View style={styles.info}>
                <Text style={styles.title}>{track.name}</Text>
                <Text style={styles.artist}>{track.artists?.map((a: any) => a.name).join(', ')}</Text>
                <View style={{ marginTop: 8 }}>
                    <AppButton
                        title="Add to Disliked"
                        color="#e22134"
                        onPress={() => {
                            const id = track?.id;
                            if (!id) return;
                            if (dislikedSongsService.isDisliked(id)) {
                                Alert.alert('Error', 'Track is already in the Disliked list');
                                return;
                            }
                            try {
                                dislikedSongsService.add({
                                    id,
                                    title: track.name,
                                    artist: track.artists?.[0]?.name || 'Unknown',
                                });
                                spotifyService.nextTrack();
                                Alert.alert('Done', 'Track added to Disliked — skipping to next track');
                            } catch (e) {
                                console.error('Error adding to disliked:', e);
                                Alert.alert('Error', 'Unable to add the track at the moment');
                            }
                        }}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 1,
        backgroundColor: '#222',
        borderRadius: 8,
        padding: 8,
    },
    image: {
        width: 48,
        height: 48,
        borderRadius: 4,
        marginRight: 12,
    },
    info: {
        flex: 1,
    },
    title: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    artist: {
        color: '#b3b3b3',
        fontSize: 14,
    },
    error: {
        color: '#e22134',
        marginBottom: 8,
    },
    noData: {
        color: '#b3b3b3',
        marginBottom: 8,
    },
});