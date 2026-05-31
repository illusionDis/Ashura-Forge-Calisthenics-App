import { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator, Alert, RefreshControl
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';

const API_URL = 'https://ashura-forge-api.onrender.com';
const CATS = ['Cardio', 'Strength', 'Flexibility', 'Balance'];

export default function DashboardScreen({ route, navigation }) {
  const { token } = route.params;
  const [userData,        setUserData]        = useState(null);
  const [loading,         setLoading]         = useState(true);
  const [refreshing,      setRefreshing]      = useState(false);
  const [apiLog,          setApiLog]          = useState(null);
  const [workoutName,     setWorkoutName]     = useState('');
  const [workoutDuration, setWorkoutDuration] = useState('30');
  const [workoutCategory, setWorkoutCategory] = useState('Cardio');
  const [addingWorkout,   setAddingWorkout]   = useState(false);

  const fetchData = useCallback(async (showLog = false) => {
    const endpoint = `${API_URL}/api/Progress`;
    if (showLog) setApiLog({ status: 'GÖNDERİLİYOR...', endpoint, method: 'GET' });
    try {
      const res = await axios.get(endpoint, { headers: { Authorization: `Bearer ${token}` } });
      setUserData(res.data.data);
      if (showLog) setApiLog({ status: '200 OK', endpoint, method: 'GET', response: { currentTitle: res.data.data.currentTitle, totalWorkouts: res.data.data.totalWorkouts } });
    } catch (err) {
      if (showLog) setApiLog({ status: `${err.response?.status || 'Hata'}`, endpoint, method: 'GET' });
    } finally { setLoading(false); setRefreshing(false); }
  }, [token]);

  useEffect(() => { fetchData(true); }, [fetchData]);
  const onRefresh = () => { setRefreshing(true); fetchData(true); };

  const handleAddWorkout = async () => {
    if (!workoutName.trim()) { Alert.alert('Hata', 'Antrenman adı boş olamaz.'); return; }
    setAddingWorkout(true);
    const endpoint = `${API_URL}/api/Workout`;
    const payload  = { name: workoutName, durationMinutes: parseInt(workoutDuration) || 30, category: workoutCategory };
    setApiLog({ status: 'GÖNDERİLİYOR...', endpoint, method: 'POST', payload });
    try {
      const res = await axios.post(endpoint, payload, { headers: { Authorization: `Bearer ${token}` } });
      setApiLog({ status: '201 Created', endpoint, method: 'POST', payload, response: { id: res.data.data?.id, name: res.data.data?.name } });
      setWorkoutName(''); setWorkoutDuration('30'); setWorkoutCategory('Cardio');
      fetchData(false);
    } catch (err) {
      setApiLog({ status: `${err.response?.status || 'Hata'}`, endpoint, method: 'POST', payload });
      Alert.alert('Hata', 'Antrenman eklenemedi.');
    } finally { setAddingWorkout(false); }
  };

  const handleDeleteWorkout = (id) => {
    Alert.alert('Sil', 'Bu antrenmani silmek istediğine emin misin?', [
      { text: 'Vazgeç', style: 'cancel' },
      { text: 'Sil', style: 'destructive', onPress: async () => {
        const endpoint = `${API_URL}/api/Workout/${id}`;
        setApiLog({ status: 'GÖNDERİLİYOR...', endpoint, method: 'DELETE' });
        try {
          await axios.delete(endpoint, { headers: { Authorization: `Bearer ${token}` } });
          setApiLog({ status: '200 OK', endpoint, method: 'DELETE', response: 'Silindi' });
          fetchData(false);
        } catch (err) {
          setApiLog({ status: `${err.response?.status || 'Hata'}`, endpoint, method: 'DELETE' });
        }
      }}
    ]);
  };

  const progress = Math.min(
    ((userData?.totalWorkouts || 0) / ((userData?.totalWorkouts || 0) + (userData?.workoutsToNextTitle || 1))) * 100, 100
  );

  if (loading) {
    return (
      <SafeAreaView style={s.safe}>
        <View style={s.center}>
          <LinearGradient colors={['#f97316','#f59e0b']} style={s.loadIcon}>
            <MaterialCommunityIcons name="dumbbell" size={44} color="#000" />
          </LinearGradient>
          <ActivityIndicator color="#f97316" size="large" style={{ marginTop: 24 }} />
          <Text style={s.loadText}>YÜKLENİYOR...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe}>
      {/* HEADER */}
      <View style={s.header}>
        <View style={s.headerLeft}>
          <LinearGradient colors={['#f97316','#f59e0b']} style={s.avatar}>
            <Ionicons name="flame" size={26} color="#000" />
          </LinearGradient>
          <View>
            <Text style={s.headerTitle}>ASHURA FORGE</Text>
            <View style={s.headerSubRow}>
              <Ionicons name="trophy" size={12} color="#f59e0b" />
              <Text style={s.headerSub}> {userData?.currentTitle || 'Acemi Savaşçı'}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={s.logoutBtn} onPress={() =>
          Alert.alert('Çıkış', 'Çıkış yapmak istiyor musun?', [
            { text: 'Vazgeç', style: 'cancel' },
            { text: 'Çıkış Yap', style: 'destructive', onPress: () => navigation.replace('Login') }
          ])}>
          <Ionicons name="log-out-outline" size={22} color="#f87171" />
        </TouchableOpacity>
      </View>

      {/* NAV */}
      <View style={s.nav}>
        <LinearGradient colors={['#f97316','#f59e0b']} style={s.navActive} start={[0,0]} end={[1,0]}>
          <Ionicons name="home" size={16} color="#000" />
          <Text style={s.navActiveText}>ARENA</Text>
        </LinearGradient>
        <TouchableOpacity style={s.navBtn} onPress={() => navigation.navigate('Programs', { token })}>
          <Ionicons name="book-outline" size={16} color="#6b7280" />
          <Text style={s.navText}>PROGRAMLAR</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={s.scroll} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#f97316" />}>

        {/* UNVAN KARTI */}
        <View style={s.titleCard}>
          <View style={s.titleTopBar} />
          <View style={s.titleBody}>
            <Ionicons name="trophy" size={72} color="#f97316" style={{ marginBottom: 8 }} />
            <Text style={s.titleText}>{userData?.currentTitle || 'Acemi Savaşçı'}</Text>
            <View style={s.nextRow}>
              <Ionicons name="navigate" size={14} color="#f97316" />
              <Text style={s.nextText}> Sonraki Seviye: <Text style={{ color: '#f59e0b' }}>{userData?.nextTitle || 'Belirsiz'}</Text></Text>
            </View>
            <View style={s.progressBg}>
              <LinearGradient colors={['#f97316','#f59e0b']} style={[s.progressFill, { width: `${progress}%` }]} start={[0,0]} end={[1,0]} />
            </View>
            <View style={s.progressLabelRow}>
              <Ionicons name="flame" size={14} color="#f97316" />
              <Text style={s.progressLabel}> {userData?.workoutsToNextTitle || 0} antrenman kaldı!</Text>
            </View>
          </View>
        </View>

        {/* STAT KARTLARI */}
        <View style={s.statsRow}>
          <View style={s.statCard}>
            <Ionicons name="flame" size={32} color="#f97316" style={{ marginBottom: 6 }} />
            <Text style={s.statVal}>{userData?.totalWorkouts || 0}</Text>
            <Text style={s.statLbl}>TOPLAM SEANS</Text>
          </View>
          <View style={s.statCard}>
            <Ionicons name="time-outline" size={32} color="#60a5fa" style={{ marginBottom: 6 }} />
            <Text style={s.statVal}>{userData?.totalMinutes || 0}</Text>
            <Text style={s.statLbl}>DAKİKA</Text>
          </View>
        </View>

        {/* ROZETLER */}
        {(userData?.earnedBadges || []).length > 0 && (
          <View style={s.card}>
            <View style={[s.cardTopBar, { backgroundColor: '#a855f7' }]} />
            <View style={s.cardBody}>
              <View style={s.cardTitleRow}>
                <View style={[s.cardTitleIcon, { backgroundColor: 'rgba(168,85,247,0.2)' }]}>
                  <Ionicons name="medal" size={22} color="#a855f7" />
                </View>
                <Text style={s.cardTitle}>Başarı Rozetleri</Text>
                <View style={s.badgeCount}>
                  <Text style={{ color: '#a855f7', fontWeight: '900', fontSize: 12 }}>{userData.badgeCount} Rozet</Text>
                </View>
              </View>
              <View style={s.badgesGrid}>
                {userData.earnedBadges.map((badge, i) => (
                  <View key={i} style={s.badgeItem}>
                    <Text style={s.badgeIcon}>{badge.icon || '★'}</Text>
                    <Text style={s.badgeName}>{badge.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* ANTRİYEN EKLE */}
        <View style={s.card}>
          <View style={[s.cardTopBar, { backgroundColor: '#f97316' }]} />
          <View style={s.cardBody}>
            <View style={s.cardTitleRow}>
              <View style={[s.cardTitleIcon, { backgroundColor: 'rgba(249,115,22,0.2)' }]}>
                <Ionicons name="add" size={22} color="#f97316" />
              </View>
              <Text style={s.cardTitle}>Yeni Antrenman</Text>
            </View>
            <TextInput style={s.input} placeholder="Antrenman Adı (örn: Bench Press, Squat)"
              placeholderTextColor="#4b5563" value={workoutName} onChangeText={setWorkoutName} />
            <TextInput style={s.input} placeholder="Dakika"
              placeholderTextColor="#4b5563" value={workoutDuration}
              onChangeText={setWorkoutDuration} keyboardType="numeric" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
              {CATS.map(cat => (
                <TouchableOpacity key={cat}
                  style={[s.catBtn, workoutCategory === cat && s.catBtnActive]}
                  onPress={() => setWorkoutCategory(cat)}>
                  <Text style={[s.catText, workoutCategory === cat && s.catTextActive]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <LinearGradient colors={['#f97316','#f59e0b','#f97316']} style={s.addBtnGrad} start={[0,0]} end={[1,0]}>
              <TouchableOpacity style={s.addBtn} onPress={handleAddWorkout} disabled={addingWorkout}>
                {addingWorkout ? <ActivityIndicator color="#000" /> :
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Ionicons name="flash" size={20} color="#000" />
                    <Text style={s.addBtnText}>ANTRENMANI KAYDET</Text>
                  </View>
                }
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>

        {/* GEÇMİŞ */}
        <View style={s.card}>
          <View style={[s.cardTopBar, { backgroundColor: '#06b6d4' }]} />
          <View style={s.cardBody}>
            <View style={s.cardTitleRow}>
              <View style={[s.cardTitleIcon, { backgroundColor: 'rgba(6,182,212,0.2)' }]}>
                <Ionicons name="pulse" size={22} color="#06b6d4" />
              </View>
              <Text style={s.cardTitle}>Antrenman Geçmişi</Text>
            </View>
            {(userData?.recentWorkouts || []).length === 0
              ? <View style={s.emptyBox}>
                  <Ionicons name="pulse" size={64} color="#1f2937" />
                  <Text style={s.emptyText}>Henüz antrenman kaydın yok!</Text>
                  <Text style={s.emptySubText}>İlk antrenmanını ekle ve yolculuğa başla.</Text>
                </View>
              : userData.recentWorkouts.map(w => (
                <View key={w.id} style={s.workoutRow}>
                  <View style={s.workoutIconBox}>
                    <MaterialCommunityIcons name="dumbbell" size={26} color="#f97316" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.workoutName}>{w.name}</Text>
                    <Text style={s.workoutMeta}>{w.category} • {new Date(w.workoutDate).toLocaleDateString('tr-TR')}</Text>
                  </View>
                  <View style={s.workoutRight}>
                    <View>
                      <Text style={s.workoutDur}>{w.durationMinutes}</Text>
                      <Text style={s.workoutDurLabel}>Dakika</Text>
                    </View>
                    <TouchableOpacity onPress={() => handleDeleteWorkout(w.id)} style={s.delBtn}>
                      <Ionicons name="trash-outline" size={20} color="#4b5563" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            }
          </View>
        </View>

        {/* API LOG */}
        {apiLog && (
          <View style={s.logBox}>
            <Text style={s.logTitle}>API ISTEK / YANIT</Text>
            <Text style={s.logRow}><Text style={s.logKey}>Metod: </Text>{apiLog.method}</Text>
            <Text style={s.logRow}><Text style={s.logKey}>Endpoint: </Text>{apiLog.endpoint}</Text>
            {apiLog.payload && <Text style={s.logRow}><Text style={s.logKey}>Istek: </Text>{JSON.stringify(apiLog.payload)}</Text>}
            <Text style={[s.logRow, { color: (apiLog.status === '200 OK' || apiLog.status === '201 Created') ? '#4ade80' : apiLog.status.includes('GÖN') ? '#f59e0b' : '#f87171' }]}>
              <Text style={s.logKey}>Durum: </Text>{apiLog.status}
            </Text>
            {apiLog.response && <Text style={s.logRow}><Text style={s.logKey}>Yanit: </Text>{JSON.stringify(apiLog.response)}</Text>}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:           { flex: 1, backgroundColor: '#000' },
  center:         { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadIcon:       { width: 100, height: 100, borderRadius: 28, alignItems: 'center', justifyContent: 'center', shadowColor: '#f97316', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 30, elevation: 20 },
  loadText:       { color: '#f97316', fontWeight: '900', fontSize: 13, letterSpacing: 4, marginTop: 16 },
  header:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(249,115,22,0.2)' },
  headerLeft:     { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar:         { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  headerTitle:    { color: '#f97316', fontWeight: '900', fontSize: 17, letterSpacing: 2 },
  headerSubRow:   { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  headerSub:      { color: '#f59e0b', fontSize: 11, fontWeight: '700' },
  logoutBtn:      { backgroundColor: '#111', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#1f2937' },
  nav:            { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  navActive:      { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, borderRadius: 14 },
  navActiveText:  { color: '#000', fontWeight: '900', fontSize: 12, letterSpacing: 1 },
  navBtn:         { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, borderRadius: 14, backgroundColor: '#111', borderWidth: 1, borderColor: '#1f2937' },
  navText:        { color: '#6b7280', fontWeight: '700', fontSize: 12 },
  scroll:         { flex: 1, paddingHorizontal: 16 },
  titleCard:      { backgroundColor: '#0d0d0d', borderRadius: 24, marginTop: 16, marginBottom: 14, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(249,115,22,0.25)', shadowColor: '#f97316', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.2, shadowRadius: 24, elevation: 10 },
  titleTopBar:    { height: 4, backgroundColor: '#f97316' },
  titleBody:      { padding: 28, alignItems: 'center' },
  titleText:      { fontSize: 26, fontWeight: '900', color: '#f59e0b', textAlign: 'center', letterSpacing: 1, marginBottom: 8 },
  nextRow:        { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  nextText:       { color: '#9ca3af', fontSize: 13, fontWeight: '600' },
  progressBg:     { width: '100%', height: 10, backgroundColor: '#1f2937', borderRadius: 10, overflow: 'hidden', marginBottom: 8 },
  progressFill:   { height: 10, borderRadius: 10 },
  progressLabelRow:{ flexDirection: 'row', alignItems: 'center' },
  progressLabel:  { color: '#f97316', fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  statsRow:       { flexDirection: 'row', gap: 12, marginBottom: 14 },
  statCard:       { flex: 1, backgroundColor: '#0d0d0d', borderRadius: 20, padding: 18, alignItems: 'center', borderWidth: 1, borderColor: '#1f2937' },
  statVal:        { color: '#fff', fontWeight: '900', fontSize: 32, marginBottom: 4 },
  statLbl:        { color: '#6b7280', fontSize: 9, fontWeight: '800', letterSpacing: 2 },
  card:           { backgroundColor: '#0d0d0d', borderRadius: 24, marginBottom: 14, overflow: 'hidden', borderWidth: 1, borderColor: '#1f2937' },
  cardTopBar:     { height: 4 },
  cardBody:       { padding: 20 },
  cardTitleRow:   { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 18 },
  cardTitleIcon:  { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cardTitle:      { color: '#fff', fontWeight: '900', fontSize: 15, letterSpacing: 0.5, flex: 1 },
  badgeCount:     { paddingHorizontal: 12, paddingVertical: 4, backgroundColor: 'rgba(168,85,247,0.15)', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(168,85,247,0.3)' },
  badgesGrid:     { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  badgeItem:      { backgroundColor: '#111', borderRadius: 16, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(245,158,11,0.3)', minWidth: 80 },
  badgeIcon:      { fontSize: 30, color: '#f59e0b', marginBottom: 6, textAlign: 'center' },
  badgeName:      { color: '#fff', fontWeight: '700', fontSize: 10, textAlign: 'center' },
  input:          { backgroundColor: '#000', borderWidth: 2, borderColor: '#1f2937', borderRadius: 14, padding: 14, color: '#fff', fontSize: 14, marginBottom: 12, fontWeight: '600' },
  catBtn:         { paddingHorizontal: 18, paddingVertical: 9, borderRadius: 22, backgroundColor: '#000', borderWidth: 1.5, borderColor: '#1f2937', marginRight: 8 },
  catBtnActive:   { backgroundColor: '#f97316', borderColor: '#f97316' },
  catText:        { color: '#6b7280', fontWeight: '700', fontSize: 12 },
  catTextActive:  { color: '#000', fontWeight: '900' },
  addBtnGrad:     { borderRadius: 14, shadowColor: '#f97316', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 10 },
  addBtn:         { paddingVertical: 16, alignItems: 'center' },
  addBtnText:     { color: '#000', fontWeight: '900', fontSize: 14, letterSpacing: 2 },
  workoutRow:     { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#111' },
  workoutIconBox: { width: 52, height: 52, backgroundColor: 'rgba(249,115,22,0.08)', borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(249,115,22,0.25)' },
  workoutName:    { color: '#fff', fontWeight: '800', fontSize: 15 },
  workoutMeta:    { color: '#6b7280', fontSize: 11, marginTop: 3, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  workoutRight:   { flexDirection: 'row', alignItems: 'center', gap: 8 },
  workoutDur:     { color: '#f97316', fontWeight: '900', fontSize: 26, textAlign: 'right' },
  workoutDurLabel:{ color: '#6b7280', fontSize: 9, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1, textAlign: 'right' },
  delBtn:         { padding: 8 },
  emptyBox:       { alignItems: 'center', paddingVertical: 36 },
  emptyText:      { color: '#4b5563', fontWeight: '900', fontSize: 12, marginTop: 12, textTransform: 'uppercase', letterSpacing: 2 },
  emptySubText:   { color: '#374151', fontSize: 11, marginTop: 6 },
  logBox:         { backgroundColor: '#080808', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: 'rgba(249,115,22,0.2)', marginBottom: 14 },
  logTitle:       { color: '#f97316', fontWeight: '900', fontSize: 11, marginBottom: 10, letterSpacing: 3 },
  logRow:         { color: '#6b7280', fontSize: 11, marginBottom: 5, lineHeight: 17 },
  logKey:         { color: '#f59e0b', fontWeight: '700' },
});
