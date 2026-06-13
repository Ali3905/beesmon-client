import React, { useRef } from 'react';
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Octicons from '@expo/vector-icons/Octicons';
import { DarkTheme, LightTheme } from '@/theme';
import Sidebar, { SidebarHandle } from '@/components/Sidebar';
import { useUserDetail } from '@/hooks/useUser';

const PURPLE = '#58276D';
const ORANGE = '#F3B15A';

function InfoRow({ icon, label, value }: { icon: any; label: string; value?: string }) {
    return (
        <View style={styles.infoRow}>
            <View style={styles.infoIconWrap}>
                <Octicons name={icon} size={18} color={ORANGE} />
            </View>
            <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{label}</Text>
                <Text style={styles.infoValue}>{value || '—'}</Text>
            </View>
        </View>
    );
}

export default function ProfileScreen() {
    const sidebarRef = useRef<SidebarHandle>(null);
    const scheme = useColorScheme();
    const theme = scheme === 'dark' ? DarkTheme : LightTheme;

    const { data: user, isLoading, isError, refetch } = useUserDetail();

    const fullName = user
        ? `${user.first_name} ${user.last_name}`.trim() || user.username || user.email
        : '';

    const initials = fullName
        ? fullName
              .split(' ')
              .slice(0, 2)
              .map((n) => n[0]?.toUpperCase())
              .join('')
        : '?';

    const joinedDate = user?.date_joined
        ? new Date(user.date_joined).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
          })
        : undefined;

    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor={PURPLE} />

            <SafeAreaView style={{ backgroundColor: theme.background, flex: 1 }}>
                {/* Header */}
                <View style={styles.header}>
                    <Pressable style={styles.hamburger} onPress={() => sidebarRef.current?.open()}>
                        <Octicons name="three-bars" size={26} color="white" />
                    </Pressable>
                    <Text style={styles.heading}>My Profile</Text>
                </View>

                <ScrollView
                    contentContainerStyle={styles.scroll}
                    showsVerticalScrollIndicator={false}
                >
                    {isLoading ? (
                        <View style={styles.centered}>
                            <ActivityIndicator size="large" color={ORANGE} />
                            <Text style={styles.loadingText}>Loading profile…</Text>
                        </View>
                    ) : isError ? (
                        <View style={styles.centered}>
                            <Octicons name="alert" size={40} color="#e74c3c" />
                            <Text style={styles.errorText}>Failed to load profile</Text>
                            <Pressable style={styles.retryBtn} onPress={() => refetch()}>
                                <Text style={styles.retryBtnText}>Retry</Text>
                            </Pressable>
                        </View>
                    ) : (
                        <>
                            {/* Avatar card */}
                            <View style={styles.avatarCard}>
                                <View style={styles.avatarCircle}>
                                    <Text style={styles.avatarInitials}>{initials}</Text>
                                </View>
                                <Text style={styles.userName}>{fullName}</Text>
                                <Text style={styles.userEmail}>{user?.email}</Text>

                                {joinedDate && (
                                    <View style={styles.memberBadge}>
                                        <Octicons name="calendar" size={12} color={PURPLE} />
                                        <Text style={styles.memberBadgeText}>
                                            Member since {joinedDate}
                                        </Text>
                                    </View>
                                )}
                            </View>

                            {/* Info section */}
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Personal Information</Text>

                                <View style={styles.card}>
                                    <InfoRow
                                        icon="person"
                                        label="First Name"
                                        value={user?.first_name}
                                    />
                                    <View style={styles.divider} />
                                    <InfoRow
                                        icon="person"
                                        label="Last Name"
                                        value={user?.last_name}
                                    />
                                    <View style={styles.divider} />
                                    <InfoRow
                                        icon="mail"
                                        label="Email"
                                        value={user?.email}
                                    />
                                    <View style={styles.divider} />
                                    <InfoRow
                                        icon="device-mobile"
                                        label="Phone Number"
                                        value={user?.phone_number}
                                    />
                                    <View style={styles.divider} />
                                    <InfoRow
                                        icon="location"
                                        label="Address"
                                        value={user?.address}
                                    />
                                </View>
                            </View>

                            {/* Account section */}
                            {(user?.username || user?.date_joined) && (
                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>Account</Text>
                                    <View style={styles.card}>
                                        {user?.username && (
                                            <>
                                                <InfoRow
                                                    icon="mention"
                                                    label="Username"
                                                    value={user.username}
                                                />
                                                <View style={styles.divider} />
                                            </>
                                        )}
                                        {joinedDate && (
                                            <InfoRow
                                                icon="calendar"
                                                label="Joined"
                                                value={joinedDate}
                                            />
                                        )}
                                    </View>
                                </View>
                            )}
                        </>
                    )}
                </ScrollView>
            </SafeAreaView>

            <Sidebar sidebarRef={sidebarRef} />
        </>
    );
}

const styles = StyleSheet.create({
    /* ── Header ────────────────────────────────────── */
    header: {
        backgroundColor: PURPLE,
        paddingVertical: 15,
        paddingHorizontal: 25,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    hamburger: {
        position: 'absolute',
        left: 25,
    },
    heading: {
        color: 'white',
        fontSize: 30,
        fontWeight: '700',
    },

    /* ── Scroll ─────────────────────────────────────── */
    scroll: {
        paddingBottom: 40,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 80,
        gap: 12,
    },
    loadingText: {
        color: '#888',
        fontSize: 15,
        marginTop: 8,
    },
    errorText: {
        color: '#e74c3c',
        fontSize: 15,
        fontWeight: '600',
    },
    retryBtn: {
        backgroundColor: ORANGE,
        paddingVertical: 10,
        paddingHorizontal: 28,
        borderRadius: 10,
        marginTop: 4,
    },
    retryBtnText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 15,
    },

    /* ── Avatar card ─────────────────────────────── */
    avatarCard: {
        backgroundColor: PURPLE,
        alignItems: 'center',
        paddingTop: 32,
        paddingBottom: 36,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        marginBottom: 8,
    },
    avatarCircle: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: ORANGE,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 14,
        borderWidth: 3,
        borderColor: 'rgba(255,255,255,0.35)',
    },
    avatarInitials: {
        color: 'white',
        fontSize: 36,
        fontWeight: '800',
        letterSpacing: 1,
    },
    userName: {
        color: 'white',
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 4,
    },
    userEmail: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
    },
    memberBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: 'rgba(255,255,255,0.15)',
        paddingVertical: 5,
        paddingHorizontal: 12,
        borderRadius: 20,
        marginTop: 12,
    },
    memberBadgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '500',
    },

    /* ── Sections ──────────────────────────────────── */
    section: {
        paddingHorizontal: 18,
        marginTop: 24,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: PURPLE,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 10,
        paddingLeft: 4,
    },

    /* ── Info card ─────────────────────────────────── */
    card: {
        backgroundColor: 'white',
        borderRadius: 18,
        paddingVertical: 4,
        borderWidth: 1.5,
        borderColor: '#f0e4f5',
        shadowColor: PURPLE,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.07,
        shadowRadius: 8,
        elevation: 3,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        gap: 14,
    },
    infoIconWrap: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#fdf3e7',
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 11,
        color: '#aaa',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 15,
        color: '#222',
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: '#f5eef8',
        marginHorizontal: 16,
    },
});
