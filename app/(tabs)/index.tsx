import {
    Image,
    Pressable,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useState, useRef } from 'react';
import Octicons from '@expo/vector-icons/Octicons';
import { DarkTheme, LightTheme } from '@/theme';
import { router } from 'expo-router';
import Sidebar, { SidebarHandle } from '@/components/Sidebar';

export default function HomeScreen() {
    const [image, setImage] = useState('');
    const sidebarRef = useRef<SidebarHandle>(null);

    const scheme = useColorScheme();
    const theme = scheme === 'dark' ? DarkTheme : LightTheme;

    const handleImageSelect = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            alert('Permission required to access gallery');
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });
        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    return (
        <>
            <StatusBar
                barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
                backgroundColor="black"
            />

            <SafeAreaView style={{ backgroundColor: theme.background, flex: 1 }}>
                <View style={styles.header}>
                    <View style={styles.headerTop}>
                        <Pressable style={styles.hamburger} onPress={() => sidebarRef.current?.open()}>
                            <Octicons name="three-bars" size={26} color="white" />
                        </Pressable>
                        <Text style={styles.heading}>Dashboard</Text>
                    </View>

                    <View style={styles.headerBottom}>
                        <View>
                            <Text style={styles.welcomeTxt}>Welcome Ali!</Text>
                            <Text style={styles.updationTxt}>Last Updated: Jul 22, 2022, 6:33:45 PM</Text>
                        </View>
                        <Pressable onPress={handleImageSelect} style={styles.imgCon}>
                            <Image
                                source={
                                    image
                                        ? { uri: image }
                                        : require('../../assets/icons/avatar.png')
                                }
                                style={{ width: 88, height: 88, borderRadius: 44 }}
                            />
                        </Pressable>
                    </View>
                </View>

                <View style={[styles.center, styles.nothingCon]}>
                    <Image
                        source={require('../../assets/icons/nothingfound.png')}
                        style={{ width: 250, height: 250, borderRadius: 44 }}
                    />
                    <Text style={styles.nothingTxt}>
                        Looks like you haven't purchased any of our services yet.
                    </Text>
                    <View
                        style={{
                            backgroundColor: theme.orange,
                            paddingVertical: 10,
                            paddingHorizontal: 20,
                            borderRadius: 10,
                            marginTop: 10,
                        }}
                        // onPress={() => router.push('/Colonies')}
                    >
                        <Text style={{ color: 'white', fontWeight: '700' }}>Purchase Now!</Text>
                    </View>
                </View>
            </SafeAreaView>

            {/* Sidebar — rendered last so it sits on top */}
            <Sidebar sidebarRef={sidebarRef} />
        </>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#58276D',
        paddingHorizontal: 30,
        paddingVertical: 20,
        paddingBottom: 50,
        borderBottomLeftRadius: 70,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        height: 50,
    },
    hamburger: {
        position: 'absolute',
        left: 0,
    },
    heading: {
        fontWeight: '700',
        fontSize: 30,
        color: 'white',
    },
    headerBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginTop: 18,
    },
    imgCon: {
        borderRadius: 999,
    },
    welcomeTxt: {
        color: 'white',
        fontSize: 30,
        fontWeight: '700',
        maxWidth: '70%',
        marginBottom: 10,
    },
    updationTxt: {
        color: 'white',
        fontSize: 14,
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    nothingCon: {
        marginTop: 50,
    },
    nothingTxt: {
        fontWeight: '700',
        textAlign: 'center',
        maxWidth: '90%',
        fontSize: 18,
    },
});