import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import ArenaTab         from './tabs/ArenaTab';
import ProgramsTab      from './tabs/ProgramsTab';
import NotificationsTab from './tabs/NotificationsTab';
import ProfileTab       from './tabs/ProfileTab';

const API_URL = 'https://ashura-forge-api.onrender.com';

export default function MainScreen({ route, navigation }) {
  const { token } = route.params;
  const [activeTab, setActiveTab] = useState('arena');
  const [userData,  setUserData]  = useState(null);

  const fetchUserData = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/api/Progress`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserData(res.data.data);
    } catch {}
  }, [token]);

  useEffect(() => { fetchUserData(); }, [fetchUserData]);

  const handleLogout = () => {
    navigation.replace('Login');
  };

  const TABS = [
    { key: 'arena',         label: 'Arena',      icon: 'home',             iconLib: 'Ionicons' },
    { key: 'programs',      label: 'Programlar', icon: 'book-outline',     iconLib: 'Ionicons' },
    { key: 'notifications', label: 'Bildirimler',icon: 'notifications-outline', iconLib: 'Ionicons', badge: userData?.badgeCount },
    { key: 'profile',       label: 'Profil',     icon: 'settings-outline', iconLib: 'Ionicons' },
  ];

  return (
    <SafeAreaView style={s.safe}>

      {/* ── HEADER ─────────────────────────────── */}
      <View style={s.header}>
        <View style={s.headerLeft}>
          {/* Profil avatar */}
          <View style={s.avatarWrap}>
            <LinearGradient colors={['#f97316','#f59e0b']} style={s.avatarGrad}>
              <Ionicons name="flame" size={26} color="#000" />
            </LinearGradient>
            {/* Online dot */}
            <View style={s.onlineDot} />
          </View>
          <View>
            <Text style={s.headerTitle}>ASHURA FORGE</Text>
            <View style={s.headerSubRow}>
              <Ionicons name="trophy" size={11} color="#f59e0b" />
              <Text style={s.headerSub}> {userData?.currentTitle || 'Acemi Savaşçı'}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={s.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#f87171" />
        </TouchableOpacity>
      </View>

      {/* ── TAB İÇERİĞİ ────────────────────────── */}
      <View style={{ flex: 1 }}>
        {activeTab === 'arena' && (
          <ArenaTab token={token} userData={userData} refreshData={fetchUserData} navigation={navigation} />
        )}
        {activeTab === 'programs' && (
          <ProgramsTab token={token} navigation={navigation} />
        )}
        {activeTab === 'notifications' && (
          <NotificationsTab token={token} />
        )}
        {activeTab === 'profile' && (
          <ProfileTab token={token} userData={userData} refreshData={fetchUserData} />
        )}
      </View>

      {/* ── ALT NAV ────────────────────────────── */}
      <View style={s.bottomNav}>
        {TABS.map(tab => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity key={tab.key} style={s.tabItem} onPress={() => setActiveTab(tab.key)}>
              {isActive ? (
                <LinearGradient colors={['#f97316','#f59e0b']} style={s.tabActiveGrad} start={[0,0]} end={[1,1]}>
                  <Ionicons name={tab.icon} size={20} color="#000" />
                </LinearGradient>
              ) : (
                <View style={s.tabIconWrap}>
                  <Ionicons name={tab.icon} size={20} color="#4b5563" />
                  {tab.badge > 0 && (
                    <View style={s.badge}>
                      <Text style={s.badgeText}>{tab.badge}</Text>
                    </View>
                  )}
                </View>
              )}
              <Text style={[s.tabLabel, isActive && s.tabLabelActive]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: '#000' },
  header:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(249,115,22,0.2)' },
  headerLeft:    { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarWrap:    { position: 'relative' },
  avatarGrad:    { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center', shadowColor: '#f97316', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.9, shadowRadius: 12, elevation: 8 },
  onlineDot:     { position: 'absolute', bottom: -2, right: -2, width: 14, height: 14, backgroundColor: '#22c55e', borderRadius: 7, borderWidth: 3, borderColor: '#000' },
  headerTitle:   { color: '#f97316', fontWeight: '900', fontSize: 18, letterSpacing: 2 },
  headerSubRow:  { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  headerSub:     { color: '#f59e0b', fontSize: 11, fontWeight: '700' },
  logoutBtn:     { backgroundColor: '#111', padding: 11, borderRadius: 12, borderWidth: 1, borderColor: '#1f2937' },
  bottomNav:     { flexDirection: 'row', backgroundColor: '#080808', borderTopWidth: 1, borderTopColor: 'rgba(249,115,22,0.15)', paddingBottom: 6, paddingTop: 10 },
  tabItem:       { flex: 1, alignItems: 'center', gap: 4 },
  tabActiveGrad: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', shadowColor: '#f97316', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.6, shadowRadius: 10, elevation: 8 },
  tabIconWrap:   { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  badge:         { position: 'absolute', top: 4, right: 4, backgroundColor: '#ef4444', borderRadius: 8, minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#000' },
  badgeText:     { color: '#fff', fontSize: 9, fontWeight: '900' },
  tabLabel:      { color: '#4b5563', fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  tabLabelActive:{ color: '#f97316', fontWeight: '900' },
});
