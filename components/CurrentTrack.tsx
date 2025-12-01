import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ActivityIndicator, Image, StyleSheet } from 'react-native';
import spotifyService from '../services/spotifyService';
import dislikedSongsService from '../services/dislikedSongsService';

export default function CurrentTrack() {
    const [track, setTrack] = useState<any>(null);
    const lastTrackIdRef = useRef<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Poll every 5 seconds, but only update if track id changed
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    useEffect(() => {
        let mounted = true;
        const poll = async () => {
            try {
                const response = await spotifyService.getCurrentPlayback();
                const newTrack = response?.item || null;
                const newId = newTrack?.id || null;
                console.log('Polled current track:', newId ,newTrack.name );
                if (mounted && newId !== lastTrackIdRef.current) {
                    if (dislikedSongsService.isDisliked(newId)) {
                    console.log('Current track is disliked, skipping to next track:', newId);
                    spotifyService.nextTrack();
                    }
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
            setError('לא ניתן לטעון שיר נוכחי');
            setTrack(null);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <ActivityIndicator size="small" color="#1DB954" />;
    if (error) return <Text style={styles.error}>{error}</Text>;
    if (!track) return <Text style={styles.noData}>לא מתנגן שיר כרגע</Text>;

    return (
        <View style={styles.container}>
            {track.album?.images?.[0]?.url && (
                <Image source={{ uri: track.album.images[0].url }} style={styles.image} />
            )}
            <View style={styles.info}>
                <Text style={styles.title}>{track.name}</Text>
                <Text style={styles.artist}>{track.artists?.map((a: any) => a.name).join(', ')}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
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
        fontSize: 16,
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