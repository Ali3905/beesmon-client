import { DarkTheme, LightTheme } from '@/theme';
import Octicons from '@expo/vector-icons/Octicons'
import React, { useRef } from 'react'
import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useColonies } from '@/hooks/useColonies';
import Sidebar, { SidebarHandle } from '@/components/Sidebar';

export default function ColoniesScreen() {
    const { data, isLoading, isError, error, refetch } = useColonies({});
    const sidebarRef = useRef<SidebarHandle>(null)

    const scheme = useColorScheme();
    const theme = scheme === "dark" ? DarkTheme : LightTheme;


    return (
        <>
            <SafeAreaView style={{ backgroundColor: theme.background, flex: 1, }}>
                <View style={styles.header}>
                    <Pressable style={styles.hamburger} onPress={() => sidebarRef.current?.open()}>
                        <Octicons name="three-bars" size={26} color={"white"} />
                    </Pressable>
                    <Text style={styles.headerTxt}>My Colonies</Text>
                </View>
                {isLoading ? (
                    <ActivityIndicator />
                ) : isError ? (
                    <View>
                        <Text>{error?error.message:"Something went Wrong"}</Text>
                    </View>
                ) : (
                    <View style={{ flex: 1 }}>
                        <View style={styles.body}>
                            <Text style={styles.bodyHeadingTxt}>
                                We have found your {data?.length ?? 0} packages!
                            </Text>
                        </View>

                        <FlatList
                            data={data}
                            keyExtractor={(item) => item._id}
                            renderItem={({ item }) => <ColonyCard colony={item} />}
                            onRefresh={refetch}
                            refreshing={isLoading}
                            contentContainerStyle={styles.cardContainer}
                            ListFooterComponent={
                                <Pressable
                                    style={{
                                        backgroundColor: theme.orange,
                                        paddingVertical: 10,
                                        paddingHorizontal: 20,
                                        borderRadius: 10,
                                        marginTop: 10,
                                        maxWidth: "50%",
                                        alignSelf: "flex-end",
                                    }}
                                    onPress={() => router.push("/RegisterDevice")}
                                >
                                    <Text style={{ color: "white", fontWeight: "700", textAlign: "center" }}>
                                        Add Colony
                                    </Text>
                                </Pressable>
                            }
                        />
                    </View>
                )}

            </SafeAreaView>

            <Sidebar sidebarRef={sidebarRef} />
        </>
    )
}

export function ColonyCard({ colony }: { colony: any }) {
    return (
        <Pressable style={styles.card} onPress={() => router.push(`/(colony)/${colony.id}/temperature`)}>
            <Text style={styles.cardTitle}>{colony.name}</Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View >
                    <Text style={{ fontSize: 15, marginBottom: 20 }}>Package Includes:</Text>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        {
                            colony.controller.sensor.map((sen: any) => {
                                return <View style={{ alignItems: "center" }}>
                                    <FontAwesome5 name="thermometer-half" size={24} color="#f3815a" />
                                    <Text style={{ paddingRight: 10, textTransform: "capitalize", width: "100%" }}>{sen.type}</Text>
                                </View>
                            })
                        }
                    </View>
                </View>
                <View style={{ alignItems: "center" }}>
                    <Text style={{ fontSize: 15, marginBottom: 20 }}>Microcontroller:</Text>
                    <Ionicons name="hardware-chip-outline" size={40} color="black" />
                    <Text style={{ fontSize: 9 }}>{colony.controller.type}</Text>
                </View>
            </View>
        </Pressable>
    )
}



const styles = StyleSheet.create({
    hamburger: {
        position: 'absolute',
        left: 25,
    },
    header: {
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: 'center',
        position: 'relative',
        // height: 50,
        backgroundColor: "#58276D",
        paddingVertical: 15,
        paddingHorizontal: 25
    },
    headerTxt: {
        color: "white",
        fontSize: 30,
        fontWeight: 400
    },
    body: {
        paddingHorizontal: 25,
        paddingVertical: 30
    },
    bodyHeadingTxt: {
        color: "#F3B15A",
        fontSize: 20,
        fontWeight: 500
    },
    cardContainer: {
        // paddingHorizontal: 20
        // flexDirection: "column",
        paddingHorizontal: 10
    },
    card: {
        backgroundColor: "white",
        paddingHorizontal: 10,
        paddingVertical: 20,
        marginTop: 10,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: "#58276D"
    },
    cardTitle: {
        textAlign: "center",
        fontSize: 25,
        fontWeight: 600,
        color: "#f3b15a"
    }
})