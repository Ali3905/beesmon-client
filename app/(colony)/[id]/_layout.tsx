import { Tabs, useLocalSearchParams, useNavigation, usePathname, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Feather from '@expo/vector-icons/Feather';
import Octicons from '@expo/vector-icons/Octicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColonyById } from '@/hooks/useColony';

const TABS = [
  {
    name: 'temperature',
    label: 'Temperature',
    icon: (color: string) => <FontAwesome5 name="thermometer-empty" size={20} color={color} />,
  },
  {
    name: 'weight',
    label: 'Weight',
    icon: (color: string) => <FontAwesome5 name="balance-scale-left" size={20} color={color} />,
  },
  {
    name: 'humidity',
    label: 'Humidity',
    icon: (color: string) => <Feather name="droplet" size={20} color={color} />,
  },
  {
    name: 'camera',
    label: 'Camera',
    icon: (color: string) => <Octicons name="device-camera-video" size={20} color={color} />,
  },
];

function CustomTabBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { id } = useLocalSearchParams()
  const { data: colony } = useColonyById(id);

  const availableSensorTypes = colony?.controller?.sensor?.map((s: any) => s.type?.toLowerCase()) || [];
  const activeTabs = colony 
    ? TABS.filter(tab => availableSensorTypes.includes(tab.name))
    : TABS;

  const getActiveName = () => {
    console.log({ pathname });

    const segments = pathname.split('/').filter(Boolean);
    const last = segments[segments.length - 1];
    return activeTabs.map(t => t.name).includes(last) ? last : (activeTabs[0]?.name || 'temperature');
  };

  const activeName = getActiveName();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.tabBar}>
        {activeTabs.map((tab) => {
          const focused = activeName === tab.name;
          const color = focused ? '#6B3FA0' : '#aaa';

          return (
            <TouchableOpacity
              key={tab.name}
              onPress={() => {
                if(pathname == `/(colony)/${id}/${tab.name}`) return;
                router.replace(`/(colony)/${id}/${tab.name}`)
              }
              }
              style={styles.tabTouchable}
              activeOpacity={0.7}
            >
              <View style={[styles.tabItem, focused && styles.tabItemActive]}>
                {tab.icon(color)}
                {focused && (
                  <Text style={styles.tabLabel} numberOfLines={1}>
                    {tab.label}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

export default function TabLayout() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: colony } = useColonyById(id);
  const navigation = useNavigation()
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    navigation.setOptions({
      title: (colony?.name)
    });
  }, [colony]);

  const availableSensorTypes = colony?.controller?.sensor?.map((s: any) => s.type?.toLowerCase()) || [];

  useEffect(() => {
    if (colony && availableSensorTypes.length > 0) {
      const segments = pathname.split('/').filter(Boolean);
      const last = segments[segments.length - 1];
      const knownTabs = TABS.map(t => t.name);
      if (knownTabs.includes(last) && !availableSensorTypes.includes(last)) {
        router.replace(`/(colony)/${id}/${availableSensorTypes[0]}`);
      }
    }
  }, [colony, pathname]);

  return (
    <Tabs
      initialRouteName="temperature"
      tabBar={() => <CustomTabBar />}
      screenOptions={{ headerShown: false }}
    >
      {TABS.map((tab) => {
        const isAvailable = !colony || availableSensorTypes.includes(tab.name);
        return (
          <Tabs.Screen
            key={tab.name}
            name={tab.name}
            options={{
              href: isAvailable ? undefined : null,
            }}
          />
        );
      })}
      <Tabs.Screen name="_layout" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  tabTouchable: {
    flex: 1,           // equal base width for all tabs
    alignItems: 'center',
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
  },
  tabItemActive: {
    backgroundColor: '#EDE7F6',
    borderRadius: 20,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B3FA0',
    flexShrink: 0,     // prevent label truncation
  },
});