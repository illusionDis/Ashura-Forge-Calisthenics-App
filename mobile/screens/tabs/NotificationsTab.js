import { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const API_URL = 'https://ashura-forge-api.onrender.com';

function GlowCard({ glowColor = '#f97316', style, children }) {
  return (
    <View style={[{ borderRadius: 24, padding: 2, backgroundColor: glowColor + '22' }, style]}>
      <View style={{ backgroundColor: '#0d0d0d', borderRadius: 22, overflow: 'hidden' }}>
        {children}
      </View>
    </View>
  );
}

const TYPE_CONFIG = {
  badge_earned:       { icon: 'medal',              color: '#a855f7', label: 'ROZET' },
  title_achieved:     { icon: 'trophy',             color: '#f59e0b', label: 'UNVAN' },
  workout_milestone:  { icon: 'flame',              color: '#f97316', label: 'MİLESTONE' },
  system:             { icon: 'information-circle', color: '#3b82f6', label: 'SİSTEM' },
};

function getTypeConfig(type) {
  return TYPE_CONFIG[type] || { icon: 'notifications', color: '#6b7280', label: 'BİLDİRİM' };
}

export default function NotificationsTab({ token }) {
  const [notifications, setNotifications] = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [refreshing,    setRefreshing]    = useState(false);
  const [marking,       setMarking]       = useState(false);
  const [apiLog,        setApiLog]        = useState(null);

  const fetchNotifications = useCallback(async () => {
    const endpoint = `${API_URL}/api/Notification`;
    setApiLog({ status: 'GÖNDERİLİYOR...', endpoint, method: 'GET' });
    try {
      const res = await axios.get(endpoint, { headers: { Authorization: `Bearer ${token}` } });
      const data = res.data.data || [];
      setNotifications(data);
      setApiLog({ status: '200 OK', endpoint, method: 'GET', response: { count: data.length } });
    } catch (err) {
      setApiLog({ status: `${err.response?.status || 'Hata'}`, endpoint, method: 'GET', response: err.response?.data || 'Sunucuya ulaşılamadı' });
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  };

  const handleMarkAllRead = async () => {
    setMarking(true);
    const endpoint = `${API_URL}/api/Notification/read-all`;
    setApiLog({ status: 'GÖNDERİLİYOR...', endpoint, method: 'PATCH' });
    try {
      await axios.patch(endpoint, {}, { headers: { Authorization: `Bearer ${token}` } });
      setApiLog({ status: '200 OK', endpoint, method: 'PATCH', response: 'Tümü okundu' });
      await fetchNotifications();
    } catch (err) {
      setApiLog({ status: `${err.response?.status || 'Hata'}`, endpoint, method: 'PATCH' });
    } finally { setMarking(false); }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (loading) {
    return (
      <View style={s.loadingBox}>
        <ActivityIndicator size="large" color="#f97316" />
        <Text style={s.loadingText}>Bildirimler yükleniyor...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={s.scroll} contentContainerStyle={{ padding: 16 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#f97316" />}>

      {/* BAŞLIK SATIRI */}
      <View style={s.headerRow}>
        <View style={s.headerLeft}>
          <Ionicons name="notifications" size={22} color="#f97316" />
          <Text style={s.headerTitle}>Bildirimler</Text>
          {unreadCount > 0 && (
            <View style={s.unreadBadge}>
              <Text style={s.unreadBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity style={s.markBtn} onPress={handleMarkAllRead} disabled={marking}>
            {marking
              ? <ActivityIndicator size="small" color="#f97316" />
              : <>
                  <Ionicons name="checkmark-done" size={14} color="#f97316" />
                  <Text style={s.markBtnText}>Tümünü Oku</Text>
                </>
            }
          </TouchableOpacity>
        )}
      </View>

      {/* BOŞ DURUM */}
      {notifications.length === 0 ? (
        <GlowCard glowColor="#1f2937" style={{ marginTop: 8 }}>
          <View style={s.emptyBox}>
            <Ionicons name="notifications-off-outline" size={64} color="#1f2937" />
            <Text style={s.emptyTitle}>Bildirim Yok</Text>
            <Text style={s.emptyText}>Şu an için herhangi bir bildiriminiz bulunmuyor.</Text>
          </View>
        </GlowCard>
      ) : (
        <View style={{ gap: 10 }}>
          {notifications.map(notif => {
            const cfg = getTypeConfig(notif.type);
            return (
              <View key={notif.id} style={[s.notifCard, !notif.isRead && { borderColor: cfg.color + '40', borderWidth: 1 }]}>
                {/* Sol renk şerit */}
                <View style={[s.notifBar, { backgroundColor: cfg.color }]} />

                <View style={[s.notifIconBox, { backgroundColor: cfg.color + '18' }]}>
                  <Ionicons name={cfg.icon} size={22} color={cfg.color} />
                </View>

                <View style={{ flex: 1, marginRight: 8 }}>
                  <View style={s.notifTopRow}>
                    <View style={[s.typeBadge, { backgroundColor: cfg.color + '18', borderColor: cfg.color + '40' }]}>
                      <Text style={[s.typeBadgeText, { color: cfg.color }]}>{cfg.label}</Text>
                    </View>
                    {!notif.isRead && <View style={[s.dotUnread, { backgroundColor: cfg.color }]} />}
                  </View>
                  <Text style={s.notifMsg}>{notif.message}</Text>
                  <View style={s.notifTimeRow}>
                    <Ionicons name="time-outline" size={11} color="#4b5563" />
                    <Text style={s.notifTime}>
                      {' '}{new Date(notif.createdAt).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' })}
                      {' '}{new Date(notif.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      )}

      {/* API LOG */}
      {apiLog && (
        <View style={s.logBox}>
          <Text style={s.logTitle}>API ISTEK / YANIT</Text>
          <Text style={s.logRow}><Text style={s.logKey}>Metod: </Text>{apiLog.method}</Text>
          <Text style={s.logRow}><Text style={s.logKey}>Endpoint: </Text>{apiLog.endpoint}</Text>
          <Text style={[s.logRow, { color: ['200 OK'].includes(apiLog.status) ? '#4ade80' : apiLog.status.includes('GÖN') ? '#f59e0b' : '#f87171' }]}>
            <Text style={s.logKey}>Durum: </Text>{apiLog.status}
          </Text>
          {apiLog.response && <Text style={s.logRow}><Text style={s.logKey}>Yanit: </Text>{JSON.stringify(apiLog.response)}</Text>}
        </View>
      )}
      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  scroll:          { flex: 1 },
  loadingBox:      { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14 },
  loadingText:     { color: '#6b7280', fontSize: 13, fontWeight: '700' },
  headerRow:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  headerLeft:      { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle:     { color: '#fff', fontWeight: '900', fontSize: 18, letterSpacing: 0.5 },
  unreadBadge:     { backgroundColor: '#f97316', borderRadius: 12, minWidth: 22, height: 22, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  unreadBadgeText: { color: '#000', fontWeight: '900', fontSize: 11 },
  markBtn:         { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 7, backgroundColor: 'rgba(249,115,22,0.1)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(249,115,22,0.3)' },
  markBtnText:     { color: '#f97316', fontSize: 11, fontWeight: '800' },
  emptyBox:        { alignItems: 'center', paddingVertical: 48, paddingHorizontal: 24 },
  emptyTitle:      { color: '#374151', fontWeight: '900', fontSize: 16, marginTop: 16, letterSpacing: 1 },
  emptyText:       { color: '#1f2937', fontSize: 12, marginTop: 8, textAlign: 'center', lineHeight: 20 },
  notifCard:       { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0d0d0d', borderRadius: 18, overflow: 'hidden', borderWidth: 1, borderColor: '#111' },
  notifBar:        { width: 4, alignSelf: 'stretch' },
  notifIconBox:    { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', margin: 12, marginRight: 10 },
  notifTopRow:     { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 5, marginTop: 12 },
  typeBadge:       { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, borderWidth: 1 },
  typeBadgeText:   { fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  dotUnread:       { width: 7, height: 7, borderRadius: 4 },
  notifMsg:        { color: '#e5e7eb', fontSize: 13, fontWeight: '600', lineHeight: 19, marginBottom: 6 },
  notifTimeRow:    { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  notifTime:       { color: '#4b5563', fontSize: 10, fontWeight: '600' },
  logBox:          { backgroundColor: '#080808', borderRadius: 18, padding: 14, borderWidth: 1, borderColor: 'rgba(249,115,22,0.2)', marginTop: 16, marginBottom: 10 },
  logTitle:        { color: '#f97316', fontWeight: '900', fontSize: 10, marginBottom: 8, letterSpacing: 3 },
  logRow:          { color: '#6b7280', fontSize: 10, marginBottom: 4, lineHeight: 16 },
  logKey:          { color: '#f59e0b', fontWeight: '700' },
});
