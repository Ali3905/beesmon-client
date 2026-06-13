import React, { useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import Octicons from '@expo/vector-icons/Octicons';
import { router } from 'expo-router';
import { DarkTheme } from '@/theme';
import { useLogout } from '@/hooks/useAuth';

const SIDEBAR_WIDTH = Dimensions.get('window').width * 0.72;
const SIDEBAR_HEIGHT = Dimensions.get('window').height;
const ORANGE = DarkTheme.orange;

const navItems = [
    { label: 'Home', icon: 'home', route: '/(tabs)' },
    { label: 'Colonies', icon: 'organization', route: '/Colonies' },
    { label: 'Employees', icon: 'people', route: '/(employee)/employeeList' },
    { label: 'Profile', icon: 'person', route: '/Profile' },
];

const bottomItems = [
    { label: 'Contact Us', icon: 'mail', route: "/(auth)/signup" },
    { label: 'About Us', icon: 'info', route: "/(auth)/login" },
    { label: 'Logout', icon: 'sign-out', danger: true },
];

interface SidebarHandle {
    open: () => void;
    close: () => void;
}

interface SidebarProps {
    sidebarRef: React.RefObject<SidebarHandle | null>;
}

export { SidebarHandle };

export default function Sidebar({ sidebarRef }: SidebarProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { mutate: logout } = useLogout();
    const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
    const overlayAnim = useRef(new Animated.Value(0)).current;

    const open = () => {
        setSidebarOpen(true);
        Animated.parallel([
            Animated.spring(slideAnim, {
                toValue: 0,
                useNativeDriver: true,
                bounciness: 4,
            }),
            Animated.timing(overlayAnim, {
                toValue: 0.5,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const close = () => {
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: -SIDEBAR_WIDTH,
                duration: 250,
                useNativeDriver: true,
            }),
            Animated.timing(overlayAnim, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
            }),
        ]).start(() => setSidebarOpen(false));
    };

    // Expose open/close to parent via ref
    React.useImperativeHandle(sidebarRef, () => ({ open, close }));

    return (
        <>
            {/* Overlay */}
            {sidebarOpen && (
                <TouchableWithoutFeedback onPress={close}>
                    <Animated.View
                        style={[
                            StyleSheet.absoluteFillObject,
                            { backgroundColor: '#000', opacity: overlayAnim, zIndex: 10 },
                        ]}
                    />
                </TouchableWithoutFeedback>
            )}

            {/* Drawer */}
            <Animated.View
                style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}
            >
                {/* Logo area */}
                <View style={styles.sidebarLogoArea}>
                    <Image
                        source={require('../assets/icons/logo.png')}
                        style={{ width: 120, height: 120 }}
                    />
                    <Text style={styles.sidebarAppName}>Smart APISMON</Text>
                    <Text style={styles.sidebarSubtitle}>'Let your bees thrive'</Text>
                </View>

                <View style={styles.sidebarDivider} />

                {/* Nav items */}
                <View style={styles.sidebarNav}>
                    {navItems.map((item) => (
                        <TouchableOpacity
                            key={item.label}
                            style={styles.sidebarItem}
                            onPress={() => {
                                close();
                                router.push(item.route as any);
                            }}
                        >
                            <Octicons name={item.icon as any} size={20} color={ORANGE} />
                            <Text style={styles.sidebarItemText}>{item.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Bottom items */}
                <View style={styles.sidebarBottom}>
                    <View style={styles.sidebarDivider} />
                    {bottomItems.map((item) => (
                        <TouchableOpacity
                            key={item.label}
                            style={styles.sidebarItem}
                            onPress={() => {
                                close();
                                if (item.label === 'Logout') {
                                    logout();
                                    return;
                                }
                                if (!item.route) return;
                                router.push(item.route as any);
                            }}
                        >
                            <Octicons
                                name={item.icon as any}
                                size={20}
                                color={item.danger ? '#e74c3c' : '#555'}
                            />
                            <Text
                                style={[
                                    styles.sidebarItemText,
                                    item.danger && styles.dangerText,
                                ]}
                            >
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </Animated.View>
        </>
    );
}

const styles = StyleSheet.create({
    sidebar: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: SIDEBAR_WIDTH,
        backgroundColor: '#fff',
        zIndex: 20,
        elevation: 20,
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 0 },
        shadowOpacity: 0.18,
        shadowRadius: 12,
    },
    sidebarLogoArea: {
        height: SIDEBAR_HEIGHT / 3,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 30,
        paddingBottom: 14,
    },
    sidebarAppName: {
        color: ORANGE,
        fontSize: 30,
        fontWeight: '700',
        letterSpacing: 1,
    },
    sidebarSubtitle: {
        color: ORANGE,
        fontSize: 14,
        marginTop: 2,
    },
    sidebarDivider: {
        height: 1,
        backgroundColor: '#f0e6f4',
        marginVertical: 8,
        marginHorizontal: 16,
    },
    sidebarNav: {
        flex: 1,
        paddingTop: 4,
    },
    sidebarItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 13,
        paddingHorizontal: 22,
        gap: 14,
    },
    sidebarItemText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
    },
    sidebarBottom: {
        paddingBottom: 30,
    },
    dangerText: {
        color: '#e74c3c',
    },
});